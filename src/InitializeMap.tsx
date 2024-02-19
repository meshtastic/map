import type { Component, JSXElement } from "solid-js";
import { createEffect, createResource, createSignal } from "solid-js";
import { MapContext } from "./providers/MapProvider.jsx";
import { useClient } from "./hooks/useClient.jsx";
import { GatewayService } from "@buf/meshtastic_api.connectrpc_es/protobufs/gateway/v1/gateway_service_connect.js";
import { useStore } from "./hooks/useStore.jsx";
import { Map as maplibregl } from "maplibre-gl";
import type { GeoJSONSource } from "maplibre-gl";

export interface IntitalizeMapProps {
  children?: JSXElement;
}

export const IntitalizeMap: Component<IntitalizeMapProps> = (props) => {
  const [mapRef, setMapRef] = createSignal<HTMLDivElement>();
  const { localState } = useStore();
  const [geoJson, setGeoJson] = createSignal<GeoJSON.GeoJSON>();
  const [currentView, setCurrentView] = createSignal<maplibregl | undefined>(
    undefined,
  );

  createEffect(() => {
    const data: GeoJSON.GeoJSON = {
      type: "FeatureCollection",
      features: localState.gateways.map((gateway) => {
        return {
          type: "Feature",
          properties: {
            id: gateway.id,
            age: (Date.now() - gateway.updatedAt.toDate().getTime()) / 1000,
          },
          geometry: {
            type: "Point",
            coordinates: [gateway.longitude / 1e7, gateway.latitude / 1e7, 0],
          },
        };
      }),
    };
    setGeoJson(data);
  });

  const initializeMap = () => {
    const map = new maplibregl({
      container: mapRef(),
      style: `https://api.protomaps.com/styles/v2/dark.json?key=${
        import.meta.env.VITE_PROTOMAPS_API_KEY
      }`,
    });

    setCurrentView(map);

    map.on("load", () => {
      map.addSource("gateways", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      map.addLayer({
        id: "gateways-point",
        type: "circle",
        source: "gateways",
        minzoom: 7,
        paint: {
          "circle-radius": 10,
          "circle-color": [
            "interpolate",
            ["linear"],
            ["get", "age"],
            60,
            "rgba(33,102,172,0)",
            60 * 10,
            "rgb(103,169,207)",
            60 * 60,
            "rgb(209,229,240)",
            60 * 60 * 24,
            "rgb(253,219,199)",
            60 * 60 * 24 * 7,
            "rgb(239,138,98)",
            60 * 60 * 24 * 30,
            "rgb(178,24,43)",
          ],
          "circle-stroke-color": "white",
          "circle-stroke-width": 1,
          "circle-opacity": 1,
        },
      });

      map.addLayer({
        id: "gateways-heat",
        type: "heatmap",
        source: "gateways",
        maxzoom: 9,
        paint: {
          // Increase the heatmap weight based on frequency and property magnitude
          "heatmap-weight": [
            "interpolate",
            ["linear"],
            ["get", "age"],
            0,
            1,
            60 * 60 * 24 * 30,
            0,
          ],
          // Increase the heatmap color weight weight by zoom level
          // heatmap-intensity is a multiplier on top of heatmap-weight
          "heatmap-intensity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            0,
            1,
            9,
            3,
          ],
          // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
          // Begin color ramp at 0-stop with a 0-transparancy color
          // to create a blur-like effect.
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "rgba(33,102,172,0)",
            0.2,
            "rgb(103,169,207)",
            0.4,
            "rgb(209,229,240)",
            0.6,
            "rgb(253,219,199)",
            0.8,
            "rgb(239,138,98)",
            1,
            "rgb(178,24,43)",
          ],
          // Adjust the heatmap radius by zoom level
          "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 2, 9, 20],
          // Transition from heatmap to circle layer by zoom level
          "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 7, 1, 9, 0],
        },
      });
    });
  };

  const { gatewayStream } = useClient(GatewayService)();
  const [gatewayStreamResponse] = createResource(() => gatewayStream({}));
  const { addGateway } = useStore();

  (async () => {
    for await (const gatewayResponse of gatewayStreamResponse() ?? []) {
      const gateway = gatewayResponse.gateway;
      if (gateway) {
        addGateway(gateway);
      }

      const layer = currentView()?.getSource("gateways") as GeoJSONSource;

      layer?.setData(geoJson());
    }

    await Promise.resolve();
  })();

  return (
    <MapContext.Provider value={{ setMapRef, initializeMap }}>
      {/* <CurrentViewContext.Provider value={currentView}> */}
      {props.children}
      {/* </CurrentViewContext.Provider> */}
    </MapContext.Provider>
  );
};

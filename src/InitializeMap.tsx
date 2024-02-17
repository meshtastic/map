import type { Component, JSXElement } from "solid-js";
import { createResource, createSignal } from "solid-js";
import { MapContext } from "./providers/MapProvider.jsx";
import { CurrentViewContext } from "./providers/SceneViewProvider.jsx";
import MapConstructor from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer.js";
import Point from "@arcgis/core/geometry/Point.js";
import TileInfo from "@arcgis/core/layers/support/TileInfo.js";
import ScaleBar from "@arcgis/core/widgets/ScaleBar.js";
import Search from "@arcgis/core/widgets/Search.js";
import CSVLayer from "@arcgis/core/layers/CSVLayer.js";
import LayerSearchSource from "@arcgis/core/widgets/Search/LayerSearchSource.js";
import TimeSlider from "@arcgis/core/widgets/TimeSlider.js";
import Track from "@arcgis/core/widgets/Track.js";
import Compass from "@arcgis/core/widgets/Compass.js";
import CoordinateConversion from "@arcgis/core/widgets/CoordinateConversion.js";
import Fullscreen from "@arcgis/core/widgets/Fullscreen.js";
import WebTileLayer from "@arcgis/core/layers/WebTileLayer.js";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";
import Graphic from "@arcgis/core/Graphic.js";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol.js";
import { useClient } from "./hooks/useClient.jsx";
import { GatewayService } from "@buf/meshtastic_api.connectrpc_es/protobufs/gateway/v1/gateway_service_connect.js";

export interface IntitalizeMapProps {
  children?: JSXElement;
}

export const IntitalizeMap: Component<IntitalizeMapProps> = (props) => {
  interface MapPoint {
    name: string;
    origin: Point;
  }

  const [mapPoints, setMapPoints] = createSignal<MapPoint[]>();

  const map = new MapConstructor({
    basemap: "satellite",
  });

  const [currentView, setCurrentView] = createSignal<MapView>(new MapView());
  const [mapRef, setMapRef] = createSignal<HTMLDivElement>();

  const initializeMap = () => {
    setCurrentView(
      new MapView({
        map,
        container: mapRef(),
        center: new Point({
          latitude: -28,
          longitude: 135,
        }),
        scale: 10000000,
        constraints: {
          lods: TileInfo.create().lods,
        },
      }),
    );

    const scalebar = new ScaleBar({
      view: currentView(),
      unit: "metric",
    });

    const search = new Search({
      view: currentView(),
      sources: [],
      includeDefaultSources: false,
    });

    const track = new Track({
      view: currentView(),
      scale: 2500,
    });

    const compass = new Compass({
      view: currentView(),
    });

    const coordinateConversion = new CoordinateConversion({
      view: currentView(),
      // @ts-ignore - this is a bug in the typings
      conversions: ["mgrs"],
    });

    const fullscreen = new Fullscreen({
      view: currentView(),
    });

    currentView().ui.add(scalebar, "bottom-left");
    currentView().ui.add(search, "top-right");
    currentView().ui.add(track, "top-left");
    currentView().ui.add(compass, "top-left");
    currentView().ui.add(coordinateConversion, "bottom-right");
    currentView().ui.add(fullscreen, "top-right");

    const cepGraphicsLayer = new GraphicsLayer({
      id: "cep",
    });

    map.add(cepGraphicsLayer);

    currentView()?.when(() => {
      console.log("scene view ready");
    });
  };

  interface Gateway {
    id: string;
    latitude?: number;
    longitude?: number;
    createdAt: string;
    updatedAt: string;
    channels: Channel[];
  }

  interface Channel {
    id: string;
    name: string;
    encrypted: boolean;
    messages: number;
    createdAt: string;
    updatedAt: string;
    gatewayId: string;
  }

  const graphicsLayer = new GraphicsLayer();
  map.add(graphicsLayer);

  const { gatewayStream } = useClient(GatewayService)();
  const [gatewayStreamResponse] = createResource(() => gatewayStream({}));

  // const [gateways, setGateways] = createSignal<Gateway[]>([]);

  (async () => {
    for await (const gatewayResponse of gatewayStreamResponse() ?? []) {
      for (const gateway of gatewayResponse.gateways) {
        // setGateways([...gateways(), gateway]);

        if (gateway.latitude && gateway.longitude) {
          console.log(
            "adding gateway",
            gateway.id,
            `at location: ${gateway.latitude}, ${gateway.longitude}`,
          );

          const point = new Point({
            latitude: gateway.latitude,
            longitude: gateway.longitude,
          });
          const symbol = new SimpleMarkerSymbol({
            color: [226, 119, 40],
            outline: {
              color: [255, 255, 255],
              width: 1,
            },
          });

          const graphic = new Graphic({
            geometry: point,
            symbol: symbol,
            attributes: {
              Name: gateway.id,
              Channels: gateway.channels.map((channel) => channel.name),
            },
            popupTemplate: {
              title: "{Name}",
              content: [
                {
                  type: "fields",
                  fieldInfos: [
                    {
                      fieldName: "Name",
                    },
                    {
                      fieldName: "Channels",
                    },
                  ],
                },
              ],
              actions: [
                {
                  type: "toggle",
                  title: "Subscribe to channel",
                  value: true,
                },
              ],
            },
          });

          //add to map
          graphicsLayer.add(graphic);
        }
      }
      // console.log(gateways());
    }
  })();

  return (
    <MapContext.Provider value={{ map, setMapRef, initializeMap }}>
      <CurrentViewContext.Provider value={currentView}>
        {props.children}
      </CurrentViewContext.Provider>
    </MapContext.Provider>
  );
};

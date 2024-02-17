import type MapConstructor from "@arcgis/core/Map.js";
import type { Setter } from "solid-js";
import { createContext } from "solid-js";

export const MapContext = createContext<{
  map: MapConstructor;
  setMapRef: Setter<HTMLDivElement | undefined>;
  initializeMap: () => void;
}>();

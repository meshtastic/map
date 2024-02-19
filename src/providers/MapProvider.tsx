import type { Setter } from "solid-js";
import { createContext } from "solid-js";

export const MapContext = createContext<{
  setMapRef: Setter<HTMLDivElement | undefined>;
  initializeMap: () => void;
}>();

import { useContext } from "solid-js";
import { MapContext } from "../providers/MapProvider.jsx";

export function useMap() {
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  return useContext(MapContext)!;
}

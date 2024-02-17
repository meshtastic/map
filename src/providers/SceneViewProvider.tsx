import type MapView from "@arcgis/core/views/MapView.js";
import type { Accessor } from "solid-js";
import { createContext } from "solid-js";

export const CurrentViewContext = createContext<Accessor<MapView>>();

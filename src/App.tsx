import type { Component } from "solid-js";
import { IntitalizeMap } from "./InitializeMap";
import { MapWindow } from "./MapWindow";

export const App: Component = () => {
  return (
    <div class="h-screen w-screen">
      <IntitalizeMap>
        <MapWindow />
      </IntitalizeMap>
    </div>
  );
};

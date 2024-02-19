import type { Component } from "solid-js";
import { IntitalizeMap } from "./InitializeMap";
import { MapWindow } from "./MapWindow";
import { LocalStateContext } from "./providers";
import { LocalState } from "./store";

export const App: Component = () => {
  return (
    <div class="h-screen w-screen">
      <LocalStateContext.Provider value={LocalState}>
        <IntitalizeMap>
          <MapWindow />
        </IntitalizeMap>
      </LocalStateContext.Provider>
    </div>
  );
};

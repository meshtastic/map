import type { Component } from "solid-js";
import { onMount } from "solid-js";
import { useMap } from "./hooks/useMap.jsx";
export const MapWindow: Component = () => {
  const { setMapRef, initializeMap } = useMap();

  onMount(() => {
    initializeMap();
  });

  return <div ref={setMapRef} class="p-0 m-0 w-full h-full " />;
};

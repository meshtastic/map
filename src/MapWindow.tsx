import type { Component } from "solid-js";
import { For, createSignal, onMount } from "solid-js";
import { useStore } from "./hooks/useStore.jsx";
import * as Card from "./components/ui/card.jsx";
import { Button } from "./components/ui/button.jsx";
import { Input } from "./components/ui/input.jsx";
import { MagnifyingGlassIcon } from "solid-phosphor/regular";
import { Text } from "./components/ui/text.jsx";
import { useMap } from "./hooks/useMap.jsx";

export const MapWindow: Component = () => {
  const { localState } = useStore();
  const { setMapRef, initializeMap } = useMap();

  onMount(() => {
    initializeMap();
  });

  return (
    <div ref={setMapRef} class="relative p-0 m-0 w-full h-full">
      <div class="z-10 absolute flex flex-col gap-2 left-0 right-0 top-0">
        {/* <div class="w-1/2 mx-auto bg-[#242424] p-3 pb-7">
          <Slider
            class="m-auto"
            value={[33, 66]}
            marks={[
              {
                value: 0,
                label: "0%",
              },
              {
                value: 100,
                label: "100%",
              },
            ]}
          />
        </div> */}
      </div>
      <div class="absolute h-full flex flex-col w-1/5 p-2 gap-2 right-0 top-0">
        <Card.Root width="sm">
          <Card.Header>
            <Card.Title class="flex gap-2">
              <MagnifyingGlassIcon class="h-4 m-auto" />
              <Input placeholder="Gateways" />
            </Card.Title>
          </Card.Header>
          <Card.Body>
            {/* Search Box */}
            <div class="m-auto text-gray-500">
              <Text>... Searching</Text>
            </div>
          </Card.Body>
          <Card.Footer class="gap-3">
            <Button variant="outline">Cancel</Button>
            <Button>Invite</Button>
          </Card.Footer>
        </Card.Root>
      </div>
    </div>
  );
};

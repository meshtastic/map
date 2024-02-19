import type { Gateway } from "@buf/meshtastic_api.bufbuild_es/protobufs/gateway/v1/gateway_pb";
import { createStore } from "solid-js/store";

interface LocalState {
  gateways: Gateway[];
  oldestGatewayDate: Date;
}

const [localState, setLocalState] = createStore<LocalState>({
  gateways: [],
  oldestGatewayDate: new Date(),
});

const addGateway = (gateway: Gateway) => {
  // console.log(gateway);
  setLocalState("gateways", [...localState.gateways, gateway]);

  if (!gateway.updatedAt) {
    return;
  }
  if (gateway.updatedAt.toDate() < localState.oldestGatewayDate) {
    setLocalState("oldestGatewayDate", gateway.updatedAt.toDate());
  }
};

export const LocalState = {
  localState,
  addGateway,
};

import type { PromiseClient } from "@connectrpc/connect";
import { createPromiseClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import type { ServiceType } from "@bufbuild/protobuf";
import type { Accessor } from "solid-js";
import { createMemo } from "solid-js";

const transport = createConnectTransport({
  baseUrl: import.meta.env.VITE_RPC_URL,
  useBinaryFormat: true,
  credentials: "include",
});

export function useClient<T extends ServiceType>(
  service: T,
): Accessor<PromiseClient<T>> {
  return createMemo(() => createPromiseClient(service, transport));
}

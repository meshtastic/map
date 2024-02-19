import { useContext } from "solid-js";
import { LocalStateContext } from "../providers/index.js";

export function useStore() {
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  return useContext(LocalStateContext)!;
}

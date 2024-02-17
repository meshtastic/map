import { useContext } from "solid-js";
import { CurrentViewContext } from "../providers/SceneViewProvider.jsx";

export function useCurrentView() {
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  return useContext(CurrentViewContext)!;
}

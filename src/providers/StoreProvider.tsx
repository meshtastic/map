import { createContext } from "solid-js";
import type { LocalState } from "../store.js";

export const LocalStateContext = createContext<typeof LocalState>();

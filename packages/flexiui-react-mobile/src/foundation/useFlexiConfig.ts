import { useContext } from "react";
import { FlexiContext } from "./FlexiProvider";

export function useFlexiConfig() {
  return useContext(FlexiContext);
}

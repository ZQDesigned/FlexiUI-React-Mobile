import { createFlexiTheme } from "../theme/createFlexiTheme";
import type { FlexiTheme } from "../theme/types";
import { useFlexiConfig } from "./useFlexiConfig";

export function useResolvedTheme(theme?: FlexiTheme): FlexiTheme {
  const config = useFlexiConfig();
  return theme ?? config.theme ?? createFlexiTheme();
}

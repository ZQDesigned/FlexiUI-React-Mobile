import { createContext, useMemo, type PropsWithChildren } from "react";
import { createFlexiTheme } from "../theme/createFlexiTheme";
import type { FlexiTheme } from "../theme/types";
import type { FlexiRenderStrategy } from "./types";

type FlexiContextValue = {
  theme: FlexiTheme;
  renderStrategy: FlexiRenderStrategy;
};

export type FlexiProviderProps = PropsWithChildren<{
  theme?: FlexiTheme;
  renderStrategy?: FlexiRenderStrategy;
}>;

const defaultValue: FlexiContextValue = {
  theme: createFlexiTheme(),
  renderStrategy: "custom",
};

export const FlexiContext = createContext<FlexiContextValue>(defaultValue);

export function FlexiProvider({ children, theme, renderStrategy = "custom" }: FlexiProviderProps) {
  const value = useMemo<FlexiContextValue>(
    () => ({
      theme: theme ?? defaultValue.theme,
      renderStrategy,
    }),
    [theme, renderStrategy],
  );

  return <FlexiContext.Provider value={value}>{children}</FlexiContext.Provider>;
}

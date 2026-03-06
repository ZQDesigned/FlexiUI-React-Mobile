import { createContext, useMemo, type PropsWithChildren } from "react";
import { alphaColor } from "./color";
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
  const resolvedTheme = theme ?? defaultValue.theme;

  const value = useMemo<FlexiContextValue>(
    () => ({
      theme: resolvedTheme,
      renderStrategy,
    }),
    [resolvedTheme, renderStrategy],
  );

  const scrollbarStyles = useMemo(() => {
    const trackColor = alphaColor(resolvedTheme.colors.colorFlexiThemeSecondary, 0.12);
    const thumbColor = alphaColor(resolvedTheme.colors.colorFlexiThemePrimary, 0.46);
    const thumbHoverColor = alphaColor(resolvedTheme.colors.colorFlexiThemePrimary, 0.62);
    const thumbActiveColor = alphaColor(resolvedTheme.colors.colorFlexiThemePrimary, 0.78);
    const cornerColor = alphaColor(resolvedTheme.colors.colorFlexiBackgroundPrimary, 0.72);
    const interactiveRingColor = alphaColor(resolvedTheme.colors.colorFlexiThemePrimary, 0.24);
    const interactiveHoverColor = alphaColor(resolvedTheme.colors.colorFlexiThemePrimary, 0.08);
    const interactiveActiveColor = alphaColor(resolvedTheme.colors.colorFlexiThemePrimary, 0.14);

    return `
      * {
        scrollbar-width: thin;
        scrollbar-color: ${thumbColor} ${trackColor};
      }

      *::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }

      *::-webkit-scrollbar-track {
        background: ${trackColor};
        border-radius: 999px;
      }

      *::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, ${thumbHoverColor} 0%, ${thumbColor} 100%);
        border-radius: 999px;
        border: 2px solid ${trackColor};
      }

      *::-webkit-scrollbar-thumb:hover {
        background: ${thumbHoverColor};
      }

      *::-webkit-scrollbar-thumb:active {
        background: ${thumbActiveColor};
      }

      *::-webkit-scrollbar-corner {
        background: ${cornerColor};
      }

      :where(button, [role="button"]) {
        transition:
          background-color 180ms cubic-bezier(0.2, 0, 0, 1),
          border-color 180ms cubic-bezier(0.2, 0, 0, 1),
          color 180ms cubic-bezier(0.2, 0, 0, 1),
          box-shadow 180ms cubic-bezier(0.2, 0, 0, 1),
          transform 140ms cubic-bezier(0.2, 0, 0, 1);
      }

      :where(input, textarea) {
        transition:
          background-color 180ms cubic-bezier(0.2, 0, 0, 1),
          border-color 180ms cubic-bezier(0.2, 0, 0, 1),
          color 180ms cubic-bezier(0.2, 0, 0, 1),
          box-shadow 180ms cubic-bezier(0.2, 0, 0, 1);
      }

      :where(button, [role="button"]):where(:not(:disabled)):hover {
        background-color: ${interactiveHoverColor};
      }

      :where(button, [role="button"]):where(:not(:disabled)):active {
        transform: translateY(1px) scale(0.985);
        background-color: ${interactiveActiveColor};
      }

      :where(button, [role="button"], input, textarea):focus-visible {
        outline: none;
        box-shadow: 0 0 0 3px ${interactiveRingColor};
      }

      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation: none !important;
          transition-duration: 1ms !important;
          transition-delay: 0ms !important;
        }
      }
    `;
  }, [resolvedTheme]);

  return (
    <FlexiContext.Provider value={value}>
      <style>{scrollbarStyles}</style>
      {children}
    </FlexiContext.Provider>
  );
}

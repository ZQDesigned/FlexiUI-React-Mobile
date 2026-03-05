import type { FlexiColorTokens } from "../tokens/colors";
import type { FlexiDimensionTokens } from "../tokens/dimensions";

export type FlexiThemeBase = "material3" | "materialComponents";
export type FlexiThemeVariant = "light" | "dark" | "highContrast";
export type FlexiThemePreset = "default" | "red" | "pink" | "purple" | "orange" | "yellow" | "green" | "blue";

export type FlexiTheme = {
  base: FlexiThemeBase;
  variant: FlexiThemeVariant;
  preset: FlexiThemePreset;
  colors: FlexiColorTokens;
  dimensions: FlexiDimensionTokens;
};

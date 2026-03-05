import { flexiDarkColors, flexiHighContrastColors, flexiLightColors, flexiPresetPrimaryColors } from "../tokens/colors";
import { flexiDimensions } from "../tokens/dimensions";
import type { FlexiTheme, FlexiThemeBase, FlexiThemePreset, FlexiThemeVariant } from "./types";

type CreateThemeOptions = {
  base?: FlexiThemeBase;
  variant?: FlexiThemeVariant;
  preset?: FlexiThemePreset;
};

export function createFlexiTheme(options: CreateThemeOptions = {}): FlexiTheme {
  const base = options.base ?? "material3";
  const variant = options.variant ?? "light";
  const preset = options.preset ?? "default";

  const variantColors = getVariantColors(variant);
  const presetPrimary = flexiPresetPrimaryColors[preset];

  return {
    base,
    variant,
    preset,
    colors: {
      ...variantColors,
      colorFlexiThemePrimary: presetPrimary,
    },
    dimensions: flexiDimensions,
  };
}

function getVariantColors(variant: FlexiThemeVariant) {
  switch (variant) {
    case "dark":
      return flexiDarkColors;
    case "highContrast":
      return flexiHighContrastColors;
    case "light":
    default:
      return flexiLightColors;
  }
}

export type FlexiColorTokens = {
  colorFlexiBackgroundPrimary: string;
  colorFlexiBackgroundSecondary: string;
  colorFlexiForegroundPrimary: string;
  colorFlexiForegroundSecondary: string;
  colorFlexiThemePrimary: string;
  colorFlexiThemeSecondary: string;
  colorFlexiThemeTertiary: string;
  colorFlexiTextPrimary: string;
  colorFlexiTextSecondary: string;
};

export const flexiLightColors: FlexiColorTokens = {
  colorFlexiBackgroundPrimary: "#F5F5F5",
  colorFlexiBackgroundSecondary: "#EDEDED",
  colorFlexiForegroundPrimary: "#FFFFFF",
  colorFlexiForegroundSecondary: "#F5F5F5",
  colorFlexiThemePrimary: "#777777",
  colorFlexiThemeSecondary: "#A6777777",
  colorFlexiThemeTertiary: "#27777777",
  colorFlexiTextPrimary: "#323B42",
  colorFlexiTextSecondary: "#777777",
};

export const flexiDarkColors: FlexiColorTokens = {
  colorFlexiBackgroundPrimary: "#2D2D2D",
  colorFlexiBackgroundSecondary: "#484848",
  colorFlexiForegroundPrimary: "#474747",
  colorFlexiForegroundSecondary: "#646464",
  colorFlexiThemePrimary: "#888888",
  colorFlexiThemeSecondary: "#A6888888",
  colorFlexiThemeTertiary: "#40888888",
  colorFlexiTextPrimary: "#E3E3E3",
  colorFlexiTextSecondary: "#BBBBBB",
};

export const flexiHighContrastColors: FlexiColorTokens = {
  colorFlexiBackgroundPrimary: "#FFFFFF",
  colorFlexiBackgroundSecondary: "#FFFFFF",
  colorFlexiForegroundPrimary: "#FFFFFF",
  colorFlexiForegroundSecondary: "#FFFFFF",
  colorFlexiThemePrimary: "#000000",
  colorFlexiThemeSecondary: "#7F7F7F",
  colorFlexiThemeTertiary: "#7F7F7F",
  colorFlexiTextPrimary: "#000000",
  colorFlexiTextSecondary: "#000000",
};

export const flexiPresetPrimaryColors = {
  default: "#777777",
  red: "#FF5545",
  pink: "#FF4E7C",
  purple: "#A476FF",
  orange: "#D27C00",
  yellow: "#BA8800",
  green: "#5B9E7A",
  blue: "#0099DF",
} as const;

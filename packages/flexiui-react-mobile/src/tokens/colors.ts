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

export type FlexiPresetThemeOverrideTokens = Pick<
  FlexiColorTokens,
  | "colorFlexiBackgroundPrimary"
  | "colorFlexiBackgroundSecondary"
  | "colorFlexiForegroundPrimary"
  | "colorFlexiForegroundSecondary"
  | "colorFlexiThemePrimary"
  | "colorFlexiThemeSecondary"
  | "colorFlexiThemeTertiary"
>;

export type FlexiPresetName = "red" | "pink" | "purple" | "orange" | "yellow" | "green" | "blue";

type FlexiPresetThemeOverrideMap = Record<FlexiPresetName, { light: FlexiPresetThemeOverrideTokens; dark: FlexiPresetThemeOverrideTokens }>;

function normalizeAndroidColor(color: string): string {
  return color.trim().toUpperCase();
}

function androidColorToCss(color: string): string {
  const normalized = normalizeAndroidColor(color);

  if (/^#[0-9A-F]{8}$/.test(normalized)) {
    const alpha = normalized.slice(1, 3);
    const rgb = normalized.slice(3);
    return alpha === "FF" ? `#${rgb}` : `#${rgb}${alpha}`;
  }

  return normalized;
}

function toCssColorTokens<T extends Record<string, string>>(tokens: T): T {
  return Object.fromEntries(Object.entries(tokens).map(([key, value]) => [key, androidColorToCss(value)])) as T;
}

function toCssPresetOverrides<T extends Record<string, { light: Record<string, string>; dark: Record<string, string> }>>(presets: T): T {
  return Object.fromEntries(
    Object.entries(presets).map(([preset, value]) => [
      preset,
      {
        light: toCssColorTokens(value.light),
        dark: toCssColorTokens(value.dark),
      },
    ]),
  ) as T;
}

export const flexiLightColorsAndroidRaw: FlexiColorTokens = {
  colorFlexiBackgroundPrimary: "#FFF5F5F5",
  colorFlexiBackgroundSecondary: "#FFEDEDED",
  colorFlexiForegroundPrimary: "#FFFFFFFF",
  colorFlexiForegroundSecondary: "#FFF5F5F5",
  colorFlexiThemePrimary: "#FF777777",
  colorFlexiThemeSecondary: "#A6777777",
  colorFlexiThemeTertiary: "#27777777",
  colorFlexiTextPrimary: "#FF323B42",
  colorFlexiTextSecondary: "#FF777777",
};

export const flexiDarkColorsAndroidRaw: FlexiColorTokens = {
  colorFlexiBackgroundPrimary: "#FF000000",
  colorFlexiBackgroundSecondary: "#FF1B1B1B",
  colorFlexiForegroundPrimary: "#FF1A1A1A",
  colorFlexiForegroundSecondary: "#FF373737",
  colorFlexiThemePrimary: "#FF5B5B5B",
  colorFlexiThemeSecondary: "#A65B5B5B",
  colorFlexiThemeTertiary: "#455B5B5B",
  colorFlexiTextPrimary: "#FFE3E3E3",
  colorFlexiTextSecondary: "#FFBBBBBB",
};

export const flexiHighContrastColorsAndroidRaw: FlexiColorTokens = {
  colorFlexiBackgroundPrimary: "#FFFFFFFF",
  colorFlexiBackgroundSecondary: "#FFFFFFFF",
  colorFlexiForegroundPrimary: "#FFFFFFFF",
  colorFlexiForegroundSecondary: "#FFFFFFFF",
  colorFlexiThemePrimary: "#FF000000",
  colorFlexiThemeSecondary: "#FF7F7F7F",
  colorFlexiThemeTertiary: "#FF7F7F7F",
  colorFlexiTextPrimary: "#FF000000",
  colorFlexiTextSecondary: "#FF000000",
};

export const flexiPresetThemeOverridesAndroidRaw: FlexiPresetThemeOverrideMap = {
  red: {
    light: {
      colorFlexiBackgroundPrimary: "#FFFBEEEC",
      colorFlexiBackgroundSecondary: "#FFEDE0DE",
      colorFlexiForegroundPrimary: "#FFFFFBFF",
      colorFlexiForegroundSecondary: "#FFFBEEEC",
      colorFlexiThemePrimary: "#FFFF5545",
      colorFlexiThemeSecondary: "#A6FF8A7B",
      colorFlexiThemeTertiary: "#27FF5545",
    },
    dark: {
      colorFlexiBackgroundPrimary: "#FF000000",
      colorFlexiBackgroundSecondary: "#FF000000",
      colorFlexiForegroundPrimary: "#FF271816",
      colorFlexiForegroundSecondary: "#FF3D2C2A",
      colorFlexiThemePrimary: "#FFB9856D",
      colorFlexiThemeSecondary: "#A69B6B54",
      colorFlexiThemeTertiary: "#45B9856D",
    },
  },
  pink: {
    light: {
      colorFlexiBackgroundPrimary: "#FFFBEEEE",
      colorFlexiBackgroundSecondary: "#FFECE0E0",
      colorFlexiForegroundPrimary: "#FFFFFBFF",
      colorFlexiForegroundSecondary: "#FFFBEEEE",
      colorFlexiThemePrimary: "#FFFF4E7C",
      colorFlexiThemeSecondary: "#A6FF869D",
      colorFlexiThemeTertiary: "#27FF4E7C",
    },
    dark: {
      colorFlexiBackgroundPrimary: "#FF000000",
      colorFlexiBackgroundSecondary: "#FF000000",
      colorFlexiForegroundPrimary: "#FF26181A",
      colorFlexiForegroundSecondary: "#FF3D2C2E",
      colorFlexiThemePrimary: "#FFBA837B",
      colorFlexiThemeSecondary: "#A69D6962",
      colorFlexiThemeTertiary: "#45BA837B",
    },
  },
  purple: {
    light: {
      colorFlexiBackgroundPrimary: "#FFF5EFF4",
      colorFlexiBackgroundSecondary: "#FFE6E1E6",
      colorFlexiForegroundPrimary: "#FFFFFBFF",
      colorFlexiForegroundSecondary: "#FFF5EFF4",
      colorFlexiThemePrimary: "#FFA476FF",
      colorFlexiThemeSecondary: "#A6BB99FF",
      colorFlexiThemeTertiary: "#27A476FF",
    },
    dark: {
      colorFlexiBackgroundPrimary: "#FF000000",
      colorFlexiBackgroundSecondary: "#FF000000",
      colorFlexiForegroundPrimary: "#FF1E1A24",
      colorFlexiForegroundSecondary: "#FF332E3A",
      colorFlexiThemePrimary: "#FF9F88AD",
      colorFlexiThemeSecondary: "#A6846E91",
      colorFlexiThemeTertiary: "#459F88AD",
    },
  },
  orange: {
    light: {
      colorFlexiBackgroundPrimary: "#FFFAEFE7",
      colorFlexiBackgroundSecondary: "#FFEBE0D9",
      colorFlexiForegroundPrimary: "#FFFFFBFF",
      colorFlexiForegroundSecondary: "#FFFAEFE7",
      colorFlexiThemePrimary: "#FFD27C00",
      colorFlexiThemeSecondary: "#A6F89300",
      colorFlexiThemeTertiary: "#27D27C00",
    },
    dark: {
      colorFlexiBackgroundPrimary: "#FF000000",
      colorFlexiBackgroundSecondary: "#FF000000",
      colorFlexiForegroundPrimary: "#FF25190E",
      colorFlexiForegroundSecondary: "#FF3B2E22",
      colorFlexiThemePrimary: "#FFAE8B5D",
      colorFlexiThemeSecondary: "#A6917045",
      colorFlexiThemeTertiary: "#45AE8B5D",
    },
  },
  yellow: {
    light: {
      colorFlexiBackgroundPrimary: "#FFF8EFE7",
      colorFlexiBackgroundSecondary: "#FFE9E1D9",
      colorFlexiForegroundPrimary: "#FFFFFBFF",
      colorFlexiForegroundSecondary: "#FFF8EFE7",
      colorFlexiThemePrimary: "#FFBA8800",
      colorFlexiThemeSecondary: "#A6DCA100",
      colorFlexiThemeTertiary: "#27BA8800",
    },
    dark: {
      colorFlexiBackgroundPrimary: "#FF000000",
      colorFlexiBackgroundSecondary: "#FF000000",
      colorFlexiForegroundPrimary: "#FF221B0D",
      colorFlexiForegroundSecondary: "#FF382F20",
      colorFlexiThemePrimary: "#FFA18F5C",
      colorFlexiThemeSecondary: "#A6857544",
      colorFlexiThemeTertiary: "#45A18F5C",
    },
  },
  green: {
    light: {
      colorFlexiBackgroundPrimary: "#FFEFF1ED",
      colorFlexiBackgroundSecondary: "#FFE1E3DF",
      colorFlexiForegroundPrimary: "#FFFBFDF8",
      colorFlexiForegroundSecondary: "#FFEFF1ED",
      colorFlexiThemePrimary: "#FF5B9E7A",
      colorFlexiThemeSecondary: "#A676B993",
      colorFlexiThemeTertiary: "#275B9E7A",
    },
    dark: {
      colorFlexiBackgroundPrimary: "#FF000000",
      colorFlexiBackgroundSecondary: "#FF000000",
      colorFlexiForegroundPrimary: "#FF191C1A",
      colorFlexiForegroundSecondary: "#FF2E312E",
      colorFlexiThemePrimary: "#FF7F9687",
      colorFlexiThemeSecondary: "#A6657B6D",
      colorFlexiThemeTertiary: "#457F9687",
    },
  },
  blue: {
    light: {
      colorFlexiBackgroundPrimary: "#FFF0F0F3",
      colorFlexiBackgroundSecondary: "#FFE2E2E5",
      colorFlexiForegroundPrimary: "#FFFCFCFF",
      colorFlexiForegroundSecondary: "#FFF0F0F3",
      colorFlexiThemePrimary: "#FF0099DF",
      colorFlexiThemeSecondary: "#A633B4FF",
      colorFlexiThemeTertiary: "#270099DF",
    },
    dark: {
      colorFlexiBackgroundPrimary: "#FF000000",
      colorFlexiBackgroundSecondary: "#FF000000",
      colorFlexiForegroundPrimary: "#FF141C23",
      colorFlexiForegroundSecondary: "#FF293139",
      colorFlexiThemePrimary: "#FF8091B1",
      colorFlexiThemeSecondary: "#A6657795",
      colorFlexiThemeTertiary: "#458091B1",
    },
  },
};

export const flexiLightColors: FlexiColorTokens = toCssColorTokens(flexiLightColorsAndroidRaw);

export const flexiDarkColors: FlexiColorTokens = toCssColorTokens(flexiDarkColorsAndroidRaw);

export const flexiHighContrastColors: FlexiColorTokens = toCssColorTokens(flexiHighContrastColorsAndroidRaw);

export const flexiPresetThemeOverrides: FlexiPresetThemeOverrideMap = toCssPresetOverrides(flexiPresetThemeOverridesAndroidRaw);

export const flexiPresetPrimaryColors = {
  default: flexiLightColors.colorFlexiThemePrimary,
  red: flexiPresetThemeOverrides.red.light.colorFlexiThemePrimary,
  pink: flexiPresetThemeOverrides.pink.light.colorFlexiThemePrimary,
  purple: flexiPresetThemeOverrides.purple.light.colorFlexiThemePrimary,
  orange: flexiPresetThemeOverrides.orange.light.colorFlexiThemePrimary,
  yellow: flexiPresetThemeOverrides.yellow.light.colorFlexiThemePrimary,
  green: flexiPresetThemeOverrides.green.light.colorFlexiThemePrimary,
  blue: flexiPresetThemeOverrides.blue.light.colorFlexiThemePrimary,
} as const;

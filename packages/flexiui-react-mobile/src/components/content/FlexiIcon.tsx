import { css, cx } from "@emotion/css";
import type { HTMLAttributes, ReactNode } from "react";
import { alphaColor } from "../../foundation/color";
import type { FlexiBaseComponentProps } from "../../foundation/componentTypes";
import { useResolvedTheme } from "../../foundation/useResolvedTheme";

export type FlexiIconTintStyle = "themePrimary" | "themeSecondary" | "textPrimary" | "textSecondary" | "custom";

export type FlexiIconProps = HTMLAttributes<HTMLSpanElement> &
  FlexiBaseComponentProps & {
    icon?: ReactNode;
    tint?: string;
    tintStyle?: FlexiIconTintStyle;
    rippleEffect?: boolean;
    size?: number;
  };

function resolveTintColor(
  tintStyle: FlexiIconTintStyle,
  tint: string | undefined,
  theme: ReturnType<typeof useResolvedTheme>,
): string {
  switch (tintStyle) {
    case "themeSecondary":
      return theme.colors.colorFlexiThemeSecondary;
    case "textPrimary":
      return theme.colors.colorFlexiTextPrimary;
    case "textSecondary":
      return theme.colors.colorFlexiTextSecondary;
    case "custom":
      return tint ?? theme.colors.colorFlexiThemePrimary;
    case "themePrimary":
    default:
      return tint ?? theme.colors.colorFlexiThemePrimary;
  }
}

export function FlexiIcon({
  theme,
  className,
  style,
  icon,
  children,
  tint,
  tintStyle = "themePrimary",
  rippleEffect = false,
  size,
  ...props
}: FlexiIconProps) {
  const currentTheme = useResolvedTheme(theme);
  const finalSize = size ?? currentTheme.dimensions.dimensionFlexiIconSizeSecondary;
  const tintColor = resolveTintColor(tintStyle, tint, currentTheme);

  const iconClassName = css({
    width: finalSize,
    height: finalSize,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: tintColor,
    borderRadius: currentTheme.dimensions.dimensionFlexiCornerRadiusSecondary,
    position: "relative",
    overflow: "hidden",
    cursor: "pointer",
    userSelect: "none",
    transition: "background-color 120ms ease",
    ":active": rippleEffect
      ? {
          background: alphaColor(currentTheme.colors.colorFlexiThemeSecondary, 0.18),
        }
      : undefined,
  });

  return (
    <span {...props} className={cx(iconClassName, className)} style={style}>
      {icon ?? children}
    </span>
  );
}

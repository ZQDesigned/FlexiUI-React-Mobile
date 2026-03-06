import { css, cx } from "@emotion/css";
import type { ButtonHTMLAttributes, CSSProperties } from "react";
import { alphaColor } from "../../foundation/color";
import { useResolvedTheme } from "../../foundation/useResolvedTheme";
import type { FlexiTheme } from "../../theme/types";

export type FlexiButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  theme?: FlexiTheme;
};

export function FlexiButton({ children, theme, className, style, ...props }: FlexiButtonProps) {
  const currentTheme = useResolvedTheme(theme);

  const buttonClassName = css({
    border: `${currentTheme.dimensions.dimensionFlexiStrokeSizeSecondary}px solid ${currentTheme.colors.colorFlexiThemePrimary}`,
    borderRadius: currentTheme.dimensions.dimensionFlexiCornerRadiusPrimary,
    backgroundColor: currentTheme.colors.colorFlexiForegroundPrimary,
    color: currentTheme.colors.colorFlexiTextPrimary,
    fontSize: currentTheme.dimensions.dimensionFlexiTextSizePrimary,
    padding: `${currentTheme.dimensions.dimensionFlexiSpacingTertiary}px ${currentTheme.dimensions.dimensionFlexiSpacingPrimary}px`,
    cursor: "pointer",
    transition:
      "background-color 180ms cubic-bezier(0.2, 0, 0, 1), color 180ms cubic-bezier(0.2, 0, 0, 1), border-color 180ms cubic-bezier(0.2, 0, 0, 1), box-shadow 180ms cubic-bezier(0.2, 0, 0, 1), transform 140ms cubic-bezier(0.2, 0, 0, 1)",
    ":hover:not(:disabled)": {
      backgroundColor: alphaColor(currentTheme.colors.colorFlexiThemePrimary, 0.08),
    },
    ":active:not(:disabled)": {
      transform: "translateY(1px) scale(0.985)",
      backgroundColor: alphaColor(currentTheme.colors.colorFlexiThemePrimary, 0.14),
    },
    ":focus-visible": {
      outline: "none",
      boxShadow: `0 0 0 3px ${alphaColor(currentTheme.colors.colorFlexiThemePrimary, 0.24)}`,
    },
    ":disabled": {
      opacity: 0.52,
      cursor: "not-allowed",
    },
  });

  const buttonStyle: CSSProperties = {
    ...style,
  };

  return (
    <button {...props} className={cx(buttonClassName, className)} style={buttonStyle}>
      {children}
    </button>
  );
}

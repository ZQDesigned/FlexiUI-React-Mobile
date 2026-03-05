import { css, cx } from "@emotion/css";
import type { ButtonHTMLAttributes, CSSProperties } from "react";
import { useResolvedTheme } from "../foundation/useResolvedTheme";
import type { FlexiTheme } from "../theme/types";

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

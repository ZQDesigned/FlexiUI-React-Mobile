import { css, cx } from "@emotion/css";
import type { CSSProperties, HTMLAttributes } from "react";
import { useResolvedTheme } from "../foundation/useResolvedTheme";
import type { FlexiTheme } from "../theme/types";

export type FlexiTextProps = HTMLAttributes<HTMLParagraphElement> & {
  theme?: FlexiTheme;
  secondary?: boolean;
};

export function FlexiText({ children, theme, secondary = false, className, style, ...props }: FlexiTextProps) {
  const currentTheme = useResolvedTheme(theme);

  const textClassName = css({
    margin: 0,
    color: secondary ? currentTheme.colors.colorFlexiTextSecondary : currentTheme.colors.colorFlexiTextPrimary,
    fontSize: secondary
      ? currentTheme.dimensions.dimensionFlexiTextSizeSecondary
      : currentTheme.dimensions.dimensionFlexiTextSizePrimary,
    lineHeight: 1.5,
  });

  const textStyle: CSSProperties = {
    ...style,
  };

  return (
    <p {...props} className={cx(textClassName, className)} style={textStyle}>
      {children}
    </p>
  );
}

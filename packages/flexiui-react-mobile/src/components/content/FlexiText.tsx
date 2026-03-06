import { css, cx } from "@emotion/css";
import type { HTMLAttributes } from "react";
import type { FlexiBaseComponentProps } from "../../foundation/componentTypes";
import { useResolvedTheme } from "../../foundation/useResolvedTheme";

export type FlexiTextProps = HTMLAttributes<HTMLParagraphElement> &
  FlexiBaseComponentProps & {
    textSize?: number;
    textColor?: string;
    secondaryTextStyle?: boolean;
    secondary?: boolean;
  };

export function FlexiText({
  theme,
  className,
  style,
  textSize,
  textColor,
  secondaryTextStyle = false,
  secondary = false,
  children,
  ...props
}: FlexiTextProps) {
  const currentTheme = useResolvedTheme(theme);
  const useSecondary = secondaryTextStyle || secondary;

  const finalTextSize = useSecondary
    ? currentTheme.dimensions.dimensionFlexiTextSizeSecondary
    : textSize ?? currentTheme.dimensions.dimensionFlexiTextSizePrimary;

  const finalTextColor = useSecondary
    ? currentTheme.colors.colorFlexiTextSecondary
    : textColor ?? currentTheme.colors.colorFlexiTextPrimary;

  const textClassName = css({
    margin: 0,
    color: finalTextColor,
    fontSize: finalTextSize,
    lineHeight: 1.45,
    transition: "color 180ms cubic-bezier(0.2, 0, 0, 1)",
  });

  return (
    <p {...props} className={cx(textClassName, className)} style={style}>
      {children}
    </p>
  );
}

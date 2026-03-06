import { css, cx } from "@emotion/css";
import { useMemo, useState, type FocusEvent, type InputHTMLAttributes } from "react";
import type { FlexiBaseComponentProps } from "../../foundation/componentTypes";
import { useResolvedTheme } from "../../foundation/useResolvedTheme";

export type FlexiEditTextProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> &
  FlexiBaseComponentProps & {
    cornerRadius?: number;
    boxBackgroundColor?: string;
    boxStrokeSize?: number;
    boxStrokeInActiveColor?: string;
    boxStrokeActiveColor?: string;
    boxPadding?: number;
    boxPaddingLeft?: number;
    boxPaddingTop?: number;
    boxPaddingRight?: number;
    boxPaddingBottom?: number;
    textSize?: number;
    textColor?: string;
    hintTextColor?: string;
    useOriginalStyle?: boolean;
  };

export function FlexiEditText({
  theme,
  className,
  style,
  cornerRadius,
  boxBackgroundColor,
  boxStrokeSize,
  boxStrokeInActiveColor,
  boxStrokeActiveColor,
  boxPadding,
  boxPaddingLeft,
  boxPaddingTop,
  boxPaddingRight,
  boxPaddingBottom,
  textSize,
  textColor,
  hintTextColor,
  useOriginalStyle = false,
  onFocus,
  onBlur,
  ...props
}: FlexiEditTextProps) {
  const currentTheme = useResolvedTheme(theme);
  const [focused, setFocused] = useState(false);

  const resolvedPadding = useMemo(
    () => ({
      left: boxPadding ?? boxPaddingLeft ?? currentTheme.dimensions.dimensionFlexiSpacingPrimary,
      top: boxPadding ?? boxPaddingTop ?? currentTheme.dimensions.dimensionFlexiSpacingPrimary,
      right: boxPadding ?? boxPaddingRight ?? currentTheme.dimensions.dimensionFlexiSpacingPrimary,
      bottom: boxPadding ?? boxPaddingBottom ?? currentTheme.dimensions.dimensionFlexiSpacingPrimary,
    }),
    [boxPadding, boxPaddingBottom, boxPaddingLeft, boxPaddingRight, boxPaddingTop, currentTheme],
  );

  const resolvedStrokeColor = focused
    ? boxStrokeActiveColor ?? currentTheme.colors.colorFlexiThemePrimary
    : boxStrokeInActiveColor ?? currentTheme.colors.colorFlexiThemeSecondary;

  const inputClassName = css({
    width: "100%",
    outline: "none",
    borderRadius: cornerRadius ?? currentTheme.dimensions.dimensionFlexiCornerRadiusPrimary,
    border: `${boxStrokeSize ?? currentTheme.dimensions.dimensionFlexiStrokeSizeSecondary}px solid ${resolvedStrokeColor}`,
    backgroundColor: boxBackgroundColor ?? "transparent",
    color: textColor ?? currentTheme.colors.colorFlexiTextPrimary,
    fontSize: textSize ?? currentTheme.dimensions.dimensionFlexiTextSizePrimary,
    paddingLeft: resolvedPadding.left,
    paddingTop: resolvedPadding.top,
    paddingRight: resolvedPadding.right,
    paddingBottom: resolvedPadding.bottom,
    transition: "border-color 180ms ease",
    "::placeholder": {
      color: hintTextColor ?? currentTheme.colors.colorFlexiThemeSecondary,
    },
  });

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    onBlur?.(event);
  };

  if (useOriginalStyle) {
    return <input {...props} className={className} style={style} onFocus={handleFocus} onBlur={handleBlur} />;
  }

  return (
    <input
      {...props}
      className={cx(inputClassName, className)}
      style={style}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
}

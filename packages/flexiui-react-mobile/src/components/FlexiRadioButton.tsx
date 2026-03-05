import { css, cx } from "@emotion/css";
import type { InputHTMLAttributes, ReactNode } from "react";
import type { FlexiBaseComponentProps } from "../foundation/componentTypes";
import { useResolvedTheme } from "../foundation/useResolvedTheme";

export type FlexiRadioButtonProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> &
  FlexiBaseComponentProps & {
    textSize?: number;
    tint?: string;
    checkedTint?: string;
    unCheckedTint?: string;
    label?: ReactNode;
  };

export function FlexiRadioButton({
  theme,
  className,
  style,
  textSize,
  tint,
  checkedTint,
  unCheckedTint,
  label,
  disabled,
  ...props
}: FlexiRadioButtonProps) {
  const currentTheme = useResolvedTheme(theme);
  const finalCheckedTint = checkedTint ?? tint ?? currentTheme.colors.colorFlexiThemePrimary;
  const finalUncheckedTint = unCheckedTint ?? tint ?? currentTheme.colors.colorFlexiThemePrimary;

  const rootClassName = css({
    display: "inline-flex",
    alignItems: "center",
    gap: currentTheme.dimensions.dimensionFlexiSpacingTertiary,
    color: currentTheme.colors.colorFlexiTextPrimary,
    fontSize: textSize ?? currentTheme.dimensions.dimensionFlexiTextSizePrimary,
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? "not-allowed" : "pointer",
  });

  const inputClassName = css({
    width: currentTheme.dimensions.dimensionFlexiIconSizeTertiary,
    height: currentTheme.dimensions.dimensionFlexiIconSizeTertiary,
    margin: 0,
    cursor: "inherit",
    accentColor: finalUncheckedTint,
    ":checked": {
      accentColor: finalCheckedTint,
    },
  });

  return (
    <label className={cx(rootClassName, className)} style={style}>
      <input {...props} type="radio" disabled={disabled} className={inputClassName} />
      {label}
    </label>
  );
}

import { css, cx } from "@emotion/css";
import type { InputHTMLAttributes, ReactNode } from "react";
import { alphaColor } from "../../foundation/color";
import type { FlexiBaseComponentProps } from "../../foundation/componentTypes";
import { useResolvedTheme } from "../../foundation/useResolvedTheme";

export type FlexiCheckBoxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> &
  FlexiBaseComponentProps & {
    textSize?: number;
    tint?: string;
    checkedTint?: string;
    unCheckedTint?: string;
    label?: ReactNode;
  };

export function FlexiCheckBox({
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
}: FlexiCheckBoxProps) {
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
    transition: "transform 140ms cubic-bezier(0.2, 0, 0, 1), filter 160ms cubic-bezier(0.2, 0, 0, 1), box-shadow 160ms cubic-bezier(0.2, 0, 0, 1)",
    ":focus-visible": {
      outline: "none",
      boxShadow: `0 0 0 3px ${alphaColor(finalCheckedTint, 0.24)}`,
      borderRadius: 4,
    },
    ":active": {
      transform: "scale(0.92)",
    },
    ":checked": {
      accentColor: finalCheckedTint,
      filter: "saturate(1.12)",
    },
  });

  return (
    <label className={cx(rootClassName, className)} style={style}>
      <input {...props} type="checkbox" disabled={disabled} className={inputClassName} />
      {label}
    </label>
  );
}

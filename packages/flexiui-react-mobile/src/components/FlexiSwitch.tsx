import { css, cx } from "@emotion/css";
import { useId, useState, type ChangeEvent, type InputHTMLAttributes, type ReactNode } from "react";
import type { FlexiBaseComponentProps } from "../foundation/componentTypes";
import { useResolvedTheme } from "../foundation/useResolvedTheme";

export type FlexiSwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> &
  FlexiBaseComponentProps & {
    textSize?: number;
    trackInActiveTint?: string;
    trackActiveTint?: string;
    thumbTint?: string;
    label?: ReactNode;
    onCheckedChange?: (checked: boolean) => void;
  };

export function FlexiSwitch({
  theme,
  className,
  style,
  textSize,
  trackInActiveTint,
  trackActiveTint,
  thumbTint,
  label,
  onChange,
  onCheckedChange,
  checked,
  defaultChecked,
  disabled,
  id,
  ...props
}: FlexiSwitchProps) {
  const currentTheme = useResolvedTheme(theme);
  const inputId = id ?? useId();
  const [internalChecked, setInternalChecked] = useState(defaultChecked ?? false);
  const iconSize = currentTheme.dimensions.dimensionFlexiIconSizeTertiary;
  const trackHeight = iconSize + 4;
  const trackWidth = iconSize * 2;

  const rootClassName = css({
    display: "inline-flex",
    alignItems: "center",
    gap: currentTheme.dimensions.dimensionFlexiSpacingSecondary,
    fontSize: textSize ?? currentTheme.dimensions.dimensionFlexiTextSizePrimary,
    color: currentTheme.colors.colorFlexiTextPrimary,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
  });

  const visualClassName = css({
    position: "relative",
    display: "inline-block",
    width: trackWidth,
    height: trackHeight,
    borderRadius: trackHeight / 2,
    backgroundColor: trackInActiveTint ?? currentTheme.colors.colorFlexiThemeTertiary,
    transition: "background-color 180ms ease",
    "::after": {
      content: "\"\"",
      position: "absolute",
      top: 2,
      left: 2,
      width: iconSize,
      height: iconSize,
      borderRadius: "50%",
      backgroundColor: thumbTint ?? "#FFFFFF",
      transition: "transform 180ms ease",
      boxShadow: "0 1px 2px rgba(0,0,0,0.25)",
    },
  });

  const inputClassName = css({
    position: "absolute",
    opacity: 0,
    width: 0,
    height: 0,
    pointerEvents: "none",
  });

  const checkedClassName = css({
    backgroundColor: trackActiveTint ?? currentTheme.colors.colorFlexiThemePrimary,
    "::after": {
      transform: `translateX(${iconSize - 2}px)`,
    },
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (checked === undefined) {
      setInternalChecked(event.target.checked);
    }
    onChange?.(event);
    onCheckedChange?.(event.target.checked);
  };

  const isChecked = checked ?? internalChecked;

  return (
    <label htmlFor={inputId} className={cx(rootClassName, className)} style={style}>
      <input
        {...props}
        id={inputId}
        type="checkbox"
        className={inputClassName}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={handleChange}
      />
      <span className={cx(visualClassName, isChecked && checkedClassName)} />
      {label}
    </label>
  );
}

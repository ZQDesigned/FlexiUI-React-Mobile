import { css, cx } from "@emotion/css";
import { useMemo, useState, type ChangeEvent, type InputHTMLAttributes } from "react";
import type { FlexiBaseComponentProps } from "../foundation/componentTypes";
import { useResolvedTheme } from "../foundation/useResolvedTheme";

export type FlexiValueLabelBehavior = "floatOnSliding" | "alwaysVisible" | "alwaysGone";

export type FlexiSliderProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "defaultValue" | "onChange"> &
  FlexiBaseComponentProps & {
    indicatorColor?: string;
    trackColor?: string;
    thumbColor?: string;
    thumbSize?: number;
    valueFrom?: number;
    valueTo?: number;
    value?: number;
    defaultValue?: number;
    valueStep?: number;
    valueLabelBehavior?: FlexiValueLabelBehavior;
    valueLabelFormatter?: string;
    onValueChange?: (value: number) => void;
  };

export function FlexiSlider({
  theme,
  className,
  style,
  indicatorColor,
  trackColor,
  thumbColor,
  thumbSize,
  valueFrom = 0,
  valueTo = 100,
  value,
  defaultValue = 0,
  valueStep = 0,
  valueLabelBehavior = "floatOnSliding",
  valueLabelFormatter = "",
  onValueChange,
  disabled,
  ...props
}: FlexiSliderProps) {
  const currentTheme = useResolvedTheme(theme);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isSliding, setIsSliding] = useState(false);
  const currentValue = value ?? internalValue;

  const finalIndicatorColor = indicatorColor ?? currentTheme.colors.colorFlexiThemePrimary;
  const finalTrackColor = trackColor ?? currentTheme.colors.colorFlexiThemeTertiary;
  const finalThumbColor = thumbColor ?? finalIndicatorColor;
  const finalThumbSize = thumbSize ?? currentTheme.dimensions.dimensionFlexiZoomSizeSecondary;

  const safeRange = Math.max(valueTo - valueFrom, 1);
  const progressPercent = Math.max(0, Math.min(((currentValue - valueFrom) / safeRange) * 100, 100));

  const rootClassName = css({
    width: "100%",
    opacity: disabled ? 0.6 : 1,
  });

  const sliderClassName = css({
    width: "100%",
    margin: 0,
    appearance: "none",
    background: "transparent",
    cursor: disabled ? "not-allowed" : "pointer",
    "::webkit-slider-runnable-track": {
      height: 6,
    },
    "::-webkit-slider-runnable-track": {
      height: 6,
      borderRadius: 999,
      background: `linear-gradient(to right, ${finalIndicatorColor} 0%, ${finalIndicatorColor} ${progressPercent}%, ${finalTrackColor} ${progressPercent}%, ${finalTrackColor} 100%)`,
    },
    "::-webkit-slider-thumb": {
      appearance: "none",
      marginTop: -(finalThumbSize / 2 - 3),
      width: finalThumbSize,
      height: finalThumbSize,
      borderRadius: "50%",
      backgroundColor: finalThumbColor,
      border: "none",
    },
    "::-moz-range-track": {
      height: 6,
      borderRadius: 999,
      background: finalTrackColor,
      border: "none",
    },
    "::-moz-range-progress": {
      height: 6,
      borderRadius: 999,
      background: finalIndicatorColor,
    },
    "::-moz-range-thumb": {
      width: finalThumbSize,
      height: finalThumbSize,
      borderRadius: "50%",
      backgroundColor: finalThumbColor,
      border: "none",
    },
  });

  const labelClassName = css({
    marginBottom: currentTheme.dimensions.dimensionFlexiSpacingTertiary,
    color: currentTheme.colors.colorFlexiThemePrimary,
    fontSize: currentTheme.dimensions.dimensionFlexiTextSizeSecondary,
  });

  const shouldShowLabel = useMemo(() => {
    switch (valueLabelBehavior) {
      case "alwaysVisible":
        return true;
      case "alwaysGone":
        return false;
      case "floatOnSliding":
      default:
        return isSliding;
    }
  }, [isSliding, valueLabelBehavior]);

  const labelText = useMemo(() => {
    if (!valueLabelFormatter) {
      return `${currentValue}`;
    }

    return valueLabelFormatter
      .replace("{valueInt}", `${Math.round(currentValue)}`)
      .replace("{valueFloat}", `${currentValue}`);
  }, [currentValue, valueLabelFormatter]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = Number(event.target.value);
    if (value === undefined) {
      setInternalValue(nextValue);
    }
    onValueChange?.(nextValue);
  };

  return (
    <div className={cx(rootClassName, className)} style={style}>
      {shouldShowLabel ? <div className={labelClassName}>{labelText}</div> : null}
      <input
        {...props}
        type="range"
        className={sliderClassName}
        disabled={disabled}
        min={valueFrom}
        max={valueTo}
        step={valueStep > 0 ? valueStep : undefined}
        value={currentValue}
        onMouseDown={() => setIsSliding(true)}
        onMouseUp={() => setIsSliding(false)}
        onTouchStart={() => setIsSliding(true)}
        onTouchEnd={() => setIsSliding(false)}
        onBlur={() => setIsSliding(false)}
        onChange={handleChange}
      />
    </div>
  );
}

import { css, cx } from "@emotion/css";
import { useId, useRef, useState, type ChangeEvent, type CSSProperties, type InputHTMLAttributes, type PointerEvent, type ReactNode } from "react";
import { alphaColor } from "../../foundation/color";
import type { FlexiBaseComponentProps } from "../../foundation/componentTypes";
import { useResolvedTheme } from "../../foundation/useResolvedTheme";

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
  const inputRef = useRef<HTMLInputElement>(null);
  const pointerIdRef = useRef<number | null>(null);
  const pointerStartXRef = useRef(0);
  const pointerStartOffsetRef = useRef(0);
  const isDraggingRef = useRef(false);
  const [internalChecked, setInternalChecked] = useState(defaultChecked ?? false);
  const [dragOffset, setDragOffset] = useState<number | null>(null);

  const iconSize = currentTheme.dimensions.dimensionFlexiIconSizeTertiary;
  const trackHeight = Math.max(iconSize + 6, 24);
  const trackWidth = Math.round(trackHeight * 1.86);
  const trackPadding = 2;
  const thumbSize = trackHeight - trackPadding * 2;
  const thumbTravel = trackWidth - thumbSize - trackPadding * 2;

  const isChecked = checked ?? internalChecked;

  const trackClassName = css({
    position: "relative",
    display: "inline-block",
    width: trackWidth,
    height: trackHeight,
    borderRadius: trackHeight / 2,
    backgroundColor: trackInActiveTint ?? alphaColor(currentTheme.colors.colorFlexiThemeSecondary, 0.34),
    boxShadow: `inset 0 0 0 1px ${alphaColor(currentTheme.colors.colorFlexiThemeSecondary, 0.2)}`,
    transition: "background-color 220ms cubic-bezier(0.2, 0, 0, 1), box-shadow 220ms cubic-bezier(0.2, 0, 0, 1), transform 140ms cubic-bezier(0.2, 0, 0, 1)",
    "::before": {
      content: "\"\"",
      position: "absolute",
      top: trackPadding,
      left: trackPadding,
      width: thumbSize,
      height: thumbSize,
      borderRadius: "50%",
      backgroundColor: thumbTint ?? currentTheme.colors.colorFlexiForegroundPrimary,
      boxShadow: `0 1px 3px ${alphaColor("#000000", 0.26)}`,
      transform: "translateX(var(--flexi-switch-thumb-offset, 0px))",
      transition:
        "transform 240ms cubic-bezier(0.2, 0.88, 0.28, 1.05), background-color 180ms cubic-bezier(0.2, 0, 0, 1), box-shadow 180ms cubic-bezier(0.2, 0, 0, 1)",
    },
  });

  const checkedClassName = css({
    "--flexi-switch-thumb-offset": `${thumbTravel}px`,
    backgroundColor: trackActiveTint ?? currentTheme.colors.colorFlexiThemePrimary,
    boxShadow: `inset 0 0 0 1px ${alphaColor(currentTheme.colors.colorFlexiThemePrimary, 0.34)}`,
    "::before": {
      boxShadow: `0 2px 6px ${alphaColor(currentTheme.colors.colorFlexiThemePrimary, 0.34)}`,
    },
  });

  const draggingClassName = css({
    transition: "none",
    "::before": {
      transition: "none",
    },
  });

  const rootClassName = css({
    display: "inline-flex",
    alignItems: "center",
    gap: currentTheme.dimensions.dimensionFlexiSpacingSecondary,
    fontSize: textSize ?? currentTheme.dimensions.dimensionFlexiTextSizePrimary,
    color: currentTheme.colors.colorFlexiTextPrimary,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.58 : 1,
    userSelect: "none",
    transition: "opacity 160ms cubic-bezier(0.2, 0, 0, 1), color 180ms cubic-bezier(0.2, 0, 0, 1)",
    [`.${trackClassName}`]: {
      willChange: "transform",
    },
    [`.${trackClassName}:hover`]: disabled
      ? undefined
      : {
          boxShadow: `inset 0 0 0 1px ${alphaColor(currentTheme.colors.colorFlexiThemePrimary, 0.26)}`,
        },
    [`.${trackClassName}:active`]: disabled
      ? undefined
      : {
          transform: "scale(0.97)",
        },
    [`input:focus-visible + .${trackClassName}`]: {
      boxShadow: `0 0 0 3px ${alphaColor(currentTheme.colors.colorFlexiThemePrimary, 0.28)}`,
    },
  });

  const inputClassName = css({
    position: "absolute",
    opacity: 0,
    width: 1,
    height: 1,
    pointerEvents: "none",
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextChecked = event.target.checked;
    if (checked === undefined) {
      setInternalChecked(nextChecked);
    }
    onChange?.(event);
    onCheckedChange?.(nextChecked);
  };

  const toggleViaInput = () => {
    inputRef.current?.click();
  };

  const handleTrackPointerDown = (event: PointerEvent<HTMLSpanElement>) => {
    if (disabled) {
      return;
    }

    if (event.button !== 0) {
      return;
    }

    pointerIdRef.current = event.pointerId;
    pointerStartXRef.current = event.clientX;
    pointerStartOffsetRef.current = isChecked ? thumbTravel : 0;
    isDraggingRef.current = false;
    setDragOffset(pointerStartOffsetRef.current);
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  };

  const handleTrackPointerMove = (event: PointerEvent<HTMLSpanElement>) => {
    if (pointerIdRef.current !== event.pointerId) {
      return;
    }

    const delta = event.clientX - pointerStartXRef.current;
    if (Math.abs(delta) > 2) {
      isDraggingRef.current = true;
    }
    const nextOffset = Math.max(0, Math.min(pointerStartOffsetRef.current + delta, thumbTravel));
    setDragOffset(nextOffset);
  };

  const endTrackPointer = (event: PointerEvent<HTMLSpanElement>) => {
    if (pointerIdRef.current !== event.pointerId) {
      return;
    }

    pointerIdRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const finalOffset = dragOffset ?? pointerStartOffsetRef.current;
    const nextChecked = finalOffset >= thumbTravel / 2;
    const shouldToggle = isDraggingRef.current ? nextChecked !== isChecked : true;

    setDragOffset(null);
    isDraggingRef.current = false;

    if (shouldToggle) {
      toggleViaInput();
    }
    event.preventDefault();
  };

  const cancelTrackPointer = (event: PointerEvent<HTMLSpanElement>) => {
    if (pointerIdRef.current !== event.pointerId) {
      return;
    }

    pointerIdRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDragOffset(null);
    isDraggingRef.current = false;
    event.preventDefault();
  };

  const trackStyle =
    dragOffset === null
      ? undefined
      : ({
          "--flexi-switch-thumb-offset": `${dragOffset}px`,
        } as CSSProperties);

  return (
    <label htmlFor={inputId} className={cx(rootClassName, className)} style={style}>
      <input
        {...props}
        ref={inputRef}
        id={inputId}
        type="checkbox"
        className={inputClassName}
        checked={isChecked}
        disabled={disabled}
        onChange={handleChange}
      />
      <span
        className={cx(trackClassName, isChecked && checkedClassName, dragOffset !== null && draggingClassName)}
        style={trackStyle}
        onClick={(event) => {
          event.preventDefault();
        }}
        onPointerDown={handleTrackPointerDown}
        onPointerMove={handleTrackPointerMove}
        onPointerUp={endTrackPointer}
        onPointerCancel={cancelTrackPointer}
      />
      {label}
    </label>
  );
}

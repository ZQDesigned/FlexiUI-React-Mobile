import { css, cx } from "@emotion/css";
import { useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { alphaColor } from "../../foundation/color";
import type { FlexiBaseComponentProps } from "../../foundation/componentTypes";
import { useResolvedTheme } from "../../foundation/useResolvedTheme";
import { FlexiIconCheck } from "../icons";

export type FlexiChipAppearance = "normal" | "checkbox" | "candidate";

export type FlexiChipProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> &
  FlexiBaseComponentProps & {
    chipAppearance?: FlexiChipAppearance;
    chipIcon?: ReactNode;
    checked?: boolean;
    defaultChecked?: boolean;
    ensureMinTouchTargetSize?: boolean;
    onCheckedChange?: (checked: boolean) => void;
  };

export function FlexiChip({
  theme,
  className,
  style,
  chipAppearance = "normal",
  chipIcon,
  checked,
  defaultChecked = false,
  ensureMinTouchTargetSize = false,
  onCheckedChange,
  children,
  onClick,
  ...props
}: FlexiChipProps) {
  const currentTheme = useResolvedTheme(theme);
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = checked ?? internalChecked;

  const chipClassName = css({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: currentTheme.dimensions.dimensionFlexiSpacingTertiary,
    minHeight: ensureMinTouchTargetSize ? 44 : undefined,
    minWidth: ensureMinTouchTargetSize ? 44 : undefined,
    borderRadius: currentTheme.dimensions.dimensionFlexiCornerRadiusSecondary,
    border: `${currentTheme.dimensions.dimensionFlexiStrokeSizeSecondary}px solid ${currentTheme.colors.colorFlexiThemePrimary}`,
    backgroundColor: isChecked ? currentTheme.colors.colorFlexiThemeTertiary : currentTheme.colors.colorFlexiForegroundPrimary,
    color: currentTheme.colors.colorFlexiThemePrimary,
    fontSize: currentTheme.dimensions.dimensionFlexiTextSizePrimary,
    padding: `${currentTheme.dimensions.dimensionFlexiSpacingTertiary}px ${currentTheme.dimensions.dimensionFlexiSpacingSecondary}px`,
    cursor: "pointer",
    transition:
      "background-color 180ms cubic-bezier(0.2, 0, 0, 1), border-color 180ms cubic-bezier(0.2, 0, 0, 1), color 180ms cubic-bezier(0.2, 0, 0, 1), box-shadow 180ms cubic-bezier(0.2, 0, 0, 1), transform 140ms cubic-bezier(0.2, 0, 0, 1)",
    ":hover:not(:disabled)": {
      backgroundColor: isChecked
        ? alphaColor(currentTheme.colors.colorFlexiThemePrimary, 0.2)
        : alphaColor(currentTheme.colors.colorFlexiThemePrimary, 0.1),
    },
    ":active:not(:disabled)": {
      transform: "translateY(1px) scale(0.985)",
    },
    ":focus-visible": {
      outline: "none",
      boxShadow: `0 0 0 3px ${alphaColor(currentTheme.colors.colorFlexiThemePrimary, 0.24)}`,
    },
    ":disabled": {
      opacity: 0.55,
      cursor: "not-allowed",
    },
  });

  const handleClick: ButtonHTMLAttributes<HTMLButtonElement>["onClick"] = (event) => {
    const nextChecked = !isChecked;
    if (checked === undefined && chipAppearance !== "normal") {
      setInternalChecked(nextChecked);
    }

    if (chipAppearance !== "normal") {
      onCheckedChange?.(nextChecked);
    }

    onClick?.(event);
  };

  return (
    <button {...props} className={cx(chipClassName, className)} style={style} onClick={handleClick} type="button">
      {(chipAppearance === "checkbox" || chipAppearance === "candidate") && isChecked ? (
        <FlexiIconCheck size={currentTheme.dimensions.dimensionFlexiIconSizeTertiary} color="currentColor" />
      ) : (
        chipIcon
      )}
      {children}
    </button>
  );
}

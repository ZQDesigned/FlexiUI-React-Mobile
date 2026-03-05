import { css, cx } from "@emotion/css";
import { useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import type { FlexiBaseComponentProps } from "../foundation/componentTypes";
import { useResolvedTheme } from "../foundation/useResolvedTheme";

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
    transition: "all 180ms ease",
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
      {(chipAppearance === "checkbox" || chipAppearance === "candidate") && isChecked ? "✓" : chipIcon}
      {children}
    </button>
  );
}

import { css, cx } from "@emotion/css";
import { useState, type HTMLAttributes, type ReactNode } from "react";
import type { FlexiBaseComponentProps } from "../foundation/componentTypes";
import { useResolvedTheme } from "../foundation/useResolvedTheme";
import { FlexiSwitch } from "./FlexiSwitch";

export type FlexiItemOrientation = "horizontal" | "vertical";
export type FlexiItemStyle = "normal" | "switcher" | "selector";
export type FlexiItemLogoShape = "roundRectangle" | "rectangle" | "circle";

export type FlexiItemProps = Omit<HTMLAttributes<HTMLDivElement>, "title" | "style"> &
  FlexiBaseComponentProps & {
    rippleEffect?: boolean;
    orientation?: FlexiItemOrientation;
    itemIsSelected?: boolean;
    boxSelectedBackgroundColor?: string;
    titleTextColor?: string;
    titleSelectedTextColor?: string;
    subtitleTextColor?: string;
    subtitleSelectedTextColor?: string;
    arrowTint?: string;
    arrowSelectedTint?: string;
    arrowAlpha?: number;
    logoImage?: ReactNode;
    logoSize?: number;
    showFlagArrow?: boolean;
    itemStyle?: FlexiItemStyle;
    checked?: boolean;
    defaultChecked?: boolean;
    dataSets?: string[];
    dropdownItemSelection?: number;
    componentSpacing?: number;
    contentSpacing?: number;
    titleTextSize?: number;
    subtitleTextSize?: number;
    title?: ReactNode;
    subtitle?: ReactNode;
    logoCornerRadius?: number;
    logoShape?: FlexiItemLogoShape;
    onCheckedChange?: (checked: boolean) => void;
    onSelectionChange?: (index: number, value: string) => void;
  };

export function FlexiItem({
  theme,
  className,
  style,
  rippleEffect = true,
  orientation = "horizontal",
  itemIsSelected,
  boxSelectedBackgroundColor,
  titleTextColor,
  titleSelectedTextColor,
  subtitleTextColor,
  subtitleSelectedTextColor,
  arrowTint,
  arrowSelectedTint,
  arrowAlpha = 0.5,
  logoImage,
  logoSize = -1,
  showFlagArrow = true,
  itemStyle = "normal",
  checked,
  defaultChecked = false,
  dataSets = [],
  dropdownItemSelection = -1,
  componentSpacing,
  contentSpacing,
  titleTextSize,
  subtitleTextSize,
  title = "",
  subtitle = "",
  logoCornerRadius = -1,
  logoShape = "roundRectangle",
  onCheckedChange,
  onSelectionChange,
  onClick,
  ...props
}: FlexiItemProps) {
  const currentTheme = useResolvedTheme(theme);
  const [internalSelected, setInternalSelected] = useState(false);
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const [internalSelection, setInternalSelection] = useState(dropdownItemSelection >= 0 ? dropdownItemSelection : 0);

  const selected = itemIsSelected ?? internalSelected;
  const switchChecked = checked ?? internalChecked;
  const selectedIndex = dropdownItemSelection >= 0 ? dropdownItemSelection : internalSelection;
  const selectedValue = dataSets[selectedIndex] ?? "";

  const rootClassName = css({
    display: "flex",
    flexDirection: orientation === "vertical" ? "column" : "row",
    alignItems: orientation === "vertical" ? "stretch" : "center",
    justifyContent: "space-between",
    gap: componentSpacing ?? currentTheme.dimensions.dimensionFlexiSpacingSecondary,
    width: "100%",
    padding: currentTheme.dimensions.dimensionFlexiSpacingSecondary,
    borderRadius: currentTheme.dimensions.dimensionFlexiCornerRadiusPrimary,
    background: selected
      ? boxSelectedBackgroundColor ?? currentTheme.colors.colorFlexiThemeTertiary
      : currentTheme.colors.colorFlexiForegroundPrimary,
    transition: "background-color 150ms ease",
    cursor: "pointer",
    userSelect: "none",
    ":active": rippleEffect
      ? {
          filter: "brightness(0.98)",
        }
      : undefined,
  });

  const leftWrapClassName = css({
    display: "flex",
    alignItems: orientation === "vertical" ? "flex-start" : "center",
    flexDirection: orientation === "vertical" ? "column" : "row",
    gap: contentSpacing ?? currentTheme.dimensions.dimensionFlexiSpacingSecondary,
    minWidth: 0,
    flex: 1,
  });

  const contentClassName = css({
    display: "flex",
    flexDirection: "column",
    gap: currentTheme.dimensions.dimensionFlexiSpacingTertiary,
    minWidth: 0,
    width: "100%",
  });

  const titleClassName = css({
    margin: 0,
    color: selected
      ? titleSelectedTextColor ?? currentTheme.colors.colorFlexiThemePrimary
      : titleTextColor ?? currentTheme.colors.colorFlexiTextPrimary,
    fontSize: titleTextSize ?? currentTheme.dimensions.dimensionFlexiTextSizePrimary,
    lineHeight: 1.3,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  });

  const subtitleClassName = css({
    margin: 0,
    color: selected
      ? subtitleSelectedTextColor ?? currentTheme.colors.colorFlexiThemeSecondary
      : subtitleTextColor ?? currentTheme.colors.colorFlexiTextSecondary,
    fontSize: subtitleTextSize ?? currentTheme.dimensions.dimensionFlexiTextSizeSecondary,
    lineHeight: 1.3,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  });

  const logoClassName = css({
    width: logoSize > 0 ? logoSize : currentTheme.dimensions.dimensionFlexiIconSizePrimary,
    height: logoSize > 0 ? logoSize : currentTheme.dimensions.dimensionFlexiIconSizePrimary,
    borderRadius:
      logoShape === "circle"
        ? "50%"
        : logoShape === "rectangle"
          ? 0
          : logoCornerRadius > 0
            ? logoCornerRadius
            : currentTheme.dimensions.dimensionFlexiCornerRadiusSecondary,
    overflow: "hidden",
    flexShrink: 0,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: currentTheme.colors.colorFlexiBackgroundSecondary,
  });

  const arrowClassName = css({
    color: selected ? arrowSelectedTint ?? currentTheme.colors.colorFlexiThemePrimary : arrowTint ?? currentTheme.colors.colorFlexiTextPrimary,
    opacity: arrowAlpha,
    flexShrink: 0,
  });

  const handleRootClick: HTMLAttributes<HTMLDivElement>["onClick"] = (event) => {
    if (itemIsSelected === undefined && itemStyle === "normal") {
      setInternalSelected((value) => !value);
    }
    onClick?.(event);
  };

  const handleSwitchChange = (nextChecked: boolean) => {
    if (checked === undefined) {
      setInternalChecked(nextChecked);
    }
    onCheckedChange?.(nextChecked);
  };

  const handleSelectionChange: HTMLAttributes<HTMLSelectElement>["onChange"] = (event) => {
    const nextIndex = Number(event.currentTarget.value);
    if (dropdownItemSelection < 0) {
      setInternalSelection(nextIndex);
    }
    onSelectionChange?.(nextIndex, dataSets[nextIndex] ?? "");
  };

  return (
    <div {...props} className={cx(rootClassName, className)} style={style} onClick={handleRootClick}>
      <div className={leftWrapClassName}>
        {logoImage ? <span className={logoClassName}>{logoImage}</span> : null}
        <div className={contentClassName}>
          <p className={titleClassName}>{title}</p>
          {subtitle ? <p className={subtitleClassName}>{subtitle}</p> : null}
        </div>
      </div>

      {orientation === "horizontal" && itemStyle === "normal" && showFlagArrow ? <span className={arrowClassName}>›</span> : null}

      {itemStyle === "switcher" ? (
        <FlexiSwitch checked={switchChecked} onCheckedChange={handleSwitchChange} />
      ) : null}

      {itemStyle === "selector" ? (
        <select
          value={selectedIndex}
          onChange={handleSelectionChange}
          style={{
            borderRadius: currentTheme.dimensions.dimensionFlexiCornerRadiusSecondary,
            border: `${currentTheme.dimensions.dimensionFlexiStrokeSizeSecondary}px solid ${currentTheme.colors.colorFlexiThemeTertiary}`,
            background: currentTheme.colors.colorFlexiForegroundPrimary,
            color: currentTheme.colors.colorFlexiTextPrimary,
            padding: `${currentTheme.dimensions.dimensionFlexiSpacingTertiary}px ${currentTheme.dimensions.dimensionFlexiSpacingSecondary}px`,
            fontSize: currentTheme.dimensions.dimensionFlexiTextSizeSecondary,
          }}
        >
          {dataSets.map((value, index) => (
            <option key={`${value}-${index}`} value={index}>
              {value}
            </option>
          ))}
        </select>
      ) : null}

      {itemStyle === "selector" && !dataSets.length ? <span>{selectedValue}</span> : null}
    </div>
  );
}

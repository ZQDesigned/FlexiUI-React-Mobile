import { css, cx } from "@emotion/css";
import { useState, type HTMLAttributes } from "react";
import type { FlexiBaseComponentProps } from "../foundation/componentTypes";
import { useResolvedTheme } from "../foundation/useResolvedTheme";
import type { FlexiTabItem } from "./FlexiTabLayout";

export type FlexiTabChipState = "selected" | "reselected" | "unselected";

export type FlexiTabChipProps = HTMLAttributes<HTMLDivElement> &
  FlexiBaseComponentProps & {
    tabItems: FlexiTabItem[];
    selectionRequired?: boolean;
    fadingEdgeLength?: number;
    tabItemSelection?: number;
    defaultTabItemSelection?: number;
    tabItemTextSize?: number;
    tabItemTextColor?: string;
    tabItemSelectedTextColor?: string;
    tabItemSpacing?: number;
    tabItemBackgroundColor?: string;
    tabItemSelectedBackgroundColor?: string;
    onTabSelectionChange?: (index: number, item: FlexiTabItem) => void;
    onTabStateChange?: (index: number, item: FlexiTabItem, state: FlexiTabChipState) => void;
  };

export function FlexiTabChip({
  theme,
  className,
  style,
  tabItems,
  selectionRequired = false,
  fadingEdgeLength,
  tabItemSelection,
  defaultTabItemSelection = -1,
  tabItemTextSize,
  tabItemTextColor,
  tabItemSelectedTextColor,
  tabItemSpacing,
  tabItemBackgroundColor,
  tabItemSelectedBackgroundColor,
  onTabSelectionChange,
  onTabStateChange,
  ...props
}: FlexiTabChipProps) {
  const currentTheme = useResolvedTheme(theme);
  const [internalSelection, setInternalSelection] = useState(defaultTabItemSelection);
  const selectedIndex = tabItemSelection ?? internalSelection;

  const rootClassName = css({
    display: "flex",
    alignItems: "center",
    gap: tabItemSpacing ?? currentTheme.dimensions.dimensionFlexiSpacingSecondary,
    overflowX: "auto",
    paddingBottom: 2,
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    "::-webkit-scrollbar": {
      display: "none",
    },
    maskImage:
      (fadingEdgeLength ?? currentTheme.dimensions.dimensionFlexiZoomSizeSecondary) > 0
        ? `linear-gradient(to right, transparent 0, black ${fadingEdgeLength ?? currentTheme.dimensions.dimensionFlexiZoomSizeSecondary}px, black calc(100% - ${
            fadingEdgeLength ?? currentTheme.dimensions.dimensionFlexiZoomSizeSecondary
          }px), transparent 100%)`
        : undefined,
  });

  const handleClick = (index: number) => {
    const item = tabItems[index];
    if (!item) {
      return;
    }

    if (index === selectedIndex) {
      if (selectionRequired) {
        onTabStateChange?.(index, item, "reselected");
        return;
      }

      if (tabItemSelection === undefined) {
        setInternalSelection(-1);
      }
      onTabStateChange?.(index, item, "unselected");
      return;
    }

    if (tabItemSelection === undefined) {
      setInternalSelection(index);
    }
    onTabSelectionChange?.(index, item);
    onTabStateChange?.(index, item, "selected");
  };

  return (
    <div {...props} className={cx(rootClassName, className)} style={style}>
      {tabItems.map((item, index) => {
        const selected = index === selectedIndex;
        const chipClassName = css({
          border: 0,
          borderRadius: currentTheme.dimensions.dimensionFlexiCornerRadiusSecondary,
          background: selected
            ? tabItemSelectedBackgroundColor ?? currentTheme.colors.colorFlexiThemeTertiary
            : tabItemBackgroundColor ?? currentTheme.colors.colorFlexiForegroundPrimary,
          color: selected
            ? tabItemSelectedTextColor ?? currentTheme.colors.colorFlexiThemePrimary
            : tabItemTextColor ?? currentTheme.colors.colorFlexiTextPrimary,
          fontSize: tabItemTextSize ?? currentTheme.dimensions.dimensionFlexiTextSizePrimary,
          padding: `${currentTheme.dimensions.dimensionFlexiSpacingTertiary}px ${currentTheme.dimensions.dimensionFlexiSpacingSecondary}px`,
          whiteSpace: "nowrap",
          display: "inline-flex",
          alignItems: "center",
          gap: currentTheme.dimensions.dimensionFlexiSpacingTertiary,
          cursor: "pointer",
        });

        return (
          <button key={item.key} type="button" className={chipClassName} onClick={() => handleClick(index)}>
            {item.icon}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

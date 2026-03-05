import { css, cx } from "@emotion/css";
import { useMemo, useState, type HTMLAttributes } from "react";
import { alphaColor } from "../foundation/color";
import type { FlexiBaseComponentProps } from "../foundation/componentTypes";
import { useResolvedTheme } from "../foundation/useResolvedTheme";
import type { FlexiTabItem } from "./FlexiTabLayout";

export type FlexiNavigationBarState = "selected" | "reselected";

export type FlexiNavigationBarProps = HTMLAttributes<HTMLElement> &
  FlexiBaseComponentProps & {
    tabItems: FlexiTabItem[];
    tabItemSelection?: number;
    defaultTabItemSelection?: number;
    tabItemTextColor?: string;
    tabItemSelectedTextColor?: string;
    tabItemIconTint?: string;
    tabItemSelectedIconTint?: string;
    tabItemIndicatorColor?: string;
    onTabSelectionChange?: (index: number, item: FlexiTabItem) => void;
    onTabStateChange?: (index: number, item: FlexiTabItem, state: FlexiNavigationBarState) => void;
  };

export function FlexiNavigationBar({
  theme,
  className,
  style,
  tabItems,
  tabItemSelection,
  defaultTabItemSelection = 0,
  tabItemTextColor,
  tabItemSelectedTextColor,
  tabItemIconTint,
  tabItemSelectedIconTint,
  tabItemIndicatorColor,
  onTabSelectionChange,
  onTabStateChange,
  ...props
}: FlexiNavigationBarProps) {
  const currentTheme = useResolvedTheme(theme);
  const [internalSelection, setInternalSelection] = useState(defaultTabItemSelection);
  const selectedIndex = tabItemSelection ?? internalSelection;

  const finalIndicatorColor = useMemo(
    () => tabItemIndicatorColor ?? alphaColor(currentTheme.colors.colorFlexiThemePrimary, 0.25),
    [currentTheme.colors.colorFlexiThemePrimary, tabItemIndicatorColor],
  );

  const rootClassName = css({
    width: "100%",
    display: "grid",
    gridTemplateColumns: `repeat(${Math.max(tabItems.length, 1)}, minmax(0, 1fr))`,
    background: currentTheme.colors.colorFlexiForegroundPrimary,
    borderRadius: currentTheme.dimensions.dimensionFlexiCornerRadiusSecondary,
    padding: currentTheme.dimensions.dimensionFlexiSpacingTertiary,
    gap: currentTheme.dimensions.dimensionFlexiSpacingTertiary,
    border: `${currentTheme.dimensions.dimensionFlexiStrokeSizeSecondary}px solid ${currentTheme.colors.colorFlexiThemeTertiary}`,
  });

  const handleClick = (index: number) => {
    const item = tabItems[index];
    if (!item) {
      return;
    }

    if (index === selectedIndex) {
      onTabStateChange?.(index, item, "reselected");
      return;
    }

    if (tabItemSelection === undefined) {
      setInternalSelection(index);
    }

    onTabSelectionChange?.(index, item);
    onTabStateChange?.(index, item, "selected");
  };

  return (
    <nav {...props} className={cx(rootClassName, className)} style={style}>
      {tabItems.map((item, index) => {
        const selected = index === selectedIndex;
        const itemClassName = css({
          border: 0,
          borderRadius: currentTheme.dimensions.dimensionFlexiCornerRadiusSecondary,
          background: selected ? finalIndicatorColor : "transparent",
          color: selected
            ? tabItemSelectedTextColor ?? currentTheme.colors.colorFlexiThemePrimary
            : tabItemTextColor ?? currentTheme.colors.colorFlexiThemeSecondary,
          padding: `${currentTheme.dimensions.dimensionFlexiSpacingSecondary}px ${currentTheme.dimensions.dimensionFlexiSpacingTertiary}px`,
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: currentTheme.dimensions.dimensionFlexiSpacingTertiary,
          fontSize: currentTheme.dimensions.dimensionFlexiTextSizeSecondary,
          cursor: "pointer",
        });

        return (
          <button key={item.key} type="button" className={itemClassName} onClick={() => handleClick(index)}>
            {item.icon ? (
              <span
                style={{
                  color: selected
                    ? tabItemSelectedIconTint ?? currentTheme.colors.colorFlexiThemePrimary
                    : tabItemIconTint ?? currentTheme.colors.colorFlexiThemeSecondary,
                  display: "inline-flex",
                }}
              >
                {item.icon}
              </span>
            ) : null}
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

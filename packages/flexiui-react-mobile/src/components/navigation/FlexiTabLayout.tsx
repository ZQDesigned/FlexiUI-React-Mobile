import { css, cx } from "@emotion/css";
import { useMemo, useState, type HTMLAttributes, type ReactNode } from "react";
import { alphaColor } from "../../foundation/color";
import type { FlexiBaseComponentProps } from "../../foundation/componentTypes";
import { useResolvedTheme } from "../../foundation/useResolvedTheme";

export type FlexiTabAlignment = "scrollable" | "fixed" | "auto";
export type FlexiTabState = "selected" | "reselected" | "unselected";

export type FlexiTabItem = {
  key: string;
  label: string;
  icon?: ReactNode;
};

export type FlexiTabLayoutProps = HTMLAttributes<HTMLDivElement> &
  FlexiBaseComponentProps & {
    tabItems: FlexiTabItem[];
    tabAlignment?: FlexiTabAlignment;
    tabItemSelection?: number;
    defaultTabItemSelection?: number;
    tabItemTextSize?: number;
    tabItemTextColor?: string;
    tabItemSelectedTextColor?: string;
    tabItemIconTint?: string;
    tabItemSelectedIconTint?: string;
    tabItemIndicatorColor?: string;
    tabItemPaddingStart?: number;
    tabItemPaddingTop?: number;
    tabItemPaddingEnd?: number;
    tabItemPaddingBottom?: number;
    tabItemMinWidth?: number;
    tabItemMaxWidth?: number;
    scrollableTabItemMinWidth?: number;
    onTabSelectionChange?: (index: number, item: FlexiTabItem) => void;
    onTabStateChange?: (index: number, item: FlexiTabItem, state: FlexiTabState) => void;
  };

export function FlexiTabLayout({
  theme,
  className,
  style,
  tabItems,
  tabAlignment = "auto",
  tabItemSelection,
  defaultTabItemSelection = 0,
  tabItemTextSize,
  tabItemTextColor,
  tabItemSelectedTextColor,
  tabItemIconTint,
  tabItemSelectedIconTint,
  tabItemIndicatorColor,
  tabItemPaddingStart = -1,
  tabItemPaddingTop = -1,
  tabItemPaddingEnd = -1,
  tabItemPaddingBottom = -1,
  tabItemMinWidth = 0,
  tabItemMaxWidth = -1,
  scrollableTabItemMinWidth = 0,
  onTabSelectionChange,
  onTabStateChange,
  ...props
}: FlexiTabLayoutProps) {
  const currentTheme = useResolvedTheme(theme);
  const [internalSelection, setInternalSelection] = useState(defaultTabItemSelection);
  const selectedIndex = tabItemSelection ?? internalSelection;

  const effectiveAlignment = useMemo<FlexiTabAlignment>(() => {
    if (tabAlignment !== "auto") {
      return tabAlignment;
    }
    return tabItems.length > 4 ? "scrollable" : "fixed";
  }, [tabAlignment, tabItems.length]);

  const rootClassName = css({
    display: "flex",
    overflowX: effectiveAlignment === "scrollable" ? "auto" : "hidden",
    overflowY: "hidden",
    borderBottom: `${currentTheme.dimensions.dimensionFlexiStrokeSizeSecondary}px solid ${currentTheme.colors.colorFlexiThemeTertiary}`,
    gap: effectiveAlignment === "scrollable" ? currentTheme.dimensions.dimensionFlexiSpacingTertiary : 0,
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    "::-webkit-scrollbar": {
      display: "none",
    },
  });

  const indicatorWidth = Math.max(currentTheme.dimensions.dimensionFlexiIconSizeTertiary, 20);
  const indicatorHeight = Math.max(currentTheme.dimensions.dimensionFlexiStrokeSizeSecondary * 2, 2);

  const handleTabClick = (index: number) => {
    const item = tabItems[index];
    const wasSelected = index === selectedIndex;

    if (wasSelected) {
      onTabStateChange?.(index, item, "reselected");
      return;
    }

    if (tabItemSelection === undefined) {
      setInternalSelection(index);
    }

    const previous = tabItems[selectedIndex];
    if (previous) {
      onTabStateChange?.(selectedIndex, previous, "unselected");
    }

    onTabSelectionChange?.(index, item);
    onTabStateChange?.(index, item, "selected");
  };

  return (
    <div {...props} className={cx(rootClassName, className)} style={style}>
      {tabItems.map((item, index) => {
        const selected = index === selectedIndex;
        const tabClassName = css({
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: currentTheme.dimensions.dimensionFlexiSpacingTertiary,
          border: 0,
          background: "transparent",
          color: selected
            ? tabItemSelectedTextColor ?? currentTheme.colors.colorFlexiThemePrimary
            : tabItemTextColor ?? currentTheme.colors.colorFlexiThemeSecondary,
          fontSize: tabItemTextSize ?? currentTheme.dimensions.dimensionFlexiTextSizePrimary,
          paddingLeft: tabItemPaddingStart >= 0 ? tabItemPaddingStart : currentTheme.dimensions.dimensionFlexiSpacingPrimary,
          paddingTop: tabItemPaddingTop >= 0 ? tabItemPaddingTop : currentTheme.dimensions.dimensionFlexiSpacingSecondary,
          paddingRight: tabItemPaddingEnd >= 0 ? tabItemPaddingEnd : currentTheme.dimensions.dimensionFlexiSpacingPrimary,
          paddingBottom: tabItemPaddingBottom >= 0 ? tabItemPaddingBottom : currentTheme.dimensions.dimensionFlexiSpacingSecondary,
          minWidth:
            effectiveAlignment === "scrollable"
              ? Math.max(scrollableTabItemMinWidth, tabItemMinWidth)
              : tabItemMinWidth || undefined,
          maxWidth: tabItemMaxWidth > 0 ? tabItemMaxWidth : undefined,
          flex: effectiveAlignment === "fixed" ? 1 : undefined,
          whiteSpace: "nowrap",
          cursor: "pointer",
          "::after": {
            content: "\"\"",
            position: "absolute",
            left: "50%",
            bottom: 0,
            width: indicatorWidth,
            height: indicatorHeight,
            borderRadius: indicatorHeight,
            background: tabItemIndicatorColor ?? currentTheme.colors.colorFlexiThemePrimary,
            transform: selected ? "translateX(-50%) scaleX(1)" : "translateX(-50%) scaleX(0.6)",
            opacity: selected ? 1 : 0,
            transition:
              "opacity 180ms cubic-bezier(0.2, 0, 0, 1), transform 180ms cubic-bezier(0.2, 0, 0, 1), background-color 180ms cubic-bezier(0.2, 0, 0, 1)",
          },
          transition:
            "color 180ms cubic-bezier(0.2, 0, 0, 1), border-color 180ms cubic-bezier(0.2, 0, 0, 1), background-color 180ms cubic-bezier(0.2, 0, 0, 1), transform 140ms cubic-bezier(0.2, 0, 0, 1)",
          ":hover:not(:disabled)": {
            background: alphaColor(currentTheme.colors.colorFlexiThemePrimary, 0.08),
          },
          ":active:not(:disabled)": {
            transform: "translateY(1px) scale(0.985)",
          },
          ":focus-visible": {
            outline: "none",
            boxShadow: `inset 0 0 0 2px ${alphaColor(currentTheme.colors.colorFlexiThemePrimary, 0.32)}`,
          },
        });

        return (
          <button key={item.key} type="button" className={tabClassName} onClick={() => handleTabClick(index)}>
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
    </div>
  );
}

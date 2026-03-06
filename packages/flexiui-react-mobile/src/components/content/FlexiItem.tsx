import { css, cx, keyframes } from "@emotion/css";
import { useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from "react";
import { alphaColor } from "../../foundation/color";
import type { FlexiBaseComponentProps } from "../../foundation/componentTypes";
import { useResolvedTheme } from "../../foundation/useResolvedTheme";
import { FlexiIconArrowForward } from "../icons";
import { FlexiSwitch } from "../forms/FlexiSwitch";

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

const dropdownEnterKeyframes = keyframes({
  "0%": {
    opacity: 0,
    transform: "translateY(-6px) scale(0.985)",
  },
  "100%": {
    opacity: 1,
    transform: "translateY(0) scale(1)",
  },
});

const dropdownExitKeyframes = keyframes({
  "0%": {
    opacity: 1,
    transform: "translateY(0) scale(1)",
  },
  "100%": {
    opacity: 0,
    transform: "translateY(-4px) scale(0.99)",
  },
});

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
  const [selectorMenuPhase, setSelectorMenuPhase] = useState<"closed" | "opening" | "open" | "closing">("closed");
  const selectorRef = useRef<HTMLDivElement>(null);
  const selectorMenuVisible = selectorMenuPhase !== "closed";
  const selectorOpen = selectorMenuPhase === "opening" || selectorMenuPhase === "open";

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
    width: currentTheme.dimensions.dimensionFlexiIconSizeTertiary,
    height: currentTheme.dimensions.dimensionFlexiIconSizeTertiary,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  });

  const selectorWrapClassName = css({
    position: "relative",
    flexShrink: 0,
    minWidth: 128,
  });

  const selectorTriggerClassName = css({
    width: "100%",
    borderRadius: currentTheme.dimensions.dimensionFlexiCornerRadiusSecondary,
    border: `${currentTheme.dimensions.dimensionFlexiStrokeSizeSecondary}px solid ${currentTheme.colors.colorFlexiThemeTertiary}`,
    background: currentTheme.colors.colorFlexiForegroundPrimary,
    color: currentTheme.colors.colorFlexiTextPrimary,
    padding: `${currentTheme.dimensions.dimensionFlexiSpacingTertiary}px ${currentTheme.dimensions.dimensionFlexiSpacingSecondary}px`,
    fontSize: currentTheme.dimensions.dimensionFlexiTextSizeSecondary,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: currentTheme.dimensions.dimensionFlexiSpacingTertiary,
    cursor: "pointer",
    transition:
      "background-color 180ms cubic-bezier(0.2, 0, 0, 1), border-color 180ms cubic-bezier(0.2, 0, 0, 1), box-shadow 180ms cubic-bezier(0.2, 0, 0, 1), transform 140ms cubic-bezier(0.2, 0, 0, 1)",
    ":hover:not(:disabled)": {
      background: alphaColor(currentTheme.colors.colorFlexiThemePrimary, 0.08),
    },
    ":active:not(:disabled)": {
      transform: "translateY(1px) scale(0.985)",
    },
  });

  const selectorMenuClassName = css({
    position: "absolute",
    top: `calc(100% + ${currentTheme.dimensions.dimensionFlexiZoomSizeTertiary}px)`,
    right: 0,
    zIndex: 7,
    minWidth: "100%",
    maxHeight: 240,
    overflowY: "auto",
    borderRadius: currentTheme.dimensions.dimensionFlexiCornerRadiusSecondary,
    border: `${currentTheme.dimensions.dimensionFlexiStrokeSizeSecondary}px solid ${currentTheme.colors.colorFlexiThemeTertiary}`,
    background: currentTheme.colors.colorFlexiForegroundPrimary,
    boxShadow: "0 10px 28px rgba(0, 0, 0, 0.16)",
    padding: `${currentTheme.dimensions.dimensionFlexiSpacingTertiary}px`,
    transformOrigin: "top center",
  });

  const selectorMenuOpeningClassName = css({
    animation: `${dropdownEnterKeyframes} 180ms cubic-bezier(0.2, 0.88, 0.28, 1.05)`,
  });

  const selectorMenuClosingClassName = css({
    animation: `${dropdownExitKeyframes} 150ms cubic-bezier(0.4, 0, 1, 1) forwards`,
    pointerEvents: "none",
  });

  const openSelectorMenu = () => {
    setSelectorMenuPhase((phase) => (phase === "closed" || phase === "closing" ? "opening" : phase));
  };

  const closeSelectorMenu = () => {
    setSelectorMenuPhase((phase) => (phase === "open" || phase === "opening" ? "closing" : phase));
  };

  const toggleSelectorMenu = () => {
    if (selectorOpen) {
      closeSelectorMenu();
      return;
    }
    openSelectorMenu();
  };

  useEffect(() => {
    if (!selectorMenuVisible) {
      return;
    }

    const handleOutsidePointerDown = (event: PointerEvent) => {
      if (selectorRef.current?.contains(event.target as Node)) {
        return;
      }
      closeSelectorMenu();
    };

    window.addEventListener("pointerdown", handleOutsidePointerDown);
    return () => {
      window.removeEventListener("pointerdown", handleOutsidePointerDown);
    };
  }, [selectorMenuVisible]);

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

  const handleSelectionChange = (nextIndex: number) => {
    if (dropdownItemSelection < 0) {
      setInternalSelection(nextIndex);
    }
    onSelectionChange?.(nextIndex, dataSets[nextIndex] ?? "");
    closeSelectorMenu();
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

      {orientation === "horizontal" && itemStyle === "normal" && showFlagArrow ? (
        <span className={arrowClassName}>
          <FlexiIconArrowForward size={currentTheme.dimensions.dimensionFlexiIconSizeTertiary} color="currentColor" />
        </span>
      ) : null}

      {itemStyle === "switcher" ? (
        <FlexiSwitch checked={switchChecked} onCheckedChange={handleSwitchChange} />
      ) : null}

      {itemStyle === "selector" ? (
        <div
          ref={selectorRef}
          className={selectorWrapClassName}
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <button
            type="button"
            className={selectorTriggerClassName}
            aria-haspopup="listbox"
            aria-expanded={selectorOpen}
            onClick={toggleSelectorMenu}
          >
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selectedValue || "Select"}</span>
            <span style={{ opacity: 0.7 }}>▾</span>
          </button>

          {selectorMenuVisible ? (
            <div
              className={cx(
                selectorMenuClassName,
                selectorMenuPhase === "opening" && selectorMenuOpeningClassName,
                selectorMenuPhase === "closing" && selectorMenuClosingClassName,
              )}
              role="listbox"
              onAnimationEnd={() => {
                setSelectorMenuPhase((phase) => {
                  if (phase === "opening") {
                    return "open";
                  }
                  if (phase === "closing") {
                    return "closed";
                  }
                  return phase;
                });
              }}
            >
              {dataSets.length ? (
                dataSets.map((value, index) => {
                  const optionClassName = css({
                    width: "100%",
                    border: 0,
                    borderRadius: currentTheme.dimensions.dimensionFlexiCornerRadiusSecondary,
                    padding: `${currentTheme.dimensions.dimensionFlexiSpacingTertiary}px ${currentTheme.dimensions.dimensionFlexiSpacingSecondary}px`,
                    background:
                      selectedIndex === index ? alphaColor(currentTheme.colors.colorFlexiThemePrimary, 0.16) : "transparent",
                    color: currentTheme.colors.colorFlexiTextPrimary,
                    fontSize: currentTheme.dimensions.dimensionFlexiTextSizeSecondary,
                    textAlign: "left",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    transition: "background-color 160ms cubic-bezier(0.2, 0, 0, 1), transform 120ms cubic-bezier(0.2, 0, 0, 1)",
                    ":hover": {
                      background: alphaColor(currentTheme.colors.colorFlexiThemePrimary, 0.12),
                    },
                    ":active": {
                      transform: "translateY(1px) scale(0.99)",
                    },
                  });

                  return (
                    <button
                      key={`${value}-${index}`}
                      type="button"
                      role="option"
                      aria-selected={selectedIndex === index}
                      className={optionClassName}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        handleSelectionChange(index);
                      }}
                    >
                      {value}
                    </button>
                  );
                })
              ) : (
                <div
                  style={{
                    padding: `${currentTheme.dimensions.dimensionFlexiSpacingTertiary}px ${currentTheme.dimensions.dimensionFlexiSpacingSecondary}px`,
                    color: currentTheme.colors.colorFlexiTextSecondary,
                    fontSize: currentTheme.dimensions.dimensionFlexiTextSizeSecondary,
                  }}
                >
                  No options
                </div>
              )}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

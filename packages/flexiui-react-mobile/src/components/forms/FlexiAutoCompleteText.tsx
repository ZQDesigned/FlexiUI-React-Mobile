import { css, cx, keyframes } from "@emotion/css";
import { useEffect, useMemo, useState, type FocusEvent, type InputHTMLAttributes, type MouseEvent } from "react";
import { alphaColor } from "../../foundation/color";
import type { FlexiBaseComponentProps } from "../../foundation/componentTypes";
import { useResolvedTheme } from "../../foundation/useResolvedTheme";
import { FlexiIconFinishClose } from "../icons";
import type { FlexiDropdownItem } from "./FlexiDropdownList";

export type FlexiAutoCompleteTextProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "onChange"> &
  FlexiBaseComponentProps & {
    dataSets?: string[] | FlexiDropdownItem[];
    completionThreshold?: number;
    completionLetterCase?: boolean;
    completionMaxMatchedCount?: number;
    completionMatchesFromAnyPosition?: boolean;
    dropdownHorizontalOffset?: number;
    dropdownVerticalOffset?: number;
    dropdownWidth?: number;
    dropdownHeight?: number;
    dropdownBackgroundColor?: string;
    dropdownSelectionItemTint?: string;
    dropdownItemTextColor?: string;
    dropdownItemTextMaxLines?: number;
    dropdownItemMatchedTextColor?: string;
    dropdownItemTextSize?: number;
    dropdownItemMatchedTextBold?: boolean;
    allowRemoveItem?: boolean;
    shownWhenFocused?: boolean;
    onValueChange?: (value: string) => void;
    onSelectionChange?: (index: number, item: FlexiDropdownItem) => void;
  };

function normalizeItems(dataSets: FlexiAutoCompleteTextProps["dataSets"]): FlexiDropdownItem[] {
  if (!dataSets) {
    return [];
  }

  return dataSets.map((item) => (typeof item === "string" ? { label: item, value: item } : { label: item.label, value: item.value ?? item.label }));
}

function normalizeByCase(text: string, caseSensitive: boolean): string {
  return caseSensitive ? text : text.toLowerCase();
}

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

export function FlexiAutoCompleteText({
  theme,
  className,
  style,
  dataSets,
  completionThreshold = 2,
  completionLetterCase = false,
  completionMaxMatchedCount = -1,
  completionMatchesFromAnyPosition = false,
  dropdownHorizontalOffset = 0,
  dropdownVerticalOffset,
  dropdownWidth = -1,
  dropdownHeight = -1,
  dropdownBackgroundColor,
  dropdownSelectionItemTint,
  dropdownItemTextColor,
  dropdownItemTextMaxLines = Number.MAX_SAFE_INTEGER,
  dropdownItemMatchedTextColor,
  dropdownItemTextSize,
  dropdownItemMatchedTextBold = true,
  allowRemoveItem = false,
  shownWhenFocused = false,
  onFocus,
  onBlur,
  onValueChange,
  onSelectionChange,
  ...props
}: FlexiAutoCompleteTextProps) {
  const currentTheme = useResolvedTheme(theme);
  const [menuPhase, setMenuPhase] = useState<"closed" | "opening" | "open" | "closing">("closed");
  const [items, setItems] = useState<FlexiDropdownItem[]>(() => normalizeItems(dataSets));
  const [internalValue, setInternalValue] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const menuVisible = menuPhase !== "closed";

  useEffect(() => {
    setItems(normalizeItems(dataSets));
  }, [dataSets]);

  const matchedItems = useMemo(() => {
    if (!internalValue) {
      return shownWhenFocused ? items : [];
    }

    const normalizedKeyword = normalizeByCase(internalValue, completionLetterCase);
    if (completionThreshold > 0 && normalizedKeyword.length < completionThreshold) {
      return [];
    }

    const result = items.filter((item) => {
      const source = normalizeByCase(item.label, completionLetterCase);
      return completionMatchesFromAnyPosition ? source.includes(normalizedKeyword) : source.startsWith(normalizedKeyword);
    });

    if (completionMaxMatchedCount > 0) {
      return result.slice(0, completionMaxMatchedCount);
    }
    return result;
  }, [
    completionLetterCase,
    completionMatchesFromAnyPosition,
    completionMaxMatchedCount,
    completionThreshold,
    internalValue,
    items,
    shownWhenFocused,
  ]);

  const rootClassName = css({
    position: "relative",
    width: "100%",
  });

  const inputClassName = css({
    width: "100%",
    border: `${currentTheme.dimensions.dimensionFlexiStrokeSizeSecondary}px solid ${currentTheme.colors.colorFlexiThemeSecondary}`,
    borderRadius: currentTheme.dimensions.dimensionFlexiCornerRadiusPrimary,
    background: currentTheme.colors.colorFlexiForegroundPrimary,
    color: currentTheme.colors.colorFlexiTextPrimary,
    fontSize: currentTheme.dimensions.dimensionFlexiTextSizePrimary,
    padding: `${currentTheme.dimensions.dimensionFlexiSpacingSecondary}px ${currentTheme.dimensions.dimensionFlexiSpacingPrimary}px`,
    outline: "none",
    transition: "border-color 160ms ease",
    ":focus": {
      borderColor: currentTheme.colors.colorFlexiThemePrimary,
    },
  });

  const menuClassName = css({
    position: "absolute",
    zIndex: 6,
    left: dropdownHorizontalOffset,
    top: `calc(100% + ${dropdownVerticalOffset ?? currentTheme.dimensions.dimensionFlexiZoomSizeTertiary}px)`,
    width: dropdownWidth > 0 ? dropdownWidth : "100%",
    maxHeight: dropdownHeight > 0 ? dropdownHeight : 220,
    overflowY: "auto",
    borderRadius: currentTheme.dimensions.dimensionFlexiCornerRadiusSecondary,
    border: `${currentTheme.dimensions.dimensionFlexiStrokeSizeSecondary}px solid ${currentTheme.colors.colorFlexiThemeTertiary}`,
    background: dropdownBackgroundColor ?? currentTheme.colors.colorFlexiForegroundPrimary,
    padding: currentTheme.dimensions.dimensionFlexiSpacingTertiary,
    boxShadow: "0 6px 24px rgba(0, 0, 0, 0.14)",
    transformOrigin: "top center",
  });

  const menuOpeningClassName = css({
    animation: `${dropdownEnterKeyframes} 180ms cubic-bezier(0.2, 0.88, 0.28, 1.05)`,
  });

  const menuClosingClassName = css({
    animation: `${dropdownExitKeyframes} 150ms cubic-bezier(0.4, 0, 1, 1) forwards`,
    pointerEvents: "none",
  });

  const showMenu = () => {
    setMenuPhase((phase) => (phase === "closed" || phase === "closing" ? "opening" : phase));
  };

  const hideMenu = () => {
    setMenuPhase((phase) => (phase === "open" || phase === "opening" ? "closing" : phase));
  };

  const setValue = (nextValue: string) => {
    setInternalValue(nextValue);
    onValueChange?.(nextValue);
  };

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    if (shownWhenFocused || internalValue.length >= completionThreshold) {
      showMenu();
    }
    onFocus?.(event);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    window.setTimeout(() => hideMenu(), 100);
    onBlur?.(event);
  };

  const removeItem = (event: MouseEvent<HTMLButtonElement>, item: FlexiDropdownItem) => {
    event.stopPropagation();
    setItems((previous) => previous.filter((entry) => entry.value !== item.value || entry.label !== item.label));
  };

  const selectItem = (index: number, item: FlexiDropdownItem) => {
    setSelectedIndex(index);
    setValue(item.value ?? item.label);
    onSelectionChange?.(index, item);
    hideMenu();
  };

  const highlightLabel = (label: string) => {
    if (!internalValue) {
      return label;
    }

    const source = normalizeByCase(label, completionLetterCase);
    const keyword = normalizeByCase(internalValue, completionLetterCase);
    const matchIndex = source.indexOf(keyword);
    if (matchIndex < 0) {
      return label;
    }

    const start = label.slice(0, matchIndex);
    const matched = label.slice(matchIndex, matchIndex + internalValue.length);
    const end = label.slice(matchIndex + internalValue.length);

    return (
      <>
        {start}
        <span
          style={{
            color: dropdownItemMatchedTextColor ?? currentTheme.colors.colorFlexiThemePrimary,
            fontWeight: dropdownItemMatchedTextBold ? 700 : 400,
          }}
        >
          {matched}
        </span>
        {end}
      </>
    );
  };

  return (
    <div className={cx(rootClassName, className)} style={style}>
      <input
        {...props}
        className={inputClassName}
        value={internalValue}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={(event) => {
          const nextValue = event.target.value;
          setValue(nextValue);
          if (shownWhenFocused || nextValue.length >= completionThreshold) {
            showMenu();
          } else {
            hideMenu();
          }
        }}
      />

      {menuVisible ? (
        <div
          className={cx(menuClassName, menuPhase === "opening" && menuOpeningClassName, menuPhase === "closing" && menuClosingClassName)}
          onAnimationEnd={() => {
            setMenuPhase((phase) => {
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
          {matchedItems.map((item, index) => {
            const active = index === selectedIndex;
            const optionClassName = css({
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: currentTheme.dimensions.dimensionFlexiSpacingTertiary,
              borderRadius: currentTheme.dimensions.dimensionFlexiCornerRadiusSecondary,
              padding: `${currentTheme.dimensions.dimensionFlexiSpacingTertiary}px ${currentTheme.dimensions.dimensionFlexiSpacingSecondary}px`,
              background: active
                ? alphaColor(dropdownSelectionItemTint ?? currentTheme.colors.colorFlexiThemePrimary, 0.3)
                : "transparent",
              color: dropdownItemTextColor ?? currentTheme.colors.colorFlexiTextPrimary,
              fontSize: dropdownItemTextSize ?? currentTheme.dimensions.dimensionFlexiTextSizePrimary,
              cursor: "pointer",
              transition: "background-color 160ms cubic-bezier(0.2, 0, 0, 1), transform 120ms cubic-bezier(0.2, 0, 0, 1)",
              ":hover": {
                background: alphaColor(dropdownSelectionItemTint ?? currentTheme.colors.colorFlexiThemePrimary, 0.2),
              },
              ":active": {
                transform: "translateY(1px) scale(0.99)",
              },
            });

            const textClassName = css({
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: Math.max(1, dropdownItemTextMaxLines),
              WebkitBoxOrient: "vertical",
            });

            return (
              <div key={`${item.value}-${index}`} className={optionClassName} onMouseDown={() => selectItem(index, item)} role="button" tabIndex={-1}>
                <span className={textClassName}>{highlightLabel(item.label)}</span>
                {allowRemoveItem ? (
                  <button
                    type="button"
                    onMouseDown={(event) => removeItem(event, item)}
                    style={{
                      border: 0,
                      background: "transparent",
                      color: currentTheme.colors.colorFlexiThemeSecondary,
                      cursor: "pointer",
                    }}
                  >
                    <FlexiIconFinishClose size={currentTheme.dimensions.dimensionFlexiIconSizeTertiary} color="currentColor" />
                  </button>
                ) : null}
              </div>
            );
          })}
          {!matchedItems.length ? (
            <div
              style={{
                padding: `${currentTheme.dimensions.dimensionFlexiSpacingTertiary}px ${currentTheme.dimensions.dimensionFlexiSpacingSecondary}px`,
                color: currentTheme.colors.colorFlexiTextSecondary,
                fontSize: currentTheme.dimensions.dimensionFlexiTextSizeSecondary,
              }}
            >
              No matches
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

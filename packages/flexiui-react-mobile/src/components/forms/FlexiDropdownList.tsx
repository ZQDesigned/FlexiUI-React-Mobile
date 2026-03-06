import { css, cx, keyframes } from "@emotion/css";
import {
  useEffect,
  useMemo,
  useState,
  type FocusEvent,
  type InputHTMLAttributes,
  type MouseEvent,
} from "react";
import { alphaColor } from "../../foundation/color";
import type { FlexiBaseComponentProps } from "../../foundation/componentTypes";
import { useResolvedTheme } from "../../foundation/useResolvedTheme";

export type FlexiDropdownItem = {
  label: string;
  value?: string;
};

export type FlexiDropdownListProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "onChange"> &
  FlexiBaseComponentProps & {
    inputType?: string;
    dataSets?: string[] | FlexiDropdownItem[];
    dropdownItemSelection?: number;
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
    allowInputEvents?: boolean;
    allowRemoveItem?: boolean;
    shownWhenFocused?: boolean;
    onValueChange?: (value: string) => void;
    onSelectionChange?: (index: number, item: FlexiDropdownItem) => void;
  };

function normalizeItems(dataSets: FlexiDropdownListProps["dataSets"]): FlexiDropdownItem[] {
  if (!dataSets) {
    return [];
  }

  return dataSets.map((item) => (typeof item === "string" ? { label: item, value: item } : { label: item.label, value: item.value ?? item.label }));
}

function isSameItems(left: FlexiDropdownItem[], right: FlexiDropdownItem[]): boolean {
  if (left.length !== right.length) {
    return false;
  }

  for (let index = 0; index < left.length; index += 1) {
    const leftItem = left[index];
    const rightItem = right[index];
    if (!leftItem || !rightItem || leftItem.label !== rightItem.label || leftItem.value !== rightItem.value) {
      return false;
    }
  }

  return true;
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

export function FlexiDropdownList({
  theme,
  className,
  style,
  inputType,
  dataSets,
  dropdownItemSelection = -1,
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
  allowInputEvents = false,
  allowRemoveItem = false,
  shownWhenFocused = true,
  onFocus,
  onBlur,
  onValueChange,
  onSelectionChange,
  ...props
}: FlexiDropdownListProps) {
  const currentTheme = useResolvedTheme(theme);
  const [menuPhase, setMenuPhase] = useState<"closed" | "opening" | "open" | "closing">("closed");
  const [items, setItems] = useState<FlexiDropdownItem[]>(() => normalizeItems(dataSets));
  const [internalSelection, setInternalSelection] = useState(dropdownItemSelection);
  const [internalValue, setInternalValue] = useState("");
  const menuVisible = menuPhase !== "closed";

  useEffect(() => {
    const nextItems = normalizeItems(dataSets);
    setItems((previous) => (isSameItems(previous, nextItems) ? previous : nextItems));
  }, [dataSets]);

  useEffect(() => {
    if (dropdownItemSelection >= 0 && items[dropdownItemSelection]) {
      const nextValue = items[dropdownItemSelection]?.value ?? "";
      setInternalSelection(dropdownItemSelection);
      setInternalValue(nextValue);
    }
  }, [dropdownItemSelection, items]);

  const selectedIndex = dropdownItemSelection >= 0 ? dropdownItemSelection : internalSelection;
  const selectedValue = selectedIndex >= 0 ? (items[selectedIndex]?.value ?? items[selectedIndex]?.label ?? "") : "";
  const effectiveSelectedIndex = allowInputEvents && internalValue !== selectedValue ? -1 : selectedIndex;
  const showClearButton = allowInputEvents && internalValue.length > 0;

  const filteredItems = useMemo(() => {
    if (!allowInputEvents || !internalValue) {
      return items;
    }

    const normalizedKeyword = internalValue.toLowerCase();
    return items.filter((item) => item.label.toLowerCase().includes(normalizedKeyword));
  }, [allowInputEvents, internalValue, items]);

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
    paddingRight: showClearButton
      ? currentTheme.dimensions.dimensionFlexiSpacingPrimary + currentTheme.dimensions.dimensionFlexiIconSizeSecondary + currentTheme.dimensions.dimensionFlexiSpacingTertiary
      : undefined,
    outline: "none",
    transition: "border-color 160ms ease",
    ":focus": {
      borderColor: currentTheme.colors.colorFlexiThemePrimary,
    },
  });

  const clearButtonClassName = css({
    position: "absolute",
    right: currentTheme.dimensions.dimensionFlexiSpacingTertiary,
    top: "50%",
    transform: "translateY(-50%)",
    width: currentTheme.dimensions.dimensionFlexiIconSizeSecondary,
    height: currentTheme.dimensions.dimensionFlexiIconSizeSecondary,
    borderRadius: "50%",
    border: 0,
    padding: 0,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: currentTheme.dimensions.dimensionFlexiTextSizeSecondary,
    color: currentTheme.colors.colorFlexiThemeSecondary,
    background: "transparent",
    cursor: "pointer",
    transition: "background-color 140ms ease, color 140ms ease",
    ":hover": {
      backgroundColor: alphaColor(currentTheme.colors.colorFlexiThemePrimary, 0.1),
      color: currentTheme.colors.colorFlexiThemePrimary,
    },
    ":active": {
      backgroundColor: alphaColor(currentTheme.colors.colorFlexiThemePrimary, 0.18),
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

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    if (shownWhenFocused) {
      showMenu();
    }
    onFocus?.(event);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    window.setTimeout(() => {
      hideMenu();
    }, 100);
    onBlur?.(event);
  };

  const setValue = (nextValue: string) => {
    setInternalValue(nextValue);
    onValueChange?.(nextValue);
  };

  const selectItem = (index: number, item: FlexiDropdownItem) => {
    setInternalSelection(index);
    setValue(item.value ?? item.label);
    onSelectionChange?.(index, item);
    hideMenu();
  };

  const removeItem = (event: MouseEvent<HTMLButtonElement>, index: number) => {
    event.stopPropagation();
    setItems((previous) => previous.filter((_, itemIndex) => itemIndex !== index));
    if (selectedIndex === index) {
      setInternalSelection(-1);
      setValue("");
    }
  };

  const highlightLabel = (label: string) => {
    if (!internalValue) {
      return label;
    }

    const lowerLabel = label.toLowerCase();
    const lowerKeyword = internalValue.toLowerCase();
    const matchedIndex = lowerLabel.indexOf(lowerKeyword);
    if (matchedIndex < 0) {
      return label;
    }

    const start = label.slice(0, matchedIndex);
    const matched = label.slice(matchedIndex, matchedIndex + internalValue.length);
    const end = label.slice(matchedIndex + internalValue.length);

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
        type={inputType ?? "text"}
        value={internalValue}
        className={inputClassName}
        readOnly={!allowInputEvents}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={(event) => {
          const nextValue = event.target.value;
          if (allowInputEvents && dropdownItemSelection < 0 && internalSelection >= 0) {
            setInternalSelection(-1);
          }
          setValue(nextValue);
        }}
      />
      {showClearButton ? (
        <button
          type="button"
          className={clearButtonClassName}
          aria-label="Clear input"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            if (dropdownItemSelection < 0) {
              setInternalSelection(-1);
            }
            setValue("");
          }}
        >
          ×
        </button>
      ) : null}

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
          {filteredItems.map((item, index) => {
            const selected = index === effectiveSelectedIndex;
            const optionClassName = css({
              width: "100%",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: currentTheme.dimensions.dimensionFlexiSpacingTertiary,
              border: 0,
              borderRadius: currentTheme.dimensions.dimensionFlexiCornerRadiusSecondary,
              padding: `${currentTheme.dimensions.dimensionFlexiSpacingTertiary}px ${currentTheme.dimensions.dimensionFlexiSpacingSecondary}px`,
              background: selected
                ? alphaColor(dropdownSelectionItemTint ?? currentTheme.colors.colorFlexiThemePrimary, 0.3)
                : "transparent",
              color: dropdownItemTextColor ?? currentTheme.colors.colorFlexiTextPrimary,
              fontSize: dropdownItemTextSize ?? currentTheme.dimensions.dimensionFlexiTextSizePrimary,
              lineHeight: 1.3,
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
                    onMouseDown={(event) => removeItem(event, index)}
                    style={{
                      border: 0,
                      background: "transparent",
                      cursor: "pointer",
                      color: currentTheme.colors.colorFlexiThemeSecondary,
                    }}
                  >
                    ✕
                  </button>
                ) : null}
              </div>
            );
          })}
          {!filteredItems.length ? (
            <div
              style={{
                padding: `${currentTheme.dimensions.dimensionFlexiSpacingTertiary}px ${currentTheme.dimensions.dimensionFlexiSpacingSecondary}px`,
                color: currentTheme.colors.colorFlexiTextSecondary,
                fontSize: currentTheme.dimensions.dimensionFlexiTextSizeSecondary,
              }}
            >
              No options
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

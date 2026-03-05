import { css, cx } from "@emotion/css";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type InputHTMLAttributes,
  type MouseEvent,
} from "react";
import { alphaColor } from "../foundation/color";
import type { FlexiBaseComponentProps } from "../foundation/componentTypes";
import { useResolvedTheme } from "../foundation/useResolvedTheme";

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
    clearWhenLongClick?: boolean;
    onValueChange?: (value: string) => void;
    onSelectionChange?: (index: number, item: FlexiDropdownItem) => void;
  };

function normalizeItems(dataSets: FlexiDropdownListProps["dataSets"]): FlexiDropdownItem[] {
  if (!dataSets) {
    return [];
  }

  return dataSets.map((item) => (typeof item === "string" ? { label: item, value: item } : { label: item.label, value: item.value ?? item.label }));
}

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
  clearWhenLongClick = true,
  onFocus,
  onBlur,
  onValueChange,
  onSelectionChange,
  ...props
}: FlexiDropdownListProps) {
  const currentTheme = useResolvedTheme(theme);
  const longPressTimerRef = useRef<number | null>(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<FlexiDropdownItem[]>(() => normalizeItems(dataSets));
  const [internalSelection, setInternalSelection] = useState(dropdownItemSelection);
  const [internalValue, setInternalValue] = useState("");

  useEffect(() => {
    setItems(normalizeItems(dataSets));
  }, [dataSets]);

  useEffect(() => {
    if (dropdownItemSelection >= 0 && items[dropdownItemSelection]) {
      const nextValue = items[dropdownItemSelection]?.value ?? "";
      setInternalSelection(dropdownItemSelection);
      setInternalValue(nextValue);
    }
  }, [dropdownItemSelection, items]);

  const selectedIndex = dropdownItemSelection >= 0 ? dropdownItemSelection : internalSelection;

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
  });

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    if (shownWhenFocused) {
      setOpen(true);
    }
    onFocus?.(event);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    window.setTimeout(() => {
      setOpen(false);
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
    setOpen(false);
  };

  const onLongPressStart = () => {
    if (!clearWhenLongClick) {
      return;
    }

    longPressTimerRef.current = window.setTimeout(() => {
      setInternalSelection(-1);
      setValue("");
    }, 600);
  };

  const onLongPressEnd = () => {
    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
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
        onChange={(event) => setValue(event.target.value)}
        onPointerDown={onLongPressStart}
        onPointerUp={onLongPressEnd}
        onPointerCancel={onLongPressEnd}
      />

      {open ? (
        <div className={menuClassName}>
          {filteredItems.map((item, index) => {
            const selected = index === selectedIndex;
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

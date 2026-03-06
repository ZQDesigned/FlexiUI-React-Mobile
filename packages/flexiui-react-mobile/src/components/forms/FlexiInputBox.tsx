import { css, cx, keyframes } from "@emotion/css";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { alphaColor } from "../../foundation/color";
import type { FlexiBaseComponentProps } from "../../foundation/componentTypes";
import { useResolvedTheme } from "../../foundation/useResolvedTheme";
import { FlexiIconFinishClose } from "../icons";

export type FlexiInputMode = "editText" | "dropdownText" | "autoCompleteText";

export type FlexiInputBoxItem = {
  label: string;
  value?: string;
};

export type FlexiInputBoxProps = Omit<HTMLAttributes<HTMLDivElement>, "inputMode"> &
  FlexiBaseComponentProps & {
    cornerRadius?: number;
    boxBackgroundColor?: string;
    boxStrokeSize?: number;
    boxStrokeInActiveColor?: string;
    boxStrokeActiveColor?: string;
    boxStartIcon?: ReactNode;
    boxStartIconSize?: number;
    boxStartIconTint?: string;
    boxStartIconActiveTint?: string;
    boxEndIcon?: ReactNode;
    boxEndIconSize?: number;
    boxEndIconTint?: string;
    boxEndIconActiveTint?: string;
    boxPadding?: number;
    boxPaddingLeft?: number;
    boxPaddingTop?: number;
    boxPaddingRight?: number;
    boxPaddingBottom?: number;
    maxInputBoxHeight?: number;
    enableBorderHint?: boolean;
    inputMode?: FlexiInputMode;
    dataSets?: string[] | FlexiInputBoxItem[];
    completionThreshold?: number;
    completionLetterCase?: boolean;
    dropdownItemSelection?: number;
    dropdownBackgroundColor?: string;
    dropdownItemTextColor?: string;
    dropdownItemTextSize?: number;
    showClearTextIcon?: boolean;
    password?: boolean;
    showPasswordToggle?: boolean;
    textSize?: number;
    text?: string;
    defaultText?: string;
    hint?: string;
    digits?: string;
    singleLine?: boolean;
    maxLength?: number;
    maxLines?: number;
    textColor?: string;
    hintTextColor?: string;
    inputType?: string;
    useOriginalStyle?: boolean;
    onTextChange?: (text: string) => void;
    onSelectionChange?: (index: number) => void;
  };

function normalizeItems(dataSets: FlexiInputBoxProps["dataSets"]): FlexiInputBoxItem[] {
  if (!dataSets) {
    return [];
  }

  return dataSets.map((item) => (typeof item === "string" ? { label: item, value: item } : { label: item.label, value: item.value ?? item.label }));
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

export function FlexiInputBox({
  theme,
  className,
  style,
  cornerRadius,
  boxBackgroundColor = "transparent",
  boxStrokeSize,
  boxStrokeInActiveColor,
  boxStrokeActiveColor,
  boxStartIcon,
  boxStartIconSize = -1,
  boxStartIconTint,
  boxStartIconActiveTint,
  boxEndIcon,
  boxEndIconSize = -1,
  boxEndIconTint,
  boxEndIconActiveTint,
  boxPadding,
  boxPaddingLeft,
  boxPaddingTop,
  boxPaddingRight,
  boxPaddingBottom,
  maxInputBoxHeight = -1,
  enableBorderHint = true,
  inputMode = "editText",
  dataSets,
  completionThreshold = -1,
  completionLetterCase = false,
  dropdownItemSelection = -1,
  dropdownBackgroundColor,
  dropdownItemTextColor,
  dropdownItemTextSize,
  showClearTextIcon = false,
  password = false,
  showPasswordToggle = true,
  textSize,
  text,
  defaultText = "",
  hint = "",
  digits = "",
  singleLine = false,
  maxLength = -1,
  maxLines = -1,
  textColor,
  hintTextColor,
  inputType,
  useOriginalStyle = false,
  onTextChange,
  onSelectionChange,
  ...props
}: FlexiInputBoxProps) {
  const currentTheme = useResolvedTheme(theme);
  const rootRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);
  const [internalText, setInternalText] = useState(defaultText);
  const [internalSelection, setInternalSelection] = useState(dropdownItemSelection >= 0 ? dropdownItemSelection : 0);
  const [showPassword, setShowPassword] = useState(false);
  const [menuPhase, setMenuPhase] = useState<"closed" | "opening" | "open" | "closing">("closed");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const menuVisible = menuPhase !== "closed";
  const menuInteractive = menuPhase === "opening" || menuPhase === "open";

  const isControlledText = text !== undefined;
  const currentText = isControlledText ? text : internalText;
  const items = useMemo(() => normalizeItems(dataSets), [dataSets]);
  const selectedIndex = dropdownItemSelection >= 0 ? dropdownItemSelection : internalSelection;
  const selectedItem = items[selectedIndex];
  const isDropdownMode = inputMode === "dropdownText";
  const isAutoCompleteMode = inputMode === "autoCompleteText";

  const filteredItems = useMemo(() => {
    if (inputMode !== "autoCompleteText" || !currentText) {
      return items;
    }

    if (completionThreshold > 0 && currentText.length < completionThreshold) {
      return [];
    }

    const keyword = completionLetterCase ? currentText : currentText.toLowerCase();
    return items.filter((item) => {
      const source = completionLetterCase ? item.label : item.label.toLowerCase();
      return source.includes(keyword);
    });
  }, [completionLetterCase, completionThreshold, currentText, inputMode, items]);
  const visibleItems = isAutoCompleteMode ? filteredItems : items;

  const resolvedPadding = {
    left: boxPadding ?? boxPaddingLeft ?? currentTheme.dimensions.dimensionFlexiSpacingPrimary,
    top: boxPadding ?? boxPaddingTop ?? currentTheme.dimensions.dimensionFlexiSpacingSecondary,
    right: boxPadding ?? boxPaddingRight ?? currentTheme.dimensions.dimensionFlexiSpacingPrimary,
    bottom: boxPadding ?? boxPaddingBottom ?? currentTheme.dimensions.dimensionFlexiSpacingSecondary,
  };

  const borderColor = focused
    ? boxStrokeActiveColor ?? currentTheme.colors.colorFlexiThemePrimary
    : boxStrokeInActiveColor ?? currentTheme.colors.colorFlexiThemeSecondary;

  const rootClassName = css({
    width: "100%",
    position: "relative",
    borderRadius: cornerRadius ?? currentTheme.dimensions.dimensionFlexiCornerRadiusPrimary,
    border: `${boxStrokeSize ?? currentTheme.dimensions.dimensionFlexiStrokeSizeSecondary}px solid ${borderColor}`,
    backgroundColor: boxBackgroundColor,
    paddingLeft: resolvedPadding.left,
    paddingTop: resolvedPadding.top,
    paddingRight: resolvedPadding.right,
    paddingBottom: resolvedPadding.bottom,
    display: "flex",
    alignItems: "center",
    gap: currentTheme.dimensions.dimensionFlexiSpacingTertiary,
    transition: "border-color 180ms cubic-bezier(0.2, 0, 0, 1), box-shadow 180ms cubic-bezier(0.2, 0, 0, 1)",
    boxShadow: focused ? `0 0 0 3px ${alphaColor(currentTheme.colors.colorFlexiThemePrimary, 0.2)}` : undefined,
    maxHeight: maxInputBoxHeight > 0 ? maxInputBoxHeight : undefined,
  });

  const inputBaseClassName = css({
    width: "100%",
    border: 0,
    outline: "none",
    boxShadow: "none",
    background: "transparent",
    color: textColor ?? currentTheme.colors.colorFlexiTextPrimary,
    fontSize: textSize ?? currentTheme.dimensions.dimensionFlexiTextSizePrimary,
    lineHeight: 1.4,
    minHeight: currentTheme.dimensions.dimensionFlexiIconSizeTertiary + 2,
    "::placeholder": {
      color: hintTextColor ?? currentTheme.colors.colorFlexiThemeSecondary,
    },
    ":focus": {
      outline: "none",
      boxShadow: "none",
    },
    ":focus-visible": {
      outline: "none",
      boxShadow: "none",
    },
  });

  const iconClassName = css({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: focused ? boxStartIconActiveTint ?? currentTheme.colors.colorFlexiThemePrimary : boxStartIconTint ?? currentTheme.colors.colorFlexiThemeSecondary,
    fontSize: boxStartIconSize > 0 ? boxStartIconSize : currentTheme.dimensions.dimensionFlexiIconSizeTertiary,
    flexShrink: 0,
  });

  const endIconClassName = css({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: focused ? boxEndIconActiveTint ?? currentTheme.colors.colorFlexiThemePrimary : boxEndIconTint ?? currentTheme.colors.colorFlexiThemeSecondary,
    fontSize: boxEndIconSize > 0 ? boxEndIconSize : currentTheme.dimensions.dimensionFlexiIconSizeTertiary,
    flexShrink: 0,
    border: 0,
    background: "transparent",
    cursor: "pointer",
    padding: 0,
  });

  const optionShadowGap = 2;
  const menuContentPadding = currentTheme.dimensions.dimensionFlexiSpacingTertiary + optionShadowGap;

  const menuClassName = css({
    position: "absolute",
    zIndex: 8,
    left: 0,
    top: `calc(100% + ${currentTheme.dimensions.dimensionFlexiZoomSizeTertiary}px)`,
    width: "100%",
    maxHeight: 240,
    overflowY: "auto",
    borderRadius: currentTheme.dimensions.dimensionFlexiCornerRadiusSecondary,
    border: `${currentTheme.dimensions.dimensionFlexiStrokeSizeSecondary}px solid ${currentTheme.colors.colorFlexiThemeTertiary}`,
    background: dropdownBackgroundColor ?? currentTheme.colors.colorFlexiForegroundPrimary,
    color: dropdownItemTextColor ?? currentTheme.colors.colorFlexiTextPrimary,
    fontSize: dropdownItemTextSize ?? currentTheme.dimensions.dimensionFlexiTextSizePrimary,
    padding: menuContentPadding,
    boxShadow: "0 10px 28px rgba(0, 0, 0, 0.16)",
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

  useEffect(() => {
    if (!menuVisible) {
      return;
    }

    const handleOutsidePointerDown = (event: PointerEvent) => {
      if (rootRef.current?.contains(event.target as Node)) {
        return;
      }
      hideMenu();
      setHighlightedIndex(-1);
    };

    window.addEventListener("pointerdown", handleOutsidePointerDown);
    return () => {
      window.removeEventListener("pointerdown", handleOutsidePointerDown);
    };
  }, [menuVisible]);

  const handleFocus = (_event: FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    if (isDropdownMode) {
      showMenu();
      setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
      return;
    }
    if (isAutoCompleteMode && (completionThreshold <= 0 || currentText.length >= completionThreshold)) {
      showMenu();
      setHighlightedIndex(visibleItems.length ? 0 : -1);
    }
  };

  const handleBlur = (_event: FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    window.setTimeout(() => {
      if (!rootRef.current?.contains(document.activeElement)) {
        hideMenu();
        setHighlightedIndex(-1);
      }
    }, 0);
  };

  const updateText = (nextText: string) => {
    if (!isControlledText) {
      setInternalText(nextText);
    }
    onTextChange?.(nextText);
  };

  const clearInputText = () => {
    if (isDropdownMode || isAutoCompleteMode) {
      if (dropdownItemSelection < 0) {
        setInternalSelection(-1);
      }
      onSelectionChange?.(-1);
      hideMenu();
      setHighlightedIndex(-1);
    }

    updateText("");
  };

  const digitsPattern = digits ? `[^${digits}]` : "";

  const applyDigitsFilter = (nextText: string) => {
    if (!digitsPattern) {
      return nextText;
    }

    return nextText.replace(new RegExp(digitsPattern, "g"), "");
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextText = applyDigitsFilter(event.target.value);
    updateText(nextText);
    if (isAutoCompleteMode) {
      if (completionThreshold > 0 && nextText.length < completionThreshold) {
        hideMenu();
        setHighlightedIndex(-1);
        return;
      }
      showMenu();
      setHighlightedIndex(0);
    }
  };

  const findItemIndex = (item: FlexiInputBoxItem) =>
    items.findIndex((entry) => entry.value === item.value && entry.label === item.label);

  const selectItem = (item: FlexiInputBoxItem) => {
    const sourceIndex = findItemIndex(item);
    if (sourceIndex >= 0 && dropdownItemSelection < 0) {
      setInternalSelection(sourceIndex);
    }
    if (sourceIndex >= 0) {
      onSelectionChange?.(sourceIndex);
    }
    updateText(item.value ?? item.label);
    hideMenu();
    setHighlightedIndex(-1);
  };

  const moveHighlight = (step: number) => {
    if (!visibleItems.length) {
      setHighlightedIndex(-1);
      return;
    }

    setHighlightedIndex((previous) => {
      const normalizedPrevious = previous < 0 ? (step > 0 ? -1 : 0) : previous;
      const nextIndex = normalizedPrevious + step;
      if (nextIndex < 0) {
        return visibleItems.length - 1;
      }
      if (nextIndex >= visibleItems.length) {
        return 0;
      }
      return nextIndex;
    });
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!isDropdownMode && !isAutoCompleteMode) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!menuVisible) {
        showMenu();
      }
      moveHighlight(1);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!menuVisible) {
        showMenu();
      }
      moveHighlight(-1);
      return;
    }

    if (event.key === "Enter" && menuInteractive && highlightedIndex >= 0 && visibleItems[highlightedIndex]) {
      event.preventDefault();
      selectItem(visibleItems[highlightedIndex]);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      hideMenu();
      setHighlightedIndex(-1);
    }
  };

  const renderInput = () => {
    const valueToDisplay = isDropdownMode ? selectedItem?.label ?? currentText : currentText;

    return (
      <input
        className={inputBaseClassName}
        value={valueToDisplay}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleInputKeyDown}
        onPointerDown={() => {
          if (isDropdownMode) {
            showMenu();
          }
        }}
        readOnly={isDropdownMode}
        placeholder={enableBorderHint ? hint : ""}
        type={password ? (showPassword ? "text" : "password") : inputType ?? "text"}
        maxLength={maxLength > 0 ? maxLength : undefined}
        style={{
          whiteSpace: singleLine ? "nowrap" : undefined,
        }}
      />
    );
  };

  if (useOriginalStyle) {
    return <div {...props} className={className} style={style} />;
  }

  return (
    <div {...props} ref={rootRef} className={cx(rootClassName, className)} style={style}>
      {boxStartIcon ? <span className={iconClassName}>{boxStartIcon}</span> : null}

      <div style={{ width: "100%", position: "relative", minWidth: 0 }}>
        {renderInput()}
        {menuVisible && (isDropdownMode || isAutoCompleteMode) ? (
          <div
            className={cx(menuClassName, menuPhase === "opening" && menuOpeningClassName, menuPhase === "closing" && menuClosingClassName)}
            role="listbox"
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
            {visibleItems.length ? (
              visibleItems.map((item, index) => {
                const sourceIndex = findItemIndex(item);
                const selected = sourceIndex >= 0 && sourceIndex === selectedIndex;
                const active = index === highlightedIndex;
                const optionClassName = css({
                  width: "100%",
                  border: 0,
                  background: active
                    ? alphaColor(currentTheme.colors.colorFlexiThemePrimary, 0.2)
                    : selected
                      ? alphaColor(currentTheme.colors.colorFlexiThemePrimary, 0.12)
                      : "transparent",
                  color: dropdownItemTextColor ?? currentTheme.colors.colorFlexiTextPrimary,
                  fontSize: dropdownItemTextSize ?? currentTheme.dimensions.dimensionFlexiTextSizePrimary,
                  textAlign: "left",
                  borderRadius: currentTheme.dimensions.dimensionFlexiCornerRadiusSecondary,
                  padding: `${currentTheme.dimensions.dimensionFlexiSpacingTertiary}px ${currentTheme.dimensions.dimensionFlexiSpacingSecondary}px`,
                  marginBottom: optionShadowGap,
                  cursor: "pointer",
                  display: "block",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  transition: "background-color 160ms cubic-bezier(0.2, 0, 0, 1), transform 120ms cubic-bezier(0.2, 0, 0, 1)",
                  ":hover": {
                    background: alphaColor(currentTheme.colors.colorFlexiThemePrimary, 0.14),
                  },
                  ":active": {
                    transform: "translateY(1px) scale(0.99)",
                  },
                  ":last-of-type": {
                    marginBottom: 0,
                  },
                });

                return (
                  <button
                    key={`${item.value}-${index}`}
                    type="button"
                    className={optionClassName}
                    role="option"
                    aria-selected={selected}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onMouseDown={(event) => {
                      event.preventDefault();
                      selectItem(item);
                    }}
                  >
                    {item.label}
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

      {showClearTextIcon && currentText ? (
        <button type="button" className={endIconClassName} onClick={clearInputText} title="Clear text">
          <FlexiIconFinishClose size={currentTheme.dimensions.dimensionFlexiIconSizeTertiary} color="currentColor" />
        </button>
      ) : null}

      {password && showPasswordToggle ? (
        <button type="button" className={endIconClassName} onClick={() => setShowPassword((value) => !value)} title="Toggle password visibility">
          {showPassword ? "🙈" : "👁"}
        </button>
      ) : null}

      {!showClearTextIcon && !(password && showPasswordToggle) && boxEndIcon ? (
        <span className={endIconClassName}>{boxEndIcon}</span>
      ) : null}
    </div>
  );
}

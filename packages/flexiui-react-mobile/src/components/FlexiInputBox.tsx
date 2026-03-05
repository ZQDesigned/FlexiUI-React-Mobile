import { css, cx } from "@emotion/css";
import { useId, useMemo, useState, type ChangeEvent, type FocusEvent, type HTMLAttributes, type ReactNode } from "react";
import type { FlexiBaseComponentProps } from "../foundation/componentTypes";
import { useResolvedTheme } from "../foundation/useResolvedTheme";

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
  const listId = useId();
  const [focused, setFocused] = useState(false);
  const [internalText, setInternalText] = useState(defaultText);
  const [internalSelection, setInternalSelection] = useState(dropdownItemSelection >= 0 ? dropdownItemSelection : 0);
  const [showPassword, setShowPassword] = useState(false);

  const isControlledText = text !== undefined;
  const currentText = isControlledText ? text : internalText;
  const items = useMemo(() => normalizeItems(dataSets), [dataSets]);
  const selectedIndex = dropdownItemSelection >= 0 ? dropdownItemSelection : internalSelection;
  const selectedItem = items[selectedIndex];

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

  const resolvedPadding = {
    left: boxPadding ?? boxPaddingLeft ?? currentTheme.dimensions.dimensionFlexiSpacingPrimary,
    top: boxPadding ?? boxPaddingTop ?? currentTheme.dimensions.dimensionFlexiSpacingPrimary,
    right: boxPadding ?? boxPaddingRight ?? currentTheme.dimensions.dimensionFlexiSpacingPrimary,
    bottom: boxPadding ?? boxPaddingBottom ?? currentTheme.dimensions.dimensionFlexiSpacingPrimary,
  };

  const borderColor = focused
    ? boxStrokeActiveColor ?? currentTheme.colors.colorFlexiThemePrimary
    : boxStrokeInActiveColor ?? currentTheme.colors.colorFlexiThemeSecondary;

  const rootClassName = css({
    width: "100%",
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
    transition: "border-color 180ms ease",
    maxHeight: maxInputBoxHeight > 0 ? maxInputBoxHeight : undefined,
  });

  const inputBaseClassName = css({
    width: "100%",
    border: 0,
    outline: "none",
    background: "transparent",
    color: textColor ?? currentTheme.colors.colorFlexiTextPrimary,
    fontSize: textSize ?? currentTheme.dimensions.dimensionFlexiTextSizePrimary,
    lineHeight: 1.4,
    minHeight: currentTheme.dimensions.dimensionFlexiIconSizeTertiary + 2,
    "::placeholder": {
      color: hintTextColor ?? currentTheme.colors.colorFlexiThemeSecondary,
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

  const menuClassName = css({
    marginTop: currentTheme.dimensions.dimensionFlexiZoomSizeTertiary,
    borderRadius: currentTheme.dimensions.dimensionFlexiCornerRadiusSecondary,
    border: `${currentTheme.dimensions.dimensionFlexiStrokeSizeSecondary}px solid ${currentTheme.colors.colorFlexiThemeTertiary}`,
    background: dropdownBackgroundColor ?? currentTheme.colors.colorFlexiForegroundPrimary,
    color: dropdownItemTextColor ?? currentTheme.colors.colorFlexiTextPrimary,
    fontSize: dropdownItemTextSize ?? currentTheme.dimensions.dimensionFlexiTextSizePrimary,
    padding: `${currentTheme.dimensions.dimensionFlexiSpacingTertiary}px ${currentTheme.dimensions.dimensionFlexiSpacingSecondary}px`,
  });

  const handleFocus = (_event: FocusEvent<HTMLElement>) => setFocused(true);
  const handleBlur = (_event: FocusEvent<HTMLElement>) => setFocused(false);

  const updateText = (nextText: string) => {
    if (!isControlledText) {
      setInternalText(nextText);
    }
    onTextChange?.(nextText);
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
  };

  const handleDropdownChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextIndex = Number(event.target.value);
    const nextItem = items[nextIndex];
    setInternalSelection(nextIndex);
    onSelectionChange?.(nextIndex);
    updateText(nextItem?.value ?? "");
  };

  const renderInput = () => {
    if (inputMode === "dropdownText") {
      return (
        <select value={selectedIndex} className={inputBaseClassName} onChange={handleDropdownChange} onFocus={handleFocus} onBlur={handleBlur}>
          {items.map((item, index) => (
            <option key={`${item.value}-${index}`} value={index}>
              {item.label}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        className={inputBaseClassName}
        value={currentText}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={enableBorderHint ? hint : ""}
        type={password ? (showPassword ? "text" : "password") : inputType ?? "text"}
        list={inputMode === "autoCompleteText" ? listId : undefined}
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
    <div {...props} className={cx(rootClassName, className)} style={style}>
      {boxStartIcon ? <span className={iconClassName}>{boxStartIcon}</span> : null}

      <div style={{ width: "100%" }}>
        {renderInput()}
        {inputMode === "autoCompleteText" ? (
          <datalist id={listId}>
            {filteredItems.map((item, index) => (
              <option key={`${item.value}-${index}`} value={item.value}>
                {item.label}
              </option>
            ))}
          </datalist>
        ) : null}

        {inputMode === "dropdownText" && selectedItem ? (
          <div className={menuClassName}>
            {selectedItem.label}
          </div>
        ) : null}
      </div>

      {showClearTextIcon && currentText ? (
        <button type="button" className={endIconClassName} onClick={() => updateText("")} title="Clear text">
          ⨯
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

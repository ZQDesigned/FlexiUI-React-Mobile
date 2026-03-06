import { css, cx } from "@emotion/css";
import type { HTMLAttributes, ReactNode } from "react";
import type { FlexiBaseComponentProps } from "../../foundation/componentTypes";
import { useResolvedTheme } from "../../foundation/useResolvedTheme";

export type FlexiStickyHeaderBarProps = HTMLAttributes<HTMLDivElement> &
  FlexiBaseComponentProps & {
    text?: ReactNode;
    textColor?: string;
    textSize?: number;
    icon?: ReactNode;
    iconCornerRadius?: number;
    iconTint?: string;
    iconBackgroundColor?: string;
    dividerLineColor?: string;
    showDividerLine?: boolean;
  };

export function FlexiStickyHeaderBar({
  theme,
  className,
  style,
  text = "",
  textColor,
  textSize,
  icon,
  iconCornerRadius,
  iconTint = "#FFFFFF",
  iconBackgroundColor,
  dividerLineColor,
  showDividerLine = true,
  ...props
}: FlexiStickyHeaderBarProps) {
  const currentTheme = useResolvedTheme(theme);
  const hasIcon = Boolean(icon);
  const shouldShowDivider = hasIcon ? false : showDividerLine;

  const rootClassName = css({
    position: "sticky",
    top: 0,
    zIndex: 5,
    display: "flex",
    alignItems: "center",
    gap: currentTheme.dimensions.dimensionFlexiSpacingSecondary,
    padding: `${currentTheme.dimensions.dimensionFlexiSpacingSecondary}px ${currentTheme.dimensions.dimensionFlexiSpacingPrimary}px`,
    background: currentTheme.colors.colorFlexiBackgroundPrimary,
    borderBottom: shouldShowDivider
      ? `${currentTheme.dimensions.dimensionFlexiStrokeSizeSecondary}px solid ${
          dividerLineColor ?? currentTheme.colors.colorFlexiThemePrimary
        }`
      : "none",
  });

  const iconClassName = css({
    width: currentTheme.dimensions.dimensionFlexiIconSizePrimary,
    height: currentTheme.dimensions.dimensionFlexiIconSizePrimary,
    borderRadius: iconCornerRadius ?? currentTheme.dimensions.dimensionFlexiCornerRadiusTertiary,
    background: iconBackgroundColor ?? currentTheme.colors.colorFlexiThemePrimary,
    color: iconTint,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  });

  const textClassName = css({
    margin: 0,
    color: textColor ?? currentTheme.colors.colorFlexiTextPrimary,
    fontSize: textSize ?? currentTheme.dimensions.dimensionFlexiTextSizePrimary,
    lineHeight: 1.3,
    fontWeight: 600,
    flex: 1,
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  });

  return (
    <div {...props} className={cx(rootClassName, className)} style={style}>
      {hasIcon ? <span className={iconClassName}>{icon}</span> : null}
      <p className={textClassName}>{text}</p>
    </div>
  );
}

import { css, cx } from "@emotion/css";
import type { HTMLAttributes, MouseEventHandler, ReactNode } from "react";
import type { FlexiBaseComponentProps } from "../../foundation/componentTypes";
import { useResolvedTheme } from "../../foundation/useResolvedTheme";
import { FlexiIconArrowNaviUp, FlexiIconFinishClose } from "../icons";

export type FlexiAppBarStyle = "primary" | "secondary";

export type FlexiAppBarProps = HTMLAttributes<HTMLElement> &
  FlexiBaseComponentProps & {
    title?: ReactNode;
    subtitle?: ReactNode;
    barStyle?: FlexiAppBarStyle;
    contentPaddingLeft?: number;
    contentPaddingTop?: number;
    contentPaddingRight?: number;
    contentPaddingBottom?: number;
    titleTextColor?: string;
    subtitleTextColor?: string;
    titleTextSize?: number;
    subtitleTextSize?: number;
    actionIconSize?: number;
    actionIconTint?: string;
    finishIcon?: ReactNode;
    finishIconSize?: number;
    finishIconPadding?: number;
    finishIconTint?: string;
    finishIconTooltipText?: string;
    navigationUpIcon?: ReactNode;
    navigationUpIconSize?: number;
    navigationUpIconPadding?: number;
    navigationUpIconTint?: string;
    navigationUpIconTooltipText?: string;
    showFinishIcon?: boolean;
    showNavigationUpIcon?: boolean;
    bottomHeight?: number;
    actionRightViewsMinWidth?: number;
    rightActions?: ReactNode;
    onFinishClick?: MouseEventHandler<HTMLButtonElement>;
    onNavigationUpClick?: MouseEventHandler<HTMLButtonElement>;
  };

export function FlexiAppBar({
  theme,
  className,
  style,
  title = "",
  subtitle = "",
  barStyle = "primary",
  contentPaddingLeft,
  contentPaddingTop,
  contentPaddingRight,
  contentPaddingBottom,
  titleTextColor,
  subtitleTextColor,
  titleTextSize,
  subtitleTextSize,
  actionIconSize,
  actionIconTint,
  finishIcon,
  finishIconSize,
  finishIconPadding = 0,
  finishIconTint,
  finishIconTooltipText = "Done",
  navigationUpIcon,
  navigationUpIconSize,
  navigationUpIconPadding = 0,
  navigationUpIconTint,
  navigationUpIconTooltipText = "Back",
  showFinishIcon = false,
  showNavigationUpIcon = true,
  bottomHeight = 0,
  actionRightViewsMinWidth = 180,
  rightActions,
  onFinishClick,
  onNavigationUpClick,
  ...props
}: FlexiAppBarProps) {
  const currentTheme = useResolvedTheme(theme);
  const finalActionIconSize = actionIconSize ?? currentTheme.dimensions.dimensionFlexiIconSizeSecondary;
  const finalActionIconTint = actionIconTint ?? currentTheme.colors.colorFlexiTextPrimary;
  const finalNavigationUpIconSize = navigationUpIconSize ?? finalActionIconSize * 0.7;
  const finalFinishIconSize = finishIconSize ?? finalActionIconSize * 0.7;

  const rootClassName = css({
    display: "flex",
    alignItems: "center",
    gap: currentTheme.dimensions.dimensionFlexiSpacingSecondary,
    width: "100%",
    backgroundColor: currentTheme.colors.colorFlexiBackgroundPrimary,
    paddingLeft: contentPaddingLeft ?? currentTheme.dimensions.dimensionFlexiSpacingPrimary,
    paddingTop: contentPaddingTop ?? currentTheme.dimensions.dimensionFlexiSpacingPrimary,
    paddingRight: contentPaddingRight ?? currentTheme.dimensions.dimensionFlexiSpacingPrimary,
    paddingBottom: (contentPaddingBottom ?? currentTheme.dimensions.dimensionFlexiSpacingPrimary) + bottomHeight,
    borderBottom: `${currentTheme.dimensions.dimensionFlexiStrokeSizePrimary}px solid ${currentTheme.colors.colorFlexiThemeTertiary}`,
  });

  const iconButtonClassName = css({
    width: finalActionIconSize,
    height: finalActionIconSize,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: 0,
    background: "transparent",
    color: finalActionIconTint,
    fontSize: finalActionIconSize * 0.7,
    borderRadius: currentTheme.dimensions.dimensionFlexiCornerRadiusSecondary,
    cursor: "pointer",
    padding: 0,
  });

  const textWrapClassName = css({
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    flex: 1,
  });

  const titleClassName = css({
    margin: 0,
    color: titleTextColor ?? currentTheme.colors.colorFlexiTextPrimary,
    fontSize:
      titleTextSize ??
      (barStyle === "primary"
        ? currentTheme.dimensions.dimensionFlexiTextSizeTitlePrimary
        : currentTheme.dimensions.dimensionFlexiTextSizeTitleSecondary),
    lineHeight: 1.3,
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
  });

  const subtitleClassName = css({
    margin: 0,
    color: subtitleTextColor ?? currentTheme.colors.colorFlexiTextSecondary,
    fontSize: subtitleTextSize ?? currentTheme.dimensions.dimensionFlexiTextSizeSubtitle,
    lineHeight: 1.3,
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
  });

  const rightActionsClassName = css({
    minWidth: actionRightViewsMinWidth,
    display: "inline-flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: currentTheme.dimensions.dimensionFlexiSpacingTertiary,
  });

  return (
    <header {...props} className={cx(rootClassName, className)} style={style}>
      {showNavigationUpIcon ? (
        <button
          type="button"
          className={iconButtonClassName}
          title={navigationUpIconTooltipText}
          onClick={onNavigationUpClick}
          style={{ color: navigationUpIconTint ?? finalActionIconTint, padding: navigationUpIconPadding }}
        >
          {navigationUpIcon ?? <FlexiIconArrowNaviUp size={finalNavigationUpIconSize} color="currentColor" />}
        </button>
      ) : null}

      {showFinishIcon ? (
        <button
          type="button"
          className={iconButtonClassName}
          title={finishIconTooltipText}
          onClick={onFinishClick}
          style={{ color: finishIconTint ?? finalActionIconTint, padding: finishIconPadding }}
        >
          {finishIcon ?? <FlexiIconFinishClose size={finalFinishIconSize} color="currentColor" />}
        </button>
      ) : null}

      <div className={textWrapClassName}>
        <h1 className={titleClassName}>{title}</h1>
        {subtitle ? <p className={subtitleClassName}>{subtitle}</p> : null}
      </div>

      <div className={rightActionsClassName}>{rightActions}</div>
    </header>
  );
}

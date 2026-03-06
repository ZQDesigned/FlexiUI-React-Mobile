import { css, cx } from "@emotion/css";
import type { HTMLAttributes, PropsWithChildren } from "react";
import type { FlexiBaseComponentProps } from "../../foundation/componentTypes";
import { useResolvedTheme } from "../../foundation/useResolvedTheme";

export type FlexiAreaLayoutProps = PropsWithChildren<
  HTMLAttributes<HTMLDivElement> &
    FlexiBaseComponentProps & {
      boxBackgroundColor?: string;
      boxStrokeSize?: number;
      boxStrokeColor?: string;
      rippleEffect?: boolean;
      cornerRadius?: number;
      cornerRadiusTL?: number;
      cornerRadiusTR?: number;
      cornerRadiusBR?: number;
      cornerRadiusBL?: number;
      fitsPaddingLeft?: boolean;
      fitsPaddingTop?: boolean;
      fitsPaddingRight?: boolean;
      fitsPaddingBottom?: boolean;
      useOriginalStyle?: boolean;
      useInBoxStyle?: boolean;
      useOutBoxStyle?: boolean;
      useOriginalStyleForChildren?: boolean;
      orientation?: "horizontal" | "vertical";
    }
>;

function FlexiAreaLayoutBase({
  theme,
  className,
  style,
  children,
  boxBackgroundColor,
  boxStrokeSize,
  boxStrokeColor,
  rippleEffect = false,
  cornerRadius,
  cornerRadiusTL,
  cornerRadiusTR,
  cornerRadiusBR,
  cornerRadiusBL,
  fitsPaddingLeft = true,
  fitsPaddingTop = true,
  fitsPaddingRight = true,
  fitsPaddingBottom = true,
  useOriginalStyle = false,
  useInBoxStyle = false,
  useOutBoxStyle = false,
  useOriginalStyleForChildren = false,
  orientation,
  ...props
}: FlexiAreaLayoutProps) {
  const currentTheme = useResolvedTheme(theme);
  const shouldApplyBoxStyle = !useOriginalStyle && (useInBoxStyle || !useOutBoxStyle);
  const defaultCorner = cornerRadius ?? currentTheme.dimensions.dimensionFlexiCornerRadiusPrimary;

  const rootClassName = css({
    width: "100%",
    display: orientation ? "flex" : undefined,
    flexDirection: orientation === "vertical" ? "column" : orientation === "horizontal" ? "row" : undefined,
    background: shouldApplyBoxStyle ? boxBackgroundColor ?? currentTheme.colors.colorFlexiForegroundPrimary : undefined,
    border: shouldApplyBoxStyle
      ? `${boxStrokeSize ?? currentTheme.dimensions.dimensionFlexiStrokeSizePrimary}px solid ${
          boxStrokeColor ?? currentTheme.colors.colorFlexiThemePrimary
        }`
      : undefined,
    borderTopLeftRadius: shouldApplyBoxStyle ? cornerRadiusTL ?? defaultCorner : undefined,
    borderTopRightRadius: shouldApplyBoxStyle ? cornerRadiusTR ?? defaultCorner : undefined,
    borderBottomRightRadius: shouldApplyBoxStyle ? cornerRadiusBR ?? defaultCorner : undefined,
    borderBottomLeftRadius: shouldApplyBoxStyle ? cornerRadiusBL ?? defaultCorner : undefined,
    paddingLeft: fitsPaddingLeft ? "env(safe-area-inset-left, 0px)" : undefined,
    paddingTop: fitsPaddingTop ? "env(safe-area-inset-top, 0px)" : undefined,
    paddingRight: fitsPaddingRight ? "env(safe-area-inset-right, 0px)" : undefined,
    paddingBottom: fitsPaddingBottom ? "env(safe-area-inset-bottom, 0px)" : undefined,
    transition: "filter 120ms ease",
    ":active": rippleEffect
      ? {
          filter: "brightness(0.98)",
        }
      : undefined,
  });

  return (
    <div
      {...props}
      className={cx(rootClassName, className)}
      style={style}
      data-use-original-style-for-children={useOriginalStyleForChildren}
    >
      {children}
    </div>
  );
}

export function FlexiAreaCoordinatorLayout(props: FlexiAreaLayoutProps) {
  return <FlexiAreaLayoutBase {...props} />;
}

export function FlexiAreaConstraintLayout(props: FlexiAreaLayoutProps) {
  return <FlexiAreaLayoutBase {...props} />;
}

export function FlexiAreaFrameLayout(props: FlexiAreaLayoutProps) {
  return <FlexiAreaLayoutBase {...props} />;
}

export function FlexiAreaLinearLayout(props: FlexiAreaLayoutProps) {
  return <FlexiAreaLayoutBase {...props} orientation={props.orientation ?? "vertical"} />;
}

export function FlexiAreaRelativeLayout(props: FlexiAreaLayoutProps) {
  return <FlexiAreaLayoutBase {...props} />;
}

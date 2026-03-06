import { css, cx } from "@emotion/css";
import type { HTMLAttributes, PropsWithChildren } from "react";
import type { FlexiBaseComponentProps } from "../../foundation/componentTypes";

export type FlexiWindowInsetsType =
  | "statusBars"
  | "navigationBars"
  | "captionBar"
  | "systemBars"
  | "ime"
  | "tappableElement"
  | "systemGestures"
  | "mandatorySystemGestures"
  | "displayCutout"
  | "waterFall"
  | "safeGestures"
  | "safeDrawing"
  | "safeDrawingIgnoringIme"
  | "safeContent";

export type FlexiWindowInsetsLayoutProps = PropsWithChildren<
  HTMLAttributes<HTMLDivElement> &
    FlexiBaseComponentProps & {
      consumed?: boolean;
      animated?: boolean;
      requestApplyOnLayout?: boolean;
      fitsPaddingTop?: boolean;
      fitsPaddingLeft?: boolean;
      fitsPaddingRight?: boolean;
      fitsPaddingBottom?: boolean;
      windowInsetsType?: FlexiWindowInsetsType;
    }
>;

function resolveSides(windowInsetsType: FlexiWindowInsetsType) {
  switch (windowInsetsType) {
    case "statusBars":
    case "captionBar":
      return { top: true, right: false, bottom: false, left: false };
    case "navigationBars":
    case "ime":
      return { top: false, right: false, bottom: true, left: false };
    default:
      return { top: true, right: true, bottom: true, left: true };
  }
}

export function FlexiWindowInsetsLayout({
  className,
  style,
  children,
  consumed = false,
  animated = false,
  requestApplyOnLayout = true,
  fitsPaddingTop = true,
  fitsPaddingLeft = true,
  fitsPaddingRight = true,
  fitsPaddingBottom = true,
  windowInsetsType = "safeDrawingIgnoringIme",
  ...props
}: FlexiWindowInsetsLayoutProps) {
  const sides = resolveSides(windowInsetsType);

  const finalPaddingTop = fitsPaddingTop && sides.top ? "env(safe-area-inset-top, 0px)" : 0;
  const finalPaddingLeft = fitsPaddingLeft && sides.left ? "env(safe-area-inset-left, 0px)" : 0;
  const finalPaddingRight = fitsPaddingRight && sides.right ? "env(safe-area-inset-right, 0px)" : 0;
  const finalPaddingBottom = fitsPaddingBottom && sides.bottom ? "env(safe-area-inset-bottom, 0px)" : 0;

  const rootClassName = css({
    width: "100%",
    boxSizing: "border-box",
    paddingTop: finalPaddingTop,
    paddingLeft: finalPaddingLeft,
    paddingRight: finalPaddingRight,
    paddingBottom: finalPaddingBottom,
    transition: animated ? "padding 180ms ease" : undefined,
    overflow: consumed ? "hidden" : undefined,
  });

  return (
    <div
      {...props}
      className={cx(rootClassName, className)}
      style={style}
      data-window-insets-type={windowInsetsType}
      data-request-apply-on-layout={requestApplyOnLayout}
      data-consumed={consumed}
    >
      {children}
    </div>
  );
}

import { css, cx } from "@emotion/css";
import type { HTMLAttributes, PropsWithChildren } from "react";
import type { FlexiBaseComponentProps } from "../../foundation/componentTypes";

export type FlexiRootLayoutProps = PropsWithChildren<
  HTMLAttributes<HTMLDivElement> &
    FlexiBaseComponentProps & {
      fitsPaddingLeft?: boolean;
      fitsPaddingTop?: boolean;
      fitsPaddingRight?: boolean;
      fitsPaddingBottom?: boolean;
      fitsWindowInsetsTop?: boolean;
      fitsWindowInsetsBottom?: boolean;
      orientation?: "horizontal" | "vertical";
    }
>;

function FlexiRootLayoutBase({
  className,
  style,
  children,
  fitsPaddingLeft = false,
  fitsPaddingTop = false,
  fitsPaddingRight = false,
  fitsPaddingBottom = false,
  fitsWindowInsetsTop = true,
  fitsWindowInsetsBottom = true,
  orientation,
  ...props
}: FlexiRootLayoutProps) {
  const rootClassName = css({
    width: "100%",
    display: orientation ? "flex" : undefined,
    flexDirection: orientation === "vertical" ? "column" : orientation === "horizontal" ? "row" : undefined,
    paddingLeft: fitsPaddingLeft ? "env(safe-area-inset-left, 0px)" : 0,
    paddingTop: fitsPaddingTop || fitsWindowInsetsTop ? "env(safe-area-inset-top, 0px)" : 0,
    paddingRight: fitsPaddingRight ? "env(safe-area-inset-right, 0px)" : 0,
    paddingBottom: fitsPaddingBottom || fitsWindowInsetsBottom ? "env(safe-area-inset-bottom, 0px)" : 0,
    boxSizing: "border-box",
  });

  return (
    <div
      {...props}
      className={cx(rootClassName, className)}
      style={style}
      data-fits-window-insets-top={fitsWindowInsetsTop}
      data-fits-window-insets-bottom={fitsWindowInsetsBottom}
    >
      {children}
    </div>
  );
}

export function FlexiRootCoordinatorLayout(props: FlexiRootLayoutProps) {
  return <FlexiRootLayoutBase {...props} />;
}

export function FlexiRootConstraintLayout(props: FlexiRootLayoutProps) {
  return <FlexiRootLayoutBase {...props} />;
}

export function FlexiRootFrameLayout(props: FlexiRootLayoutProps) {
  return <FlexiRootLayoutBase {...props} />;
}

export function FlexiRootLinearLayout(props: FlexiRootLayoutProps) {
  return <FlexiRootLayoutBase {...props} orientation={props.orientation ?? "vertical"} />;
}

export function FlexiRootRelativeLayout(props: FlexiRootLayoutProps) {
  return <FlexiRootLayoutBase {...props} />;
}

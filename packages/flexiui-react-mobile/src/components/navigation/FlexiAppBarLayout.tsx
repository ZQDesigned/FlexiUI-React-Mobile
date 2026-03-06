import { css, cx } from "@emotion/css";
import type { HTMLAttributes, PropsWithChildren } from "react";
import type { FlexiBaseComponentProps } from "../../foundation/componentTypes";
import { useResolvedTheme } from "../../foundation/useResolvedTheme";

export type FlexiAppBarLayoutProps = PropsWithChildren<
  HTMLAttributes<HTMLDivElement> &
    FlexiBaseComponentProps & {
      fitsChildMarginTop?: boolean;
      childMarginTop?: number;
    }
>;

export function FlexiAppBarLayout({
  theme,
  className,
  style,
  children,
  fitsChildMarginTop = true,
  childMarginTop,
  ...props
}: FlexiAppBarLayoutProps) {
  const currentTheme = useResolvedTheme(theme);
  const topSpacing =
    childMarginTop ??
    currentTheme.dimensions.dimensionFlexiTextSizeTitleSecondary +
      currentTheme.dimensions.dimensionFlexiSpacingPrimary * 2;

  const rootClassName = css({
    width: "100%",
    boxSizing: "border-box",
    paddingTop: fitsChildMarginTop ? topSpacing : 0,
  });

  return (
    <div {...props} className={cx(rootClassName, className)} style={style}>
      {children}
    </div>
  );
}

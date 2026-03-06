import { css, cx } from "@emotion/css";
import type { HTMLAttributes, PropsWithChildren } from "react";
import type { FlexiBaseComponentProps } from "../../foundation/componentTypes";
import { useResolvedTheme } from "../../foundation/useResolvedTheme";

export type FlexiScrollProps = PropsWithChildren<
  HTMLAttributes<HTMLDivElement> &
    FlexiBaseComponentProps & {
      fillViewport?: boolean;
      showScrollbars?: boolean;
      fadingEdgeLength?: number;
      direction?: "vertical" | "horizontal" | "both";
    }
>;

export function FlexiScroll({
  theme,
  className,
  style,
  children,
  fillViewport = true,
  showScrollbars = false,
  fadingEdgeLength,
  direction = "vertical",
  ...props
}: FlexiScrollProps) {
  const currentTheme = useResolvedTheme(theme);
  const edge = fadingEdgeLength ?? currentTheme.dimensions.dimensionFlexiZoomSizeSecondary;

  const overflowX = direction === "horizontal" || direction === "both" ? "auto" : "hidden";
  const overflowY = direction === "vertical" || direction === "both" ? "auto" : "hidden";

  const rootClassName = css({
    width: "100%",
    overflowX,
    overflowY,
    minHeight: fillViewport ? "100%" : undefined,
    scrollbarWidth: showScrollbars ? "thin" : "none",
    msOverflowStyle: showScrollbars ? "auto" : "none",
    "::-webkit-scrollbar": showScrollbars
      ? {
          width: 8,
          height: 8,
        }
      : {
          display: "none",
        },
    "::-webkit-scrollbar-thumb": showScrollbars
      ? {
          background: currentTheme.colors.colorFlexiThemeSecondary,
          borderRadius: 999,
        }
      : undefined,
    maskImage:
      edge > 0
        ? `linear-gradient(to bottom, transparent 0, black ${edge}px, black calc(100% - ${edge}px), transparent 100%)`
        : undefined,
  });

  return (
    <div {...props} className={cx(rootClassName, className)} style={style}>
      {children}
    </div>
  );
}

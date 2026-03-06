import { css, cx } from "@emotion/css";
import { Children, Fragment, type HTMLAttributes, type ReactNode } from "react";
import type { FlexiBaseComponentProps } from "../../foundation/componentTypes";
import { useResolvedTheme } from "../../foundation/useResolvedTheme";

export type FlexiDividerMode = "none" | "beginning" | "middle" | "end" | "all";
export type FlexiLinearOrientation = "horizontal" | "vertical";

export type FlexiLinearLayoutProps = HTMLAttributes<HTMLDivElement> &
  FlexiBaseComponentProps & {
    orientation?: FlexiLinearOrientation;
    showDividers?: FlexiDividerMode;
    dividerHeight?: number;
    dividerColor?: string;
    divider?: ReactNode;
    gap?: number;
  };

export function FlexiLinearLayout({
  theme,
  className,
  style,
  children,
  orientation = "horizontal",
  showDividers = "none",
  dividerHeight = 0,
  dividerColor,
  divider,
  gap = 0,
  ...props
}: FlexiLinearLayoutProps) {
  const currentTheme = useResolvedTheme(theme);
  const childrenArray = Children.toArray(children);
  const shouldRenderDivider = showDividers !== "none" && dividerHeight > 0;

  const rootClassName = css({
    display: "flex",
    flexDirection: orientation === "horizontal" ? "row" : "column",
    gap,
    width: "100%",
  });

  const dividerClassName = css({
    flexShrink: 0,
    alignSelf: orientation === "horizontal" ? "stretch" : "auto",
    width: orientation === "horizontal" ? dividerHeight : "100%",
    height: orientation === "horizontal" ? "auto" : dividerHeight,
    background: dividerColor ?? currentTheme.colors.colorFlexiThemeTertiary,
    borderRadius: currentTheme.dimensions.dimensionFlexiCornerRadiusSecondary,
  });

  const drawDivider = (key: string) =>
    divider ? (
      <span key={key} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
        {divider}
      </span>
    ) : (
      <span key={key} className={dividerClassName} />
    );

  const renderWithDividers = () => {
    if (!childrenArray.length) {
      return null;
    }

    const elements: ReactNode[] = [];
    const drawBeginning = shouldRenderDivider && (showDividers === "beginning" || showDividers === "all");
    const drawMiddle = shouldRenderDivider && (showDividers === "middle" || showDividers === "all");
    const drawEnd = shouldRenderDivider && (showDividers === "end" || showDividers === "all");

    if (drawBeginning) {
      elements.push(drawDivider("divider-beginning"));
    }

    childrenArray.forEach((child, index) => {
      elements.push(<Fragment key={`child-${index}`}>{child}</Fragment>);
      if (drawMiddle && index < childrenArray.length - 1) {
        elements.push(drawDivider(`divider-middle-${index}`));
      }
    });

    if (drawEnd) {
      elements.push(drawDivider("divider-end"));
    }

    return elements;
  };

  return (
    <div {...props} className={cx(rootClassName, className)} style={style}>
      {renderWithDividers()}
    </div>
  );
}

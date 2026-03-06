import { css, cx, keyframes } from "@emotion/css";
import type { HTMLAttributes } from "react";
import type { FlexiBaseComponentProps } from "../../foundation/componentTypes";
import { useResolvedTheme } from "../../foundation/useResolvedTheme";

export type FlexiIndicatorType = "circular" | "linear";

export type FlexiProgressIndicatorProps = HTMLAttributes<HTMLDivElement> &
  FlexiBaseComponentProps & {
    indicatorType?: FlexiIndicatorType;
    indicatorColor?: string;
    trackColor?: string;
    determinateTrackColor?: string;
    indicatorSize?: number;
    trackThickness?: number;
    max?: number;
    min?: number;
    progress?: number;
    indeterminate?: boolean;
    trackCornerRadius?: number;
  };

const linearIndeterminateKeyframe = keyframes({
  "0%": { transform: "translateX(-50%) scaleX(0.35)" },
  "100%": { transform: "translateX(250%) scaleX(0.6)" },
});

const circularIndeterminateKeyframe = keyframes({
  "0%": { transform: "rotate(0deg)" },
  "100%": { transform: "rotate(360deg)" },
});

export function FlexiProgressIndicator({
  theme,
  className,
  style,
  indicatorType = "circular",
  indicatorColor,
  trackColor,
  determinateTrackColor,
  indicatorSize,
  trackThickness,
  max = 100,
  min = 0,
  progress = 0,
  indeterminate = true,
  trackCornerRadius,
  ...props
}: FlexiProgressIndicatorProps) {
  const currentTheme = useResolvedTheme(theme);
  const finalIndicatorColor = indicatorColor ?? currentTheme.colors.colorFlexiThemePrimary;
  const finalDeterminateTrackColor = determinateTrackColor ?? currentTheme.colors.colorFlexiThemeTertiary;
  const finalTrackColor = trackColor ?? finalDeterminateTrackColor;
  const finalTrackThickness = trackThickness ?? currentTheme.dimensions.dimensionFlexiZoomSizeTertiary / 2;
  const finalTrackRadius = trackCornerRadius ?? currentTheme.dimensions.dimensionFlexiCornerRadiusSecondary;

  const normalizedProgress = Math.max(0, Math.min((progress - min) / Math.max(max - min, 1), 1));

  if (indicatorType === "linear") {
    const trackClassName = css({
      position: "relative",
      width: "100%",
      height: finalTrackThickness,
      borderRadius: finalTrackRadius,
      overflow: "hidden",
      backgroundColor: indeterminate ? finalTrackColor : finalDeterminateTrackColor,
    });

    const barClassName = css({
      height: "100%",
      borderRadius: finalTrackRadius,
      backgroundColor: finalIndicatorColor,
      width: indeterminate ? "40%" : `${Math.round(normalizedProgress * 100)}%`,
      transition: indeterminate ? undefined : "width 180ms ease",
      animation: indeterminate ? `${linearIndeterminateKeyframe} 1s ease-in-out infinite` : undefined,
      transformOrigin: "left center",
    });

    return (
      <div {...props} className={cx(trackClassName, className)} style={style}>
        <div className={barClassName} />
      </div>
    );
  }

  const finalSize = indicatorSize ?? currentTheme.dimensions.dimensionFlexiIconSizePrimary * 1.6;

  if (indeterminate) {
    const spinnerClassName = css({
      width: finalSize,
      height: finalSize,
      borderRadius: "50%",
      border: `${finalTrackThickness}px solid ${finalTrackColor}`,
      borderTopColor: finalIndicatorColor,
      animation: `${circularIndeterminateKeyframe} 900ms linear infinite`,
      boxSizing: "border-box",
    });

    return <div {...props} className={cx(spinnerClassName, className)} style={style} />;
  }

  const radius = Math.max(finalSize / 2 - finalTrackThickness / 2, 0.001);
  const circumference = 2 * Math.PI * radius;
  const progressLength = circumference * normalizedProgress;
  const remainingLength = Math.max(circumference - progressLength, 0);

  const circularClassName = css({
    width: finalSize,
    height: finalSize,
    display: "inline-block",
    boxSizing: "border-box",
  });

  const circularSvgClassName = css({
    width: "100%",
    height: "100%",
    display: "block",
    transform: "rotate(-90deg)",
  });

  return (
    <div {...props} className={cx(circularClassName, className)} style={style}>
      <svg className={circularSvgClassName} viewBox={`0 0 ${finalSize} ${finalSize}`} aria-hidden="true">
        {normalizedProgress < 1 ? (
          <circle
            cx={finalSize / 2}
            cy={finalSize / 2}
            r={radius}
            fill="none"
            stroke={finalDeterminateTrackColor}
            strokeWidth={finalTrackThickness}
            strokeLinecap="round"
            strokeDasharray={`${remainingLength} ${circumference}`}
            strokeDashoffset={-progressLength}
          />
        ) : null}
        {normalizedProgress > 0 ? (
          <circle
            cx={finalSize / 2}
            cy={finalSize / 2}
            r={radius}
            fill="none"
            stroke={finalIndicatorColor}
            strokeWidth={finalTrackThickness}
            strokeLinecap="round"
            strokeDasharray={`${progressLength} ${circumference}`}
            strokeDashoffset={0}
          />
        ) : null}
      </svg>
    </div>
  );
}

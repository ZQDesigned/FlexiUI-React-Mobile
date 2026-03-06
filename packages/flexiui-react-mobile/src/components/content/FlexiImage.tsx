import { css, cx } from "@emotion/css";
import type { ImgHTMLAttributes } from "react";
import type { FlexiBaseComponentProps } from "../../foundation/componentTypes";
import { useResolvedTheme } from "../../foundation/useResolvedTheme";

export type FlexiImageProps = ImgHTMLAttributes<HTMLImageElement> &
  FlexiBaseComponentProps & {
    cornerRadius?: number;
    cornerRadiusTL?: number;
    cornerRadiusTR?: number;
    cornerRadiusBR?: number;
    cornerRadiusBL?: number;
    useOriginalStyle?: boolean;
    useShapeAppearance?: boolean;
  };

export function FlexiImage({
  theme,
  className,
  style,
  cornerRadius = -1,
  cornerRadiusTL,
  cornerRadiusTR,
  cornerRadiusBR,
  cornerRadiusBL,
  useOriginalStyle = false,
  useShapeAppearance = false,
  ...props
}: FlexiImageProps) {
  const currentTheme = useResolvedTheme(theme);
  const fallbackRadius = cornerRadius >= 0 ? cornerRadius : currentTheme.dimensions.dimensionFlexiCornerRadiusPrimary;

  if (useOriginalStyle) {
    return <img {...props} className={className} style={style} />;
  }

  const imageClassName = css({
    display: "block",
    width: "100%",
    height: "auto",
    objectFit: "cover",
    borderTopLeftRadius: useShapeAppearance ? cornerRadiusTL ?? fallbackRadius : cornerRadiusTL ?? fallbackRadius,
    borderTopRightRadius: useShapeAppearance ? cornerRadiusTR ?? fallbackRadius : cornerRadiusTR ?? fallbackRadius,
    borderBottomRightRadius: useShapeAppearance ? cornerRadiusBR ?? fallbackRadius : cornerRadiusBR ?? fallbackRadius,
    borderBottomLeftRadius: useShapeAppearance ? cornerRadiusBL ?? fallbackRadius : cornerRadiusBL ?? fallbackRadius,
  });

  return <img {...props} className={cx(imageClassName, className)} style={style} />;
}

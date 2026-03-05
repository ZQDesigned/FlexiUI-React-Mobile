import type { CSSProperties } from "react";
import type { FlexiTheme } from "../theme/types";

export type FlexiBaseComponentProps = {
  theme?: FlexiTheme;
  className?: string;
  style?: CSSProperties;
};

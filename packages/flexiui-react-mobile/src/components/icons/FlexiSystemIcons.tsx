import type { ReactNode, SVGAttributes } from "react";

export type FlexiSvgIconProps = Omit<SVGAttributes<SVGSVGElement>, "color"> & {
  size?: number;
  color?: string;
};

type FlexiSvgBaseProps = FlexiSvgIconProps & {
  viewBox: string;
  defaultSize: number;
  children: ReactNode;
};

function FlexiSvgBase({ size, viewBox, defaultSize, children, ...props }: FlexiSvgBaseProps) {
  const finalSize = size ?? defaultSize;

  return (
    <svg
      width={finalSize}
      height={finalSize}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export function FlexiIconArrowDropDown({ color = "currentColor", ...props }: FlexiSvgIconProps) {
  return (
    <FlexiSvgBase viewBox="0 0 24 24" defaultSize={24} {...props}>
      <path
        fill={color}
        d="M8.12,9.29L12,13.17l3.88,-3.88c0.39,-0.39 1.02,-0.39 1.41,0 0.39,0.39 0.39,1.02 0,1.41l-4.59,4.59c-0.39,0.39 -1.02,0.39 -1.41,0L6.7,10.7c-0.39,-0.39 -0.39,-1.02 0,-1.41 0.39,-0.38 1.03,-0.39 1.42,0z"
      />
    </FlexiSvgBase>
  );
}

export function FlexiIconArrowDropUp({ color = "currentColor", ...props }: FlexiSvgIconProps) {
  return (
    <FlexiSvgBase viewBox="0 0 24 24" defaultSize={24} {...props}>
      <path
        fill={color}
        d="M8.12,14.71L12,10.83l3.88,3.88c0.39,0.39 1.02,0.39 1.41,0 0.39,-0.39 0.39,-1.02 0,-1.41L12.7,8.71c-0.39,-0.39 -1.02,-0.39 -1.41,0L6.7,13.3c-0.39,0.39 -0.39,1.02 0,1.41 0.39,0.38 1.03,0.39 1.42,0z"
      />
    </FlexiSvgBase>
  );
}

export function FlexiIconArrowForward({ color = "currentColor", ...props }: FlexiSvgIconProps) {
  return (
    <FlexiSvgBase viewBox="0 0 24 24" defaultSize={32} {...props}>
      <path
        fill={color}
        d="M7.38,21.01c0.49,0.49 1.28,0.49 1.77,0l8.31,-8.31c0.39,-0.39 0.39,-1.02 0,-1.41L9.15,2.98c-0.49,-0.49 -1.28,-0.49 -1.77,0s-0.49,1.28 0,1.77L14.62,12l-7.25,7.25c-0.48,0.48 -0.48,1.28 0.01,1.76z"
      />
    </FlexiSvgBase>
  );
}

export function FlexiIconArrowNaviUp({ color = "currentColor", ...props }: FlexiSvgIconProps) {
  return (
    <FlexiSvgBase viewBox="0 0 48 48" defaultSize={32} {...props}>
      <path d="M5.799,24H41.799" stroke={color} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17.799,36L5.799,24L17.799,12" stroke={color} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
    </FlexiSvgBase>
  );
}

export function FlexiIconCheck({ color = "currentColor", ...props }: FlexiSvgIconProps) {
  return (
    <FlexiSvgBase viewBox="0 0 48 48" defaultSize={32} {...props}>
      <path d="M43,11L16.875,37L5,25.182" stroke={color} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
    </FlexiSvgBase>
  );
}

export function FlexiIconFinishClose({ color = "currentColor", ...props }: FlexiSvgIconProps) {
  return (
    <FlexiSvgBase viewBox="0 0 48 48" defaultSize={32} {...props}>
      <path d="M8.893,10.113L38.904,40.124" stroke={color} strokeWidth={3.75141} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.995,39.006L39.006,8.995" stroke={color} strokeWidth={3.75141} strokeLinecap="round" strokeLinejoin="round" />
    </FlexiSvgBase>
  );
}

export function FlexiIconSearch({ color = "currentColor", ...props }: FlexiSvgIconProps) {
  return (
    <FlexiSvgBase viewBox="0 0 48 48" defaultSize={48} {...props}>
      <path
        d="M21,38C30.389,38 38,30.389 38,21C38,11.611 30.389,4 21,4C11.611,4 4,11.611 4,21C4,30.389 11.611,38 21,38Z"
        stroke={color}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <path
        d="M26.657,14.343C25.209,12.895 23.209,12 21,12C18.791,12 16.791,12.895 15.343,14.343"
        stroke={color}
        strokeWidth={4}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M33.222,33.222L41.707,41.707"
        stroke={color}
        strokeWidth={4}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </FlexiSvgBase>
  );
}

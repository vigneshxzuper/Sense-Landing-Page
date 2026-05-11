"use client";

export interface GradientBlindsProps {
  className?: string;
  dpr?: number;
  paused?: boolean;
  gradientColors?: string[];
  angle?: number;
  noise?: number;
  blindCount?: number;
  blindMinWidth?: number;
  mouseDampening?: number;
  mirrorGradient?: boolean;
  spotlightRadius?: number;
  spotlightSoftness?: number;
  spotlightOpacity?: number;
  distortAmount?: number;
  shineDirection?: "left" | "right";
  mixBlendMode?: string;
  /** Render one frozen frame: no time animation, no mouse tracking. */
  staticFrame?: boolean;
  /** Drive the spotlight in an automatic corner-to-corner pulse sweep. */
  pulseSweep?: boolean;
  /** Seconds for one full ping-pong cycle when pulseSweep is true. */
  pulseSweepPeriod?: number;
}

// Re-export the untyped JSX component with proper TypeScript interface
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const Impl = require("./GradientBlindsImpl.jsx").default;

export default function GradientBlinds(props: GradientBlindsProps) {
  return <Impl {...props} />;
}

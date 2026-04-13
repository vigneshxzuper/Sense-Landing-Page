import { ComponentType } from "react";

interface GradientBlindsProps {
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
}

// eslint-disable-next-line @typescript-eslint/no-require-imports
const GradientBlinds: ComponentType<GradientBlindsProps> =
  require("./GradientBlinds.jsx").default;

export default GradientBlinds;

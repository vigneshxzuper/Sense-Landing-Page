"use client";

/**
 * Sense logo — 3×3 grid of rounded squares forming an "X" pattern:
 * orange on corners + center, pale-orange on edges.
 */

interface SenseLogoProps {
  size?: number;
  /** When true, renders the white variant for use on dark/orange backgrounds. */
  white?: boolean;
}

export default function SenseLogo({ size = 28, white = false }: SenseLogoProps) {
  const solid = white ? "#ffffff" : "#EB5D2A";
  const muted = white ? "#ffffff" : "#F8D5C2";
  const mutedOpacity = white ? 0.55 : 0.7;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 186 186"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* Row 1 */}
      <rect x="0"      y="0"      width="55.5756" height="55.5756" rx="13.8939" fill={solid} />
      <rect x="64.835" y="0"      width="55.5756" height="55.5756" rx="13.8939" fill={muted} fillOpacity={mutedOpacity} />
      <rect x="129.673" y="0"     width="55.5756" height="55.5756" rx="13.8939" fill={solid} />
      {/* Row 2 */}
      <rect x="0"      y="64.8386"  width="55.5756" height="55.5756" rx="13.8939" fill={muted} fillOpacity={mutedOpacity} />
      <rect x="64.835" y="64.8386"  width="55.5756" height="55.5756" rx="13.8939" fill={solid} />
      <rect x="129.673" y="64.8386" width="55.5756" height="55.5756" rx="13.8939" fill={muted} fillOpacity={mutedOpacity} />
      {/* Row 3 */}
      <rect x="0"      y="129.677"  width="55.5756" height="55.5756" rx="13.8939" fill={solid} />
      <rect x="64.835" y="129.677"  width="55.5756" height="55.5756" rx="13.8939" fill={muted} fillOpacity={mutedOpacity} />
      <rect x="129.673" y="129.677" width="55.5756" height="55.5756" rx="13.8939" fill={solid} />
    </svg>
  );
}

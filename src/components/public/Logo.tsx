import React from "react";

interface LogoProps {
  light?: boolean;
  fontSize?: string;
  subtitleSize?: string; // Kept for backwards compatibility
  style?: React.CSSProperties;
}

export default function Logo({ light = false, fontSize = "26px", style }: LogoProps) {
  const textColor = light ? "#ffffff" : "#2b2621";
  
  // Calculate scaled height based on font size to keep layout proportions
  // height/width ratio is 135 / 388 = 0.348
  // If the height of MIEUX is 100% of fontSize, total SVG height is 1.35 * fontSize
  const svgHeight = `calc(1.35 * ${fontSize})`;
  
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", ...style }}>
      <svg
        viewBox="0 0 388 135"
        style={{
          height: svgHeight,
          width: "auto",
          display: "block",
          fill: textColor,
        }}
      >
        {/* M */}
        <path d="M0,0 H16 L42,68 L68,0 H84 V100 H68 V28 L42,92 L16,28 V100 H0 Z" />
        
        {/* I */}
        <rect x="102" y="0" width="16" height="100" />
        
        {/* E */}
        {/* Top horizontal stroke: Red Accent Block */}
        <rect x="136" y="0" width="64" height="16" fill="#ff3b30" />
        {/* Vertical Stem */}
        <rect x="136" y="16" width="16" height="84" />
        {/* Middle stroke */}
        <rect x="152" y="44" width="40" height="16" />
        {/* Bottom stroke */}
        <rect x="152" y="84" width="48" height="16" />
        
        {/* U */}
        <rect x="218" y="0" width="16" height="84" />
        <rect x="274" y="0" width="16" height="84" />
        <rect x="218" y="84" width="72" height="16" />
        
        {/* X */}
        <path d="M308,0 H326 L348,38 L370,0 H388 L358,50 L388,100 H370 L348,62 L326,100 H308 L338,50 Z" />
        
        {/* Subtitle: INTERIOR & ARCHITECTURE */}
        <text
          x="0"
          y="128"
          fontFamily="var(--font-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="700"
          fontSize="14.5px"
          letterSpacing="0.05em"
          fill="#ff3b30"
          textLength="388"
          lengthAdjust="spacing"
        >
          {"INTERIOR & ARCHITECTURE"}
        </text>
      </svg>
    </div>
  );
}


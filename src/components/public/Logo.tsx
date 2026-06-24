import React from "react";

interface LogoProps {
  light?: boolean;
  fontSize?: string;
  subtitleSize?: string; // Kept for backwards compatibility
  style?: React.CSSProperties;
  layout?: "horizontal" | "vertical";
}

export default function Logo({
  light = false,
  fontSize = "26px",
  style,
  layout = "horizontal",
}: LogoProps) {
  // Determine height based on layout
  const height = layout === "horizontal" ? `calc(1.75 * ${fontSize})` : `calc(2.5 * ${fontSize})`;

  return (
    <div style={{ display: "inline-flex", alignItems: "center", ...style }}>
      <img
        src="/logo.png"
        alt="MIEUX Interior & Architecture"
        style={{
          height: height,
          width: "auto",
          display: "block",
          filter: light ? "brightness(0) invert(1)" : "none",
        }}
      />
    </div>
  );
}




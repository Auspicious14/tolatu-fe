import React from "react";

const HEIGHTS = [0.2,0.5,0.8,0.4,1.0,0.6,0.3,0.9,0.5,0.7,0.4,0.8,0.3,0.6,1.0,
                 0.5,0.2,0.7,0.9,0.4,0.6,0.3,0.8,0.5,1.0,0.4,0.7,0.2,0.9,0.6,
                 0.5,0.3,0.8,0.4,1.0,0.6,0.2,0.9,0.5,0.7,0.3,0.6,0.4,0.8,0.2,
                 0.5,1.0,0.7,0.3,0.9,0.4,0.6,0.8,0.3,0.7];

type Props = {
  bars?: number;
  height?: number;
  active?: boolean;
  barWidth?: number;
  gap?: number;
};

const WaveformDecor: React.FC<Props> = ({
  bars = 36, height = 40, active = false, barWidth = 3, gap = 3,
}) => (
  <div className="flex items-center shrink-0" style={{ height, gap }}>
    {Array.from({ length: bars }).map((_, i) => {
      const h = HEIGHTS[i % HEIGHTS.length] * height;
      const delay = (i * 0.055) % 1.5;
      const dur = active ? 0.75 + (i % 5) * 0.1 : 1.5 + (i % 7) * 0.2;
      return (
        <div
          key={i}
          style={{
            width: barWidth,
            height: h,
            background: "var(--amber)",
            borderRadius: 2,
            opacity: active ? 0.85 : 0.22,
            transformOrigin: "center",
            animation: `${active ? "wave-active" : "wave-idle"} ${dur}s ease-in-out ${delay}s infinite`,
            transition: "opacity 0.4s ease",
          }}
        />
      );
    })}
  </div>
);

export default WaveformDecor;

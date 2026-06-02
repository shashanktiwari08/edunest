import React from 'react';

export default function Gauge({ value, color = "#ef4d23", showLabels, min, max }) {
  const totalTicks = 40;
  const activeTicks = Math.round((value / 100) * totalTicks);
  const cx = 100;
  const cy = 100;
  const r = 80;

  // Generate tick marks for a 180-degree arc (from Math.PI to 2*Math.PI)
  const ticks = [];
  for (let i = 0; i <= totalTicks; i++) {
    const angle = Math.PI + (i / totalTicks) * Math.PI;
    
    // Line coordinates from radius (r - 10) to r
    const x1 = cx + (r - 10) * Math.cos(angle);
    const y1 = cy + (r - 10) * Math.sin(angle);
    const x2 = cx + r * Math.cos(angle);
    const y2 = cy + r * Math.sin(angle);

    const isActive = i <= activeTicks;

    ticks.push(
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={isActive ? color : "#d4d4d8"}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: '260px', margin: '0 auto' }}>
      <svg viewBox="0 0 200 120" style={{ width: '100%', height: 'auto' }}>
        <g>
          {ticks}
        </g>
        <text
          x={cx}
          y={cy + 5}
          textAnchor="middle"
          fontSize="22"
          fontWeight="600"
          fill="#1f2937"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {value}%
        </text>
      </svg>
      {showLabels && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: '#737373',
          padding: '0 10px',
          marginTop: '-10px',
          fontWeight: 500
        }}>
          <span>{min}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
}

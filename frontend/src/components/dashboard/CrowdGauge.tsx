import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useTheme } from '../../context/ThemeContext';

interface CrowdGaugeProps {
  currentCrowd: number;
  size?: number;
}

export const CrowdGauge: React.FC<CrowdGaugeProps> = ({
  currentCrowd,
  size = 240,
}) => {
  const { getOccupancyPercentage, getRiskLevel, getStatusColor } = useSettings();
  const { theme } = useTheme();
  const percentage = getOccupancyPercentage(currentCrowd);
  const riskLevel = getRiskLevel(currentCrowd);
  const colors = getStatusColor(riskLevel);

  const strokeWidth = 16;
  const radius = (size - strokeWidth * 2) / 2;
  const cx = size / 2;
  const cy = size / 2 + 15;

  const arcLength = Math.PI * radius;
  const clampedPct = Math.min(Math.max(percentage, 0), 100);
  const strokeDashoffset = arcLength - (clampedPct / 100) * arcLength;

  // Active Needle / Indicator coordinates
  const currentAngleRad = Math.PI - (clampedPct / 100) * Math.PI;
  const indicatorX = cx + radius * Math.cos(currentAngleRad);
  const indicatorY = cy - radius * Math.sin(currentAngleRad);

  const trackColor = theme === 'dark' ? '#1E293B' : '#E2E8F0';
  const textColor = theme === 'dark' ? '#F8FAFC' : '#0F172A';
  const tickColor = theme === 'dark' ? '#64748B' : '#94A3B8';

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <svg width={size} height={size * 0.64} className="overflow-visible">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="40%" stopColor="#F59E0B" />
            <stop offset="75%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
        </defs>

        {/* Background Track Arc */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Dynamic Occupancy Value Arc */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke={colors.fill}
          strokeWidth={strokeWidth}
          strokeDasharray={arcLength}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
          style={{
            filter: `drop-shadow(0 0 10px ${colors.fill}80)`,
          }}
        />

        {/* Animated Needle / Dot on Arc */}
        <circle
          cx={indicatorX}
          cy={indicatorY}
          r={7}
          fill={colors.fill}
          stroke={theme === 'dark' ? '#0F172A' : '#FFFFFF'}
          strokeWidth={2.5}
          className="transition-all duration-700 ease-out shadow-lg"
          style={{
            filter: `drop-shadow(0 0 8px ${colors.fill})`,
          }}
        />

        {/* Ticks and Labels: 0%, 25%, 50%, 75%, 100% */}
        {[
          { label: '0%', angle: 180 },
          { label: '25%', angle: 135 },
          { label: '50%', angle: 90 },
          { label: '75%', angle: 45 },
          { label: '100%', angle: 0 },
        ].map((tick) => {
          const rad = (tick.angle * Math.PI) / 180;
          const tickR1 = radius + 11;
          const tickR2 = radius + 17;
          const x1 = cx + tickR1 * Math.cos(Math.PI - rad);
          const y1 = cy - tickR1 * Math.sin(Math.PI - rad);
          const x2 = cx + tickR2 * Math.cos(Math.PI - rad);
          const y2 = cy - tickR2 * Math.sin(Math.PI - rad);

          const textR = radius + 27;
          const tx = cx + textR * Math.cos(Math.PI - rad);
          const ty = cy - textR * Math.sin(Math.PI - rad);

          return (
            <g key={tick.label}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={tickColor}
                strokeWidth={1.5}
              />
              <text
                x={tx}
                y={ty}
                fill={tickColor}
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {tick.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Center Digital Display */}
      <div className="text-center -mt-9">
        <div
          className="text-3xl sm:text-4xl font-black font-mono tracking-tight transition-colors duration-300"
          style={{ color: textColor }}
        >
          {percentage}%
        </div>
        <div
          className={`mt-1 inline-flex items-center px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider border shadow-sm transition-all ${colors.bg} ${colors.text} ${colors.border}`}
        >
          {riskLevel}
        </div>
      </div>
    </div>
  );
};

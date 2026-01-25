/**
 * VoxelStrip Component
 * 
 * A decorative bottom strip with voxel/block-style pattern for section framing.
 */

import { motion } from 'framer-motion';

interface VoxelStripProps {
  className?: string;
}

export function VoxelStrip({ className = '' }: VoxelStripProps) {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      viewBox="0 0 400 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="none"
    >
      {/* Base line */}
      <path
        d="M0 38 H400"
        stroke="hsl(var(--primary) / 0.15)"
        strokeWidth="2"
      />
      
      {/* Voxel blocks along the strip */}
      {[20, 60, 120, 180, 220, 280, 340, 380].map((x, i) => (
        <g key={i}>
          {/* Block base */}
          <rect
            x={x}
            y={28}
            width={12}
            height={8}
            fill="hsl(var(--primary) / 0.08)"
            stroke="hsl(var(--primary) / 0.2)"
            strokeWidth="1"
          />
          {/* Block top (pseudo-3D) */}
          <path
            d={`M${x} 28 L${x + 3} 24 L${x + 15} 24 L${x + 12} 28 Z`}
            fill="hsl(var(--primary) / 0.12)"
            stroke="hsl(var(--primary) / 0.25)"
            strokeWidth="0.5"
          />
          {/* Block side */}
          <path
            d={`M${x + 12} 28 L${x + 15} 24 L${x + 15} 32 L${x + 12} 36 Z`}
            fill="hsl(var(--primary) / 0.06)"
            stroke="hsl(var(--primary) / 0.15)"
            strokeWidth="0.5"
          />
        </g>
      ))}
      
      {/* Accent dots */}
      {[100, 160, 260, 320].map((x, i) => (
        <circle
          key={`dot-${i}`}
          cx={x}
          cy={35}
          r={2}
          fill="hsl(var(--accent) / 0.3)"
        />
      ))}
    </motion.svg>
  );
}

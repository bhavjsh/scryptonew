/**
 * VoxelGrid Component
 * 
 * Subtle voxel/grid pattern background for premium minimal design.
 * Creates depth through geometric patterns without heavy effects.
 */

import { motion } from 'framer-motion';

interface VoxelGridProps {
  className?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export function VoxelGrid({ className = '', position = 'top-right' }: VoxelGridProps) {
  const positionClasses = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-right': 'bottom-0 right-0',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      className={`absolute ${positionClasses[position]} pointer-events-none ${className}`}
    >
      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Grid lines - horizontal */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <motion.line
            key={`h-${i}`}
            x1="0"
            y1={i * 20}
            x2="160"
            y2={i * 20}
            stroke="hsl(var(--primary) / 0.04)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: i * 0.05 }}
          />
        ))}
        
        {/* Grid lines - vertical */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <motion.line
            key={`v-${i}`}
            x1={i * 20}
            y1="0"
            x2={i * 20}
            y2="160"
            stroke="hsl(var(--primary) / 0.04)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: i * 0.05 }}
          />
        ))}

        {/* Accent blocks */}
        <rect
          x="40"
          y="40"
          width="20"
          height="20"
          fill="hsl(var(--primary) / 0.03)"
          stroke="hsl(var(--primary) / 0.08)"
          strokeWidth="1"
        />
        <rect
          x="80"
          y="60"
          width="20"
          height="20"
          fill="hsl(var(--accent) / 0.02)"
          stroke="hsl(var(--accent) / 0.06)"
          strokeWidth="1"
        />
        <rect
          x="60"
          y="100"
          width="20"
          height="20"
          fill="hsl(var(--primary) / 0.02)"
          stroke="hsl(var(--primary) / 0.05)"
          strokeWidth="1"
        />
        
        {/* Corner accent - 3D block */}
        <path
          d="M100 20 L120 20 L120 40 L100 40 Z"
          fill="hsl(var(--primary) / 0.04)"
          stroke="hsl(var(--primary) / 0.1)"
          strokeWidth="1"
        />
        <path
          d="M100 20 L106 14 L126 14 L120 20 Z"
          fill="hsl(var(--primary) / 0.06)"
          stroke="hsl(var(--primary) / 0.12)"
          strokeWidth="1"
        />
        <path
          d="M120 20 L126 14 L126 34 L120 40 Z"
          fill="hsl(var(--primary) / 0.03)"
          stroke="hsl(var(--primary) / 0.08)"
          strokeWidth="1"
        />
      </svg>
    </motion.div>
  );
}

/**
 * VoxelSkills Component
 * 
 * A subtle voxel-style skills icon SVG for visual accents.
 * Represents interconnected skill blocks.
 */

import { motion } from 'framer-motion';

interface VoxelSkillsProps {
  className?: string;
}

export function VoxelSkills({ className = '' }: VoxelSkillsProps) {
  return (
    <motion.svg
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      viewBox="0 0 80 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Main skill block */}
      <g>
        {/* Front face */}
        <rect
          x="20"
          y="24"
          width="24"
          height="24"
          fill="hsl(var(--accent) / 0.1)"
          stroke="hsl(var(--accent) / 0.25)"
          strokeWidth="1"
        />
        {/* Top face */}
        <path
          d="M20 24 L28 16 L52 16 L44 24 Z"
          fill="hsl(var(--accent) / 0.15)"
          stroke="hsl(var(--accent) / 0.3)"
          strokeWidth="1"
        />
        {/* Right face */}
        <path
          d="M44 24 L52 16 L52 40 L44 48 Z"
          fill="hsl(var(--accent) / 0.08)"
          stroke="hsl(var(--accent) / 0.2)"
          strokeWidth="1"
        />
        {/* Inner symbol - exchange arrows */}
        <path
          d="M28 34 L36 30 M36 34 L28 38"
          stroke="hsl(var(--primary) / 0.4)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
      
      {/* Smaller connecting block */}
      <g>
        <rect
          x="50"
          y="36"
          width="14"
          height="14"
          fill="hsl(var(--primary) / 0.08)"
          stroke="hsl(var(--primary) / 0.2)"
          strokeWidth="1"
        />
        <path
          d="M50 36 L55 31 L69 31 L64 36 Z"
          fill="hsl(var(--primary) / 0.12)"
          stroke="hsl(var(--primary) / 0.25)"
          strokeWidth="0.5"
        />
      </g>
      
      {/* Connection line */}
      <path
        d="M44 40 L50 43"
        stroke="hsl(var(--primary) / 0.3)"
        strokeWidth="1"
        strokeDasharray="2 2"
      />
    </motion.svg>
  );
}

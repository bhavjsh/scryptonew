/**
 * VoxelCoins Component
 * 
 * Subtle block-style crypto coins with low opacity for premium minimal design.
 * Flat 2D with slight depth (pseudo-3D), lightweight and clean.
 */

import { motion } from 'framer-motion';

interface VoxelCoinsProps {
  className?: string;
}

export function VoxelCoins({ className = '' }: VoxelCoinsProps) {
  return (
    <motion.svg
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      viewBox="0 0 100 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Coin 1 - Large, back */}
      <motion.g
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Coin edge */}
        <ellipse
          cx="50"
          cy="40"
          rx="24"
          ry="8"
          fill="hsl(var(--primary) / 0.04)"
          stroke="hsl(var(--primary) / 0.1)"
          strokeWidth="1"
        />
        {/* Coin face */}
        <ellipse
          cx="50"
          cy="36"
          rx="24"
          ry="8"
          fill="hsl(var(--primary) / 0.08)"
          stroke="hsl(var(--primary) / 0.15)"
          strokeWidth="1"
        />
        {/* Inner ring */}
        <ellipse
          cx="50"
          cy="36"
          rx="16"
          ry="5"
          fill="none"
          stroke="hsl(var(--primary) / 0.12)"
          strokeWidth="1"
        />
      </motion.g>

      {/* Coin 2 - Medium, front left */}
      <motion.g
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      >
        {/* Coin edge */}
        <ellipse
          cx="28"
          cy="56"
          rx="18"
          ry="6"
          fill="hsl(var(--accent) / 0.03)"
          stroke="hsl(var(--accent) / 0.08)"
          strokeWidth="1"
        />
        {/* Coin face */}
        <ellipse
          cx="28"
          cy="52"
          rx="18"
          ry="6"
          fill="hsl(var(--accent) / 0.06)"
          stroke="hsl(var(--accent) / 0.12)"
          strokeWidth="1"
        />
        {/* Inner ring */}
        <ellipse
          cx="28"
          cy="52"
          rx="11"
          ry="3.5"
          fill="none"
          stroke="hsl(var(--accent) / 0.1)"
          strokeWidth="1"
        />
      </motion.g>

      {/* Coin 3 - Small, front right */}
      <motion.g
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        {/* Coin edge */}
        <ellipse
          cx="76"
          cy="60"
          rx="14"
          ry="5"
          fill="hsl(var(--primary) / 0.03)"
          stroke="hsl(var(--primary) / 0.06)"
          strokeWidth="1"
        />
        {/* Coin face */}
        <ellipse
          cx="76"
          cy="57"
          rx="14"
          ry="5"
          fill="hsl(var(--primary) / 0.05)"
          stroke="hsl(var(--primary) / 0.1)"
          strokeWidth="1"
        />
        {/* Inner ring */}
        <ellipse
          cx="76"
          cy="57"
          rx="8"
          ry="2.8"
          fill="none"
          stroke="hsl(var(--primary) / 0.08)"
          strokeWidth="1"
        />
      </motion.g>
    </motion.svg>
  );
}

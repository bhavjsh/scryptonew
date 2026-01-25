/**
 * VoxelWallet Component
 * 
 * A subtle voxel-style wallet SVG accent for premium minimal design.
 * Flat 2D with slight depth (pseudo-3D), no heavy glow or exaggeration.
 */

import { motion } from 'framer-motion';

interface VoxelWalletProps {
  className?: string;
}

export function VoxelWallet({ className = '' }: VoxelWalletProps) {
  return (
    <motion.svg
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      viewBox="0 0 80 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Wallet body - back face */}
      <path
        d="M12 20L60 20L60 52L12 52L12 20Z"
        fill="hsl(var(--primary) / 0.08)"
        stroke="hsl(var(--primary) / 0.2)"
        strokeWidth="1"
      />
      
      {/* Wallet body - top face (pseudo-3D) */}
      <path
        d="M12 20L20 12L68 12L60 20L12 20Z"
        fill="hsl(var(--primary) / 0.12)"
        stroke="hsl(var(--primary) / 0.25)"
        strokeWidth="1"
      />
      
      {/* Wallet body - right face (pseudo-3D) */}
      <path
        d="M60 20L68 12L68 44L60 52L60 20Z"
        fill="hsl(var(--primary) / 0.06)"
        stroke="hsl(var(--primary) / 0.15)"
        strokeWidth="1"
      />
      
      {/* Card slot */}
      <rect
        x="48"
        y="28"
        width="16"
        height="12"
        rx="2"
        fill="hsl(var(--accent) / 0.1)"
        stroke="hsl(var(--accent) / 0.2)"
        strokeWidth="1"
      />
      
      {/* Wallet clasp */}
      <rect
        x="52"
        y="32"
        width="8"
        height="4"
        rx="1"
        fill="hsl(var(--primary) / 0.15)"
      />
    </motion.svg>
  );
}

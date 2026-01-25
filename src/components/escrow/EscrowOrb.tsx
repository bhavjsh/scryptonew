/**
 * EscrowOrb Component
 * 
 * A highly interactive, animated escrow visualization that represents
 * the escrow lifecycle through visual state changes.
 * 
 * States:
 * - idle: Soft glowing orb waiting for action
 * - funded: Energy flowing into the orb
 * - in_progress: Pulsing with activity
 * - completed: Release animation with energy flowing out
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FileCheck, Zap, CheckCircle, CreditCard, Wallet, ArrowRight } from 'lucide-react';

export type EscrowState = 'idle' | 'funded' | 'in_progress' | 'completed';

interface EscrowOrbProps {
  state?: EscrowState;
  onStateChange?: (state: EscrowState) => void;
  isWalletConnected?: boolean;
  className?: string;
}

const stateLabels: Record<EscrowState, string> = {
  idle: 'Ready',
  funded: 'Funded',
  in_progress: 'In Progress',
  completed: 'Released'
};

const stateColors: Record<EscrowState, { primary: string; glow: string }> = {
  idle: { primary: 'hsl(185, 100%, 50%)', glow: 'hsl(185, 100%, 50%)' },
  funded: { primary: 'hsl(270, 80%, 65%)', glow: 'hsl(270, 80%, 65%)' },
  in_progress: { primary: 'hsl(210, 100%, 60%)', glow: 'hsl(210, 100%, 60%)' },
  completed: { primary: 'hsl(158, 70%, 45%)', glow: 'hsl(158, 70%, 45%)' }
};

// Particle component for energy flow
function EnergyParticle({ delay, direction, color }: { delay: number; direction: 'in' | 'out'; color: string }) {
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full"
      style={{ backgroundColor: color }}
      initial={{ 
        opacity: 0,
        scale: 0,
        x: direction === 'in' ? (Math.random() - 0.5) * 300 : 0,
        y: direction === 'in' ? (Math.random() - 0.5) * 300 : 0
      }}
      animate={{ 
        opacity: [0, 1, 0],
        scale: [0.5, 1, 0],
        x: direction === 'in' ? 0 : (Math.random() - 0.5) * 300,
        y: direction === 'in' ? 0 : (Math.random() - 0.5) * 300
      }}
      transition={{ 
        duration: 2,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
}

// Orbiting ring component
function OrbitalRing({ size, duration, reverse, opacity }: { size: number; duration: number; reverse?: boolean; opacity: number }) {
  return (
    <motion.div
      className="absolute rounded-full border"
      style={{ 
        width: size, 
        height: size,
        borderColor: `hsl(185 100% 50% / ${opacity})`,
        left: '50%',
        top: '50%',
        marginLeft: -size / 2,
        marginTop: -size / 2
      }}
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    />
  );
}

export function EscrowOrb({ 
  state = 'idle', 
  onStateChange,
  isWalletConnected = false,
  className = '' 
}: EscrowOrbProps) {
  const [particles, setParticles] = useState<number[]>([]);
  const currentColors = stateColors[state];

  useEffect(() => {
    if (state === 'funded' || state === 'completed') {
      setParticles(Array.from({ length: 12 }, (_, i) => i));
    } else {
      setParticles([]);
    }
  }, [state]);

  const actions = [
    { 
      id: 'create', 
      label: 'Create Skill', 
      icon: FileCheck, 
      angle: -45,
      targetState: 'funded' as EscrowState,
      showWhen: state === 'idle'
    },
    { 
      id: 'accept', 
      label: 'Accept Skill', 
      icon: Zap, 
      angle: 45,
      targetState: 'in_progress' as EscrowState,
      showWhen: state === 'funded'
    },
    { 
      id: 'complete', 
      label: 'Complete Work', 
      icon: CheckCircle, 
      angle: 135,
      targetState: 'completed' as EscrowState,
      showWhen: state === 'in_progress'
    },
    { 
      id: 'release', 
      label: 'Release Payment', 
      icon: CreditCard, 
      angle: 225,
      targetState: 'idle' as EscrowState,
      showWhen: state === 'completed'
    }
  ];

  const visibleActions = actions.filter(a => a.showWhen);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Background glow layers */}
      <motion.div
        className="absolute w-80 h-80 rounded-full"
        style={{ 
          background: `radial-gradient(circle, ${currentColors.glow}15 0%, transparent 70%)`,
        }}
        animate={{ 
          scale: state === 'in_progress' ? [1, 1.2, 1] : 1,
          opacity: state === 'idle' ? 0.5 : 0.8
        }}
        transition={{ duration: 2, repeat: state === 'in_progress' ? Infinity : 0, ease: "easeInOut" }}
      />

      {/* Orbital rings */}
      <OrbitalRing size={200} duration={20} opacity={0.15} />
      <OrbitalRing size={260} duration={30} reverse opacity={0.1} />
      <OrbitalRing size={320} duration={40} opacity={0.05} />

      {/* Energy particles */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <AnimatePresence>
          {particles.map((i) => (
            <EnergyParticle 
              key={i} 
              delay={i * 0.15} 
              direction={state === 'funded' ? 'in' : 'out'}
              color={currentColors.primary}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Main orb */}
      <motion.div
        className="relative w-40 h-40 rounded-full flex items-center justify-center"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${currentColors.primary}40, ${currentColors.primary}10)`,
          boxShadow: `
            0 0 60px ${currentColors.glow}30,
            0 0 120px ${currentColors.glow}15,
            inset 0 0 60px ${currentColors.glow}20
          `
        }}
        animate={{
          scale: state === 'in_progress' ? [1, 1.05, 1] : 1,
          boxShadow: state === 'in_progress' 
            ? [
                `0 0 60px ${currentColors.glow}30, 0 0 120px ${currentColors.glow}15, inset 0 0 60px ${currentColors.glow}20`,
                `0 0 80px ${currentColors.glow}50, 0 0 160px ${currentColors.glow}25, inset 0 0 80px ${currentColors.glow}30`,
                `0 0 60px ${currentColors.glow}30, 0 0 120px ${currentColors.glow}15, inset 0 0 60px ${currentColors.glow}20`
              ]
            : `0 0 60px ${currentColors.glow}30, 0 0 120px ${currentColors.glow}15, inset 0 0 60px ${currentColors.glow}20`
        }}
        transition={{ 
          duration: 2, 
          repeat: state === 'in_progress' ? Infinity : 0, 
          ease: "easeInOut" 
        }}
      >
        {/* Inner core */}
        <motion.div
          className="w-20 h-20 rounded-full"
          style={{
            background: `radial-gradient(circle at 40% 40%, ${currentColors.primary}80, ${currentColors.primary}30)`,
          }}
          animate={{
            scale: state === 'funded' ? [1, 1.2, 1] : state === 'completed' ? [1, 0.8, 1.1, 1] : 1
          }}
          transition={{ duration: 1.5, repeat: state === 'funded' ? Infinity : 0 }}
        />

        {/* State indicator */}
        <motion.div
          className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          key={state}
        >
          <span 
            className="text-sm font-medium px-4 py-1.5 rounded-full backdrop-blur-sm border"
            style={{ 
              backgroundColor: `${currentColors.primary}15`,
              borderColor: `${currentColors.primary}30`,
              color: currentColors.primary
            }}
          >
            {stateLabels[state]}
          </span>
        </motion.div>
      </motion.div>

      {/* Wallet connection link */}
      <AnimatePresence>
        {isWalletConnected && (
          <motion.div
            className="absolute -top-8 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            <motion.div 
              className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card neon-border-cyan text-xs"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Wallet className="h-3 w-3 text-primary" />
              <span className="text-primary">Connected</span>
            </motion.div>
            {/* Connection line */}
            <motion.div 
              className="absolute left-1/2 top-full w-px h-8 bg-gradient-to-b from-primary/50 to-transparent"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.3 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contextual action buttons */}
      <AnimatePresence mode="wait">
        {visibleActions.map((action, index) => {
          const angleRad = ((action.angle + index * 90) * Math.PI) / 180;
          const radius = 180;
          const x = Math.cos(angleRad) * radius;
          const y = Math.sin(angleRad) * radius;

          return (
            <motion.button
              key={action.id}
              className="absolute flex items-center gap-2 px-4 py-2.5 rounded-xl glass-card glass-card-hover border-primary/20 text-sm font-medium group"
              style={{ 
                left: `calc(50% + ${x}px - 60px)`,
                top: `calc(50% + ${y}px - 20px)`
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onStateChange?.(action.targetState)}
              transition={{ delay: index * 0.1 }}
            >
              <action.icon className="h-4 w-4 text-primary group-hover:text-foreground transition-colors" />
              <span className="text-foreground/80 group-hover:text-foreground transition-colors">{action.label}</span>
              <ArrowRight className="h-3 w-3 text-primary/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </motion.button>
          );
        })}
      </AnimatePresence>

      {/* Flow lines to actions */}
      <svg 
        className="absolute pointer-events-none" 
        style={{ 
          overflow: 'visible',
          width: '400px',
          height: '400px',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
        viewBox="0 0 400 400"
      >
        <defs>
          <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={currentColors.primary} stopOpacity="0.5" />
            <stop offset="100%" stopColor={currentColors.primary} stopOpacity="0" />
          </linearGradient>
        </defs>
        {visibleActions.map((action, index) => {
          const angleRad = ((action.angle + index * 90) * Math.PI) / 180;
          const startRadius = 80;
          const endRadius = 140;
          const startX = Math.cos(angleRad) * startRadius + 200;
          const startY = Math.sin(angleRad) * startRadius + 200;
          const endX = Math.cos(angleRad) * endRadius + 200;
          const endY = Math.sin(angleRad) * endRadius + 200;

          return (
            <motion.line
              key={action.id}
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke="url(#flowGradient)"
              strokeWidth="2"
              strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.5 }}
              exit={{ pathLength: 0, opacity: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            />
          );
        })}
      </svg>
    </div>
  );
}

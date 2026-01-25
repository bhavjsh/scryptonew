/**
 * EscrowDemo Component
 * 
 * Interactive demonstration of the escrow lifecycle.
 * Shows the EscrowOrb in a controlled environment with
 * automatic state transitions for demo purposes.
 */

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { EscrowOrb, EscrowState } from './EscrowOrb';
import { useWeb3 } from '@/contexts/Web3Context';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EscrowDemoProps {
  autoPlay?: boolean;
  className?: string;
}

export function EscrowDemo({ autoPlay = false, className = '' }: EscrowDemoProps) {
  const { isConnected } = useWeb3();
  const [escrowState, setEscrowState] = useState<EscrowState>('idle');
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  const states: EscrowState[] = ['idle', 'funded', 'in_progress', 'completed'];

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setEscrowState(prev => {
        const currentIndex = states.indexOf(prev);
        return states[(currentIndex + 1) % states.length];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleStateChange = (newState: EscrowState) => {
    setIsPlaying(false);
    setEscrowState(newState);
  };

  const handleReset = () => {
    setEscrowState('idle');
    setIsPlaying(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Network status indicator */}
      <motion.div
        className="absolute top-4 right-4 z-20"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card text-xs">
          <motion.div 
            className="w-2 h-2 rounded-full bg-success"
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-muted-foreground">Monad Testnet</span>
        </div>
      </motion.div>

      {/* State progress indicator */}
      <motion.div
        className="absolute top-4 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-1">
          {states.map((state, index) => (
            <div key={state} className="flex items-center">
              <motion.div
                className={`w-8 h-1 rounded-full transition-colors duration-300 ${
                  states.indexOf(escrowState) >= index 
                    ? 'bg-primary' 
                    : 'bg-muted'
                }`}
                animate={{
                  scaleX: states.indexOf(escrowState) === index ? [1, 1.1, 1] : 1
                }}
                transition={{ duration: 0.5, repeat: states.indexOf(escrowState) === index ? Infinity : 0 }}
              />
              {index < states.length - 1 && (
                <div className="w-1 h-1 rounded-full bg-muted mx-0.5" />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Main escrow visualization */}
      <div className="flex items-center justify-center min-h-[500px]">
        <EscrowOrb 
          state={escrowState}
          onStateChange={handleStateChange}
          isWalletConnected={isConnected}
        />
      </div>

      {/* Demo controls */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className="glass-card border-primary/20 hover:border-primary/40"
          >
            {isPlaying ? (
              <>
                <Pause className="h-3 w-3 mr-1" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-3 w-3 mr-1" />
                Auto Demo
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="glass-card border-muted/20 hover:border-muted/40"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
        </div>
      </motion.div>

      {/* Instruction hint */}
      <motion.p
        className="absolute bottom-16 left-1/2 -translate-x-1/2 text-xs text-muted-foreground text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Click actions to interact with the escrow
      </motion.p>
    </div>
  );
}

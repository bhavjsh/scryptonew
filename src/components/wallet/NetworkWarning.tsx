/**
 * NetworkWarning Component
 * 
 * Displays a subtle banner when the user is connected to the wrong network.
 * Provides a button to switch to Monad Testnet.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWeb3 } from '@/contexts/Web3Context';

// Monad Testnet configuration
export const MONAD_TESTNET = {
  chainId: 10143,
  chainIdHex: '0x279f',
  name: 'Monad Testnet',
  rpcUrl: 'https://testnet-rpc.monad.xyz',
  symbol: 'MON',
  blockExplorer: 'https://testnet.monadexplorer.com',
};

export function NetworkWarning() {
  const { chainId, isConnected, switchNetwork } = useWeb3();
  
  const isWrongNetwork = isConnected && chainId !== MONAD_TESTNET.chainId;

  return (
    <AnimatePresence>
      {isWrongNetwork && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-primary/20"
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  <AlertTriangle className="h-5 w-5 text-primary" />
                </motion.div>
                <span className="text-sm font-medium text-foreground">
                  Wrong Network Detected — Please switch to {MONAD_TESTNET.name}
                </span>
              </div>
              <Button
                size="sm"
                onClick={switchNetwork}
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground border-0"
              >
                Switch to Monad
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

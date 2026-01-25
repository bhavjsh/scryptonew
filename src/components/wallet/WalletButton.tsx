import { Wallet, LogOut, ChevronDown, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useWeb3 } from '@/contexts/Web3Context';

interface WalletButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

export function WalletButton({ variant = 'default', size = 'default' }: WalletButtonProps) {
  const { account, isConnecting, isConnected, connectWallet, disconnectWallet, formatAddress, chainId } = useWeb3();

  if (!isConnected) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          onClick={connectWallet}
          disabled={isConnecting}
          size={size}
          className="relative gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold px-6 btn-neon pulse-glow"
        >
          {isConnecting ? (
            <>
              <div className="web3-spinner" />
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <Wallet className="h-4 w-4" />
              <span>Connect Wallet</span>
            </>
          )}
        </Button>
      </motion.div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button 
            variant="outline" 
            size={size} 
            className="gap-2 glass-card neon-border-cyan hover:bg-card/60"
          >
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="h-2 w-2 rounded-full bg-success" />
                <div className="absolute inset-0 h-2 w-2 rounded-full bg-success animate-ping opacity-50" />
              </div>
              <span className="font-mono text-sm">{formatAddress(account!)}</span>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 glass-card border-border/50">
        <DropdownMenuItem className="flex items-center gap-2 text-muted-foreground text-xs">
          <Zap className="h-3 w-3 text-success" />
          <span>Chain ID: {chainId}</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2 text-muted-foreground text-xs">
          <div className="h-2 w-2 rounded-full bg-success" />
          <span>Connected</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={disconnectWallet} 
          className="text-muted-foreground hover:text-foreground focus:text-foreground cursor-pointer"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

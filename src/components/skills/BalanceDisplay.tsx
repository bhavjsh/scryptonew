import { motion } from 'framer-motion';
import { Wallet, Building2, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InfoBadge } from '@/components/ui/demo-badge';
import { formatEthAmount } from '@/lib/scrypto-contract';

interface BalanceDisplayProps {
  userBalance: number;
  treasuryBalance: number;
  onRefresh: () => void;
  loading?: boolean;
}

/**
 * BalanceDisplay Component
 * 
 * Shows the user's ETH balance and platform treasury.
 */
export function BalanceDisplay({ 
  userBalance, 
  treasuryBalance, 
  onRefresh, 
  loading 
}: BalanceDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <Card className="border-border bg-card/50 backdrop-blur">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <InfoBadge text="Escrow Balance" />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onRefresh}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {/* User Balance */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Your Balance</p>
                <p className="font-semibold text-lg">
                  {formatEthAmount(userBalance)} <span className="text-sm text-muted-foreground">ETH</span>
                </p>
              </div>
            </div>

            {/* Treasury Balance */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Platform Treasury</p>
                <p className="font-semibold text-lg">
                  {formatEthAmount(treasuryBalance)} <span className="text-sm text-muted-foreground">ETH</span>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
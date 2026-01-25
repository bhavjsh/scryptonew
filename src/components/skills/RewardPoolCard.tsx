import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Coins, TrendingUp, Gift, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRewardPool } from '@/hooks/useRewardPool';

export function RewardPoolCard() {
  const { pool, loading, fetchPool } = useRewardPool();

  useEffect(() => {
    fetchPool();
  }, [fetchPool]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Gift className="h-5 w-5 text-primary" />
            Reward Pool
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 mb-4">
            <span className="text-4xl font-bold gradient-text">
              {loading ? '...' : pool?.total_amount.toFixed(2) || '0.00'}
            </span>
            <span className="text-muted-foreground mb-1">ETH</span>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span>Distributed to top performers</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>Funded by dispute resolutions</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

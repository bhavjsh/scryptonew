import { UserReputation } from '@/types/scrypto';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, CheckCircle, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LeaderboardRowProps {
  rank: number;
  reputation: UserReputation;
  isCurrentUser?: boolean;
}

export function LeaderboardRow({ rank, reputation, isCurrentUser }: LeaderboardRowProps) {
  const formatAddress = (address: string) => 
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { icon: Trophy, className: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' };
    if (rank === 2) return { icon: Trophy, className: 'bg-gray-400/20 text-gray-400 border-gray-400/30' };
    if (rank === 3) return { icon: Trophy, className: 'bg-orange-600/20 text-orange-600 border-orange-600/30' };
    return null;
  };

  const rankBadge = getRankBadge(rank);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: rank * 0.05 }}
    >
      <Card className={cn(
        'border-border bg-card/50 backdrop-blur',
        isCurrentUser && 'ring-2 ring-primary'
      )}>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Rank */}
            <div className="w-12 text-center">
              {rankBadge ? (
                <Badge className={rankBadge.className}>
                  <rankBadge.icon className="h-4 w-4" />
                </Badge>
              ) : (
                <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
              )}
            </div>

            {/* User */}
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-mono text-sm">
                  {formatAddress(reputation.wallet_address)}
                  {isCurrentUser && (
                    <Badge variant="outline" className="ml-2 text-xs">You</Badge>
                  )}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm">
              <div className="text-center">
                <p className="text-muted-foreground text-xs">Sessions</p>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>{reputation.successful_sessions}/{reputation.total_sessions}</span>
                </div>
              </div>
              <div className="text-center min-w-[80px]">
                <p className="text-muted-foreground text-xs">Score</p>
                <div className="flex items-center justify-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-bold text-lg">{reputation.reputation_score}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

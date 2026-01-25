import { PotentialMatch } from '@/types/scrypto';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeftRight, Star, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface MatchCardProps {
  match: PotentialMatch;
  onConnect: (match: PotentialMatch) => void;
  loading?: boolean;
}

export function MatchCard({ match, onConnect, loading }: MatchCardProps) {
  const formatAddress = (address: string) => 
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="border-border bg-card/50 backdrop-blur">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-mono text-sm">{formatAddress(match.wallet_address)}</p>
                {match.reputation && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    <span>{match.reputation.reputation_score} pts</span>
                    <span>•</span>
                    <span>{match.reputation.successful_sessions} sessions</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-center gap-4">
            <div className="text-center flex-1">
              <p className="text-xs text-muted-foreground mb-1">They teach</p>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                {match.theyTeach.name}
              </Badge>
            </div>
            <ArrowLeftRight className="h-5 w-5 text-primary flex-shrink-0" />
            <div className="text-center flex-1">
              <p className="text-xs text-muted-foreground mb-1">They want</p>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                {match.theyWant.name}
              </Badge>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            className="w-full"
            onClick={() => onConnect(match)}
            disabled={loading}
          >
            Request Exchange
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

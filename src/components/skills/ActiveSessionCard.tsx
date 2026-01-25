import { LearningSession, SkillMatch } from '@/types/scrypto';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, CheckCircle, Clock, ArrowLeftRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWeb3 } from '@/contexts/Web3Context';
import { LiveVideoCard } from './LiveVideoCard';

interface ActiveSessionCardProps {
  session: LearningSession;
  onSatisfied: () => void;
  onNotSatisfied: () => void;
  loading?: boolean;
}

export function ActiveSessionCard({ session, onSatisfied, onNotSatisfied, loading }: ActiveSessionCardProps) {
  const { account, formatAddress } = useWeb3();
  const match = session.match as SkillMatch;
  
  if (!match) return null;

  const isUserA = account?.toLowerCase() === match.user_a_wallet;
  const otherWallet = isUserA ? match.user_b_wallet : match.user_a_wallet;
  
  const myVote = isUserA ? session.user_a_satisfied : session.user_b_satisfied;
  const theirVote = isUserA ? session.user_b_satisfied : session.user_a_satisfied;
  const hasVoted = myVote !== null;

  const mySkill = isUserA ? match.skill_a : match.skill_b;
  const theirSkill = isUserA ? match.skill_b : match.skill_a;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="border-border bg-card/50 backdrop-blur">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <p className="font-mono text-sm">{formatAddress(otherWallet)}</p>
            {session.resolution ? (
              <Badge className={
                session.resolution === 'refunded'
                  ? 'bg-green-500/20 text-green-400 border-green-500/30'
                  : 'bg-muted/40 text-muted-foreground border-muted-foreground/30'
              }>
                {session.resolution === 'refunded' ? 'Refunded ✓' : 'To Treasury'}
              </Badge>
            ) : (
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                <Clock className="h-3 w-3 mr-1" />
                In Progress
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Live Video Feed - only show for active sessions */}
          {!session.resolution && (
            <LiveVideoCard className="mb-4" />
          )}

          <div className="flex items-center justify-center gap-4">
            <div className="text-center flex-1">
              <p className="text-xs text-muted-foreground mb-1">You taught</p>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                {mySkill?.name || 'Loading...'}
              </Badge>
            </div>
            <ArrowLeftRight className="h-5 w-5 text-primary flex-shrink-0" />
            <div className="text-center flex-1">
              <p className="text-xs text-muted-foreground mb-1">You learned</p>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                {theirSkill?.name || 'Loading...'}
              </Badge>
            </div>
          </div>

          {/* Voting status */}
          <div className="flex justify-center gap-8 pt-2">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Your vote</p>
              {myVote === null ? (
                <Badge variant="outline">Pending</Badge>
              ) : myVote ? (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <ThumbsUp className="h-3 w-3 mr-1" /> Satisfied
                </Badge>
              ) : (
                <Badge className="bg-muted/40 text-muted-foreground border-muted-foreground/30">
                  <ThumbsDown className="h-3 w-3 mr-1" /> Not Satisfied
                </Badge>
              )}
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Partner's vote</p>
              {theirVote === null ? (
                <Badge variant="outline">Pending</Badge>
              ) : theirVote ? (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <ThumbsUp className="h-3 w-3 mr-1" /> Satisfied
                </Badge>
              ) : (
                <Badge className="bg-muted/40 text-muted-foreground border-muted-foreground/30">
                  <ThumbsDown className="h-3 w-3 mr-1" /> Not Satisfied
                </Badge>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter>
          {!hasVoted && !session.resolution ? (
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                className="flex-1 border-muted-foreground/30 hover:bg-muted/30 hover:text-muted-foreground"
                onClick={onNotSatisfied}
                disabled={loading}
              >
                <ThumbsDown className="h-4 w-4 mr-2" />
                Not Satisfied
              </Button>
              <Button
                className="flex-1"
                onClick={onSatisfied}
                disabled={loading}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                Satisfied
              </Button>
            </div>
          ) : session.resolution ? (
            <p className="text-sm text-center w-full text-muted-foreground">
              <CheckCircle className="inline h-4 w-4 mr-1 text-green-500" />
              Session completed
            </p>
          ) : (
            <p className="text-sm text-center w-full text-muted-foreground">
              <Clock className="inline h-4 w-4 mr-1" />
              Waiting for partner's vote...
            </p>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}

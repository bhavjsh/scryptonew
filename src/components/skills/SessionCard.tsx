import { SkillMatch } from '@/types/scrypto';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeftRight, Clock, CheckCircle, XCircle, Coins, Play, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWeb3 } from '@/contexts/Web3Context';

interface SessionCardProps {
  match: SkillMatch;
  onAccept?: () => void;
  onStake?: () => void;
  onStartSession?: () => void;
  loading?: boolean;
  userHasStaked?: boolean;
  partnerHasStaked?: boolean;
}

const statusConfig: Record<string, { label: string; icon: typeof Clock; className: string }> = {
  pending: {
    label: 'Pending',
    icon: Clock,
    className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
  },
  accepted: {
    label: 'Accepted',
    icon: CheckCircle,
    className: 'bg-green-500/20 text-green-400 border-green-500/30'
  },
  staked: {
    label: 'Staked',
    icon: Coins,
    className: 'bg-primary/20 text-primary border-primary/30'
  },
  in_session: {
    label: 'In Session',
    icon: Play,
    className: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  },
  completed: {
    label: 'Completed',
    icon: CheckCircle,
    className: 'bg-green-500/20 text-green-400 border-green-500/30'
  },
  disputed: {
    label: 'Disputed',
    icon: XCircle,
    className: 'bg-muted/40 text-muted-foreground border-muted-foreground/30'
  }
};

export function SessionCard({ match, onAccept, onStake, onStartSession, loading, userHasStaked, partnerHasStaked }: SessionCardProps) {
  const { account, formatAddress } = useWeb3();
  const isUserA = account?.toLowerCase() === match.user_a_wallet;
  const isUserB = account?.toLowerCase() === match.user_b_wallet;
  const otherWallet = isUserA ? match.user_b_wallet : match.user_a_wallet;
  
  const status = statusConfig[match.status] || statusConfig.pending;
  const StatusIcon = status.icon;

  const mySkill = isUserA ? match.skill_a : match.skill_b;
  const theirSkill = isUserA ? match.skill_b : match.skill_a;

  // Calculate required collateral (average of both skills)
  const myCollateral = mySkill?.collateral_amount || 0.03;
  const theirCollateral = theirSkill?.collateral_amount || 0.03;
  const requiredCollateral = Math.max(myCollateral, theirCollateral);

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
            <Badge className={status.className}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {status.label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-center gap-4">
            <div className="text-center flex-1">
              <p className="text-xs text-muted-foreground mb-1">You teach</p>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                {mySkill?.name || 'Loading...'}
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">
                {myCollateral} ETH
              </p>
            </div>
            <ArrowLeftRight className="h-5 w-5 text-primary flex-shrink-0" />
            <div className="text-center flex-1">
              <p className="text-xs text-muted-foreground mb-1">You learn</p>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                {theirSkill?.name || 'Loading...'}
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">
                {theirCollateral} ETH
              </p>
            </div>
          </div>

          {/* Required Collateral Display */}
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
            <div className="flex items-center justify-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Required Collateral:</span>
              <span className="font-semibold text-primary">{requiredCollateral} ETH</span>
            </div>
          </div>

          {/* Stake Status */}
          {(match.status === 'accepted' || match.status === 'staked') && (
            <div className="flex justify-center gap-4 text-xs">
              <div className={`flex items-center gap-1 ${userHasStaked ? 'text-green-400' : 'text-muted-foreground'}`}>
                {userHasStaked ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                You: {userHasStaked ? 'Staked' : 'Not staked'}
              </div>
              <div className={`flex items-center gap-1 ${partnerHasStaked ? 'text-green-400' : 'text-muted-foreground'}`}>
                {partnerHasStaked ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                Partner: {partnerHasStaked ? 'Staked' : 'Not staked'}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          {match.status === 'pending' && isUserB && onAccept && (
            <Button className="w-full" onClick={onAccept} disabled={loading}>
              Accept & Agree to {requiredCollateral} ETH Collateral
            </Button>
          )}
          {match.status === 'accepted' && !userHasStaked && onStake && (
            <Button className="w-full" onClick={onStake} disabled={loading}>
              <Coins className="h-4 w-4 mr-2" />
              Deposit {requiredCollateral} ETH Collateral
            </Button>
          )}
          {match.status === 'accepted' && userHasStaked && !partnerHasStaked && (
            <p className="text-sm text-muted-foreground w-full text-center">
              ✓ You deposited! Waiting for partner...
            </p>
          )}
          {match.status === 'staked' && onStartSession && (
            <Button className="w-full" onClick={onStartSession} disabled={loading}>
              <Play className="h-4 w-4 mr-2" />
              Start Session
            </Button>
          )}
          {match.status === 'pending' && isUserA && (
            <p className="text-sm text-muted-foreground w-full text-center">
              Waiting for partner to accept {requiredCollateral} ETH collateral...
            </p>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}

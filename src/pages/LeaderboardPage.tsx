import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Trophy, Share2, TrendingUp, Star, Award, RefreshCw, Crown, Medal } from 'lucide-react';
import { ScryptoNavbar } from '@/components/layout/ScryptoNavbar';
import { ScryptoFooter } from '@/components/layout/ScryptoFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useWeb3 } from '@/contexts/Web3Context';
import { useRewardPool } from '@/hooks/useRewardPool';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function LeaderboardPage() {
  const { account, isConnected } = useWeb3();
  const { leaderboard, loading, fetchLeaderboard, getMyRank } = useLeaderboard();
  const { pool, fetchPool } = useRewardPool();
  const [myRankInfo, setMyRankInfo] = useState<{ rank: number; total: number; reputation: any } | null>(null);

  useEffect(() => {
    fetchLeaderboard();
    fetchPool();
  }, [fetchLeaderboard, fetchPool]);

  useEffect(() => {
    if (isConnected && account) {
      getMyRank(account).then(setMyRankInfo);
    }
  }, [isConnected, account, getMyRank, leaderboard]);

  const handleShare = () => {
    if (!myRankInfo) {
      toast.error('Complete sessions to get a rank!');
      return;
    }

    const tweetText = encodeURIComponent(
      `🏆 Ranked #${myRankInfo.rank} on Scrypto with ${myRankInfo.reputation.reputation_score} points!\n\n` +
      `Exchange skills, earn rewards. Join the skill exchange revolution.\n\n` +
      `#Scrypto #Web3 #SkillExchange`
    );
    
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
  };

  const formatAddress = (address: string) => 
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  // Calculate platform stats
  const totalSessions = leaderboard.reduce((sum, rep) => sum + rep.total_sessions, 0);
  const totalSuccessful = leaderboard.reduce((sum, rep) => sum + rep.successful_sessions, 0);
  const satisfactionRate = totalSessions > 0 ? Math.round((totalSuccessful / totalSessions) * 100) : 0;

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { label: 'Champion', className: 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30' };
    if (rank <= 3) return { label: 'Elite', className: 'bg-muted text-muted-foreground border-border' };
    if (rank <= 10) return { label: 'Top 10', className: 'bg-primary/10 text-primary border-primary/20' };
    return null;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ScryptoNavbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Top Teachers Badge */}
            <div className="flex justify-center mb-4">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 px-4 py-1">
                <Trophy className="h-3.5 w-3.5 mr-1.5" />
                Top Teachers
              </Badge>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Teaching Leaderboard
              </h1>
              <p className="text-muted-foreground text-sm">
                Earn points by completing sessions with mutual satisfaction. Top teachers get rewards from the platform treasury!
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <Card className="border-border bg-card/50">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-5 w-5 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-primary">{totalSessions.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Sessions</p>
                </CardContent>
              </Card>
              
              <Card className="border-border bg-card/50">
                <CardContent className="p-4 text-center">
                  <Star className="h-5 w-5 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-primary">{satisfactionRate}%</p>
                  <p className="text-xs text-muted-foreground">Satisfaction Rate</p>
                </CardContent>
              </Card>
              
              <Card className="border-border bg-card/50">
                <CardContent className="p-4 text-center">
                  <Award className="h-5 w-5 text-accent mx-auto mb-2" />
                  <p className="text-2xl font-bold text-primary">{pool?.total_amount.toFixed(1) || '0'}</p>
                  <p className="text-xs text-muted-foreground">ETH in Treasury</p>
                </CardContent>
              </Card>
            </div>

            {/* Your Ranking Card */}
            {isConnected && myRankInfo && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8"
              >
                <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                          #{myRankInfo.rank}
                        </div>
                        <div>
                          <p className="font-medium">Your Ranking</p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {formatAddress(account || '')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">{myRankInfo.reputation.reputation_score}</p>
                          <p className="text-xs text-muted-foreground">Score</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">{myRankInfo.reputation.total_sessions}</p>
                          <p className="text-xs text-muted-foreground">Sessions</p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={handleShare}
                          className="gap-1.5"
                        >
                          <Share2 className="h-3.5 w-3.5" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Top 10 Teachers */}
            <Card className="border-border bg-card/50">
              <CardContent className="p-0">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">Top 10 Teachers</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => fetchLeaderboard()}
                    className="text-muted-foreground hover:text-foreground gap-1.5"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Refresh
                  </Button>
                </div>

                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : leaderboard.length === 0 ? (
                  <div className="text-center py-12">
                    <Trophy className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">No rankings yet</p>
                    <p className="text-xs text-muted-foreground">Complete sessions to appear here</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {leaderboard.slice(0, 10).map((rep, index) => {
                      const rank = index + 1;
                      const rankBadge = getRankBadge(rank);
                      const isCurrentUser = account?.toLowerCase() === rep.wallet_address;
                      
                      return (
                        <motion.div
                          key={rep.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: rank * 0.03 }}
                          className={cn(
                            "flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors",
                            isCurrentUser && "bg-primary/5"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            {rank === 1 ? (
                              <Crown className="h-5 w-5 text-yellow-500" />
                            ) : rank <= 3 ? (
                              <Medal className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <span className="w-5 text-center text-sm text-muted-foreground">#{rank}</span>
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-sm">{formatAddress(rep.wallet_address)}</span>
                                {rankBadge && (
                                  <Badge variant="outline" className={cn("text-xs py-0 px-1.5", rankBadge.className)}>
                                    {rankBadge.label}
                                  </Badge>
                                )}
                                {isCurrentUser && (
                                  <Badge variant="secondary" className="text-xs py-0 px-1.5">You</Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {rep.successful_sessions} sessions completed
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-bold text-primary">{rep.reputation_score}</p>
                              <p className="text-xs text-muted-foreground">points</p>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                              <Share2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <ScryptoFooter />
    </div>
  );
}

export default LeaderboardPage;

/**
 * SessionsPage
 * 
 * Manages user's skill exchange sessions:
 * - Pending matches (accept, stake)
 * - Active sessions (vote on satisfaction)
 * - Completed sessions (view outcomes)
 * 
 * All escrow logic is OFF-CHAIN using the useEscrow hook.
 */

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Calendar, RefreshCw, Wallet } from 'lucide-react';
import { ScryptoNavbar } from '@/components/layout/ScryptoNavbar';
import { ScryptoFooter } from '@/components/layout/ScryptoFooter';
import { SessionCard } from '@/components/skills/SessionCard';
import { ActiveSessionCard } from '@/components/skills/ActiveSessionCard';
import { BalanceDisplay } from '@/components/skills/BalanceDisplay';
import { WalletButton } from '@/components/wallet/WalletButton';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DemoBadge } from '@/components/ui/demo-badge';
import { useMatching } from '@/hooks/useMatching';
import { useSessions } from '@/hooks/useSessions';
import { useEscrow } from '@/hooks/useEscrow';
import { useWeb3 } from '@/contexts/Web3Context';
import { SkillMatch } from '@/types/scrypto';
import { DEMO_CONFIG, formatEthAmount, generateDemoTxHash, simulateNetworkDelay } from '@/lib/scrypto-contract';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export function SessionsPage() {
  const { isConnected, account } = useWeb3();
  const { myMatches, loading: matchesLoading, fetchMyMatches, acceptMatch, updateMatchStatus } = useMatching();
  const { sessions, loading: sessionsLoading, fetchSessions, createSession, markSatisfaction } = useSessions();
  const { 
    userBalance, 
    treasuryBalance, 
    fetchUserBalance, 
    fetchTreasuryBalance,
    stakeToEscrow,
    hasUserStaked,
    checkBothStaked,
    loading: escrowLoading 
  } = useEscrow();
  
  const [stakeDialogOpen, setStakeDialogOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<SkillMatch | null>(null);
  const [stakeAmount, setStakeAmount] = useState(DEMO_CONFIG.DEFAULT_STAKE_AMOUNT.toString());
  const [actionLoading, setActionLoading] = useState(false);
  
  // Track stake status for each match
  const [stakeStatus, setStakeStatus] = useState<Record<string, { user: boolean; partner: boolean }>>({});

  // Refresh all data
  const refreshData = useCallback(async () => {
    await Promise.all([
      fetchMyMatches(),
      fetchSessions(),
      fetchUserBalance(),
      fetchTreasuryBalance()
    ]);
  }, [fetchMyMatches, fetchSessions, fetchUserBalance, fetchTreasuryBalance]);

  // Check stake status for matches
  const checkStakeStatuses = useCallback(async () => {
    const statuses: Record<string, { user: boolean; partner: boolean }> = {};
    
    for (const match of myMatches) {
      if (match.status === 'accepted' || match.status === 'staked') {
        const userStaked = await hasUserStaked(match.id);
        const bothStaked = await checkBothStaked(match.id);
        statuses[match.id] = {
          user: userStaked,
          partner: bothStaked
        };
      }
    }
    
    setStakeStatus(statuses);
  }, [myMatches, hasUserStaked, checkBothStaked]);

  useEffect(() => {
    if (isConnected) {
      refreshData();
    }
  }, [isConnected, refreshData]);

  useEffect(() => {
    if (myMatches.length > 0) {
      checkStakeStatuses();
    }
  }, [myMatches, checkStakeStatuses]);

  const handleAccept = async (matchId: string) => {
    setActionLoading(true);
    const { error } = await acceptMatch(matchId);
    if (error) {
      toast.error(error);
    } else {
      toast.success('Match accepted! Both parties can now stake.');
    }
    setActionLoading(false);
  };

  // Calculate collateral based on skill
  const getRequiredCollateral = (match: SkillMatch) => {
    const isUserA = account?.toLowerCase() === match.user_a_wallet;
    const mySkill = isUserA ? match.skill_a : match.skill_b;
    const theirSkill = isUserA ? match.skill_b : match.skill_a;
    const myCollateral = mySkill?.collateral_amount || 0.03;
    const theirCollateral = theirSkill?.collateral_amount || 0.03;
    return Math.max(myCollateral, theirCollateral);
  };

  const handleStakeClick = (match: SkillMatch) => {
    setSelectedMatch(match);
    const collateral = getRequiredCollateral(match);
    setStakeAmount(collateral.toString());
    setStakeDialogOpen(true);
  };

  const handleStake = async () => {
    if (!selectedMatch) return;
    
    setActionLoading(true);
    try {
      // Simulate network delay for realistic feel
      await simulateNetworkDelay();
      
      // Use the skill-based collateral amount
      const amount = getRequiredCollateral(selectedMatch);
      const result = await stakeToEscrow(selectedMatch.id, amount);
      
      if (result.success) {
        const txHash = generateDemoTxHash();
        toast.success(`Deposited ${formatEthAmount(amount)} ETH collateral`, {
          description: `Demo TX: ${txHash.slice(0, 10)}...`
        });
        
        // Update match with stake amount
        await supabase
          .from('skill_matches')
          .update({ stake_amount: amount.toString() })
          .eq('id', selectedMatch.id);
        
        // Check if both have staked
        const bothStaked = await checkBothStaked(selectedMatch.id);
        if (bothStaked) {
          await updateMatchStatus(selectedMatch.id, 'staked');
          toast.info('Both parties deposited! You can now start the session.');
        }
        
        setStakeDialogOpen(false);
        await refreshData();
        await checkStakeStatuses();
      } else {
        toast.error(result.error || 'Deposit failed');
      }
    } catch (error) {
      toast.error('Deposit failed');
    }
    setActionLoading(false);
  };

  const handleStartSession = async (match: SkillMatch) => {
    setActionLoading(true);
    
    // Update match status
    await updateMatchStatus(match.id, 'in_session');
    
    // Create learning session
    const { error } = await createSession(match.id);
    
    if (error) {
      toast.error(error);
    } else {
      toast.success('Session started! Complete it and vote on satisfaction.');
    }
    
    await refreshData();
    setActionLoading(false);
  };

  const handleSatisfaction = async (sessionId: string, matchId: string, satisfied: boolean) => {
    setActionLoading(true);
    
    const match = myMatches.find(m => m.id === matchId);
    const isUserA = account?.toLowerCase() === match?.user_a_wallet;
    
    const { error } = await markSatisfaction(sessionId, matchId, isUserA, satisfied);
    
    if (error) {
      toast.error(error);
    } else {
      toast.success(satisfied ? 'Marked as satisfied!' : 'Marked as not satisfied');
    }
    
    await refreshData();
    setActionLoading(false);
  };

  const pendingMatches = myMatches.filter(m => 
    m.status === 'pending' || m.status === 'accepted' || m.status === 'staked'
  );
  const activeSessions = sessions.filter(s => !s.resolution);
  const completedSessions = sessions.filter(s => s.resolution);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ScryptoNavbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-8">
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
                  My <span className="gradient-text">Sessions</span>
                </h1>
                <p className="text-muted-foreground">
                  Manage your matches, stake ETH, and vote on session satisfaction.
                </p>
              </div>
              {isConnected && (
                <Button 
                  onClick={refreshData} 
                  disabled={matchesLoading || sessionsLoading || escrowLoading} 
                  variant="outline"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${matchesLoading || sessionsLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              )}
            </div>

            {!isConnected ? (
              <div className="text-center py-16">
                <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
                <p className="text-muted-foreground mb-6">
                  Connect your wallet to view your sessions.
                </p>
                <WalletButton />
              </div>
            ) : (
              <>
                {/* Balance Display */}
                <div className="mb-8">
                  <BalanceDisplay
                    userBalance={userBalance}
                    treasuryBalance={treasuryBalance}
                    onRefresh={() => {
                      fetchUserBalance();
                      fetchTreasuryBalance();
                    }}
                    loading={escrowLoading}
                  />
                </div>

                {matchesLoading || sessionsLoading ? (
                  <div className="flex justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <Tabs defaultValue="pending" className="w-full">
                    <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
                      <TabsTrigger value="pending">
                        Pending ({pendingMatches.length})
                      </TabsTrigger>
                      <TabsTrigger value="active">
                        Active ({activeSessions.length})
                      </TabsTrigger>
                      <TabsTrigger value="completed">
                        Completed ({completedSessions.length})
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="pending">
                      {pendingMatches.length === 0 ? (
                        <div className="text-center py-16">
                          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">No Pending Matches</h3>
                          <p className="text-muted-foreground mb-6">
                            Find users with complementary skills to start exchanging.
                          </p>
                          <Button asChild>
                            <Link to="/matches">Find Matches</Link>
                          </Button>
                        </div>
                      ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {pendingMatches.map(match => (
                            <SessionCard
                              key={match.id}
                              match={match}
                              onAccept={() => handleAccept(match.id)}
                              onStake={() => handleStakeClick(match)}
                              onStartSession={() => handleStartSession(match)}
                              loading={actionLoading}
                              userHasStaked={stakeStatus[match.id]?.user || false}
                              partnerHasStaked={stakeStatus[match.id]?.partner || false}
                            />
                          ))}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="active">
                      {activeSessions.length === 0 ? (
                        <div className="text-center py-16">
                          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">No Active Sessions</h3>
                          <p className="text-muted-foreground">
                            Start a session from your pending matches.
                          </p>
                        </div>
                      ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {activeSessions.map(session => (
                            <ActiveSessionCard
                              key={session.id}
                              session={session}
                              onSatisfied={() => handleSatisfaction(session.id, session.match_id, true)}
                              onNotSatisfied={() => handleSatisfaction(session.id, session.match_id, false)}
                              loading={actionLoading}
                            />
                          ))}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="completed">
                      {completedSessions.length === 0 ? (
                        <div className="text-center py-16">
                          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">No Completed Sessions</h3>
                          <p className="text-muted-foreground">
                            Completed sessions will appear here.
                          </p>
                        </div>
                      ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {completedSessions.map(session => (
                            <ActiveSessionCard
                              key={session.id}
                              session={session}
                              onSatisfied={() => {}}
                              onNotSatisfied={() => {}}
                              loading={false}
                            />
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                )}
              </>
            )}
          </motion.div>
        </div>
      </main>

      {/* Collateral Deposit Dialog */}
      <Dialog open={stakeDialogOpen} onOpenChange={setStakeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-2">
              <DialogTitle>Deposit Collateral</DialogTitle>
              <DemoBadge />
            </div>
            <DialogDescription>
              Both participants must deposit the skill-based collateral. Collateral is refunded if both parties mark the session as satisfactory.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedMatch && (
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 text-center">
                <p className="text-sm text-muted-foreground mb-2">Required Collateral</p>
                <p className="text-2xl font-bold text-primary">{stakeAmount} ETH</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Based on skill complexity
                </p>
              </div>
            )}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Your balance: <span className="font-semibold">{formatEthAmount(userBalance)} ETH</span>
              </p>
            </div>
            <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-3">
              <p className="text-sm text-amber-500">
                ⚠️ If either party marks the session as unsatisfactory, both deposits will be transferred to the platform treasury.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStakeDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleStake} 
              disabled={actionLoading || parseFloat(stakeAmount) > userBalance}
            >
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Deposit {stakeAmount} ETH
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ScryptoFooter />
    </div>
  );
}

export default SessionsPage;

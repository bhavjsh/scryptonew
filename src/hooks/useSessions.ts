import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LearningSession } from '@/types/scrypto';
import { useWeb3 } from '@/contexts/Web3Context';

export function useSessions() {
  const { account } = useWeb3();
  const [sessions, setSessions] = useState<LearningSession[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSessions = useCallback(async () => {
    if (!account) return;
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('learning_sessions')
        .select(`
          *,
          match:skill_matches(
            *,
            skill_a:skills!skill_matches_skill_a_teaches_fkey(*),
            skill_b:skills!skill_matches_skill_b_teaches_fkey(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching sessions:', error);
        return;
      }

      // Filter to only sessions where user is involved
      const mySessions = data?.filter(s => 
        s.match?.user_a_wallet === account.toLowerCase() ||
        s.match?.user_b_wallet === account.toLowerCase()
      ) || [];

      setSessions(mySessions as LearningSession[]);
    } finally {
      setLoading(false);
    }
  }, [account]);

  const createSession = useCallback(async (matchId: string) => {
    const { data, error } = await supabase
      .from('learning_sessions')
      .insert({ match_id: matchId })
      .select()
      .single();

    if (error) {
      return { error: error.message, data: null };
    }

    await fetchSessions();
    return { error: null, data };
  }, [fetchSessions]);

  /**
   * Resolve escrow based on individual satisfaction votes
   * 
   * Logic:
   * - BOTH satisfied → Both users get their collateral refunded
   * - User A NOT satisfied with User B's teaching → User B loses collateral (treasury), User A gets refund
   * - User B NOT satisfied with User A's teaching → User A loses collateral (treasury), User B gets refund
   * - BOTH not satisfied → Both lose collateral to treasury
   * 
   * In other words: If someone rates you "Not Satisfied", YOUR collateral goes to treasury.
   * Your own vote determines if the OTHER person loses their collateral.
   */
  const resolveEscrow = async (
    matchId: string, 
    userAWallet: string,
    userBWallet: string,
    userASatisfied: boolean, 
    userBSatisfied: boolean
  ) => {
    console.log(`Resolving escrow for match ${matchId}`);
    console.log(`User A (${userAWallet}) satisfied with B's teaching: ${userASatisfied}`);
    console.log(`User B (${userBWallet}) satisfied with A's teaching: ${userBSatisfied}`);
    
    try {
      // 1. Get all deposits for this match
      const { data: deposits, error: fetchError } = await supabase
        .from('escrow_deposits')
        .select('*')
        .eq('match_id', matchId)
        .eq('status', 'locked');

      if (fetchError || !deposits || deposits.length === 0) {
        console.log('No locked deposits found for this match');
        return { success: true };
      }

      console.log(`Found ${deposits.length} locked deposits`);

      // Get treasury data
      let { data: treasuryData } = await supabase
        .from('platform_treasury')
        .select('id, balance')
        .limit(1)
        .single();

      if (!treasuryData) {
        const { data: newTreasury } = await supabase
          .from('platform_treasury')
          .insert({ balance: 0 })
          .select()
          .single();
        treasuryData = newTreasury;
      }

      let treasuryAddition = 0;

      for (const deposit of deposits) {
        const isUserADeposit = deposit.wallet_address.toLowerCase() === userAWallet.toLowerCase();
        const isUserBDeposit = deposit.wallet_address.toLowerCase() === userBWallet.toLowerCase();
        
        let shouldRefund = false;
        
        if (isUserADeposit) {
          // User A's deposit: Refund if User B was satisfied with A's teaching
          shouldRefund = userBSatisfied === true;
          console.log(`User A's deposit: B satisfied with A? ${userBSatisfied} → ${shouldRefund ? 'REFUND' : 'TREASURY'}`);
        } else if (isUserBDeposit) {
          // User B's deposit: Refund if User A was satisfied with B's teaching
          shouldRefund = userASatisfied === true;
          console.log(`User B's deposit: A satisfied with B? ${userASatisfied} → ${shouldRefund ? 'REFUND' : 'TREASURY'}`);
        }

        if (shouldRefund) {
          // REFUND to user
          const { data: balanceData } = await supabase
            .from('user_balances')
            .select('balance')
            .eq('wallet_address', deposit.wallet_address)
            .single();

          const currentBalance = balanceData?.balance || 0;
          const newBalance = currentBalance + Number(deposit.amount);

          console.log(`Refunding ${deposit.amount} ETH to ${deposit.wallet_address}. New balance: ${newBalance}`);

          await supabase
            .from('user_balances')
            .update({ balance: newBalance })
            .eq('wallet_address', deposit.wallet_address);

          await supabase
            .from('escrow_deposits')
            .update({ status: 'refunded', resolved_at: new Date().toISOString() })
            .eq('id', deposit.id);
        } else {
          // TREASURY - bad teaching penalty
          console.log(`Sending ${deposit.amount} ETH from ${deposit.wallet_address} to treasury (bad teaching penalty)`);
          
          treasuryAddition += Number(deposit.amount);

          await supabase
            .from('escrow_deposits')
            .update({ status: 'treasury', resolved_at: new Date().toISOString() })
            .eq('id', deposit.id);
        }
      }

      // Update treasury balance if any deposits went there
      if (treasuryAddition > 0 && treasuryData) {
        const newTreasuryBalance = Number(treasuryData.balance) + treasuryAddition;
        console.log(`Adding ${treasuryAddition} ETH to treasury. New balance: ${newTreasuryBalance}`);
        
        await supabase
          .from('platform_treasury')
          .update({ balance: newTreasuryBalance })
          .eq('id', treasuryData.id);
      }

      return { success: true };
    } catch (error) {
      console.error('Error resolving escrow:', error);
      return { success: false, error: 'Unexpected error during resolution' };
    }
  };

  const markSatisfaction = useCallback(async (
    sessionId: string,
    matchId: string,
    isUserA: boolean,
    satisfied: boolean
  ) => {
    const updateData = isUserA
      ? { user_a_satisfied: satisfied, user_a_marked_at: new Date().toISOString() }
      : { user_b_satisfied: satisfied, user_b_marked_at: new Date().toISOString() };

    const { error } = await supabase
      .from('learning_sessions')
      .update(updateData)
      .eq('id', sessionId);

    if (error) {
      return { error: error.message };
    }

    // Check if both users have marked
    const { data: session } = await supabase
      .from('learning_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (session?.user_a_satisfied !== null && session?.user_b_satisfied !== null) {
      // Both have marked - resolve the session
      const bothSatisfied = session.user_a_satisfied === true && session.user_b_satisfied === true;
      
      // Determine resolution type based on votes
      let resolution = 'refunded';
      if (!session.user_a_satisfied && !session.user_b_satisfied) {
        resolution = 'both_treasury'; // Both lose collateral
      } else if (!session.user_a_satisfied) {
        resolution = 'b_treasury'; // User B loses collateral (A was not satisfied with B's teaching)
      } else if (!session.user_b_satisfied) {
        resolution = 'a_treasury'; // User A loses collateral (B was not satisfied with A's teaching)
      }

      console.log(`Session resolution: ${resolution} (user_a: ${session.user_a_satisfied}, user_b: ${session.user_b_satisfied})`);

      // Get match data for wallet addresses
      const { data: match } = await supabase
        .from('skill_matches')
        .select('user_a_wallet, user_b_wallet')
        .eq('id', matchId)
        .single();

      if (!match) {
        return { error: 'Match not found' };
      }

      // Update session with resolution
      await supabase
        .from('learning_sessions')
        .update({
          resolution,
          completed_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      // Update match status
      await supabase
        .from('skill_matches')
        .update({ status: bothSatisfied ? 'completed' : 'disputed' })
        .eq('id', matchId);

      // RESOLVE ESCROW - handle collateral based on individual satisfaction votes
      await resolveEscrow(
        matchId, 
        match.user_a_wallet, 
        match.user_b_wallet,
        session.user_a_satisfied,
        session.user_b_satisfied
      );

      // Update reputation based on whether the OTHER person was satisfied with your teaching
      await Promise.all([
        updateReputation(match.user_a_wallet, session.user_b_satisfied), // A's rep depends on B's satisfaction
        updateReputation(match.user_b_wallet, session.user_a_satisfied)  // B's rep depends on A's satisfaction
      ]);
    }

    await fetchSessions();
    return { error: null };
  }, [fetchSessions]);

  const updateReputation = async (walletAddress: string, successful: boolean) => {
    // First try to get existing reputation
    const { data: existing } = await supabase
      .from('user_reputation')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();

    if (existing) {
      await supabase
        .from('user_reputation')
        .update({
          reputation_score: existing.reputation_score + (successful ? 10 : -5),
          successful_sessions: existing.successful_sessions + (successful ? 1 : 0),
          total_sessions: existing.total_sessions + 1
        })
        .eq('wallet_address', walletAddress);
    } else {
      await supabase
        .from('user_reputation')
        .insert({
          wallet_address: walletAddress,
          reputation_score: successful ? 10 : 0,
          successful_sessions: successful ? 1 : 0,
          total_sessions: 1
        });
    }
  };

  return {
    sessions,
    loading,
    fetchSessions,
    createSession,
    markSatisfaction
  };
}

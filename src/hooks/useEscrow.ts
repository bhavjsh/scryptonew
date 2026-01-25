/**
 * useEscrow Hook
 * 
 * Implements escrow logic for skill exchange staking.
 * All staking, deposits, and resolutions are tracked in the database.
 * 
 * Key concepts:
 * - Each user has a crypto balance (starts at 1.0 ETH)
 * - When staking, funds are deducted from balance and locked in escrow_deposits
 * - On session completion:
 *   - BOTH satisfied → funds refunded to both users
 *   - ANY unsatisfied → funds sent to platform treasury
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useWeb3 } from '@/contexts/Web3Context';
import { toast } from 'sonner';

export interface UserBalance {
  wallet_address: string;
  balance: number;
}

export interface EscrowDeposit {
  id: string;
  match_id: string;
  wallet_address: string;
  amount: number;
  status: 'locked' | 'refunded' | 'treasury';
  created_at: string;
  resolved_at: string | null;
}

export interface TreasuryBalance {
  balance: number;
}

export function useEscrow() {
  const { account } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [userBalance, setUserBalance] = useState<number>(0);
  const [treasuryBalance, setTreasuryBalance] = useState<number>(0);

  /**
   * Fetch or create user balance
   * New users start with 1.0 ETH
   */
  const fetchUserBalance = useCallback(async () => {
    if (!account) return;

    const walletAddress = account.toLowerCase();

    // Try to get existing balance
    const { data, error } = await supabase
      .from('user_balances')
      .select('balance')
      .eq('wallet_address', walletAddress)
      .single();

    if (error && error.code === 'PGRST116') {
      // No balance found, create one with 1.0 ETH starting balance
      const { data: newBalance, error: insertError } = await supabase
        .from('user_balances')
        .insert({ wallet_address: walletAddress, balance: 1.0 })
        .select('balance')
        .single();

      if (!insertError && newBalance) {
        setUserBalance(newBalance.balance);
      }
    } else if (data) {
      setUserBalance(data.balance);
    }
  }, [account]);

  /**
   * Fetch platform treasury balance
   */
  const fetchTreasuryBalance = useCallback(async () => {
    const { data } = await supabase
      .from('platform_treasury')
      .select('balance')
      .limit(1)
      .single();

    if (data) {
      setTreasuryBalance(data.balance);
    }
  }, []);

  /**
   * STAKE: Deduct from user balance and lock in escrow
   * 
   * Funds are "locked" in the escrow_deposits table until resolution.
   */
  const stakeToEscrow = useCallback(async (
    matchId: string,
    amount: number
  ): Promise<{ success: boolean; error?: string }> => {
    if (!account) {
      return { success: false, error: 'Wallet not connected' };
    }

    const walletAddress = account.toLowerCase();
    setLoading(true);

    try {
      // 1. Check if user has sufficient balance
      const { data: balanceData } = await supabase
        .from('user_balances')
        .select('balance')
        .eq('wallet_address', walletAddress)
        .single();

      const currentBalance = balanceData?.balance || 0;

      if (currentBalance < amount) {
        return { 
          success: false, 
          error: `Insufficient balance. You have ${currentBalance.toFixed(4)} ETH, but need ${amount} ETH` 
        };
      }

      // 2. Check if already staked for this match
      const { data: existingDeposit } = await supabase
        .from('escrow_deposits')
        .select('id')
        .eq('match_id', matchId)
        .eq('wallet_address', walletAddress)
        .single();

      if (existingDeposit) {
        return { success: false, error: 'Already staked for this match' };
      }

      // 3. Deduct from user balance (simulated transfer to escrow)
      const newBalance = currentBalance - amount;
      const { error: updateError } = await supabase
        .from('user_balances')
        .update({ balance: newBalance })
        .eq('wallet_address', walletAddress);

      if (updateError) {
        return { success: false, error: 'Failed to deduct balance' };
      }

      // 4. Create escrow deposit record
      const { error: depositError } = await supabase
        .from('escrow_deposits')
        .insert({
          match_id: matchId,
          wallet_address: walletAddress,
          amount: amount,
          status: 'locked'
        });

      if (depositError) {
        // Rollback balance update
        await supabase
          .from('user_balances')
          .update({ balance: currentBalance })
          .eq('wallet_address', walletAddress);
        return { success: false, error: 'Failed to create escrow deposit' };
      }

      // 5. Update local state
      setUserBalance(newBalance);

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Unexpected error during staking' };
    } finally {
      setLoading(false);
    }
  }, [account]);

  /**
   * RESOLVE: Handle session completion
   * 
   * This is called when both users have marked satisfaction.
   * - BOTH satisfied → Refund stakes to users
   * - ANY unsatisfied → Transfer stakes to treasury
   */
  const resolveEscrow = useCallback(async (
    matchId: string,
    bothSatisfied: boolean
  ): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);

    try {
      // 1. Get all deposits for this match
      const { data: deposits, error: fetchError } = await supabase
        .from('escrow_deposits')
        .select('*')
        .eq('match_id', matchId)
        .eq('status', 'locked');

      if (fetchError || !deposits || deposits.length === 0) {
        return { success: false, error: 'No locked deposits found for this match' };
      }

      if (bothSatisfied) {
        // REFUND: Return stakes to users
        for (const deposit of deposits) {
          // Get current balance
          const { data: balanceData } = await supabase
            .from('user_balances')
            .select('balance')
            .eq('wallet_address', deposit.wallet_address)
            .single();

          const currentBalance = balanceData?.balance || 0;

          // Refund to user
          await supabase
            .from('user_balances')
            .update({ balance: currentBalance + deposit.amount })
            .eq('wallet_address', deposit.wallet_address);

          // Mark deposit as refunded
          await supabase
            .from('escrow_deposits')
            .update({ status: 'refunded', resolved_at: new Date().toISOString() })
            .eq('id', deposit.id);
        }
      } else {
        // TREASURY: Send stakes to platform treasury
        const totalAmount = deposits.reduce((sum, d) => sum + Number(d.amount), 0);

        // Get current treasury balance
        const { data: treasuryData } = await supabase
          .from('platform_treasury')
          .select('id, balance')
          .limit(1)
          .single();

        if (treasuryData) {
          // Add to treasury
          await supabase
            .from('platform_treasury')
            .update({ balance: treasuryData.balance + totalAmount })
            .eq('id', treasuryData.id);
        }

        // Mark all deposits as sent to treasury
        for (const deposit of deposits) {
          await supabase
            .from('escrow_deposits')
            .update({ status: 'treasury', resolved_at: new Date().toISOString() })
            .eq('id', deposit.id);
        }
      }

      // Refresh balances
      await fetchUserBalance();
      await fetchTreasuryBalance();

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Unexpected error during resolution' };
    } finally {
      setLoading(false);
    }
  }, [fetchUserBalance, fetchTreasuryBalance]);

  /**
   * Get deposits for a specific match
   */
  const getMatchDeposits = useCallback(async (matchId: string): Promise<EscrowDeposit[]> => {
    const { data } = await supabase
      .from('escrow_deposits')
      .select('*')
      .eq('match_id', matchId);

    return (data || []) as EscrowDeposit[];
  }, []);

  /**
   * Check if user has staked for a match
   */
  const hasUserStaked = useCallback(async (matchId: string): Promise<boolean> => {
    if (!account) return false;

    const { data } = await supabase
      .from('escrow_deposits')
      .select('id')
      .eq('match_id', matchId)
      .eq('wallet_address', account.toLowerCase())
      .single();

    return !!data;
  }, [account]);

  /**
   * Check if both users have staked for a match
   */
  const checkBothStaked = useCallback(async (matchId: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from('escrow_deposits')
      .select('id')
      .eq('match_id', matchId)
      .eq('status', 'locked');

    return !error && data && data.length >= 2;
  }, []);

  return {
    loading,
    userBalance,
    treasuryBalance,
    fetchUserBalance,
    fetchTreasuryBalance,
    stakeToEscrow,
    resolveEscrow,
    getMatchDeposits,
    hasUserStaked,
    checkBothStaked
  };
}

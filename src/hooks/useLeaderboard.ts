import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserReputation } from '@/types/scrypto';

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<UserReputation[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLeaderboard = useCallback(async (limit = 50) => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('user_reputation')
        .select('*')
        .order('reputation_score', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching leaderboard:', error);
        return;
      }

      setLeaderboard(data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  const getMyRank = useCallback(async (walletAddress: string) => {
    const { data, error } = await supabase
      .from('user_reputation')
      .select('*')
      .order('reputation_score', { ascending: false });

    if (error) {
      console.error('Error fetching rank:', error);
      return null;
    }

    const index = data?.findIndex(r => r.wallet_address === walletAddress.toLowerCase());
    if (index === -1 || index === undefined) return null;
    
    return {
      rank: index + 1,
      total: data?.length || 0,
      reputation: data?.[index]
    };
  }, []);

  return {
    leaderboard,
    loading,
    fetchLeaderboard,
    getMyRank
  };
}

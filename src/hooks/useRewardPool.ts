import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RewardPool } from '@/types/scrypto';

export function useRewardPool() {
  const [pool, setPool] = useState<RewardPool | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPool = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reward_pool')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching reward pool:', error);
        return;
      }

      setPool(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const addToPool = useCallback(async (amount: number) => {
    const { data: current } = await supabase
      .from('reward_pool')
      .select('*')
      .single();

    if (!current) {
      const { error } = await supabase
        .from('reward_pool')
        .insert({ total_amount: amount });
      
      if (error) console.error('Error creating pool:', error);
    } else {
      const { error } = await supabase
        .from('reward_pool')
        .update({ 
          total_amount: current.total_amount + amount,
          updated_at: new Date().toISOString()
        })
        .eq('id', current.id);

      if (error) console.error('Error updating pool:', error);
    }

    await fetchPool();
  }, [fetchPool]);

  return {
    pool,
    loading,
    fetchPool,
    addToPool,
  };
}

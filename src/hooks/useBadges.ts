import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserBadge, BADGE_TYPES, BADGE_INFO } from '@/types/scrypto';

export function useBadges() {
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBadges = useCallback(async (walletAddress: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select('*')
        .eq('wallet_address', walletAddress.toLowerCase())
        .order('earned_at', { ascending: false });

      if (error) {
        console.error('Error fetching badges:', error);
        return;
      }

      setBadges((data || []).map(d => ({
        ...d,
        metadata: (d.metadata || {}) as Record<string, any>
      })));
    } finally {
      setLoading(false);
    }
  }, []);

  const awardBadge = useCallback(async (
    walletAddress: string,
    badgeType: string
  ) => {
    const badgeInfo = BADGE_INFO[badgeType];
    if (!badgeInfo) return { error: 'Invalid badge type' };

    // Check if user already has this badge
    const { data: existing } = await supabase
      .from('user_badges')
      .select('id')
      .eq('wallet_address', walletAddress.toLowerCase())
      .eq('badge_type', badgeType)
      .single();

    if (existing) {
      return { error: 'Badge already awarded' };
    }

    const { data, error } = await supabase
      .from('user_badges')
      .insert({
        wallet_address: walletAddress.toLowerCase(),
        badge_type: badgeType,
        badge_name: badgeInfo.name,
        description: badgeInfo.description,
      })
      .select()
      .single();

    if (error) {
      console.error('Error awarding badge:', error);
      return { error: error.message };
    }

    return { data, error: null };
  }, []);

  const checkAndAwardBadges = useCallback(async (walletAddress: string) => {
    // Fetch user's reputation
    const { data: reputation } = await supabase
      .from('user_reputation')
      .select('*')
      .eq('wallet_address', walletAddress.toLowerCase())
      .single();

    if (!reputation) return;

    const awardsToGive: string[] = [];

    // Rising Star: First successful session
    if (reputation.successful_sessions >= 1) {
      awardsToGive.push(BADGE_TYPES.RISING_STAR);
    }

    // Trusted Teacher: 10+ successful sessions
    if (reputation.successful_sessions >= 10) {
      awardsToGive.push(BADGE_TYPES.TRUSTED_TEACHER);
    }

    // 100% Satisfaction Mentor: 100% rate with 5+ sessions
    if (
      reputation.total_sessions >= 5 &&
      reputation.successful_sessions === reputation.total_sessions
    ) {
      awardsToGive.push(BADGE_TYPES.SATISFACTION_MENTOR);
    }

    // Check leaderboard position for Top Provider
    const { data: leaderboard } = await supabase
      .from('user_reputation')
      .select('wallet_address')
      .order('reputation_score', { ascending: false })
      .limit(10);

    if (leaderboard?.some(r => r.wallet_address === walletAddress.toLowerCase())) {
      awardsToGive.push(BADGE_TYPES.TOP_PROVIDER);
    }

    // Award each badge (duplicates are handled in awardBadge)
    for (const badgeType of awardsToGive) {
      await awardBadge(walletAddress, badgeType);
    }
  }, [awardBadge]);

  return {
    badges,
    loading,
    fetchBadges,
    awardBadge,
    checkAndAwardBadges,
  };
}

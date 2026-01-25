import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PotentialMatch, SkillMatch } from '@/types/scrypto';
import { useWeb3 } from '@/contexts/Web3Context';
import type { RealtimeChannel } from '@supabase/supabase-js';

export function useMatching() {
  const { account } = useWeb3();
  const [potentialMatches, setPotentialMatches] = useState<PotentialMatch[]>([]);
  const [myMatches, setMyMatches] = useState<SkillMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const accountRef = useRef(account);

  // Keep accountRef updated
  useEffect(() => {
    accountRef.current = account;
  }, [account]);

  const findMatches = useCallback(async () => {
    const currentAccount = accountRef.current;
    if (!currentAccount) return;
    
    setLoading(true);
    
    try {
      // Get my skills and wanted skills
      const [mySkillsResult, myWantedResult] = await Promise.all([
        supabase
          .from('user_skills')
          .select('skill_id')
          .eq('wallet_address', currentAccount.toLowerCase()),
        supabase
          .from('user_wanted_skills')
          .select('skill_id')
          .eq('wallet_address', currentAccount.toLowerCase())
      ]);

      if (mySkillsResult.error || myWantedResult.error) {
        console.error('Error fetching my skills');
        return;
      }

      const mySkillIds = mySkillsResult.data?.map(s => s.skill_id) || [];
      const myWantedIds = myWantedResult.data?.map(s => s.skill_id) || [];

      if (mySkillIds.length === 0 || myWantedIds.length === 0) {
        setPotentialMatches([]);
        return;
      }

      // Find users who:
      // 1. Have skills that I want to learn
      // 2. Want skills that I have
      const { data: usersWhoTeachWhatIWant, error: teachError } = await supabase
        .from('user_skills')
        .select('wallet_address, skill_id, skill:skills(*)')
        .in('skill_id', myWantedIds)
        .neq('wallet_address', currentAccount.toLowerCase());

      if (teachError) {
        console.error('Error finding teachers:', teachError);
        return;
      }

      const { data: usersWhoWantWhatITeach, error: wantError } = await supabase
        .from('user_wanted_skills')
        .select('wallet_address, skill_id, skill:skills(*)')
        .in('skill_id', mySkillIds)
        .neq('wallet_address', currentAccount.toLowerCase());

      if (wantError) {
        console.error('Error finding learners:', wantError);
        return;
      }

      // Find complementary matches
      const matches: PotentialMatch[] = [];
      const teacherMap = new Map<string, { skillId: string; skill: any }[]>();

      usersWhoTeachWhatIWant?.forEach(teacher => {
        const existing = teacherMap.get(teacher.wallet_address) || [];
        existing.push({ skillId: teacher.skill_id, skill: teacher.skill });
        teacherMap.set(teacher.wallet_address, existing);
      });

      usersWhoWantWhatITeach?.forEach(learner => {
        const teacherSkills = teacherMap.get(learner.wallet_address);
        if (teacherSkills) {
          // This user teaches something I want AND wants something I teach
          teacherSkills.forEach(teacherSkill => {
            matches.push({
              wallet_address: learner.wallet_address,
              theyTeach: teacherSkill.skill,
              theyWant: learner.skill
            });
          });
        }
      });

      // Get reputation for each match
      const wallets = [...new Set(matches.map(m => m.wallet_address))];
      if (wallets.length > 0) {
        const { data: reputations } = await supabase
          .from('user_reputation')
          .select('*')
          .in('wallet_address', wallets);

        if (reputations) {
          const repMap = new Map(reputations.map(r => [r.wallet_address, r]));
          matches.forEach(m => {
            m.reputation = repMap.get(m.wallet_address);
          });
        }
      }

      setPotentialMatches(matches);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyMatches = useCallback(async () => {
    const currentAccount = accountRef.current;
    if (!currentAccount) return;

    const { data, error } = await supabase
      .from('skill_matches')
      .select('*, skill_a:skills!skill_matches_skill_a_teaches_fkey(*), skill_b:skills!skill_matches_skill_b_teaches_fkey(*)')
      .or(`user_a_wallet.eq.${currentAccount.toLowerCase()},user_b_wallet.eq.${currentAccount.toLowerCase()}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching matches:', error);
      return;
    }

    setMyMatches((data || []) as SkillMatch[]);
  }, []);

  // Subscribe to real-time updates for skills changes
  useEffect(() => {
    if (!account) return;

    // Clean up existing channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // Create a new channel for skills updates
    const channel = supabase
      .channel('skills-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_skills'
        },
        () => {
          console.log('User skills changed');
          findMatches();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_wanted_skills'
        },
        () => {
          console.log('User wanted skills changed');
          findMatches();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_profiles'
        },
        () => {
          console.log('User profile added');
          findMatches();
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [account, findMatches]);

  const createMatch = useCallback(async (
    otherWallet: string,
    mySkillId: string,
    theirSkillId: string
  ) => {
    const currentAccount = accountRef.current;
    if (!currentAccount) return { error: 'No wallet connected' };

    const { data, error } = await supabase
      .from('skill_matches')
      .insert({
        user_a_wallet: currentAccount.toLowerCase(),
        user_b_wallet: otherWallet.toLowerCase(),
        skill_a_teaches: mySkillId,
        skill_b_teaches: theirSkillId,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      return { error: error.message, data: null };
    }

    await fetchMyMatches();
    return { error: null, data };
  }, [fetchMyMatches]);

  const acceptMatch = useCallback(async (matchId: string) => {
    const { error } = await supabase
      .from('skill_matches')
      .update({ status: 'accepted' })
      .eq('id', matchId);

    if (error) {
      return { error: error.message };
    }

    await fetchMyMatches();
    return { error: null };
  }, [fetchMyMatches]);

  const updateMatchStatus = useCallback(async (matchId: string, status: string) => {
    const { error } = await supabase
      .from('skill_matches')
      .update({ status })
      .eq('id', matchId);

    if (error) {
      return { error: error.message };
    }

    await fetchMyMatches();
    return { error: null };
  }, [fetchMyMatches]);

  return {
    potentialMatches,
    myMatches,
    loading,
    findMatches,
    fetchMyMatches,
    createMatch,
    acceptMatch,
    updateMatchStatus
  };
}

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Skill, UserSkill, UserWantedSkill } from '@/types/scrypto';
import { useWeb3 } from '@/contexts/Web3Context';

export function useSkills() {
  const { account } = useWeb3();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [wantedSkills, setWantedSkills] = useState<UserWantedSkill[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSkills = useCallback(async () => {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('category', { ascending: true });
    
    if (error) {
      console.error('Error fetching skills:', error);
      return;
    }
    
    setSkills(data || []);
  }, []);

  const fetchUserSkills = useCallback(async () => {
    if (!account) {
      setUserSkills([]);
      setWantedSkills([]);
      return;
    }

    const [userSkillsResult, wantedSkillsResult] = await Promise.all([
      supabase
        .from('user_skills')
        .select('*, skill:skills(*)')
        .eq('wallet_address', account.toLowerCase()),
      supabase
        .from('user_wanted_skills')
        .select('*, skill:skills(*)')
        .eq('wallet_address', account.toLowerCase())
    ]);

    if (userSkillsResult.error) {
      console.error('Error fetching user skills:', userSkillsResult.error);
    } else {
      setUserSkills(userSkillsResult.data || []);
    }

    if (wantedSkillsResult.error) {
      console.error('Error fetching wanted skills:', wantedSkillsResult.error);
    } else {
      setWantedSkills(wantedSkillsResult.data || []);
    }
  }, [account]);

  const addUserSkill = useCallback(async (skillId: string) => {
    if (!account) return { error: 'No wallet connected' };

    const { error } = await supabase
      .from('user_skills')
      .insert({
        wallet_address: account.toLowerCase(),
        skill_id: skillId
      });

    if (error) {
      if (error.code === '23505') {
        return { error: 'You already have this skill' };
      }
      return { error: error.message };
    }

    await fetchUserSkills();
    return { error: null };
  }, [account, fetchUserSkills]);

  const removeUserSkill = useCallback(async (skillId: string) => {
    if (!account) return { error: 'No wallet connected' };

    const { error } = await supabase
      .from('user_skills')
      .delete()
      .eq('wallet_address', account.toLowerCase())
      .eq('skill_id', skillId);

    if (error) {
      return { error: error.message };
    }

    await fetchUserSkills();
    return { error: null };
  }, [account, fetchUserSkills]);

  const addWantedSkill = useCallback(async (skillId: string) => {
    if (!account) return { error: 'No wallet connected' };

    const { error } = await supabase
      .from('user_wanted_skills')
      .insert({
        wallet_address: account.toLowerCase(),
        skill_id: skillId
      });

    if (error) {
      if (error.code === '23505') {
        return { error: 'You already want to learn this skill' };
      }
      return { error: error.message };
    }

    await fetchUserSkills();
    return { error: null };
  }, [account, fetchUserSkills]);

  const removeWantedSkill = useCallback(async (skillId: string) => {
    if (!account) return { error: 'No wallet connected' };

    const { error } = await supabase
      .from('user_wanted_skills')
      .delete()
      .eq('wallet_address', account.toLowerCase())
      .eq('skill_id', skillId);

    if (error) {
      return { error: error.message };
    }

    await fetchUserSkills();
    return { error: null };
  }, [account, fetchUserSkills]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchSkills(), fetchUserSkills()]);
      setLoading(false);
    };
    load();
  }, [fetchSkills, fetchUserSkills]);

  return {
    skills,
    userSkills,
    wantedSkills,
    loading,
    addUserSkill,
    removeUserSkill,
    addWantedSkill,
    removeWantedSkill,
    refetch: () => Promise.all([fetchSkills(), fetchUserSkills()])
  };
}

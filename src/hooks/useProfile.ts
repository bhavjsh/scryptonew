/**
 * useProfile Hook
 * 
 * Manages user profile data persistence in the database.
 * Profile data is linked to wallet address and includes:
 * - Full name (editable)
 * - Bio (editable)
 * - Skills they know (via useSkills)
 * - Skills they want to learn (via useSkills)
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useWeb3 } from '@/contexts/Web3Context';

export interface UserProfile {
  id: string;
  wallet_address: string;
  full_name: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const { account } = useWeb3();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from database
  const fetchProfile = useCallback(async () => {
    if (!account) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('wallet_address', account.toLowerCase())
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setProfile(data);
      } else {
        // Create a new profile if it doesn't exist
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert({
            wallet_address: account.toLowerCase(),
            full_name: null,
            bio: null
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          return;
        }

        setProfile(newProfile);
      }
    } finally {
      setLoading(false);
    }
  }, [account]);

  // Update profile in database
  const updateProfile = useCallback(async (updates: { full_name?: string; bio?: string }) => {
    if (!account) return { error: 'No wallet connected' };

    const { error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('wallet_address', account.toLowerCase());

    if (error) {
      console.error('Error updating profile:', error);
      return { error: error.message };
    }

    // Refresh profile data after update
    await fetchProfile();
    return { error: null };
  }, [account, fetchProfile]);

  // Load profile when account changes
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    updateProfile,
    refetch: fetchProfile
  };
}

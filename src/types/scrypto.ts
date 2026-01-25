export interface Skill {
  id: string;
  name: string;
  category: string;
  collateral_amount: number;
  created_at: string;
}

export interface UserSkill {
  id: string;
  wallet_address: string;
  skill_id: string;
  created_at: string;
  skill?: Skill;
}

export interface UserWantedSkill {
  id: string;
  wallet_address: string;
  skill_id: string;
  created_at: string;
  skill?: Skill;
}

export interface SkillMatch {
  id: string;
  user_a_wallet: string;
  user_b_wallet: string;
  skill_a_teaches: string;
  skill_b_teaches: string;
  status: 'pending' | 'accepted' | 'staked' | 'in_session' | 'completed' | 'disputed';
  stake_amount: string | null;
  created_at: string;
  updated_at: string;
  skill_a?: Skill;
  skill_b?: Skill;
}

export interface LearningSession {
  id: string;
  match_id: string;
  user_a_satisfied: boolean | null;
  user_b_satisfied: boolean | null;
  user_a_marked_at: string | null;
  user_b_marked_at: string | null;
  resolution: 'refunded' | 'treasury' | null;
  created_at: string;
  completed_at: string | null;
  match?: SkillMatch;
}

export interface UserReputation {
  id: string;
  wallet_address: string;
  reputation_score: number;
  successful_sessions: number;
  total_sessions: number;
  created_at: string;
  updated_at: string;
}

export interface PotentialMatch {
  wallet_address: string;
  theyTeach: Skill;
  theyWant: Skill;
  reputation?: UserReputation;
}

export interface UserBadge {
  id: string;
  wallet_address: string;
  badge_type: string;
  badge_name: string;
  description: string | null;
  earned_at: string;
  metadata: Record<string, any>;
}

export interface RewardPool {
  id: string;
  total_amount: number;
  last_distribution_at: string | null;
  updated_at: string;
}

// Badge type constants
export const BADGE_TYPES = {
  SATISFACTION_MENTOR: 'satisfaction_mentor',
  TOP_PROVIDER: 'top_provider',
  TRUSTED_TEACHER: 'trusted_teacher',
  RISING_STAR: 'rising_star',
  STREAK_MASTER: 'streak_master',
} as const;

export const BADGE_INFO: Record<string, { name: string; description: string; icon: string }> = {
  [BADGE_TYPES.SATISFACTION_MENTOR]: {
    name: '100% Satisfaction Mentor',
    description: 'Achieved 100% satisfaction rate across 5+ sessions',
    icon: '🌟',
  },
  [BADGE_TYPES.TOP_PROVIDER]: {
    name: 'Top Skill Provider',
    description: 'Ranked in the top 10 on the leaderboard',
    icon: '🏆',
  },
  [BADGE_TYPES.TRUSTED_TEACHER]: {
    name: 'Trusted Teacher',
    description: 'Completed 10+ successful sessions',
    icon: '✨',
  },
  [BADGE_TYPES.RISING_STAR]: {
    name: 'Rising Star',
    description: 'Completed first successful session',
    icon: '⭐',
  },
  [BADGE_TYPES.STREAK_MASTER]: {
    name: 'Streak Master',
    description: 'Maintained 5+ session satisfaction streak',
    icon: '🔥',
  },
};

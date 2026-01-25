-- Create user badges table for achievement badges
CREATE TABLE public.user_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  badge_type TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  description TEXT,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view badges" ON public.user_badges
  FOR SELECT USING (true);

CREATE POLICY "System can insert badges" ON public.user_badges
  FOR INSERT WITH CHECK (true);

-- Create index for wallet address lookups
CREATE INDEX idx_user_badges_wallet ON public.user_badges(wallet_address);

-- Create reward pool table
CREATE TABLE public.reward_pool (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  last_distribution_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reward_pool ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view reward pool" ON public.reward_pool
  FOR SELECT USING (true);

CREATE POLICY "System can update reward pool" ON public.reward_pool
  FOR UPDATE USING (true);

CREATE POLICY "System can insert reward pool" ON public.reward_pool
  FOR INSERT WITH CHECK (true);

-- Initialize reward pool with starting amount
INSERT INTO public.reward_pool (total_amount) VALUES (100.0);
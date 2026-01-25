-- Create skills catalog table
CREATE TABLE public.skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on skills
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- Anyone can view skills (public catalog)
CREATE POLICY "Anyone can view skills"
ON public.skills
FOR SELECT
USING (true);

-- Create user_skills table (skills users know)
CREATE TABLE public.user_skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(wallet_address, skill_id)
);

-- Enable RLS on user_skills
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;

-- Anyone can view user skills for matching
CREATE POLICY "Anyone can view user skills"
ON public.user_skills
FOR SELECT
USING (true);

-- Users can insert their own skills (no auth, using wallet address)
CREATE POLICY "Users can add their skills"
ON public.user_skills
FOR INSERT
WITH CHECK (true);

-- Users can delete their own skills
CREATE POLICY "Users can remove their skills"
ON public.user_skills
FOR DELETE
USING (true);

-- Create user_wanted_skills table (skills users want to learn)
CREATE TABLE public.user_wanted_skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(wallet_address, skill_id)
);

-- Enable RLS on user_wanted_skills
ALTER TABLE public.user_wanted_skills ENABLE ROW LEVEL SECURITY;

-- Anyone can view wanted skills for matching
CREATE POLICY "Anyone can view wanted skills"
ON public.user_wanted_skills
FOR SELECT
USING (true);

-- Users can insert their wanted skills
CREATE POLICY "Users can add wanted skills"
ON public.user_wanted_skills
FOR INSERT
WITH CHECK (true);

-- Users can delete their wanted skills
CREATE POLICY "Users can remove wanted skills"
ON public.user_wanted_skills
FOR DELETE
USING (true);

-- Create skill matches table
CREATE TABLE public.skill_matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_a_wallet TEXT NOT NULL,
  user_b_wallet TEXT NOT NULL,
  skill_a_teaches UUID NOT NULL REFERENCES public.skills(id),
  skill_b_teaches UUID NOT NULL REFERENCES public.skills(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'staked', 'in_session', 'completed', 'disputed')),
  stake_amount TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on skill_matches
ALTER TABLE public.skill_matches ENABLE ROW LEVEL SECURITY;

-- Anyone can view matches
CREATE POLICY "Anyone can view matches"
ON public.skill_matches
FOR SELECT
USING (true);

-- Anyone can create matches
CREATE POLICY "Anyone can create matches"
ON public.skill_matches
FOR INSERT
WITH CHECK (true);

-- Anyone can update matches
CREATE POLICY "Anyone can update matches"
ON public.skill_matches
FOR UPDATE
USING (true);

-- Create sessions table for learning sessions
CREATE TABLE public.learning_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID NOT NULL REFERENCES public.skill_matches(id) ON DELETE CASCADE,
  user_a_satisfied BOOLEAN,
  user_b_satisfied BOOLEAN,
  user_a_marked_at TIMESTAMP WITH TIME ZONE,
  user_b_marked_at TIMESTAMP WITH TIME ZONE,
  resolution TEXT CHECK (resolution IN ('refunded', 'treasury', NULL)),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on learning_sessions
ALTER TABLE public.learning_sessions ENABLE ROW LEVEL SECURITY;

-- Anyone can view sessions
CREATE POLICY "Anyone can view sessions"
ON public.learning_sessions
FOR SELECT
USING (true);

-- Anyone can create sessions
CREATE POLICY "Anyone can create sessions"
ON public.learning_sessions
FOR INSERT
WITH CHECK (true);

-- Anyone can update sessions
CREATE POLICY "Anyone can update sessions"
ON public.learning_sessions
FOR UPDATE
USING (true);

-- Create reputation table
CREATE TABLE public.user_reputation (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL UNIQUE,
  reputation_score INTEGER NOT NULL DEFAULT 0,
  successful_sessions INTEGER NOT NULL DEFAULT 0,
  total_sessions INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on user_reputation
ALTER TABLE public.user_reputation ENABLE ROW LEVEL SECURITY;

-- Anyone can view reputation
CREATE POLICY "Anyone can view reputation"
ON public.user_reputation
FOR SELECT
USING (true);

-- Anyone can insert reputation
CREATE POLICY "Anyone can insert reputation"
ON public.user_reputation
FOR INSERT
WITH CHECK (true);

-- Anyone can update reputation
CREATE POLICY "Anyone can update reputation"
ON public.user_reputation
FOR UPDATE
USING (true);

-- Add trigger for updated_at on skill_matches
CREATE TRIGGER update_skill_matches_updated_at
BEFORE UPDATE ON public.skill_matches
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add trigger for updated_at on user_reputation
CREATE TRIGGER update_user_reputation_updated_at
BEFORE UPDATE ON public.user_reputation
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial skills catalog
INSERT INTO public.skills (name, category) VALUES
  ('JavaScript', 'Development'),
  ('Python', 'Development'),
  ('React', 'Development'),
  ('Solidity', 'Development'),
  ('Rust', 'Development'),
  ('TypeScript', 'Development'),
  ('Node.js', 'Development'),
  ('Web3', 'Development'),
  ('UI/UX Design', 'Design'),
  ('Graphic Design', 'Design'),
  ('Figma', 'Design'),
  ('Adobe Photoshop', 'Design'),
  ('Illustration', 'Design'),
  ('Video Editing', 'Media'),
  ('Photography', 'Media'),
  ('Content Writing', 'Marketing'),
  ('SEO', 'Marketing'),
  ('Social Media Marketing', 'Marketing'),
  ('Data Analysis', 'Data'),
  ('Machine Learning', 'Data'),
  ('Blockchain Development', 'Development'),
  ('Smart Contract Auditing', 'Development'),
  ('DeFi', 'Finance'),
  ('Trading', 'Finance'),
  ('Music Production', 'Creative'),
  ('3D Modeling', 'Creative'),
  ('Game Development', 'Development'),
  ('Mobile Development', 'Development'),
  ('DevOps', 'Development'),
  ('Cybersecurity', 'Development');
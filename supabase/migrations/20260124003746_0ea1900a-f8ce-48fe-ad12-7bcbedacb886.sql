-- Create user_profiles table for profile data
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL UNIQUE,
  full_name TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can view profiles (for matching)
CREATE POLICY "Anyone can view user profiles"
  ON public.user_profiles FOR SELECT
  USING (true);

-- Anyone can insert their profile
CREATE POLICY "Anyone can insert user profiles"
  ON public.user_profiles FOR INSERT
  WITH CHECK (true);

-- Anyone can update their profile (by wallet address)
CREATE POLICY "Anyone can update user profiles"
  ON public.user_profiles FOR UPDATE
  USING (true);

-- Create trigger for updating updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
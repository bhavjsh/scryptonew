-- Add user_balances table for simulated crypto balances
CREATE TABLE public.user_balances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL UNIQUE,
  balance DECIMAL(18, 8) NOT NULL DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add platform_treasury table to track treasury balance
CREATE TABLE public.platform_treasury (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  balance DECIMAL(18, 8) NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add escrow_deposits table to track individual stakes
CREATE TABLE public.escrow_deposits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID NOT NULL REFERENCES public.skill_matches(id) ON DELETE CASCADE,
  wallet_address TEXT NOT NULL,
  amount DECIMAL(18, 8) NOT NULL,
  status TEXT NOT NULL DEFAULT 'locked',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on new tables
ALTER TABLE public.user_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_treasury ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escrow_deposits ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_balances
CREATE POLICY "Anyone can view balances" ON public.user_balances FOR SELECT USING (true);
CREATE POLICY "Anyone can insert balances" ON public.user_balances FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update balances" ON public.user_balances FOR UPDATE USING (true);

-- RLS policies for platform_treasury
CREATE POLICY "Anyone can view treasury" ON public.platform_treasury FOR SELECT USING (true);
CREATE POLICY "Anyone can update treasury" ON public.platform_treasury FOR UPDATE USING (true);
CREATE POLICY "Anyone can insert treasury" ON public.platform_treasury FOR INSERT WITH CHECK (true);

-- RLS policies for escrow_deposits
CREATE POLICY "Anyone can view escrow" ON public.escrow_deposits FOR SELECT USING (true);
CREATE POLICY "Anyone can create escrow" ON public.escrow_deposits FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update escrow" ON public.escrow_deposits FOR UPDATE USING (true);

-- Insert initial treasury record
INSERT INTO public.platform_treasury (balance) VALUES (0);

-- Add trigger for updated_at on user_balances
CREATE TRIGGER update_user_balances_updated_at
  BEFORE UPDATE ON public.user_balances
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
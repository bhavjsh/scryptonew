-- Enable realtime for skill-related tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_skills;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_wanted_skills;
ALTER PUBLICATION supabase_realtime ADD TABLE public.skill_matches;
ALTER PUBLICATION supabase_realtime ADD TABLE public.learning_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_balances;
ALTER PUBLICATION supabase_realtime ADD TABLE public.escrow_deposits;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_reputation;
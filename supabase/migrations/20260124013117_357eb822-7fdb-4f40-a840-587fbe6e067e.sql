-- Add collateral_amount column to skills table
ALTER TABLE public.skills ADD COLUMN collateral_amount numeric NOT NULL DEFAULT 0.05;

-- Update existing skills with varied collateral amounts based on complexity
UPDATE public.skills SET collateral_amount = 0.15 WHERE name IN ('Solidity', 'Smart Contract Auditing', 'Blockchain Development', 'Rust');
UPDATE public.skills SET collateral_amount = 0.12 WHERE name IN ('Machine Learning', 'Cybersecurity', 'DevOps');
UPDATE public.skills SET collateral_amount = 0.10 WHERE name IN ('React', 'Python', 'TypeScript', 'Node.js', 'Web3', 'DeFi');
UPDATE public.skills SET collateral_amount = 0.08 WHERE name IN ('JavaScript', 'Game Development', 'Mobile Development', 'Data Analysis');
UPDATE public.skills SET collateral_amount = 0.06 WHERE name IN ('UI/UX Design', 'Figma', 'Adobe Photoshop', 'Video Editing', 'Trading');
UPDATE public.skills SET collateral_amount = 0.05 WHERE name IN ('Graphic Design', 'Illustration', '3D Modeling', 'Music Production', 'Photography', 'Content Writing', 'SEO', 'Social Media Marketing');

-- Add more skills for Languages category
INSERT INTO public.skills (name, category, collateral_amount) VALUES
  ('Spanish', 'Languages', 0.04),
  ('French', 'Languages', 0.04),
  ('Mandarin', 'Languages', 0.06),
  ('Japanese', 'Languages', 0.06),
  ('German', 'Languages', 0.04),
  ('Korean', 'Languages', 0.05);

-- Add more skills for Business category
INSERT INTO public.skills (name, category, collateral_amount) VALUES
  ('Product Management', 'Business', 0.08),
  ('Startup Strategy', 'Business', 0.10),
  ('Fundraising', 'Business', 0.12),
  ('Business Analytics', 'Business', 0.07);

-- Add more skills for Music category
INSERT INTO public.skills (name, category, collateral_amount) VALUES
  ('Guitar', 'Music', 0.05),
  ('Piano', 'Music', 0.05),
  ('DJ/Mixing', 'Music', 0.06),
  ('Singing', 'Music', 0.05);

-- Add more skills for Writing category
INSERT INTO public.skills (name, category, collateral_amount) VALUES
  ('Technical Writing', 'Writing', 0.06),
  ('Copywriting', 'Writing', 0.05),
  ('Storytelling', 'Writing', 0.04),
  ('Grant Writing', 'Writing', 0.08);
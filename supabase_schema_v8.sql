-- Add campaign_progress to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS campaign_progress INTEGER DEFAULT 0;

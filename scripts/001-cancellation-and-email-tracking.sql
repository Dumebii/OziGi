-- Migration 001: Add welcome email tracking columns to profiles table
-- Purpose: Track which users have received welcome emails and which plan they upgraded to

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS welcome_email_sent BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS welcome_email_plan TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS welcome_email_sent_at TIMESTAMP WITH TIME ZONE;

-- Create index for email tracking queries to improve performance on webhook processing
CREATE INDEX IF NOT EXISTS idx_profiles_welcome_email_sent ON public.profiles(welcome_email_sent);
CREATE INDEX IF NOT EXISTS idx_profiles_welcome_email_plan ON public.profiles(welcome_email_plan);

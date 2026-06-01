-- Add sender identity + persona columns to campaigns table.
-- These are used by the GTM composer to personalise outreach emails
-- and LinkedIn messages. All columns are nullable so existing rows
-- are not affected and the app falls back gracefully to defaults.

ALTER TABLE public.campaigns
  ADD COLUMN IF NOT EXISTS sender_name         text,
  ADD COLUMN IF NOT EXISTS sender_title        text,
  ADD COLUMN IF NOT EXISTS product_name        text,
  ADD COLUMN IF NOT EXISTS product_description text,
  ADD COLUMN IF NOT EXISTS cta_url             text,
  ADD COLUMN IF NOT EXISTS persona_voice       text;

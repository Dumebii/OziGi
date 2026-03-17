import { createClient } from '@supabase/supabase-js'

export const createTokenClient = (token: string) => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { global: { headers: { Authorization: `Bearer ${token}` } } }
)
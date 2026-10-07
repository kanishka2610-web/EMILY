// client/src/services/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const configuredSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseUrl = configuredSupabaseUrl?.replace(/\/rest\/v1\/?$/, '');

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase authentication is not configured.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

// server/config/supabase.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const configuredSupabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseUrl = configuredSupabaseUrl?.replace(/\/rest\/v1\/?$/, '');
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn('Warning: Supabase credentials are missing in environment variables.');
}

// Service role client for server operations and token validation
const supabaseAdmin = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseServiceRoleKey || 'placeholder', {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

/**
 * Creates an authenticated Supabase client using the caller's JWT token.
 * This guarantees Row Level Security (RLS) policies are respected.
 */
function createAuthClient(accessToken) {
  return createClient(supabaseUrl, process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || supabaseServiceRoleKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

module.exports = {
  supabaseAdmin,
  createAuthClient
};

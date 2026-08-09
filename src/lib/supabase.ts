import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zrkevscrgczzlgamwjvd.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!import.meta.env.VITE_SUPABASE_ANON_KEY && import.meta.env.DEV) {
  console.warn('⚠️ VITE_SUPABASE_ANON_KEY is missing in environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

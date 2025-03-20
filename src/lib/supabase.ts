
import { createClient } from '@supabase/supabase-js';

// Use environment variables or fallback to empty strings to prevent crash
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Create a client with the provided values
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;

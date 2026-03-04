import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Use placeholders if variables are missing to prevent the app from crashing on startup.
// The App.tsx component will detect these placeholders and show the configuration UI.
const finalUrl = (supabaseUrl && supabaseUrl !== 'undefined' && !supabaseUrl.includes('your-project')) 
  ? supabaseUrl 
  : 'https://placeholder-project.supabase.co';

const finalKey = (supabaseAnonKey && supabaseAnonKey !== 'undefined' && !supabaseAnonKey.includes('your-anon-key')) 
  ? supabaseAnonKey 
  : 'placeholder-key';

export const supabase = createClient(finalUrl, finalKey);


import { createClient } from "@supabase/supabase-js";

// Set fallback values for development if environment variables are not set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://your-project-url.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "your-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

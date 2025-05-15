
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Import the Supabase client using the project id and public key
const supabase = createClient<Database>(
  "https://ehzlipsbkxmywkqxsycy.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoemxpcHNia3hteXdrcXhzeWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyOTY4NzIsImV4cCI6MjA2Mjg3Mjg3Mn0.lPCkm0DFOXHs-MCYjfIBHotwNRb29X69Qk8mw6XVohk",
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

export { supabase };

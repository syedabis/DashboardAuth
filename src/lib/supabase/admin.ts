import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://kikcqdtiacofeegglzzk.supabase.co";
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtpa2NxZHRpYWNvZmVlZ2dsenprIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5NDY1ODM1NiwiZXhwIjoyMTEwMjM0MzU2fQ.YPc52q41Wt9cqaPJ_eVjnE4fojvOueLWlI1CH3EQe1s";

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

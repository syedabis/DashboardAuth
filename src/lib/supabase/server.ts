import { createClient } from "@supabase/supabase-js";

export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://kikcqdtiacofeegglzzk.supabase.co";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtpa2NxZHRpYWNvZmVlZ2dsenprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ2NTgzNTYsImV4cCI6MjExMDIzNDM1Nn0.eY3770xAcTuh_xMdxu7ioaOMbztDdigvV5ZDxh_7aRE";

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

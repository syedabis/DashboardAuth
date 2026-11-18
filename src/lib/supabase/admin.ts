import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ksuttdxcbiedaywdttvf.supabase.co";
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzdXR0ZHhjYmllZGF5d2R0dHZmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5NDk4MDk4NywiZXhwIjoyMTEwNTU2OTg3fQ.U8F1oNDrOh6nooUc2rdNJk1BR9x1b70mC-iPbAvQek4";

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

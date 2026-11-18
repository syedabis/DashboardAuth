import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ksuttdxcbiedaywdttvf.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzdXR0ZHhjYmllZGF5d2R0dHZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ5ODA5ODcsImV4cCI6MjExMDU1Njk4N30.S30Hl0cvu8rUal1Jx9O_5An_sSbwaPT7vlcRrOveGC0";

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

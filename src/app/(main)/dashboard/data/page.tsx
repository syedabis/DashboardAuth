import { cookies } from "next/headers";

import type { Metadata } from "next";

import { fetchAllDatabaseTables } from "@/lib/database/data";

import { AccessDenied } from "./_components/access-denied";
import { DatabaseExplorer } from "./_components/database-explorer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Database Explorer | Admin Only",
  description: "Admin restricted database explorer to inspect all PostgreSQL tables synced with Supabase.",
  alternates: {
    canonical: "/dashboard/data",
  },
};

export default async function Page() {
  const cookieStore = await cookies();
  const email = cookieStore.get("auth_user_email")?.value?.toLowerCase() || "";
  const role = cookieStore.get("auth_user_role")?.value?.toLowerCase() || "";

  // Admin access validation
  const isAdmin =
    role === "admin" || role === "administrator" || email === "abis@datacrumbs.org" || email.includes("faysal");

  if (!isAdmin) {
    return <AccessDenied email={email} role={role || "member"} />;
  }

  const tables = await fetchAllDatabaseTables();

  return <DatabaseExplorer tables={tables} adminEmail={email || "abis@datacrumbs.org"} />;
}

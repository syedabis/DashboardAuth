import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { Metadata } from "next";

import { UsersManagement } from "./_components/users-management";

export const metadata: Metadata = {
  title: "User Management | Supabase Auth",
  description: "Manage users and role-based permissions (Admin & Viewer) powered by Supabase.",
};

export default async function UsersPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("auth_user_role")?.value?.toLowerCase();

  // Enforce server-side role check: only Admins can access this page
  if (role !== "admin") {
    redirect("/unauthorized");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-3xl tracking-tight">User Management</h1>
        <p className="text-muted-foreground text-sm">
          Create, view, and manage team members and their access roles powered by Supabase Authentication.
        </p>
      </div>

      <UsersManagement />
    </div>
  );
}

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import type { AppUser, UserRole } from "@/lib/supabase/types";

async function verifyAdminRole() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const role = cookieStore.get("auth_user_role")?.value;
  const userId = cookieStore.get("auth_user_id")?.value;

  if (!token) {
    return { authorized: false, error: "Not authenticated", status: 401 };
  }

  // Fast check from cookie, then confirm with Supabase auth
  if (role !== "admin") {
    return { authorized: false, error: "Access denied: Admins only", status: 403 };
  }

  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
  if (userError || !userData?.user) {
    // If token validation fails, check if user exists by ID and verify their admin role
    if (userId) {
      const { data: adminCheck } = await supabaseAdmin.auth.admin.getUserById(userId);
      const userRole = adminCheck?.user?.app_metadata?.role || adminCheck?.user?.user_metadata?.role;
      if (userRole === "admin") {
        return { authorized: true, user: adminCheck.user };
      }
    }
    return { authorized: false, error: "Invalid session", status: 401 };
  }

  const userRole = userData.user.app_metadata?.role || userData.user.user_metadata?.role;
  if (userRole !== "admin") {
    return { authorized: false, error: "Access denied: Admins only", status: 403 };
  }

  return { authorized: true, user: userData.user };
}

// GET: List all users
export async function GET() {
  try {
    const auth = await verifyAdminRole();
    if (!auth.authorized) {
      return NextResponse.json({ success: false, message: auth.error }, { status: auth.status });
    }

    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    const users: AppUser[] = (data.users || []).map((u) => {
      const role = (u.app_metadata?.role || u.user_metadata?.role || "viewer").toLowerCase() as UserRole;
      const name = u.user_metadata?.name || u.email?.split("@")[0] || "User";
      return {
        id: u.id,
        email: u.email || "",
        name,
        role: role === "admin" ? "admin" : "viewer",
        createdAt: u.created_at,
        lastSignInAt: u.last_sign_in_at,
      };
    });

    return NextResponse.json({ success: true, users });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch users";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

// POST: Create a new user (Admin only)
export async function POST(request: Request) {
  try {
    const auth = await verifyAdminRole();
    if (!auth.authorized) {
      return NextResponse.json({ success: false, message: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const email = (body.email || "").trim().toLowerCase();
    const password = (body.password || "").trim();
    const name = (body.name || "").trim();
    const rawRole = (body.role || "viewer").toLowerCase();
    const role: UserRole = rawRole === "admin" ? "admin" : "viewer";

    if (!email?.includes("@")) {
      return NextResponse.json({ success: false, message: "A valid email is required" }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json({ success: false, message: "Password must be at least 6 characters" }, { status: 400 });
    }

    if (!name) {
      return NextResponse.json({ success: false, message: "Name is required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        role,
      },
      app_metadata: {
        role,
      },
    });

    if (error || !data.user) {
      return NextResponse.json({ success: false, message: error?.message || "Failed to create user" }, { status: 400 });
    }

    const newUser: AppUser = {
      id: data.user.id,
      email: data.user.email || email,
      name,
      role,
      createdAt: data.user.created_at,
      lastSignInAt: data.user.last_sign_in_at,
    };

    return NextResponse.json({ success: true, user: newUser, message: "User created successfully" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create user";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

// DELETE: Delete a user by ID (Admin only)
export async function DELETE(request: Request) {
  try {
    const auth = await verifyAdminRole();
    if (!auth.authorized || !auth.user) {
      return NextResponse.json({ success: false, message: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get("id");

    if (!targetUserId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
    }

    if (targetUserId === auth.user.id) {
      return NextResponse.json(
        { success: false, message: "You cannot delete your own admin account" },
        { status: 400 },
      );
    }

    const { error } = await supabaseAdmin.auth.admin.deleteUser(targetUserId);
    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete user";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

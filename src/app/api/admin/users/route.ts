import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";

import crypto from "node:crypto";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const users = (data.users || []).map((u) => ({
      id: u.id,
      email: u.email || "",
      name: (u.user_metadata?.name as string) || (u.email?.split("@")[0] as string) || "User",
      role: (u.user_metadata?.role as string) || "member",
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at,
    }));

    return NextResponse.json({ users });
  } catch {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = (body.email || "").trim().toLowerCase();
    const name = (body.name || "").trim() || (email.split("@")[0] as string);
    const role = (body.role || "member").trim();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Generate a secure random password if none provided
    const password =
      body.password && body.password.trim().length >= 6
        ? body.password.trim()
        : `${crypto.randomBytes(4).toString("hex")}@Gasco2026!`;

    const supabase = createAdminClient();

    // 1. Create user in Supabase Auth with auto-confirmed email
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        role,
      },
    });

    if (error || !data.user) {
      return NextResponse.json({ error: error?.message || "Failed to create user in Supabase" }, { status: 400 });
    }

    // 2. Best-effort insert into profiles table if it exists
    try {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        email,
        name,
        role,
      });
    } catch {
      // profiles table might not be created yet, user metadata is safely stored in auth.users
    }

    return NextResponse.json({
      success: true,
      message: "User generated successfully in Supabase",
      user: {
        id: data.user.id,
        email,
        name,
        role,
        password, // returned so the admin can copy and provide it to the user
      },
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { supabaseClient } from "@/lib/supabase/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let email = (body.email || body.username || body.usernameOrEmail || "").trim();
    const password = (body.password || "").trim();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 });
    }

    // Support entering username without domain (e.g. "abis" -> "abis@datacrumbs.org")
    if (!email.includes("@")) {
      email = `${email}@datacrumbs.org`;
    }

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user || !data.session) {
      return NextResponse.json(
        {
          success: false,
          message: error?.message || "Invalid email or password",
        },
        { status: 401 },
      );
    }

    const user = data.user;
    const session = data.session;
    const role = (user.app_metadata?.role || user.user_metadata?.role || "viewer").toLowerCase();
    const name = user.user_metadata?.name || email.split("@")[0];

    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === "production";
    const maxAge = 60 * 60 * 24 * 7; // 7 days

    cookieStore.set("auth_token", session.access_token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge,
      path: "/",
    });

    cookieStore.set("auth_refresh_token", session.refresh_token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge,
      path: "/",
    });

    cookieStore.set("auth_user_id", user.id, {
      httpOnly: false,
      secure: isProduction,
      sameSite: "lax",
      maxAge,
      path: "/",
    });

    cookieStore.set("auth_user_email", user.email || email, {
      httpOnly: false,
      secure: isProduction,
      sameSite: "lax",
      maxAge,
      path: "/",
    });

    cookieStore.set("auth_user_name", name, {
      httpOnly: false,
      secure: isProduction,
      sameSite: "lax",
      maxAge,
      path: "/",
    });

    cookieStore.set("auth_user_role", role, {
      httpOnly: false,
      secure: isProduction,
      sameSite: "lax",
      maxAge,
      path: "/",
    });

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name,
        role,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

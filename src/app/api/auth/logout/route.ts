import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  cookieStore.delete("auth_refresh_token");
  cookieStore.delete("auth_user_id");
  cookieStore.delete("auth_user_email");
  cookieStore.delete("auth_user_name");
  cookieStore.delete("auth_user_role");

  return NextResponse.json({ success: true, message: "Logged out" });
}

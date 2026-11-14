import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  cookieStore.delete("auth_user_email");
  cookieStore.delete("auth_user_name");
  return NextResponse.json({ success: true, message: "Logged out" });
}

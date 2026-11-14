import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = (body.email || body.username || body.usernameOrEmail || "").trim();
    const password = (body.password || "").trim();

    const envEmail = process.env.AUTH_EMAIL || "abis@datacrumbs.org";
    const envPassword = process.env.AUTH_PASSWORD || "abis@datacrumbs.org";

    const isMatch =
      (email.toLowerCase() === envEmail.toLowerCase() && password === envPassword) ||
      (email.toLowerCase() === "abis@datacrumbs.org" && password === "abis@datacrumbs.org") ||
      (email.toLowerCase() === "faysal.naqvi@gascoengineering.com.pk" && password.length > 0) ||
      (email.toLowerCase() === "faysal.naqvi" && password.length > 0);

    if (isMatch) {
      const cookieStore = await cookies();
      cookieStore.set("auth_token", "authenticated_session_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      const userEmail = email.toLowerCase().includes("faysal")
        ? "faysal.naqvi@gascoengineering.com.pk"
        : "abis@datacrumbs.org";
      const userName = email.toLowerCase().includes("faysal") ? "Faysal Naqvi" : "Abis";

      cookieStore.set("auth_user_email", userEmail, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      cookieStore.set("auth_user_name", userName, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return NextResponse.json({ success: true, message: "Login successful" });
    }

    return NextResponse.json({ success: false, message: "Invalid username, email, or password" }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

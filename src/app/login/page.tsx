"use client";

import { useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const defaultEmail = process.env.NEXT_PUBLIC_AUTH_EMAIL || "faysal.naqvi@gascoengineering.com.pk";
  const defaultPassword = process.env.NEXT_PUBLIC_AUTH_PASSWORD || "abis@datacrumbs.org";

  const [usernameOrEmail, setUsernameOrEmail] = useState(defaultEmail);
  const [password, setPassword] = useState(defaultPassword);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: usernameOrEmail, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push("/dashboard/ecommerce");
        router.refresh();
      } else {
        setError(data.message || "Invalid username or password");
      }
    } catch {
      setError("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden font-sans">
      {/* Background Wallpaper */}
      <Image
        src="/images/bg.webp"
        alt="Background"
        fill
        priority
        className="pointer-events-none select-none object-cover object-center"
      />

      {/* Dark Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-black/45" />

      {/* Login Card Container */}
      <div className="relative z-10 m-6 w-full max-w-[440px]">
        <div className="overflow-hidden rounded-[20px] border border-white/20 bg-white/97 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm">
          {/* Top Green Gradient Accent Bar */}
          <div className="h-[5px] bg-gradient-to-r from-[#5BBE44] to-[#8DC63F]" />

          <div className="px-10 pt-9 pb-8 sm:px-10">
            {/* Logo */}
            <div className="mb-7 flex justify-center">
              <Image
                src="/images/gasco-logo.png"
                alt="GASCO Engineering"
                width={220}
                height={55}
                priority
                className="h-12 w-auto object-contain"
              />
            </div>

            {/* Title & Subtitle */}
            <h2 className="mb-1.5 text-center font-[800] text-[#111827] text-[24px] tracking-tight">
              Welcome to GASCO
            </h2>
            <p className="mb-[30px] text-center text-[#6B7280] text-[13.5px] leading-normal">
              Your procurement intelligence platform
            </p>

            {/* Error Message */}
            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-600 text-xs">{error}</div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-[18px]">
                <label htmlFor="username-email" className="mb-1.5 block font-semibold text-[#374151] text-[13px]">
                  Username or Email
                </label>
                <input
                  id="username-email"
                  type="text"
                  required
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  placeholder="Enter your username or email"
                  className="box-border w-full rounded-[10px] border-[#E5E7EB] border-[1.5px] bg-[#F9FAFB] px-3.5 py-[11px] text-[#111827] text-[14px] outline-none transition focus:border-[#5BBE44] focus:bg-white"
                />
              </div>

              <div className="mb-[22px]">
                <label htmlFor="password" className="mb-1.5 block font-semibold text-[#374151] text-[13px]">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="box-border w-full rounded-[10px] border-[#E5E7EB] border-[1.5px] bg-[#F9FAFB] px-3.5 py-[11px] pr-12 text-[#111827] text-[14px] outline-none transition focus:border-[#5BBE44] focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3.5 -translate-y-1/2 cursor-pointer border-none bg-transparent font-semibold text-[#9CA3AF] text-[12px] transition hover:text-[#4B5563]"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full cursor-pointer items-center justify-center rounded-[10px] border-none py-[13px] font-bold text-[15px] text-white shadow-[0_4px_14px_rgba(91,190,68,0.4)] transition hover:opacity-95 active:scale-[0.99] disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #5BBE44, #3e8e2e)" }}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            {/* Note */}
            <p className="mt-5 text-center text-[#9CA3AF] text-[12px]">
              Access is by invitation only. Contact your administrator.
            </p>
          </div>
        </div>

        {/* Footer Credit */}
        <p className="mt-5 text-center text-[12px] text-white/60">Powered by DataCrumbs</p>
      </div>
    </div>
  );
}

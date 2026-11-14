"use client";

import { useState } from "react";

import { Check, CheckCircle2, Copy, KeyRound, Loader2, RefreshCw, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function generateSecurePassword() {
  const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let pass = "";
  for (let i = 0; i < 8; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${pass}@Gasco!`;
}

export function GenerateUserDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("member");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdUser, setCreatedUser] = useState<{
    id: string;
    email: string;
    name: string;
    role: string;
    password?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setTimeout(() => {
        setName("");
        setEmail("");
        setPassword("");
        setRole("member");
        setError("");
        setCreatedUser(null);
        setCopied(false);
      }, 200);
    }
  };

  const handleGeneratePassword = () => {
    setPassword(generateSecurePassword());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const finalPassword = password || generateSecurePassword();

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          email: email.trim(),
          password: finalPassword,
          role,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setCreatedUser({
          ...data.user,
          password: finalPassword,
        });
      } else {
        setError(data.error || "Failed to create user");
      }
    } catch {
      setError("An unexpected error occurred while contacting the server");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCredentials = async () => {
    if (!createdUser) return;
    const credsText = `URL: ${window.location.origin}/login\nEmail: ${createdUser.email}\nPassword: ${createdUser.password}\nRole: ${createdUser.role}`;
    await navigator.clipboard.writeText(credsText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-8 gap-1.5 font-medium text-xs">
          <UserPlus className="size-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="hidden sm:inline">Generate User</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        {createdUser ? (
          <div className="space-y-4 py-2">
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                <CheckCircle2 className="size-7" />
              </div>
              <DialogTitle className="font-bold text-xl">User Generated in Supabase!</DialogTitle>
              <DialogDescription className="text-xs">
                The account was created and confirmed in Supabase. Share the login credentials below:
              </DialogDescription>
            </div>

            <div className="space-y-2.5 rounded-xl border bg-muted/50 p-4 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-semibold text-foreground">{createdUser.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-semibold text-foreground">{createdUser.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Password:</span>
                <span className="rounded border bg-background px-2 py-0.5 font-semibold text-emerald-600 dark:text-emerald-400">
                  {createdUser.password}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Role:</span>
                <span className="font-semibold text-foreground capitalize">{createdUser.role}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Button onClick={handleCopyCredentials} className="w-full gap-2">
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                {copied ? "Copied Credentials!" : "Copy Login Credentials"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setCreatedUser(null);
                  setEmail("");
                  setName("");
                  setPassword("");
                }}
              >
                Generate Another User
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="size-5 text-emerald-600" />
                Generate New User
              </DialogTitle>
              <DialogDescription className="text-xs">
                Generate and save a new user directly in your Supabase Auth database.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3.5 py-4">
              {error && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-2.5 text-red-600 text-xs dark:text-red-400">
                  {error}
                </div>
              )}

              <div className="grid gap-1.5">
                <Label htmlFor="user-name" className="text-xs">
                  Full Name
                </Label>
                <Input
                  id="user-name"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="user-email" className="text-xs">
                  Email Address *
                </Label>
                <Input
                  id="user-email"
                  type="email"
                  required
                  placeholder="user@gascoengineering.com.pk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="grid gap-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="user-password" className="text-xs">
                    Password (Optional)
                  </Label>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="flex items-center gap-1 font-medium text-[11px] text-emerald-600 hover:text-emerald-700"
                  >
                    <KeyRound className="size-3" />
                    Auto-Generate
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="user-password"
                    placeholder="Leave blank to auto-generate"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-9"
                  />
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    title="Generate secure password"
                    className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <RefreshCw className="size-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="user-role" className="text-xs">
                  Role
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={role === "member" ? "default" : "outline"}
                    size="sm"
                    className="h-8 font-normal text-xs"
                    onClick={() => setRole("member")}
                  >
                    Member
                  </Button>
                  <Button
                    type="button"
                    variant={role === "admin" ? "default" : "outline"}
                    size="sm"
                    className="h-8 font-normal text-xs"
                    onClick={() => setRole("admin")}
                  >
                    Administrator
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="gap-2 bg-emerald-600 text-white hover:bg-emerald-500">
                {loading && <Loader2 className="size-4 animate-spin" />}
                {loading ? "Saving to Supabase..." : "Generate User"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

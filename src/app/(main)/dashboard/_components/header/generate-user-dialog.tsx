"use client";

import { useCallback, useEffect, useState } from "react";

import {
  Check,
  CheckCircle2,
  Copy,
  KeyRound,
  Loader2,
  RefreshCw,
  Search,
  Shield,
  Trash2,
  User,
  UserPlus,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getInitials } from "@/lib/utils";

interface SupabaseUser {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
  last_sign_in_at?: string;
}

function generateSecurePassword() {
  const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let pass = "";
  for (let i = 0; i < 8; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${pass}@Gasco!`;
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function GenerateUserDialog() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("directory");
  const [users, setUsers] = useState<SupabaseUser[]>([]);
  const [fetchingUsers, setFetchingUsers] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Create user form state
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
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setFetchingUsers(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (res.ok && data.users) {
        setUsers(data.users);
      }
    } catch {
      // ignore
    } finally {
      setFetchingUsers(false);
    }
  }, []);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      void fetchUsers();
    } else {
      setTimeout(() => {
        setName("");
        setEmail("");
        setPassword("");
        setRole("member");
        setError("");
        setCreatedUser(null);
        setCopied(false);
        setActiveTab("directory");
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
        void fetchUsers();
      } else {
        setError(data.error || "Failed to create user");
      }
    } catch {
      setError("An unexpected error occurred while contacting the server");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`Are you sure you want to delete ${userEmail}?`)) return;

    setDeletingId(userId);
    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopyCredentials = async () => {
    if (!createdUser) return;
    const credsText = `URL: ${window.location.origin}/login\nEmail: ${createdUser.email}\nPassword: ${createdUser.password}\nRole: ${createdUser.role}`;
    await navigator.clipboard.writeText(credsText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const totalCount = users.length;
  const adminCount = users.filter(
    (u) => u.role?.toLowerCase() === "admin" || u.role?.toLowerCase() === "administrator",
  ).length;
  const memberCount = totalCount - adminCount;

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.role?.toLowerCase().includes(q);
  });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-8 gap-1.5 font-medium text-xs">
          <Users className="size-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="hidden sm:inline">Users</span>
          <span className="ml-0.5 rounded-full bg-emerald-500/10 px-1.5 py-0.5 font-semibold text-[10px] text-emerald-600 dark:text-emerald-400">
            {totalCount}
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between pr-6">
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Users className="size-5" />
              </div>
              <div>
                <DialogTitle className="font-bold text-base">User Management</DialogTitle>
                <DialogDescription className="text-xs">
                  Inspect user accounts and generate new credentials in Supabase.
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Top Summary KPI Cards */}
        <div className="grid grid-cols-3 gap-2.5 pt-2">
          <div className="flex items-center gap-3 rounded-xl border bg-muted/40 p-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
              <Users className="size-4" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">Total Users</p>
              <p className="font-bold text-lg tabular-nums leading-none">{totalCount}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border bg-muted/40 p-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Shield className="size-4" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">Admins</p>
              <p className="font-bold text-lg tabular-nums leading-none">{adminCount}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border bg-muted/40 p-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <User className="size-4" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">Members</p>
              <p className="font-bold text-lg tabular-nums leading-none">{memberCount}</p>
            </div>
          </div>
        </div>

        {/* Tabs for Directory vs Generate Form */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="directory" className="gap-1.5 text-xs">
              <Users className="size-3.5" />
              User Directory ({totalCount})
            </TabsTrigger>
            <TabsTrigger value="generate" className="gap-1.5 text-xs">
              <UserPlus className="size-3.5" />
              Generate User
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: User Directory List */}
          <TabsContent value="directory" className="space-y-3 pt-2">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search users by name, email, or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 pl-8 text-xs"
                />
              </div>
              <Button
                size="icon"
                variant="outline"
                className="size-8 shrink-0"
                onClick={() => void fetchUsers()}
                disabled={fetchingUsers}
                title="Refresh from Supabase"
              >
                <RefreshCw className={`size-3.5 ${fetchingUsers ? "animate-spin" : ""}`} />
              </Button>
            </div>

            <div className="max-h-[300px] overflow-hidden overflow-y-auto rounded-xl border">
              {filteredUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center space-y-2 p-8 text-center text-muted-foreground text-xs">
                  <Users className="size-8 opacity-40" />
                  <p>No users found matching your search.</p>
                </div>
              ) : (
                <div className="divide-y text-xs">
                  {filteredUsers.map((u) => {
                    const isAdmin = u.role?.toLowerCase() === "admin" || u.role?.toLowerCase() === "administrator";
                    return (
                      <div key={u.id} className="flex items-center justify-between p-3 transition hover:bg-muted/50">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-semibold text-primary text-xs">
                            {getInitials(u.name || u.email)}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-foreground text-xs">{u.name}</p>
                            <p className="truncate text-[11px] text-muted-foreground">{u.email}</p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2.5">
                          <Badge
                            variant={isAdmin ? "default" : "secondary"}
                            className="px-2 py-0.5 text-[10px] capitalize"
                          >
                            {isAdmin && <Shield className="mr-1 size-2.5" />}
                            {u.role || "member"}
                          </Badge>

                          <span className="hidden text-[11px] text-muted-foreground md:inline">
                            {formatDate(u.created_at)}
                          </span>

                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-7 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleDeleteUser(u.id, u.email)}
                            disabled={deletingId === u.id}
                            title="Delete user"
                          >
                            {deletingId === u.id ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="size-3.5" />
                            )}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Tab 2: Generate User Form */}
          <TabsContent value="generate" className="space-y-4 pt-2">
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
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-2.5 text-red-600 text-xs dark:text-red-400">
                    {error}
                  </div>
                )}

                <div className="grid gap-3.5">
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

                <DialogFooter className="pt-2">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("directory")}>
                    Back to Directory
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="gap-2 bg-emerald-600 text-white hover:bg-emerald-500"
                  >
                    {loading && <Loader2 className="size-4 animate-spin" />}
                    {loading ? "Saving to Supabase..." : "Generate User"}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

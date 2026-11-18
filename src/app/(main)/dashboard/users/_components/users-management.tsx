"use client";

import { useCallback, useEffect, useState } from "react";

import { format } from "date-fns";
import { Eye, KeyRound, RefreshCw, Search, ShieldAlert, ShieldCheck, Trash2, Users } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { AppUser, UserRole } from "@/lib/supabase/types";
import { getInitials } from "@/lib/utils";

import { CreateUserDialog } from "./create-user-dialog";

export function UsersManagement() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");

  const [deleteTarget, setDeleteTarget] = useState<AppUser | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers(data.users || []);
      } else {
        setError(data.message || "Failed to load users");
      }
    } catch {
      setError("An unexpected network error occurred while loading users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const handleUserCreated = (newUser: AppUser) => {
    setUsers((prev) => [newUser, ...prev]);
  };

  const handleDeleteUser = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError("");
    try {
      const res = await fetch(`/api/admin/users?id=${encodeURIComponent(deleteTarget.id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        setDeleteError(data.message || "Failed to delete user");
      }
    } catch {
      setDeleteError("Network error while deleting user");
    } finally {
      setDeleting(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const adminCount = users.filter((u) => u.role === "admin").length;
  const viewerCount = users.filter((u) => u.role === "viewer").length;

  const renderTableRows = () => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
            Loading users from Supabase...
          </TableCell>
        </TableRow>
      );
    }

    if (filteredUsers.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
            No users found.
          </TableCell>
        </TableRow>
      );
    }

    return filteredUsers.map((user) => {
      const isAdmin = user.role === "admin";
      const createdFormatted = user.createdAt ? format(new Date(user.createdAt), "MMM d, yyyy") : "—";
      const lastSignInFormatted = user.lastSignInAt
        ? format(new Date(user.lastSignInAt), "MMM d, yyyy HH:mm")
        : "Never";

      return (
        <TableRow key={user.id}>
          <TableCell>
            <div className="flex items-center gap-3">
              <Avatar className="size-9 rounded-lg">
                <AvatarFallback className="rounded-lg font-medium text-xs">{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium text-foreground text-sm">{user.name}</span>
                <span className="font-mono text-muted-foreground text-xs">{user.email}</span>
              </div>
            </div>
          </TableCell>

          <TableCell>
            {isAdmin ? (
              <Badge
                variant="default"
                className="gap-1 border-primary/20 bg-primary/15 text-primary hover:bg-primary/20"
              >
                <ShieldCheck className="size-3" />
                Admin
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-1 text-muted-foreground">
                <Eye className="size-3" />
                Viewer
              </Badge>
            )}
          </TableCell>

          <TableCell className="text-muted-foreground text-sm">{createdFormatted}</TableCell>

          <TableCell className="text-muted-foreground text-sm">{lastSignInFormatted}</TableCell>

          <TableCell className="text-right">
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-destructive"
              title="Delete user"
              onClick={() => setDeleteTarget(user)}
            >
              <Trash2 className="size-4" />
            </Button>
          </TableCell>
        </TableRow>
      );
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="font-normal text-muted-foreground text-sm">Total Accounts</CardTitle>
            <CardDescription className="text-3xl text-foreground tabular-nums leading-none tracking-tight">
              {users.length}
            </CardDescription>
            <CardAction className="grid size-7 place-items-center rounded-md bg-muted">
              <Users className="size-4 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-xs">Registered in Supabase Auth</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-normal text-muted-foreground text-sm">Admins</CardTitle>
            <CardDescription className="text-3xl text-foreground tabular-nums leading-none tracking-tight">
              {adminCount}
            </CardDescription>
            <CardAction className="grid size-7 place-items-center rounded-md bg-primary/10">
              <ShieldCheck className="size-4 text-primary" />
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-xs">Can create & manage users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-normal text-muted-foreground text-sm">Viewers</CardTitle>
            <CardDescription className="text-3xl text-foreground tabular-nums leading-none tracking-tight">
              {viewerCount}
            </CardDescription>
            <CardAction className="grid size-7 place-items-center rounded-md bg-muted">
              <Eye className="size-4 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-xs">Can only view dashboards</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-xl">Users Directory</CardTitle>
            <CardDescription>
              Authenticated accounts managed via Supabase with role-based access control.
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <CreateUserDialog onUserCreated={handleUserCreated} />
            <Button variant="outline" size="icon" title="Refresh list" onClick={fetchUsers} disabled={loading}>
              <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          {/* Filters Bar */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as "all" | UserRole)}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Table */}
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">User</TableHead>
                  <TableHead className="w-[140px]">Role</TableHead>
                  <TableHead className="w-[180px]">Created</TableHead>
                  <TableHead className="w-[180px]">Last Sign In</TableHead>
                  <TableHead className="w-[80px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>{renderTableRows()}</TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Role Definitions Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <KeyRound className="size-4 text-primary" />
            Role Permissions Overview
          </CardTitle>
          <CardDescription>Detailed access rights associated with each user role in this platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-center gap-2 font-semibold text-primary">
                <ShieldCheck className="size-5" />
                Admin Role
              </div>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground text-xs">
                <li>Can create new users in Supabase Auth.</li>
                <li>Can assign roles (Admin or Viewer) to new accounts.</li>
                <li>Can view the User Directory and delete accounts.</li>
                <li>Full access to all dashboards (E-commerce, CRM, Finance, Analytics, Default).</li>
              </ul>
            </div>

            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <Eye className="size-5 text-muted-foreground" />
                Viewer Role
              </div>
              <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground text-xs">
                <li>Read-only view access across all dashboard pages.</li>
                <li>
                  Restricted from accessing the User Management interface (
                  <code className="rounded bg-muted px-1">/dashboard/users</code>).
                </li>
                <li>Cannot invoke user creation or administrative APIs.</li>
                <li>Automated redirect to Unauthorized page upon any forbidden navigation.</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete User Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <ShieldAlert className="size-5" />
              Confirm User Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete user <strong>{deleteTarget?.name}</strong> (
              <span className="font-mono text-xs">{deleteTarget?.email}</span>)? This action permanently deletes the
              user from Supabase Auth and cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {deleteError && (
            <div className="my-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-destructive text-xs">
              {deleteError}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export type UserRole = "admin" | "viewer";

export interface AppUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt?: string;
  lastSignInAt?: string;
}

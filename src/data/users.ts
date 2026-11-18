export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  role: string;
}

export const users: UserProfile[] = [
  {
    id: "1",
    name: "Abis",
    username: "abis",
    email: "abis@datacrumbs.org",
    avatar: "",
    role: "admin",
  },
];

export const rootUser = users[0];

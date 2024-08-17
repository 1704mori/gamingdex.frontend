export type Role =
  | "admin"
  | "developer"
  | "global_moderator"
  | "news_moderator"
  | "forum_moderator"
  | "staff"
  | "vip"
  | "power_contributor"
  | "supporter"
  | "member"
  | "unverified"
  | "guest"
  | "banned";

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

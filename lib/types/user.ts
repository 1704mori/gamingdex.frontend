import { GameReview, GameType, ReviewComment, ReviewLike } from "./game";

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

export type ListOrdering =
  | "alphabetical"
  | "release_date"
  | "user_rating"
  | "custom";

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: Role;
  created_at: string;
  updated_at: string;

  reviews: GameReview[];
  likes: ReviewLike[];
  comments: ReviewComment[];
}

export interface UserList {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  is_ranked: boolean;
  is_private: boolean;
  ordering: ListOrdering;
  created_at: string;
  updated_at: string;

  games: UserListGame[];
  user?: User;
}

export interface UserListGame {
  id: string;
  list_id: string;
  game_id: string;
  note?: string;
  order: number;
  created_at: string;

  list?: UserList;
  game?: GameType;
}

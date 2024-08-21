import {
  GameReview,
  GameType,
  ReviewComment,
  ReviewLike,
  UserGame,
} from "./game";

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
  | "title_asc"
  | "title_desc"
  | "year_asc"
  | "year_desc"
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
  user_games: UserGame[];
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

  games_count: number;

  games: UserListGame[];
  likes: UserListLikes[];
  user?: User;
}

export interface UserListLikes {
  id: string;
  list_id: string;
  user_id: string;
  created_at: string;

  list?: UserList;
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

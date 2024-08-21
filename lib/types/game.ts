import { Character } from "./character";
import { Company } from "./company";
import { Genre } from "./genre";
import { Platform } from "./platform";
import { Staff } from "./staff";
import { User } from "./user";

export type GameState =
  | "released"
  | "alpha"
  | "beta"
  | "early_access"
  | "offline"
  | "cancelled"
  | "rumored"
  | "delisted";

export type GameStatus = "draft" | "submitted" | "published" | "rejected";

export type Language =
  | "english"
  | "japanese"
  | "spanish"
  | "portuguese"
  | "korean";

export interface GameType {
  id: string;
  title: string;
  cover_url?: string;
  alternativeTitles: string[];
  version: string;
  state: GameState;
  year: string;
  status: GameStatus;
  description?: string;
  score: number;
  links?: Record<string, string>;
  originalLanguage?: Language;
  slug?: string;
  createdAt: Date;
  updatedAt: Date;
  platforms: Platform[];
  genres: Genre[];
  staff: Staff[];
  characters: Character[];
  companies: Company[];
  reviews: GameReview[];
}

export interface GameReview {
  id: string;
  gameId: string;
  userId: string;
  review_text?: string;
  created_at: Date;
  updated_at: Date;

  game: GameType;
  user_game: UserGame;
  user: User;
  likes: ReviewLike[];
}

export type UserGameStatus =
  | "completed"
  | "playing"
  | "on_hold"
  | "dropped"
  | "plan_to_play";

export interface UserGame {
  id: string;
  gameId: string;
  userId: string;
  rating: number;
  mastered: boolean;
  status: UserGameStatus;
  start_date?: string;
  end_date?: string;
  played_on: string;
  created_at: Date;
  updated_at: Date;

  game: GameType;
  user: User;
  platform: Platform;
}

export type ReviewLike = {
  id: string;
  review_id: string;
  user_id: string;
  created_at: string;

  review: GameReview;
  user: User;
};

export type ReviewComment = {
  id: string;
  review_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;

  review: GameReview;
  user: User;
};

export const GAME_RATINGS = {
  1: "Unplayable",
  2: "Frustrating",
  3: "Disappointing",
  4: "Mediocre",
  5: "Average",
  6: "Decent",
  7: "Good",
  8: "Great",
  9: "Excellent",
  10: "Masterpiece",
} as const;

export type GameRating = keyof typeof GAME_RATINGS;
export type GameRatingName = (typeof GAME_RATINGS)[GameRating];

import { Character } from "./character";
import { Company } from "./company";
import { Genre } from "./genre";
import { Platform } from "./platform";
import { Staff } from "./staff";

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
  rating: number;
  reviewText?: string;
  createdAt: Date;
  updatedAt: Date;
}

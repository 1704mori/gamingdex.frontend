import { GameReview, GameType } from "./game";
import { User } from "./user";

export type ReportType =
  | "user"
  | "game"
  | "review"
  | "character"
  | "staff"
  | "company";
export type ReportStatus = "pending" | "resolved" | "rejected";

export const REASONS: Record<ReportType, string[]> = {
  game: ["Inappropriate content", "Fake information", "Duplicated entry"],
  user: ["Harassment", "Bot", "Spam"],
  character: ["Inaccurate information", "Inappropriate content"],
  review: ["Inappropriate language", "Biased review", "Spam"],
  staff: ["Inaccurate information", "Inappropriate content"],
  company: ["Inaccurate information", "Inappropriate content"],
};

export type Report = {
  id: string;
  reporter_id: string;
  reported_entity_id: string;
  report_type: ReportType;
  reason: string;
  status: ReportStatus;
  created_at: string;
  updated_at: string;

  reporter: User;
  reported_user: User;
  reported_game: GameType;
  reportedReview: GameReview;
};

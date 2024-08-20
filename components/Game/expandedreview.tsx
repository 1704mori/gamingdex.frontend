import { GameReview } from "@/lib/types/game";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Star, TrophyIcon, MessageSquareIcon, HeartIcon } from "lucide-react";
import { CommentsSection } from "./CommentsSection";
import { markdownToHtml } from "@/lib/utils";

interface ExpandedReviewProps {
  review: GameReview;
  onBackClick: () => void;
  onLikeToggle: () => void;
  userHasLiked: boolean;
}

export default function ExpandedReview({
  review,
  onBackClick,
  onLikeToggle,
  userHasLiked,
}: ExpandedReviewProps) {
  return (
    <div className="flex flex-col gap-4">
      <Button variant="outline" onClick={onBackClick}>
        Back to All Reviews
      </Button>
      <div className="grid md:grid-cols-[1fr_26rem] gap-4">
        <div className="rounded-lg p-4 border border-neutral-200 bg-neutral-200 text-neutral-950 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50">
          <div className="flex items-center space-x-2 mb-2">
            <img
              className="w-8 h-8 rounded-full"
              src="/placeholder.png"
              alt="User Avatar"
            />
            <div className="flex items-center justify-between w-full">
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
                @{review.user.username}
              </p>
              <TooltipProvider delayDuration={100}>
                <div className="flex items-center space-x-2 ml-auto">
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, index) => (
                          <Star
                            key={index}
                            className={`h-5 w-5 ${
                              index < Math.round((review.rating ?? 0) / 2)
                                ? "text-yellow-500"
                                : "text-neutral-400"
                            }`}
                          />
                        ))}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      Rated {review.rating ?? 0}/10
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger>
                      {review.mastered && <TrophyIcon className="w-4 h-4" />}
                    </TooltipTrigger>
                    <TooltipContent>Mastered</TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </div>
          </div>
          <p
            className="prose dark:prose-invert max-w-full"
            dangerouslySetInnerHTML={{
              __html: markdownToHtml(review.review_text ?? ""),
            }}
          ></p>
        </div>
        <CommentsSection reviewId={review.id} />
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onLikeToggle}>
          <HeartIcon
            className={`w-5 h-5 ${userHasLiked ? "text-red-500" : "text-neutral-500"}`}
          />
          {review.likes.length} Likes
        </Button>
        <Button variant="outline">
          <MessageSquareIcon className="w-5 h-5" />
          {review.comments.length} Comments
        </Button>
      </div>
    </div>
  );
}

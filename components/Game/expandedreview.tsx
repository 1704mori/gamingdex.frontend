import { GameReview } from "@/lib/types/game";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  Star,
  TrophyIcon,
  MessageSquareIcon,
  HeartIcon,
  ArrowLeft,
} from "lucide-react";
import { API_URL, getCookie, markdownToHtml } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { userAtom } from "@/lib/stores/user";

interface ExpandedReviewProps {
  review: GameReview;
  onBackClick: () => void;
  onLike?: () => void;
}

export default function ExpandedReview({
  review,
  onBackClick,
  onLike,
}: ExpandedReviewProps) {
  const queryClient = useQueryClient();
  const [user] = useAtom(userAtom);

  const { data: reviewData, isLoading: isReviewsLoading } = useQuery({
    queryKey: ["game_review", review.id],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/reviews/${review.id}`);
      return response.json<GameReview>();
    },
  });

  const likeReview = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${API_URL}/reviews/${review.id}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getCookie("gd:accessToken")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to like the reviewData");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["game_review", review.id] });
    },
  });

  const unlikeReview = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${API_URL}/reviews/${review.id}/like`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getCookie("gd:accessToken")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to unlike the reviewData");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["game_review", review.id] });
    },
  });

  const handleLikeToggle = () => {
    if (reviewData?.attributes.likes.find((like) => like.user_id == user?.id)) {
      unlikeReview.mutate();
    } else {
      likeReview.mutate();
    }
    onLike?.();
  };

  const userHasLiked = reviewData?.attributes.likes.some(
    (like) => like.user_id == user?.id,
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Button className="!w-fit" variant="outline" onClick={onBackClick}>
          <ArrowLeft />
          Back to All Reviews
        </Button>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleLikeToggle}>
            <HeartIcon
              className={`w-5 h-5 mr-2 ${userHasLiked ? "text-red-500" : "text-neutral-500"}`}
            />
            {reviewData?.attributes.likes.length} Likes
          </Button>
        </div>
      </div>
      <div className="grid md:grid-cols-1 gap-4">
        <div className="rounded-lg p-4 border border-neutral-200 bg-neutral-200 text-neutral-950 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50">
          <div className="flex items-center space-x-2 mb-2">
            <img
              className="w-8 h-8 rounded-full"
              src="/placeholder.png"
              alt="User Avatar"
            />
            <div className="flex items-center justify-between w-full">
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
                @{reviewData?.attributes.user.username}
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
                              index <
                              Math.round(
                                (reviewData?.attributes.rating ?? 0) / 2,
                              )
                                ? "text-yellow-500"
                                : "text-neutral-400"
                            }`}
                          />
                        ))}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      Rated {reviewData?.attributes.rating ?? 0}/10
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger>
                      {reviewData?.attributes.mastered && (
                        <TrophyIcon className="w-4 h-4" />
                      )}
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
              __html: markdownToHtml(reviewData?.attributes.review_text ?? ""),
            }}
          ></p>
        </div>
      </div>
    </div>
  );
}

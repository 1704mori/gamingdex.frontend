import { API_URL, getCookie } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { ReviewComment } from "@/lib/types/game";
import { Textarea } from "../ui/textarea";

export function CommentsSection({ reviewId }: { reviewId: string }) {
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");

  const { data: commentsData, isLoading: isCommentsLoading } = useQuery({
    queryKey: ["review_comments", reviewId],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/reviews/${reviewId}/comments`, {
        headers: {
          Authorization: `Bearer ${getCookie("gd:accessToken")}`,
        },
      });
      return response.json<ReviewComment[]>();
    },
  });

  const addComment = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${API_URL}/reviews/${reviewId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("gd:accessToken")}`,
        },
        body: JSON.stringify({ content: newComment }),
      });
      if (!response.ok) throw new Error("Failed to add comment");
      return response.json<ReviewComment>();
    },

    onSuccess: () => {
      setNewComment("");
      queryClient.invalidateQueries({
        queryKey: ["review_comments", reviewId],
      });
    },
  });

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment.mutate();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && e.key === "Enter") {
      handleAddComment();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">Comments</h3>
      <div className="flex flex-col gap-2 mb-4">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full p-2 rounded-md border border-neutral-200 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
        />
        <Button size="sm" variant="outline" onClick={handleAddComment}>
          Submit
        </Button>
      </div>
      {isCommentsLoading ? (
        <Skeleton className="h-4 w-full mb-2" />
      ) : commentsData?.attributes!.length! > 0 ? (
        <div className="flex flex-col gap-2">
          {commentsData?.attributes?.map((comment) => (
            <div
              key={comment.id}
              className="p-2 rounded-md border border-neutral-200 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
            >
              <p className="text-sm font-medium">{comment.user.username}:</p>
              <p className="text-sm">{comment.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          No comments yet.
        </p>
      )}
    </div>
  );
}

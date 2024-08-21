"use client";

import { useState } from "react";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { userAtom } from "@/lib/stores/user";
import { toast } from "sonner";
import { API_URL, getCookie } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { GameReview } from "@/lib/types/game";
import ReviewEditor from "../ui/revieweditor";

const reviewSchema = z.object({
  review_text: z
    .string()
    .min(10, "Review must be at least 10 characters long")
    .nullable(),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

export default function AddReview({ gameId }: { gameId: string }) {
  const [user] = useAtom(userAtom);

  const [reviewText, setReviewText] = useState("");

  const { data: reviewData } = useQuery({
    queryKey: ["game_review", gameId],
    queryFn: async () => {
      const response = await fetch(
        `${API_URL}/reviews?game_id=${gameId}&user_id=${user?.id}`,
        {
          headers: {
            Authorization: `Bearer ${getCookie("gd:accessToken")}`,
          },
        },
      );

      const result = await response.json<GameReview[]>();
      if (result.attributes?.length > 0) {
        const review = result.attributes[0];
        setReviewText(review.review_text ?? "");
      }
      return result.attributes[0];
    },
    enabled: !!user?.id,
  });

  const mutation = useMutation({
    mutationFn: async (data: ReviewFormData) => {
      const url = reviewData
        ? `${API_URL}/reviews/${reviewData.id}`
        : `${API_URL}/reviews/${gameId}`;
      const method = reviewData ? "PUT" : "POST";

      const payload: Partial<ReviewFormData> = {
        review_text: data.review_text,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("gd:accessToken")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const result = await response.json();
        toast.error(result.message || "Something went wrong.");
        return;
      }

      toast.success(
        reviewData
          ? "Review updated successfully"
          : "Review added successfully",
      );
    },
  });

  const onSubmit = (e: any) => {
    e.preventDefault();
    mutation.mutate({
      review_text: reviewText,
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{reviewData ? "Update" : "Add"} Review</DialogTitle>
      </DialogHeader>

      <form onSubmit={onSubmit} className="flex flex-col gap-4 mt-2">
        <div className="flex flex-col gap-2">
          <ReviewEditor value={reviewText} onChange={setReviewText} />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline-destructive" type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit">{reviewData ? "Update" : "Add"}</Button>
        </DialogFooter>
      </form>
    </>
  );
}

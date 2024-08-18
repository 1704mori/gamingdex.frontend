"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, StarIcon } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { API_URL, cn, getCookie } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { useEffect, useState } from "react";
import ReviewEditor from "../ui/revieweditor";
import {
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { GAME_RATINGS, GameReview, GameType } from "@/lib/types/game";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useAtom } from "jotai";
import { userAtom } from "@/lib/stores/user";

const gameReviewSchema = z.object({
  rating: z
    .number()
    .min(0)
    .max(10, { message: "Rating must be between 0 and 10" }),
  mastered: z.boolean(),
  played_on: z
    .string()
    .min(1, { message: "Please select when you played the game" }),
  start_date: z.string().nullable(),
  end_date: z.string().nullable(),
  review_text: z.string().min(1, { message: "Please provide a review" }),
});

type GameReviewFormData = z.infer<typeof gameReviewSchema>;

export default function AddToLibrary({ gameId }: { gameId: string }) {
  const [user] = useAtom(userAtom);
  const [selectedReviewId, setSelectedReviewId] = useState("");

  const form = useForm<GameReviewFormData>({
    resolver: zodResolver(gameReviewSchema),
  });

  const { data } = useQuery({
    queryKey: ["game_addlibrary", gameId],
    queryFn: async () => {
      const response = await fetch(
        `${API_URL}/games/${gameId}?includes=platforms`,
      );
      return response.json<GameType>();
    },
  });

  const { data: reviewsData } = useQuery({
    enabled: !!user?.id,
    queryKey: ["game_reviews_addlibrary", gameId, user?.id],
    queryFn: async () => {
      const response = await fetch(
        `${API_URL}/reviews/game/${gameId}?includes=platform&user_id=${user?.id}`,
        {
          headers: {
            Authorization: `Bearer ${getCookie("gd:accessToken")}`,
          },
        },
      );
      return response.json<GameReview[]>();
    },
  });

  const { data: selectedReviewData, refetch: refetchSelectedReview } = useQuery(
    {
      queryKey: ["selected_review", selectedReviewId],
      queryFn: async () => {
        if (!selectedReviewId) return null;
        const response = await fetch(`${API_URL}/reviews/${selectedReviewId}`, {
          headers: {
            Authorization: `Bearer ${getCookie("gd:accessToken")}`,
          },
        });
        return response.json<GameReview>();
      },
      enabled: !!selectedReviewId,
    },
  );

  useEffect(() => {
    if (selectedReviewData) {
      form.reset({
        rating: selectedReviewData.attributes.rating,
        mastered: selectedReviewData.attributes.mastered,
        played_on: selectedReviewData.attributes.platform.id,
        start_date: selectedReviewData.attributes.start_date,
        end_date: selectedReviewData.attributes.end_date,
        review_text: selectedReviewData.attributes.review_text,
      });
    }
  }, [selectedReviewData, form]);

  const hasReview = reviewsData?.attributes?.[0]?.id;

  const mutation = useMutation({
    mutationFn: async (data: GameReviewFormData) => {
      const response = await fetch(`${API_URL}/reviews/game/${gameId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("gd:accessToken")}`,
        },
        body: JSON.stringify(data),
      });

      const { result, message } = await response.json<GameReview>();
      if (result == "error") {
        toast.error(message);
        return;
      }
      toast.success("Game logged successfully");
    },
  });

  const onSubmit = (data: GameReviewFormData) => {
    mutation.mutate(data);
  };

  return (
    <>
      <Form {...form}>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>
              {selectedReviewId ? "Update" : "Add to"} library
            </DialogTitle>
            {hasReview && (
              <Select
                onValueChange={(value) => setSelectedReviewId(value)}
                value={selectedReviewId}
              >
                <SelectTrigger className="w-52">
                  <SelectValue placeholder="Update a review" />
                </SelectTrigger>
                <SelectContent>
                  {reviewsData?.attributes.map((review) => (
                    <SelectItem key={review.id} value={review.id}>
                      {review.platform.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-2"
        >
          <div className="flex md:items-center justify-between max-sm:flex-col max-sm:gap-2">
            <div className="flex items-center gap-4">
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field?.value?.toString()}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Rating" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(GAME_RATINGS).map(([rate, name]) => (
                            <SelectItem key={rate} value={rate}>
                              {name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                  <StarIcon
                    key={index}
                    className={`h-5 w-5 ${
                      index < Math.round((form.watch().rating ?? 0) / 2)
                        ? "text-yellow-500"
                        : "text-neutral-400"
                    }`}
                  />
                ))}
              </div>
            </div>
            <FormField
              control={form.control}
              name="mastered"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Mastered</FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <FormField
              control={form.control}
              name="played_on"
              render={({ field }) => (
                <FormItem>
                  <FormControl className="w-full">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="ww-[180px]">
                        <SelectValue placeholder="Played on" />
                      </SelectTrigger>
                      <SelectContent>
                        {data?.attributes.platforms.map((platform) => (
                          <SelectItem value={platform.id}>
                            {platform.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem>
                  <Popover modal={true}>
                    <PopoverTrigger asChild>
                      <FormControl className="w-full">
                        <Button
                          variant={"outline"}
                          className={cn(
                            "ww-[280px] justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            Intl.DateTimeFormat(undefined, {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            }).format(new Date(field.value))
                          ) : (
                            <span>Start Date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) =>
                          field.onChange(date?.toISOString() ?? null)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem>
                  <Popover modal={true}>
                    <PopoverTrigger asChild>
                      <FormControl className="w-full">
                        <Button
                          variant={"outline"}
                          className={cn(
                            "ww-[280px] justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            Intl.DateTimeFormat(undefined, {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            }).format(new Date(field.value))
                          ) : (
                            <span>End Date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) =>
                          field.onChange(date?.toISOString() ?? null)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="review_text"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ReviewEditor
                    onChange={field.onChange}
                    value={field.value}
                    reload={!!field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline-destructive" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="max-sm:mb-2">
              {selectedReviewId ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
}

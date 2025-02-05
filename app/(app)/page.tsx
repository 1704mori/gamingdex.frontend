"use client";

import Image from "next/image";
import {
  API_URL,
  cn,
  getCookie,
  markdownToHtml,
  shimmer,
  toBase64,
} from "@/lib/utils";
import {
  Activity,
  GamepadIcon,
  NotebookPenIcon,
  PlusIcon,
  StarIcon,
  HeartIcon,
  MessageSquareIcon,
} from "lucide-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GameReview } from "@/lib/types/game";
import ExpandedReview from "@/components/Game/expandedreview";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserList } from "@/lib/types/user";
import { useAtom } from "jotai";
import { userAtom } from "@/lib/stores/user";
import { useMediaQuery } from "react-responsive";

export default function Home() {
  const [user] = useAtom(userAtom);
  const [expandedReview, setExpandedReview] = useState<GameReview | null>(null);
  const queryClient = useQueryClient();

  const { data: recentGames, isLoading: isRecentGamesLoading } = useQuery({
    enabled: !!user?.id,
    queryKey: ["home_recentgames", user?.id],
    queryFn: async () => {
      const response = await fetch(
        `${API_URL}/reviews?limit=6&user_id=${user?.id}&library_count=true&order_by=created_at desc&includes=game`,
      );
      return response.json<
        GameReview[],
        { games_in_library: number; reviews_written: number }
      >();
    },
  });

  const { data: reviewsData, isLoading: isReviewsLoading } = useQuery({
    queryKey: ["home_reviews"],
    queryFn: async () => {
      const response = await fetch(
        `${API_URL}/reviews?limit=6&order_by=likes&includes=user,user_game,likes,game`,
      );
      return response.json<GameReview[]>();
    },
  });

  const { data: listsData, isLoading: isListsLoading } = useQuery({
    queryKey: ["home_lists"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/list/popular`);
      return response.json<UserList[]>();
    },
  });

  const likeReview = useMutation({
    mutationFn: async (reviewId: string) => {
      const response = await fetch(`${API_URL}/reviews/${reviewId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getCookie("gd:accessToken")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to like the review");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["home_reviews"] });
    },
  });

  const unlikeReview = useMutation({
    mutationFn: async (reviewId: string) => {
      const response = await fetch(`${API_URL}/reviews/${reviewId}/like`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getCookie("gd:accessToken")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to unlike the review");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["home_reviews"] });
    },
  });

  const handleLikeToggle = (review: GameReview) => {
    if (review.likes.find((like) => like.user_id == user?.id)) {
      unlikeReview.mutate(review.id);
    } else {
      likeReview.mutate(review.id);
    }
  };

  const likeList = useMutation({
    mutationFn: async (listId: string) => {
      const response = await fetch(`${API_URL}/list/${listId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getCookie("gd:accessToken")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to like the list");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["home_lists"] });
    },
  });

  const unlikeList = useMutation({
    mutationFn: async (listId: string) => {
      const response = await fetch(`${API_URL}/list/${listId}/like`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getCookie("gd:accessToken")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to unlike the list");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["home_lists"] });
    },
  });

  const handleLikeListToggle = (list: UserList) => {
    if (list.likes.find((like) => like.user_id == user?.id)) {
      unlikeList.mutate(list.id);
    } else {
      likeList.mutate(list.id);
    }
  };

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <main className="flex flex-col">
      <section className="flex flex-col gap-4 py-12 bg-neutral-950 text-neutral-50">
        {user?.id ? (
          <>
            <div className="flex items-center space-x-4 p-2 w-fit rounded-md border border-neutral-200 shadow-sm dark:border-neutral-800">
              <Activity className="h-5 w-5 mr-2" />
              Activity Log
            </div>

            <div className="flex flex-col self-start gap-4 w-full">
              <div className="flex items-center gap-2">
                <div className="flex items-center space-x-2 py-1 px-3 rounded-md border border-neutral-200 shadow-sm dark:border-neutral-800">
                  <GamepadIcon />
                  <div>
                    <p className="text-sm font-medium">
                      {Intl.NumberFormat("en", {
                        notation: "compact",
                      }).format(
                        recentGames?.pagination?.games_in_library!,
                      )}{" "}
                      games in library
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 py-1 px-3 rounded-md border border-neutral-200 shadow-sm dark:border-neutral-800">
                  <NotebookPenIcon />
                  <div>
                    <p className="text-sm font-medium">
                      {" "}
                      {Intl.NumberFormat("en", {
                        notation: "compact",
                      }).format(recentGames?.pagination?.reviews_written!)}{" "}
                      reviews written
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {isTabletOrMobile ? (
                  <div className="grid grid-cols-2 gap-4 w-full">
                    {recentGames?.attributes.map(({ game }) => (
                      <div
                        className="w-full relative rounded-md border-neutral-200 bg-neutral-200 text-neutral-950 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50 overflow-hidden group"
                        key={game.id}
                      >
                        <Link
                          href={`/game/${game.id}`}
                          className="flex items-center gap-2 relative"
                          onMouseDown={(e) => e.preventDefault()} // Prevent blur from triggering before navigation
                        >
                          <img
                            className="object-cover w-14 h-14"
                            src={game.cover_url!}
                            alt={game.title}
                          />
                          <h3 className="font-semibold truncate">
                            {game.title}
                          </h3>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {recentGames?.attributes.map(({ game }) => (
                      <Link
                        href={`/game/${game.id}`}
                        className="relative overflow-hidden rounded-lg block w-28 h-28"
                        key={game.id}
                      >
                        <Image
                          className="object-cover"
                          alt={game.title}
                          src={game.cover_url!}
                          placeholder={`data:image/svg+xml;base64,${toBase64(
                            shimmer(500, 300),
                          )}`}
                          fill
                        />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div>
            <h3 className="text-2xl tracking-normal font-semibold">
              Join us and start your journey
            </h3>
            <Button className="mt-4" asChild>
              <Link href="/auth">Start</Link>
            </Button>
          </div>
        )}
      </section>

      {/* Popular Reviews */}
      <section className="py-12 bg-neutral-900 text-neutral-50 dark:bg-neutral-950 dark:text-neutral-50">
        <div className="">
          <h2 className="text-2xl font-bold mb-6">Popular Reviews</h2>

          {expandedReview ? (
            <ExpandedReview
              review={expandedReview}
              onBackClick={() => setExpandedReview(null)}
            />
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
              {reviewsData?.attributes.map((review) => {
                const isLongReview = review.review_text
                  ? review.review_text.length > 150
                  : false;
                const displayedText = isLongReview
                  ? review.review_text
                    ? review.review_text!.slice(0, 150) + "..."
                    : ""
                  : review.review_text
                    ? review.review_text
                    : "";

                return (
                  <div
                    key={review.id}
                    className="break-inside-avoid rounded-lg p-4 border border-neutral-200 bg-neutral-200 text-neutral-950 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50 mb-4"
                  >
                    <div className="flex items-center mb-2">
                      <div className="flex items-center space-x-2">
                        <img
                          className="w-8 h-8 rounded-full"
                          src="/placeholder.png"
                          alt={review.user.username}
                        />
                        <div className="flex flex-col">
                          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
                            @{review.user.username}
                          </p>
                          <Link
                            href={`/game/${review.game.id}`}
                            className="text-sm font-medium text-neutral-900 dark:text-neutral-50"
                          >
                            {review.game.title}
                          </Link>
                        </div>
                      </div>
                      <TooltipProvider delayDuration={100}>
                        <div className="flex items-center space-x-2 ml-auto">
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, index) => (
                                  <StarIcon
                                    key={index}
                                    className={`h-5 w-5 ${
                                      index <
                                      Math.round(
                                        (review.user_game?.rating ?? 0) / 2,
                                      )
                                        ? "text-yellow-500"
                                        : "text-neutral-400"
                                    }`}
                                  />
                                ))}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              Rated {review.user_game?.rating ?? 0}/10
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TooltipProvider>
                    </div>
                    <p
                      className="text-sm text-neutral-600 dark:text-neutral-400 mb-2"
                      dangerouslySetInnerHTML={{
                        __html: markdownToHtml(displayedText!),
                      }}
                    ></p>

                    <div className="flex items-center max-sm:gap-2 max-sm:flex-wrap">
                      {isLongReview && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setExpandedReview(review)}
                          className="max-sm:w-full"
                        >
                          {expandedReview ? "Show Less" : "Read More"}
                        </Button>
                      )}
                      <div className="flex items-center gap-2 md:ml-auto">
                        <button
                          className="flex items-center gap-1"
                          onClick={() => handleLikeToggle(review)}
                        >
                          <HeartIcon
                            className={cn(
                              "w-5 h-5",
                              review.likes.find(
                                (like) => like.user_id == user?.id,
                              ) && "text-red-500",
                            )}
                          />
                          {Intl.NumberFormat("en", {
                            notation: "compact",
                          }).format(review.likes.length ?? 0)}{" "}
                          likes
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Popular Lists */}
      <section className="py-12 bg-neutral-950 text-neutral-50">
        <div className="">
          <h2 className="text-2xl font-bold mb-6">Popular Lists</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {listsData?.attributes.map((list) => (
              <div
                key={list.id}
                className="rounded-lg p-4 border border-neutral-200 bg-neutral-200 text-neutral-950 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50"
              >
                <Link
                  href={`/list/${list.id}`}
                  className="flex justify-end sm:justify-start lg:justify-end xl:justify-start -space-x-2"
                >
                  {list.games.map((game) => (
                    <div
                      className="relative overflow-hidden rounded-lg block w-full h-24 border border-black/50"
                      key={game.game_id}
                    >
                      <Image
                        className="object-cover"
                        alt={game.game?.title!}
                        src={game.game?.cover_url!}
                        placeholder={`data:image/svg+xml;base64,${toBase64(
                          shimmer(500, 300),
                        )}`}
                        fill
                      />
                    </div>
                  ))}
                </Link>
                <Link
                  href={`/list/${list.id}`}
                  className="text-lg mt-1 font-semibold"
                >
                  {list.name}
                </Link>
                <p className="flex items-center gap-1">
                  <p className="text-neutral-600 dark:text-neutral-400">by</p>
                  <Link href={`/user/${list.user?.id}`}>
                    @{list.user?.username}
                  </Link>
                  <span className="text-neutral-600 dark:text-neutral-400">
                    -
                  </span>
                  <span className="text-neutral-600 dark:text-neutral-400">
                    {list.games_count} games
                  </span>
                  <button
                    className="flex items-center gap-1 ml-auto"
                    onClick={() => handleLikeListToggle(list)}
                  >
                    <HeartIcon
                      className={cn(
                        "w-5 h-5",
                        list.likes.find((like) => like.user_id == user?.id) &&
                          "text-red-500",
                      )}
                    />
                    {Intl.NumberFormat("en", {
                      notation: "compact",
                    }).format(list.likes.length ?? 0)}{" "}
                    likes
                  </button>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-12 bg-neutral-900 text-neutral-50 dark:bg-neutral-950 dark:text-neutral-50">
        <div className="">
          <h2 className="text-2xl font-bold mb-6">Latest News</h2>
          <div className="space-y-4">
            <div className="rounded-lg p-4 border border-neutral-200 bg-neutral-200 text-neutral-950 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50">
              <h3 className="text-lg font-semibold">
                Developer Update: Version 1
              </h3>
              <p className="text-sm mt-2 text-neutral-600 dark:text-neutral-400">
                Version 1 has been released, check out what's new
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

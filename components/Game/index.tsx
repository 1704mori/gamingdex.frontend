"use client";

import { GameReview, GameType } from "@/lib/types/game";
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
  Edit,
  Flag,
  Gamepad2,
  Heart,
  Monitor,
  Smartphone,
  Star,
  NotebookPenIcon,
  GamepadIcon,
  PlayIcon,
  HeartIcon,
  MessageSquareIcon,
  TrophyIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import AddToLibrary from "./addtolibrary";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";
import { useState } from "react";
import { useAtom } from "jotai";
import { userAtom } from "@/lib/stores/user";
import { CommentsSection } from "./CommentsSection";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import ReportDialog from "../report";

function platformToIcon(platform: string) {
  if (
    /xbox|playstation|nintendo|switch|wii|sega|atari|gamecube|3ds|vita|ouya/i.test(
      platform,
    )
  ) {
    return <Gamepad2 />;
  } else if (
    /android|ios|iphone|ipad|windows phone|blackberry|legacy mobile device/i.test(
      platform,
    )
  ) {
    return <Smartphone />;
  } else {
    return <Monitor />;
  }
}

export default function Game({ game }: { game: GameType }) {
  const [user] = useAtom(userAtom);
  const [expandedReview, setExpandedReview] = useState<GameReview | null>(null);

  const handleBackClick = () => {
    setExpandedReview(null);
  };

  const qc = useQueryClient();

  const { data: reviewsData, isLoading: isReviewsLoading } = useQuery({
    queryKey: ["game_reviews", game.id],
    queryFn: async () => {
      const response = await fetch(
        `${API_URL}/reviews?limit=6&game_id=${game.id}&order_by=created_at asc&includes=platform,user,comments,likes`,
        {
          headers: {
            Authorization: `Bearer ${getCookie("gd:accessToken")}`,
          },
        },
      );
      return response.json<GameReview[]>();
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
      qc.invalidateQueries({ queryKey: ["game_reviews", game.id] });
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
      qc.invalidateQueries({ queryKey: ["game_reviews", game.id] });
    },
  });

  const handleLikeToggle = (review: GameReview) => {
    if (review.likes.find((like) => like.user_id == user?.id)) {
      unlikeReview.mutate(review.id);
    } else {
      likeReview.mutate(review.id);
    }
  };

  return (
    <main className="flex flex-col">
      <section className="w-full py-20 bg-neutral-900 text-neutral-50 dark:bg-neutral-950 dark:text-neutral-50">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <div className="relative overflow-hidden rounded-xl h-[744px]">
                <Image
                  className="aspect-square"
                  objectFit="cover"
                  alt={game.title}
                  src={game.cover_url!}
                  placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                  fill
                />
              </div>
              <div className="flex items-center flex-wrap gap-2 text-neutral-600 dark:text-neutral-400">
                <div className="flex items-center space-x-2 p-1 rounded-md border border-neutral-200 shadow-sm dark:border-neutral-800">
                  <GamepadIcon className="w-5 h-5" />
                  <div>
                    <p className="text-sm font-medium">soon</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 p-1 rounded-md border border-neutral-200 shadow-sm dark:border-neutral-800">
                  <PlayIcon className="w-5 h-5" />
                  <div>
                    <p className="text-sm font-medium">soon</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 p-1 rounded-md border border-neutral-200 shadow-sm dark:border-neutral-800">
                  {isReviewsLoading ? (
                    <>
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </>
                  ) : (
                    <>
                      <NotebookPenIcon className="w-5 h-5" />
                      <div>
                        <p className="text-sm font-medium">
                          {Intl.NumberFormat("en", {
                            notation: "compact",
                          }).format(reviewsData?.pagination?.total ?? 0)}{" "}
                          reviews
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div>
              <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                <h2 className="text-3xl font-bold mb-4">{game.title}</h2>
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex items-center space-x-2">
                    {/* Rating Badge */}
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-500 text-white">
                      {game.score ?? "N/A"}
                      <span className="ml-1 text-xs">/ 10</span>
                    </span>
                    {/* Star Icons */}
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          className={`h-5 w-5 ${
                            index < Math.round((game.score ?? 0) / 2)
                              ? "text-yellow-500"
                              : "text-neutral-400"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-base mb-6 p-2 rounded-md border border-neutral-200 shadow-sm dark:border-neutral-800 overflow-y-auto max-h-48">
                {game.description}
              </p>

              <div className="mb-6">
                <div className="flex flex-wrap justify-items-start gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Heart className="h-5 w-5 mr-2" />
                        Add to My List
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="md:min-w-[48rem] max-sm:max-h-[48rem]">
                      <AddToLibrary gameId={game.id} />
                    </DialogContent>
                  </Dialog>
                  {/*<Button variant="outline">
                    <Star className="h-5 w-5 mr-2" />
                    Favorite
                  </Button>*/}

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Flag className="h-5 w-5 mr-2" />
                        Report
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <ReportDialog initialEntityType="game" data={game} />
                    </DialogContent>
                  </Dialog>

                  {/*<Button variant="outline">
                    <Edit className="h-5 w-5 mr-2" />
                    Update
                  </Button>*/}
                </div>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Release Date</h3>
                <p className="w-fit p-2 rounded-md border border-neutral-200 shadow-sm dark:border-neutral-800">
                  {game.year ?? "nao sei o que colocar aqui"}
                </p>
              </div>
              {/*<div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Where to Buy</h3>
                  {game.links ? (
                    <div className="flex space-x-4">
                      {Object.entries(game.links).map(([key, value]) => (
                        <Link
                          className="hover:text-neutral-300 p-2 rounded-md border border-neutral-200 shadow-sm dark:border-neutral-800"
                          href="#"
                          key={key}
                        >
                          <ChromeIcon className="h-8 w-8" />
                          <p className="text-sm font-medium">{value}</p>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <span>Nenhum link encontrado</span>
                  )}
                </div>*/}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-semibold mb-2">Developer</h3>
                  <p className="w-fit p-2 rounded-md border border-neutral-200 shadow-sm dark:border-neutral-800">
                    {
                      game.companies.filter(
                        (company) => !!company.is_developer,
                      )?.[0]?.name
                    }
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-semibold mb-2">Publisher</h3>
                  <p className="w-fit p-2 rounded-md border border-neutral-200 shadow-sm dark:border-neutral-800">
                    {
                      game.companies.filter(
                        (company) => !!company.is_publisher,
                      )[0].name
                    }
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Platforms</h3>
                <div className="flex items-center flex-wrap gap-2">
                  {game.platforms.map((platform) => (
                    <div
                      className="flex items-center space-x-2 p-2 rounded-md border border-neutral-200 shadow-sm dark:border-neutral-800"
                      key={platform.id}
                    >
                      {platformToIcon(platform.name)}
                      <div>
                        <p className="text-sm font-medium">{platform.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Genres</h3>
                <div className="flex items-center flex-wrap gap-2">
                  {game.genres.map((genre) => (
                    <div className="flex items-center space-x-2" key={genre.id}>
                      <div className="p-2 rounded-md border border-neutral-200 shadow-sm dark:border-neutral-800">
                        <p className="text-sm font-medium">{genre.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*<section className="py-12 md:py-16 lg:py-20 bg-neutral-950 text-neutral-50">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold">Characters</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="flex flex-col items-center">
                <img
                  alt="Character"
                  className="w-24 h-24 rounded-full mb-2"
                  src="/placeholder.svg"
                />
                <p className="text-sm font-medium">Character Name</p>
              </div>
              <div className="flex flex-col items-center">
                <img
                  alt="Character"
                  className="w-24 h-24 rounded-full mb-2"
                  src="/placeholder.svg"
                />
                <p className="text-sm font-medium">Character Name</p>
              </div>
              <div className="flex flex-col items-center">
                <img
                  alt="Character"
                  className="w-24 h-24 rounded-full mb-2"
                  src="/placeholder.svg"
                />
                <p className="text-sm font-medium">Character Name</p>
              </div>
              <div className="flex flex-col items-center">
                <img
                  alt="Character"
                  className="w-24 h-24 rounded-full mb-2"
                  src="/placeholder.svg"
                />
                <p className="text-sm font-medium">Character Name</p>
              </div>
            </div>
          </div>
        </section>*/}
      <section className="bg-neutral-900 text-neutral-50 dark:bg-neutral-950 dark:text-neutral-50">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">Reviews</h2>
          </div>

          {expandedReview ? (
            <div className="flex flex-col gap-4">
              <Button variant="outline" onClick={handleBackClick}>
                Back to All Reviews
              </Button>
              <div className="grid md:grid-cols-[1fr_26rem] gap-4">
                <div className="rounded-lg p-4 border border-neutral-200 bg-neutral-200 text-neutral-950 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50">
                  <div className="flex items-center space-x-2 mb-2">
                    <img
                      className="w-8 h-8 rounded-full"
                      src="/placeholder.png"
                    />
                    <div className="flex items-center justify-between w-full">
                      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
                        @{expandedReview.user.username}
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
                                        (expandedReview.rating ?? 0) / 2,
                                      )
                                        ? "text-yellow-500"
                                        : "text-neutral-400"
                                    }`}
                                  />
                                ))}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              Rated {expandedReview.rating ?? 0}/10
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger>
                              {expandedReview.mastered && (
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
                      __html: markdownToHtml(expandedReview.review_text!),
                    }}
                  ></p>
                </div>
                <CommentsSection reviewId={expandedReview.id} />
              </div>
            </div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
              {isReviewsLoading
                ? // Render skeletons when loading
                  Array.from({ length: 6 }).map((_, index) => (
                    <div
                      className="break-inside-avoid rounded-lg p-4 border border-neutral-200 bg-neutral-200 text-neutral-950 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50 mb-4"
                      key={index}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <Skeleton className="h-4 w-1/3" />
                      </div>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-5/6 mb-2" />
                      <Skeleton className="h-4 w-2/3 mb-2" />
                    </div>
                  ))
                : reviewsData?.attributes.map((review) => {
                    const isLongReview = review.review_text!.length > 150;
                    const displayedText = isLongReview
                      ? review.review_text!.slice(0, 150) + "..."
                      : review.review_text;

                    return (
                      <div
                        className="break-inside-avoid rounded-lg p-4 border border-neutral-200 bg-neutral-200 text-neutral-950 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50 mb-4"
                        key={review.id}
                      >
                        <div className="flex items-center mb-2">
                          <div className="flex items-center space-x-2">
                            <img
                              className="w-8 h-8 rounded-full"
                              src="/placeholder.png"
                            />
                            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
                              @{review.user.username}
                            </p>
                          </div>
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
                                          Math.round((review.rating ?? 0) / 2)
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
                                  {review.mastered && (
                                    <TrophyIcon className="w-4 h-4" />
                                  )}
                                </TooltipTrigger>
                                <TooltipContent>Mastered</TooltipContent>
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
                              onClick={() =>
                                handleLikeToggle(
                                  expandedReview ? expandedReview : review,
                                )
                              }
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
                            <button
                              className="flex items-center gap-1"
                              onClick={() => setExpandedReview(review)}
                            >
                              <MessageSquareIcon className="w-5 h-5" />
                              {Intl.NumberFormat("en", {
                                notation: "compact",
                              }).format(review.comments?.length ?? 0)}{" "}
                              comments
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
    </main>
  );
}

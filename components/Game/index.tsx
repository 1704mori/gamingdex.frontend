"use client";

import { GameType } from "@/lib/types/game";
import Image from "next/image";
import { shimmer, toBase64 } from "@/lib/utils";
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
} from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

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
  const [isExpanded, setIsExpanded] = useState(false);
  const descriptionLimit = 200;

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  const truncatedDescription =
    game.description!.length > descriptionLimit && !isExpanded
      ? `${game.description?.substring(0, descriptionLimit)}...`
      : game.description;

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
              <div className="flex items-center flex-wrap gap-4 text-neutral-600 dark:text-neutral-400">
                <div className="flex items-center space-x-2 p-1 rounded-md border border-neutral-200 shadow-sm dark:border-neutral-800">
                  <GamepadIcon />
                  <div>
                    <p className="text-sm font-medium">2.3k plays</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 p-1 rounded-md border border-neutral-200 shadow-sm dark:border-neutral-800">
                  <PlayIcon />
                  <div>
                    <p className="text-sm font-medium">2.3k playing</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 p-1 rounded-md border border-neutral-200 shadow-sm dark:border-neutral-800">
                  <NotebookPenIcon />
                  <div>
                    <p className="text-sm font-medium">2.3k reviews</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-4">
                <h2 className="text-3xl font-bold mb-4">{game.title}</h2>
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex items-center space-x-2">
                    {/* Rating Badge */}
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-500 text-white">
                      {null ?? "N/A"}
                      <span className="ml-1 text-xs">/ 10</span>
                    </span>
                    {/* Star Icons */}
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          className={`h-5 w-5 ${
                            index < Math.round((0 ?? 0) / 2)
                              ? "text-yellow-500"
                              : "text-neutral-400"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-base mb-6 p-2 rounded-md border border-neutral-200 shadow-sm dark:border-neutral-800 overflow-y-scroll max-h-48">
                {game.description}
              </p>

              <div className="mb-6">
                <div className="flex flex-wrap justify-items-start gap-2">
                  <Button variant="outline">
                    <Star className="h-5 w-5 mr-2" />
                    Rate
                  </Button>
                  <Button variant="outline">
                    <Heart className="h-5 w-5 mr-2" />
                    Add to My List
                  </Button>
                  <Button variant="outline">
                    <Flag className="h-5 w-5 mr-2" />
                    Report
                  </Button>
                  <Button variant="outline">
                    <Edit className="h-5 w-5 mr-2" />
                    Update
                  </Button>
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
      <section className="py-12 md:py-16 lg:py-20 bg-neutral-900 text-neutral-50 dark:bg-neutral-950 dark:text-neutral-50">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">Reviews</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                className="rounded-lg p-4 border border-neutral-200 bg-neutral-200 text-neutral-950 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50"
                key={i}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <img
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full"
                    src="/placeholder.svg"
                  />
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
                    @johndoe
                  </p>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  "This game is a masterpiece! The storyline is gripping, and
                  the graphics are stunning. Highly recommended!"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

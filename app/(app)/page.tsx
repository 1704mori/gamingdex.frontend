"use client";

import Image from "next/image";
import { shimmer, toBase64 } from "@/lib/utils";
import {
  Activity,
  GamepadIcon,
  NotebookPenIcon,
  PlusIcon,
  StarIcon,
} from "lucide-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Home() {
  const user = {} as any;
  const games = [] as any[];
  const reviews = [] as any[];
  const lists = [] as any[];
  const news = [] as any[];

  return (
    <main className="flex flex-col">
      <section className="flex items-center gap-8 py-12 bg-neutral-950 text-neutral-50">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 ">
          <h2 className="text-xl font-bold mb-4 py-1 px-2 w-fit rounded-md border border-neutral-200 shadow-sm dark:border-neutral-800">
            Recently Trending
          </h2>
          <div className="flex gap-4 overflow-x-auto p-4 rounded-md border border-neutral-200 shadow-sm dark:border-neutral-800">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                className="w-full relative border border-neutral-200 rounded-lg shadow-sm bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden group"
                key={i}
              >
                <Link href={`/game/${i}`} className="block relative h-64">
                  <Image
                    className="object-cover"
                    alt={""}
                    src="https://images.igdb.com/igdb/image/upload/t_1080p/co7497.jpg"
                    placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(500, 300))}`}
                    fill
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-75 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-white text-center text-lg font-semibold">
                      Elden Ring
                    </h3>
                  </div>
                </Link>
                <TooltipProvider delayDuration={10}>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex">
                    <Tooltip>
                      <TooltipTrigger className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md p-2 border border-neutral-200 bg-neutral-200 text-neutral-950 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50">
                        <PlusIcon />
                      </TooltipTrigger>
                      <TooltipContent>Add to library</TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col self-start gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-2 p-1 rounded-md border border-neutral-200 shadow-sm dark:border-neutral-800">
              <GamepadIcon />
              <div>
                <p className="text-sm font-medium">2.3k games in library</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-1 rounded-md border border-neutral-200 shadow-sm dark:border-neutral-800">
              <NotebookPenIcon />
              <div>
                <p className="text-sm font-medium">2.3k reviews written</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center space-x-4 p-2 w-full rounded-md border border-neutral-200 shadow-sm dark:border-neutral-800">
              <Activity className="h-5 w-5 mr-2" />
              Activity Log
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Link
                  href=""
                  className="relative overflow-hidden rounded-lg block w-full h-28"
                >
                  <Image
                    className="object-cover"
                    alt={""}
                    src="https://images.igdb.com/igdb/image/upload/t_1080p/co7497.jpg"
                    placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(500, 300))}`}
                    fill
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Popular Reviews */}
      <section className="py-12 bg-neutral-900 text-neutral-50 dark:bg-neutral-950 dark:text-neutral-50">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Popular Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex gap-4 rounded-lg p-4 border border-neutral-200 bg-neutral-200 text-neutral-950 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50"
              >
                <Link
                  href=""
                  className="relative overflow-hidden rounded-lg block w-full h-24"
                >
                  <Image
                    className="object-cover"
                    alt={""}
                    src="https://images.igdb.com/igdb/image/upload/t_1080p/co7497.jpg"
                    placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(500, 300))}`}
                    fill
                  />
                </Link>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-1">
                    <p className="font-medium">@username</p>
                    <p className="font-medium text-neutral-900 dark:text-neutral-50">
                      Elden Ring: Shadow of Erdtree
                    </p>

                    <div className="flex items-center gap-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, index) => (
                          <StarIcon
                            key={index}
                            className={`h-5 w-5 ${
                              index < Math.round((7.5 ?? 0) / 2)
                                ? "text-yellow-500"
                                : "text-neutral-400"
                            }`}
                          />
                        ))}
                      </div>
                      Completed
                    </div>
                  </div>
                  <p>
                    Last year I went on a Pokémon ROM hack bender and this year
                    has been a similar adventure with Fire Emblem. These two
                    collided when I saw Pokémblem. Unfortunately, they can't all
                    be winners. This did not work for me. Kudos to the creator
                    of this for putting in the time and effort. There were some
                    neat ideas of how to combine these two franchises, but
                    overall I think it's best that they stay separate.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Lists */}
      <section className="py-12 bg-neutral-950 text-neutral-50">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Popular Lists</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-lg p-4 border border-neutral-200 bg-neutral-200 text-neutral-950 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50"
              >
                <div className="flex justify-end sm:justify-start lg:justify-end xl:justify-start -space-x-2">
                  {Array.from({ length: 5 }).map((_, ii) => (
                    <Link
                      href=""
                      className="relative overflow-hidden rounded-lg block w-full h-24 border border-black/50"
                    >
                      <Image
                        className="object-cover"
                        alt={""}
                        src="https://images.igdb.com/igdb/image/upload/t_1080p/co7497.jpg"
                        placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(500, 300))}`}
                        fill
                      />
                    </Link>
                  ))}
                </div>
                <h3 className="text-lg mt-1 font-semibold">nome ai karaio</h3>
                <p className="flex items-center gap-1">
                  <p className="text-neutral-600 dark:text-neutral-400">by</p>
                  <Link href="">alguem ai</Link>
                  <span className="text-neutral-600 dark:text-neutral-400">
                    -
                  </span>
                  <span
                    className="
text-neutral-600 dark:text-neutral-400
                    "
                  >
                    33 games
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-12 bg-neutral-900 text-neutral-50 dark:bg-neutral-950 dark:text-neutral-50">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
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

      {/* Bottom Grid 
      <section className="py-12 bg-neutral-950 text-neutral-50">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex flex-col space-y-4">
              <h3 className="text-xl font-semibold">Coming Soon</h3>
              {games.slice(5, 8).map((game) => (
                <div key={game.id} className="flex items-center gap-4">
                  <Image
                    src={game.cover_url!}
                    alt={game.title}
                    width={64}
                    height={64}
                    className="rounded-md"
                  />
                  <div>
                    <h4 className="text-lg font-bold">{game.title}</h4>
                    <p className="text-sm text-neutral-400">{game.year}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col space-y-4">
              <h3 className="text-xl font-semibold">Most Hyped</h3>
              {games.slice(8, 11).map((game) => (
                <div key={game.id} className="flex items-center gap-4">
                  <Image
                    src={game.cover_url!}
                    alt={game.title}
                    width={64}
                    height={64}
                    className="rounded-md"
                  />
                  <div>
                    <h4 className="text-lg font-bold">{game.title}</h4>
                    <p className="text-sm text-neutral-400">{game.year}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col space-y-4">
              <h3 className="text-xl font-semibold">Editorial Pick</h3>
              {games.slice(11, 14).map((game) => (
                <div key={game.id} className="flex items-center gap-4">
                  <Image
                    src={game.cover_url!}
                    alt={game.title}
                    width={64}
                    height={64}
                    className="rounded-md"
                  />
                  <div>
                    <h4 className="text-lg font-bold">{game.title}</h4>
                    <p className="text-sm text-neutral-400">{game.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>*/}
    </main>
  );
}

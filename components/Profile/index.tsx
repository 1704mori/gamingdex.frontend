import { shimmer, toBase64 } from "@/lib/utils";
import { FlagIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { User } from "@/lib/types/user";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import ReportDialog from "../report";

function getRoleColor(role: string): string {
  switch (role) {
    case "admin":
      return "#D32F2F"; // Muted Red
    case "developer":
      return "#F57C00"; // Muted Orange
    case "global_moderator":
      return "#388E3C"; // Muted Green
    case "news_moderator":
      return "#1976D2"; // Muted Blue
    case "forum_moderator":
      return "#0288D1"; // Lighter Muted Blue
    case "staff":
      return "#7B1FA2"; // Muted Purple
    case "vip":
      return "#FBC02D"; // Muted Gold
    case "power_contributor":
      return "#0097A7"; // Muted Teal
    case "supporter":
      return "#C2185B"; // Muted Pink
    case "member":
      return "#689F38"; // Muted Light Green
    case "unverified":
      return "#757575"; // Medium Gray
    case "guest":
      return "#BDBDBD"; // Light Gray
    case "banned":
      return "#D32F2F"; // Same as Admin, Muted Red
    default:
      return "#757575"; // Default to Medium Gray
  }
}

function shouldUseDarkText(backgroundColor: string) {
  // Remove the '#' if it's there
  const hex = backgroundColor.replace("#", "");

  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 2), 16);
  const b = parseInt(hex.substring(4, 2), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Use dark text if luminance is high (background is light)
  return luminance > 0.5;
}

export default function Profile({ user }: { user: User }) {
  const role = user.role;
  const backgroundColor = getRoleColor(role);
  const textColor = shouldUseDarkText(backgroundColor)
    ? "text-gray-900"
    : "text-white";

  return (
    <div className="flex flex-col py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center md:items-start col-span-2">
          <div className="flex items-center gap-4">
            <Image
              width={128}
              height={128}
              alt={user.username}
              placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(500, 300))}`}
              className="object-cover w-32 h-32 rounded-lg mb-4 bg-neutral-200 dark:bg-neutral-900"
              src="/placeholder.png"
            />
            <div className="flex flex-col self-end mb-4">
              <h2 className="text-2xl font-bold">{user.username}</h2>

              <span
                className={`px-2 py-1 text-xs font-medium w-fit rounded-md shadow-sm ${textColor}`}
                style={{ backgroundColor, borderColor: "rgba(0,0,0,0.1)" }}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}{" "}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <p className="font-semibold text-sm">{user.id}</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <FlagIcon className="h-5 w-5 mr-2" />
                  Report
                </Button>
              </DialogTrigger>
              <DialogContent>
                <ReportDialog initialEntityType="user" data={user} />
              </DialogContent>
            </Dialog>
          </div>

          {/*<div className="mb-6">
            <h2 className="text-xl font-bold px-2 py-1 w-fit rounded-md border border-neutral-200 shadow-sm dark:border-neutral-800">
              Recent Lists
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
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
              </div>
            ))}
          </div>*/}

          {/*<div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Favorite Games</h3>
            <div className="flex space-x-4">asd</div>
          </div>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Achievements</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <TrophyIcon className="h-6 w-6" />
                <div>
                  <p className="text-sm font-medium">Completionist</p>
                  <p className="text-xs text-gray-500">100% completion</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <TrophyIcon className="h-6 w-6" />
                <div>
                  <p className="text-sm font-medium">Speedrunner</p>
                  <p className="text-xs text-gray-500">Fastest time</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <TrophyIcon className="h-6 w-6" />
                <div>
                  <p className="text-sm font-medium">Collector</p>
                  <p className="text-xs text-gray-500">All collectibles</p>
                </div>
              </div>
            </div>
          </div>*/}
        </div>
        <div className="flex flex-col">
          <div className="mb-6">
            <h2 className="text-xl max-sm:w-full font-bold px-2 py-1 w-fit rounded-md border border-neutral-200 shadow-sm dark:border-neutral-800">
              Recently Played
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 rounded-md border border-neutral-200 shadow-sm dark:border-neutral-800 p-2">
            {user.user_games.map((userGame) => (
              <div
                key={userGame.id}
                className="border border-neutral-200 dark:border-neutral-800 bg-neutral-200 text-neutral-50 dark:bg-neutral-900 dark:text-neutral-50 rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:-translate-y-1 grid grid-cols-[100px_1fr]"
              >
                <Link href="" className="relative">
                  <Image
                    fill
                    alt={userGame.game.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    src={userGame.game.cover_url!}
                  />
                </Link>
                <div className="p-4">
                  <Link
                    href={`/game/${userGame.game.id}`}
                    className="hover:underline text-lg font-semibold mb-2 truncate max-w-64 block"
                  >
                    {userGame.game.title}
                  </Link>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Status:{" "}
                      {userGame.status.charAt(0).toUpperCase() +
                        userGame.status.slice(1)}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      Score:
                      <div className="flex items-center">
                        {[...Array(5)].map((_, index) => (
                          <StarIcon
                            key={index}
                            className={`h-4 w-4 ${
                              index < Math.round((userGame.rating ?? 0) / 2)
                                ? "text-yellow-500"
                                : "text-neutral-400"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

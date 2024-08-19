"use client";

import {
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSub,
  DropdownMenuSeparator,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { GamepadIcon, UserIcon, MenuIcon } from "lucide-react";

import Link from "next/link";

import { useAtom } from "jotai";
import { userAtom } from "@/lib/stores/user";
import { Dialog, DialogTrigger } from "./ui/dialog";
import EditUserDialog from "./updateuser";
import { API_URL, deleteCookie, shimmer, toBase64 } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { GameType } from "@/lib/types/game";
import { useEffect, useState } from "react";
import { useDebounceValue } from "@/lib/hooks/useDebounceValue";
import Image from "next/image";

export default function Header() {
  const [user] = useAtom(userAtom);

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState(search);

  const debouncedSearch = useDebounceValue(searchInput, 300); // 300ms delay

  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch, setSearch]);

  const { data: games, isLoading } = useQuery({
    queryKey: ["games_header", search],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/games?search=${search}`);
      return response.json<GameType[]>();
    },
  });

  return (
    <header className="flex justify-between items-center py-6 px-4 md:px-6 lg:px-8 bg-neutral-900 text-neutral-50 dark:bg-neutral-950 dark:text-neutral-50">
      <div className="flex items-center">
        <GamepadIcon className="h-8 w-8 mr-2" />
        <h1 className="text-2xl font-bold">GamingDex</h1>
        <nav className="hidden md:flex space-x-6 ml-6">
          <Link className="hover:text-neutral-300" href="/">
            Home
          </Link>
          <Link className="hover:text-neutral-300" href="/games">
            Games
          </Link>
          <Link className="hover:text-neutral-300" href="#">
            Profile
          </Link>
          <Link className="hover:text-neutral-300" href="#">
            About
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative min-w-72">
          <Input
            className="w-full"
            placeholder="Search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          {search && (
            <div className="absolute w-full top-14 left-0 border border-neutral-200 rounded-lg shadow-sm bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden group p-4">
              {isLoading ? (
                <p>loading</p>
              ) : (
                <>
                  {games?.attributes?.map((game) => (
                    <div
                      className="relative border border-neutral-200 rounded-lg shadow-sm bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden group"
                      key={game.id}
                    >
                      <Link
                        href={`/game/${game.id}`}
                        className="block relative h-72"
                      >
                        <Image
                          className="object-cover"
                          alt={game.title}
                          src={game.cover_url!}
                          placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(500, 300))}`}
                          fill
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-75 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <h3 className="text-white text-center text-lg font-semibold">
                            {game.title}
                          </h3>
                        </div>
                      </Link>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="text-neutral-50 hover:bg-neutral-800 dark:hover:bg-neutral-700 rounded-md"
                variant="ghost"
              >
                <UserIcon className="h-6 w-6 mr-2" />
                {user?.id && <p>{user?.username}</p>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-6 mr-12 mt-4">
              {user?.id && (
                <>
                  <DropdownMenuItem>
                    <Link href={`/user/${user.id}`}>Profile</Link>
                  </DropdownMenuItem>
                  <Dialog>
                    <DialogTrigger className="w-full">
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        Settings
                      </DropdownMenuItem>
                    </DialogTrigger>

                    <EditUserDialog />
                  </Dialog>
                </>
              )}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger disabled>
                  Interface Language
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>English</DropdownMenuItem>
                  <DropdownMenuItem>Chinese</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              {user?.id ? (
                <DropdownMenuItem>
                  <button
                    type="button"
                    onClick={() => {
                      deleteCookie("gd:accessToken");
                      deleteCookie("gd:refreshToken");
                    }}
                  >
                    Sign Out
                  </button>
                </DropdownMenuItem>
              ) : (
                <div className="flex flex-col gap-2 my-2">
                  <Button size="xs">Sign in</Button>
                  <Button size="xs" variant="outline">
                    Register
                  </Button>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="md:hidden">
            <Button size="icon" variant="outline">
              <MenuIcon className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

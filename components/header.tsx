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
import { Skeleton } from "@/components/ui/skeleton";

import { GamepadIcon, UserIcon, MenuIcon } from "lucide-react";

import Link from "next/link";

import { useAtom } from "jotai";
import { userAtom } from "@/lib/stores/user";
import { Dialog, DialogTrigger } from "./ui/dialog";
import EditUserDialog from "./updateuser";
import { API_URL, deleteCookie } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { GameType } from "@/lib/types/game";
import { useEffect, useRef, useState } from "react";
import { useDebounceValue } from "@/lib/hooks/useDebounceValue";

export default function Header() {
  const [user] = useAtom(userAtom);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState(search);

  const debouncedSearch = useDebounceValue(searchInput, 300); // 300ms delay

  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch, setSearch]);

  const { data: games, isLoading } = useQuery({
    enabled: !!search,
    queryKey: ["games_header", search],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/games?search=${search}`);
      return response.json<GameType[]>();
    },
  });

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Check if the blur is happening due to a click inside the dropdown
    if (
      dropdownRef.current &&
      (dropdownRef.current.contains(e.relatedTarget as Node) ||
        searchInputRef.current?.contains(e.relatedTarget as Node))
    ) {
      return;
    }
    // Reset the search input when focus is lost
    setSearchInput("");
    setSearch("");
  };

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
        <div
          className="relative min-w-72 transition-all duration-300 focus-within:min-w-[500px]"
          ref={dropdownRef}
        >
          <Input
            className="w-full transition-all duration-300 focus:w-[500px]"
            placeholder="Search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onBlur={handleBlur} // Reset search on blur
            ref={searchInputRef}
          />
          {search && (
            <div className="z-50 absolute flex flex-col gap-2 w-full top-14 left-0 border border-neutral-200 rounded-lg shadow-sm bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden group p-4">
              {isLoading ? (
                <div className="space-y-2">
                  {/* Show skeletons while loading */}
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 border border-neutral-400 rounded-lg shadow-sm bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-950 overflow-hidden"
                    >
                      <Skeleton className="w-14 h-14" />
                      <Skeleton className="h-6 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {games?.attributes?.map((game) => (
                    <div
                      className="relative border border-neutral-400 rounded-lg shadow-sm bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-950 overflow-hidden group"
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
                        <h3 className="font-semibold truncate">{game.title}</h3>
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
                  <Button asChild size="xs">
                    <Link href="/auth">Sign in</Link>
                  </Button>
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

"use client";

import {
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import {
  GamepadIcon,
  UserIcon,
  MenuIcon,
  SearchIcon,
  LogOutIcon,
} from "lucide-react";

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
import { Drawer, DrawerContent, DrawerOverlay } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";

export default function Header() {
  const [user] = useAtom(userAtom);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState(search);
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);

  const debouncedSearch = useDebounceValue(searchInput, 300);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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
    if (
      dropdownRef.current &&
      (dropdownRef.current.contains(e.relatedTarget as Node) ||
        searchInputRef.current?.contains(e.relatedTarget as Node))
    ) {
      return;
    }
    setSearchInput("");
    setSearch("");
  };

  return (
    <header className="flex justify-between items-center py-6 px-4 md:px-6 lg:px-8 bg-neutral-900 text-neutral-50 dark:bg-neutral-950 dark:text-neutral-50">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center">
          <GamepadIcon className="h-8 w-8 mr-2" />
          <h1 className="text-2xl font-bold">GamingDex</h1>
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link className="hover:text-neutral-300" href="/">
            Home
          </Link>
          <Link className="hover:text-neutral-300" href="/games">
            Games
          </Link>
          {user?.id && (
            <Link className="hover:text-neutral-300" href={`/user/${user?.id}`}>
              Profile
            </Link>
          )}
          <Link className="hover:text-neutral-300" href="/list">
            Lists
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div
          className="max-md:hidden relative w-64 transition-all duration-300 focus-within:w-80"
          ref={dropdownRef}
        >
          <Input
            className="max-md:hidden w-full transition-all duration-300"
            placeholder="Search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onBlur={handleBlur}
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
                          className="object-cover min-w-14 max-w-[3.5rem] h-14"
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

        <div className="hidden md:flex items-center">
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
            <DropdownMenuContent className="p-6 mt-4" align="end">
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
              <DropdownMenuSeparator />
              {user?.id ? (
                <DropdownMenuItem
                  onClick={() => {
                    deleteCookie("gd:accessToken");
                    deleteCookie("gd:refreshToken");
                  }}
                >
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              ) : (
                <div className="flex flex-col gap-2 my-2">
                  <Button asChild size="xs">
                    <Link href="/auth">Sign in</Link>
                  </Button>
                  <Button size="xs" variant="outline">
                    <Link href="/auth?m=r">Register</Link>
                  </Button>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={() => setIsSearchDrawerOpen(true)}
          >
            <SearchIcon className="h-6 w-6" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => setIsNavDrawerOpen(true)}
          >
            <MenuIcon className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Navigation Drawer for Mobile */}
      <Drawer
        fixed
        direction="left"
        open={isNavDrawerOpen}
        onOpenChange={setIsNavDrawerOpen}
      >
        <DrawerOverlay />
        <DrawerContent className="flex flex-col space-y-6 p-6 w-72 h-dvh">
          <Link
            href="/"
            className="hover:text-neutral-300"
            onClick={() => setIsNavDrawerOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/games"
            className="hover:text-neutral-300"
            onClick={() => setIsNavDrawerOpen(false)}
          >
            Games
          </Link>
          <Link
            href={`/user/${user?.id}`}
            className="hover:text-neutral-300"
            onClick={() => setIsNavDrawerOpen(false)}
          >
            Profile
          </Link>
          <Link
            href="/list"
            className="hover:text-neutral-300"
            onClick={() => setIsNavDrawerOpen(false)}
          >
            Lists
          </Link>
        </DrawerContent>
      </Drawer>

      {/* Search Drawer for Mobile */}
      <Drawer open={isSearchDrawerOpen} onOpenChange={setIsSearchDrawerOpen}>
        <DrawerOverlay />
        <DrawerContent className="flex flex-col space-y-6 p-6 w-full top-0">
          <Input
            placeholder="Search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full"
          />
          {search && (
            <div className="flex flex-col gap-2 relative">
              {isLoading ? (
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 overflow-hidden"
                    >
                      <Skeleton className="w-14 h-14" />
                      <Skeleton className="h-6 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : (
                games?.attributes?.map((game) => (
                  <Link
                    href={`/game/${game.id}`}
                    className="flex items-center gap-2 border border-neutral-200 dark:border-neutral-800 bg-neutral-200 text-neutral-50 dark:bg-neutral-900 dark:text-neutral-50 rounded-lg overflow-hidden"
                    key={game.id}
                    onClick={() => setIsSearchDrawerOpen(false)}
                  >
                    <img
                      className="object-cover w-14 h-14"
                      src={game.cover_url!}
                      alt={game.title}
                    />
                    <h3 className="font-semibold truncate">{game.title}</h3>
                  </Link>
                ))
              )}
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </header>
  );
}

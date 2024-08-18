"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GameType } from "@/lib/types/game";
import { API_URL, shimmer, toBase64 } from "@/lib/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PlusIcon, FilterXIcon } from "lucide-react";

import Image from "next/image";
import Link from "next/link";

import Pagination from "../ui/pagination";
import { useGamesContext } from "./context";
import { useEffect, useState } from "react";
import { useDebounceValue } from "@/lib/hooks/useDebounceValue";

export function GamesCards() {
  const { page, limit, search, sortBy, setPage } = useGamesContext();

  const { data } = useSuspenseQuery({
    queryKey: ["games", page, limit, sortBy, search],
    queryFn: async () => {
      const response = await fetch(
        `${API_URL}/games?page=${page}&limit=${limit}&order_by=${sortBy}&search=${search}`,
      );
      return response.json<GameType[]>();
    },
  });

  if (data.attributes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-xl text-gray-500 dark:text-gray-400">
          No games found
        </p>
        {search && (
          <p className="mt-2 text-gray-400 dark:text-gray-500">
            Try adjusting your search or filters
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {data?.attributes?.map((game) => (
          <div
            className="relative border border-neutral-200 rounded-lg shadow-sm bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden group"
            key={game.id}
          >
            <Link href={`/game/${game.id}`} className="block relative h-72">
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

      <Pagination total={data.pagination?.total!} onPageClick={setPage} />
    </div>
  );
}

export function GamesFilters() {
  const { sortBy, setSortBy, search, setSearch } = useGamesContext();

  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounceValue(searchInput, 300); // 300ms delay

  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch, setSearch]);

  function clearFilters() {
    setSearch("");
    setSortBy("");
  }

  return (
    <>
      <Input
        className=""
        placeholder="Search"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="created_at desc">Recently Added</SelectItem>
          <SelectItem value="created_at asc">Oldest Added</SelectItem>
          <SelectItem value="title asc">Title Ascending</SelectItem>
          <SelectItem value="title desc">Title Descending</SelectItem>
          <SelectItem value="year asc">Year Ascending</SelectItem>
          <SelectItem value="year desc">Year Descending</SelectItem>
          <SelectItem value="hypes desc">Most Popular</SelectItem>
          <SelectItem value="hypes asc">Least Popular</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Developer" />
        </SelectTrigger>
        <SelectContent>
          <Input placeholder="Search" />
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Publisher" />
        </SelectTrigger>
        <SelectContent>
          <Input placeholder="Search" />
        </SelectContent>
      </Select>
      <Button size="xs" variant="outline-destructive" onClick={clearFilters}>
        <FilterXIcon />
      </Button>
    </>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FilterXIcon, HeartIcon } from "lucide-react";
import Image from "next/image";
import { API_URL, cn, getCookie, shimmer, toBase64 } from "@/lib/utils";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import Pagination from "../ui/pagination";
import { useAtom } from "jotai";
import { userAtom } from "@/lib/stores/user";
import { UserList } from "@/lib/types/user";
import { useListsContext } from "./context";
import { useEffect, useState } from "react";
import { useDebounceValue } from "@/lib/hooks/useDebounceValue";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function ListsCards() {
  const { page, limit, search, sortBy, setPage } = useListsContext();
  const [user] = useAtom(userAtom);

  const queryClient = useQueryClient();

  const { data } = useSuspenseQuery({
    queryKey: ["lists", page, limit, sortBy, search],
    queryFn: async () => {
      const response = await fetch(
        `${API_URL}/list?page=${page}&limit=${limit}&includes=games,likes,user&order_by=${sortBy}&search=${search}`,
      );
      return response.json<UserList[]>();
    },
  });

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
      queryClient.invalidateQueries({
        queryKey: ["lists", page, limit, sortBy, search],
      });
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
      queryClient.invalidateQueries({
        queryKey: ["lists", page, limit, sortBy, search],
      });
    },
  });

  const handleLikeListToggle = (list: UserList) => {
    if (list.likes.find((like) => like.user_id == user?.id)) {
      unlikeList.mutate(list.id);
    } else {
      likeList.mutate(list.id);
    }
  };

  if (data.attributes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-xl text-gray-500 dark:text-gray-400">
          No lists found
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
    <div className="flex flex-col gap-6">
      {data?.attributes.map((list) => (
        <div
          key={list.id}
          className="rounded-lg p-4 border border-neutral-200 bg-neutral-200 text-neutral-950 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50"
        >
          {/* Layout para telas md: e maiores */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href={`/list/${list.id}`}
              className="flex items-center -space-x-6"
            >
              {list.games.map((game) => (
                <div
                  className="relative overflow-hidden rounded-lg block w-24 h-24 border border-black/50"
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

            <div className="flex flex-col self-start gap-2 w-full">
              <div className="flex items-center justify-between">
                <Link
                  href={`/list/${list.id}`}
                  className="text-lg mt-1 font-semibold block"
                >
                  {list.name}
                </Link>
                <p className="flex items-center gap-1">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    by
                  </span>
                  <Link
                    href={`/user/${list.user?.id}`}
                    className="underline text-neutral-800 dark:text-neutral-200"
                  >
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
                        list.likes.find((like) => like.user_id === user?.id) &&
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
              {list.description && (
                <p className="text-sm max-w-32 md:max-w-96 truncate break-words overflow-hidden text-neutral-600 dark:text-neutral-400">
                  {list.description.length > 150
                    ? list.description.slice(0, 150) + "..."
                    : list.description}
                </p>
              )}
            </div>
          </div>

          {/* Layout para telas menores que md: */}
          <div className="flex md:hidden flex-col">
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
              <span className="text-neutral-600 dark:text-neutral-400">by</span>
              <Link
                href={`/user/${list.user?.id}`}
                className="underline text-neutral-800 dark:text-neutral-200"
              >
                @{list.user?.username}
              </Link>
              <span className="text-neutral-600 dark:text-neutral-400">-</span>
              <span className="text-neutral-600 dark:text-neutral-400">
                {list.games_count} games
              </span>
            </p>
          </div>
        </div>
      ))}

      <Pagination total={data.pagination?.total!} onPageClick={setPage} />
    </div>
  );
}

export function ListsFilters() {
  const { sortBy, setSortBy, search, setSearch } = useListsContext();

  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounceValue(searchInput, 300);

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
        placeholder="Search lists"
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
          <SelectItem value="name asc">Name Ascending</SelectItem>
          <SelectItem value="name desc">Name Descending</SelectItem>
        </SelectContent>
      </Select>
      <Button size="xs" variant="outline-destructive" onClick={clearFilters}>
        <FilterXIcon />
      </Button>
    </>
  );
}

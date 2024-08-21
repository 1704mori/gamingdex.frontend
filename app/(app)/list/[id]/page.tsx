"use client";

import { UserList } from "@/lib/types/user";
import Image from "next/image";
import { API_URL, cn, getCookie, shimmer, toBase64 } from "@/lib/utils";
import { HeartIcon, LockIcon } from "lucide-react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { userAtom } from "@/lib/stores/user";
import { Skeleton } from "@/components/ui/skeleton";

export default function ListDisplay({
  params: { id },
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [user] = useAtom(userAtom);

  const {
    data: listData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["list", id],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/list/${id}`);
      return response.json<UserList>();
    },
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${API_URL}/list/${id}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getCookie("gd:accessToken")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to like the list");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list", id],
      });
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${API_URL}/list/${id}/like`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getCookie("gd:accessToken")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to unlike the list");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list", id],
      });
    },
  });

  const didILike = listData?.attributes.likes.some(
    (like) => like.user_id === user?.id,
  );

  const handleLikeToggle = () => {
    if (didILike) {
      unlikeMutation.mutate();
    } else {
      likeMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-6 w-24" />

        <div className="grid grid-cols-1 gap-6 mt-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="relative border border-neutral-200 rounded-lg shadow-sm bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden"
            >
              <div className="flex items-center gap-4 relative">
                <Skeleton className="w-24 h-24 rounded-md" />
                <Skeleton className="h-6 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !listData?.attributes) {
    return <p>Failed to load list. Please try again later.</p>;
  }

  if (
    listData.attributes.is_private &&
    listData.attributes.user_id !== user?.id
  ) {
    return (
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="text-center">
          <LockIcon className="w-12 h-12 mx-auto text-neutral-500 mb-4" />
          <p className="text-xl font-semibold">This list is private.</p>
          <p className="text-neutral-600 dark:text-neutral-400">
            You don’t have permission to view this list.
          </p>
        </div>
      </div>
    );
  }

  const isCustomOrder = listData?.attributes.ordering === "custom";

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-4">
            {listData?.attributes.name}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Created by{" "}
            <Link
              href={`/user/${listData?.attributes.user?.id}`}
              className="underline text-neutral-800 dark:text-neutral-200"
            >
              @{listData?.attributes.user?.username}
            </Link>
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={handleLikeToggle} variant="outline">
            <HeartIcon
              className={cn("w-5 h-5 mr-1", didILike && "text-red-500")}
            />
            {Intl.NumberFormat("en", { notation: "compact" }).format(
              listData?.attributes.likes.length,
            )}{" "}
            Likes
          </Button>
        </div>
      </div>
      <span className="text-sm prose dark:prose-invert mt-4 break-words">
        {listData.attributes.description}
      </span>

      <div className="grid grid-cols-1 gap-6 mt-8">
        {listData?.attributes.games.map((game) => (
          <div
            className="relative border border-neutral-200 rounded-lg shadow-sm bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden group"
            key={game.id}
          >
            <Link
              href={`/game/${game.game?.id}`}
              className="flex items-center gap-4 relative"
              onMouseDown={(e) => e.preventDefault()} // Prevent blur from triggering before navigation
            >
              <div className="relative w-24 h-24 min-w-[96px] min-h-[96px]">
                <Image
                  className="object-cover rounded-md"
                  src={game.game?.cover_url!}
                  alt={game.game?.title!}
                  layout="fixed"
                  width={96}
                  height={96}
                  placeholder="blur"
                  blurDataURL={`data:image/svg+xml;base64,${toBase64(
                    shimmer(96, 96),
                  )}`}
                />
              </div>
              <h3 className="font-semibold truncate">
                {isCustomOrder || listData.attributes.is_ranked
                  ? `${game.order + 1}. `
                  : ""}
                {game.game?.title}
              </h3>
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Button variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    </div>
  );
}

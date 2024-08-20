"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { DndContext } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { ListOrdering, UserList } from "@/lib/types/user";
import { API_URL, getCookie } from "@/lib/utils";
import GameSearchInput from "@/components/List/gamesearchinput";
import SortableItem from "@/components/List/sortableitem";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

export type EditListType = {
  name?: string;
  description?: string;
  is_ranked?: boolean;
  is_private?: boolean;
  ordering?: string;
  games?: {
    game_id: string;
    note?: string;
    order?: number;
    game: { title: string; cover_url: string };
  }[];
};

export default function EditGameListPage() {
  const router = useRouter();
  const { id: listId } = useParams();

  const [list, setList] = useState<EditListType | null>(null);

  useEffect(() => {
    if (listId) {
      // Fetch the list data
      fetch(`${API_URL}/list/${listId}`, {
        headers: {
          Authorization: `Bearer ${getCookie("gd:accessToken")}`,
        },
      })
        .then((res) => res.json<UserList>())
        .then(({ attributes: data }) => {
          // Ensure the order is set for custom ordering
          if (data.ordering === "custom") {
            data.games = data.games.map((game, index: number) => ({
              ...game,
              order: index,
            }));
          }
          setList({
            ...data,
            games: data.games.map((game) => ({
              game_id: game.game_id,
              note: game.note,
              order: game.order,
              game: {
                title: game.game!.title!,
                cover_url: game.game!.cover_url!,
              },
            })),
          });
        });
    }
  }, [listId]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setList((prev) => {
        if (!prev) return null;

        const oldIndex = prev.games?.findIndex(
          (game) => game.game_id === active.id,
        );
        const newIndex = prev.games?.findIndex(
          (game) => game.game_id === over.id,
        );

        const newGames = arrayMove(prev.games!, oldIndex!, newIndex!).map(
          (game, index) => ({
            ...game,
            order: index, // Atualiza a ordem automaticamente
          }),
        );

        return {
          ...prev,
          games: newGames,
          ordering: "custom", // Define a ordenação automaticamente para "custom" ao mover os cards
        };
      });
    }
  };

  const handleSave = async () => {
    if (!list) return;

    const response = await fetch(`${API_URL}/list/${listId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("gd:accessToken")}`,
      },
      body: JSON.stringify(list),
    });
  };

  const handleOrderingChange = (value: ListOrdering) => {
    setList((prev) => {
      if (!prev) return null;

      const updatedGames =
        value === "custom"
          ? prev.games?.map((game, index) => ({
              ...game,
              order: index,
            }))
          : prev.games?.map((game) => ({
              ...game,
              order: undefined,
            }));

      return {
        ...prev,
        ordering: value,
        games: updatedGames,
      };
    });
  };

  if (!list) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Edit List: {list.name || "Untitled List"}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex max-sm:flex-col md:items-center gap-4">
            <Input
              type="text"
              value={list.name}
              onChange={(e) =>
                setList((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="List Name"
            />
            <Select value={list.ordering} onValueChange={handleOrderingChange}>
              <SelectTrigger className="md:max-w-60">
                <SelectValue>
                  {list.ordering
                    ? list.ordering === "alphabetical"
                      ? "Alphabetical"
                      : list.ordering === "release_date"
                        ? "Release Date"
                        : list.ordering === "user_rating"
                          ? "User Rating"
                          : list.ordering === "custom"
                            ? "Custom"
                            : "List Ordering"
                    : "List Ordering"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
                <SelectItem value="release_date">Release Date</SelectItem>
                <SelectItem value="user_rating">User Rating</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            <TooltipProvider delayDuration={100}>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isRanked"
                  checked={list.is_ranked}
                  onCheckedChange={(checked) =>
                    setList((prev) => ({
                      ...prev,
                      is_ranked: checked === true,
                    }))
                  }
                />
                <label
                  htmlFor="isRanked"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Ranked
                </label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="w-4 h-4 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      If enabled, this list will be ranked and numbered in
                      ascending order.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPrivate"
                  checked={list.is_private}
                  onCheckedChange={(checked) =>
                    setList((prev) => ({
                      ...prev,
                      is_private: checked === true,
                    }))
                  }
                />
                <label
                  htmlFor="isPrivate"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Private
                </label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="w-4 h-4 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>If enabled, this list will only be visible to you.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
          <div>
            <Textarea
              value={list.description || ""}
              onChange={(e) =>
                setList((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="List Description"
            />
          </div>

          <GameSearchInput
            onGameSelect={(game) =>
              setList((prev) => ({
                ...prev,
                games: [
                  ...prev?.games!,
                  {
                    game_id: game.id,
                    note: "",
                    game: {
                      title: game.title,
                      cover_url: game.cover_url!,
                    },
                    order:
                      list.ordering === "custom"
                        ? prev?.games!.length
                        : undefined,
                  },
                ],
              }))
            }
          />

          <p className="text-sm text-neutral-400 font-medium">
            Tip: Drag and drop games to reorder them. This will automatically
            set your list to 'Custom' sorting.
          </p>
          <DndContext onDragEnd={handleDragEnd}>
            <SortableContext
              items={list.games!.map((game) => game.game_id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {list.games!.length > 0 ? (
                  list.games!.map((game) => (
                    <SortableItem
                      key={game.game_id}
                      id={game.game_id}
                      game={game}
                      setList={setList}
                    />
                  ))
                ) : (
                  <p>Add some games</p>
                )}
              </div>
            </SortableContext>
          </DndContext>

          <div className="mt-4 flex space-x-4">
            <Button variant="default" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

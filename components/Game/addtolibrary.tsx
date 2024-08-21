"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { API_URL, cn, getCookie } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAtom } from "jotai";
import { userAtom } from "@/lib/stores/user";
import { GAME_RATINGS, GameType, UserGame } from "@/lib/types/game";
import {
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

const gameLibrarySchema = z.object({
  rating: z.number().min(0).max(10).nullable(),
  mastered: z.boolean().optional().default(false),
  played_on: z.string().min(1),
  status: z.string().min(1),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
});

type GameLibraryFormData = z.infer<typeof gameLibrarySchema>;

export default function AddToLibrary({ gameId }: { gameId: string }) {
  const [user] = useAtom(userAtom);

  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState("");
  const [playedOn, setPlayedOn] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [mastered, setMastered] = useState(false);

  const { data: gameData } = useQuery({
    queryKey: ["game_addlibrary", gameId],
    queryFn: async () => {
      const response = await fetch(
        `${API_URL}/games/${gameId}?includes=platforms`,
      );
      return response.json<GameType>();
    },
  });

  const { data: libraryStatus } = useQuery({
    queryKey: ["game_status", gameId],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/games/${gameId}/library`, {
        headers: {
          Authorization: `Bearer ${getCookie("gd:accessToken")}`,
        },
      });

      const result = await response.json<UserGame>();
      setRating(result.attributes.rating);
      setStatus(result.attributes.status);
      setPlayedOn(result.attributes.played_on);
      setStartDate(result.attributes.start_date!);
      setEndDate(result.attributes.end_date!);
      setMastered(result.attributes.mastered);

      return result;
    },
    refetchOnWindowFocus: false,
    enabled: !!user?.id,
  });

  const mutation = useMutation({
    mutationFn: async (data: GameLibraryFormData) => {
      const url = libraryStatus
        ? `${API_URL}/games/${gameId}/library`
        : `${API_URL}/games/${gameId}/library`;
      const method = libraryStatus?.attributes?.id ? "PUT" : "POST";

      const payload: Partial<GameLibraryFormData> = {};
      if (data.rating !== null) payload.rating = data.rating;
      if (data.mastered !== undefined) payload.mastered = data.mastered;
      if (data.played_on) payload.played_on = data.played_on;
      if (data.status) payload.status = data.status;
      if (data.start_date) payload.start_date = data.start_date;
      if (data.end_date) payload.end_date = data.end_date;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("gd:accessToken")}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        toast.error(result.message || "Something went wrong.");
        return;
      }

      toast.success(
        libraryStatus ? "Game updated successfully" : "Game added successfully",
      );
    },
  });

  const onSubmit = (e: any) => {
    e.preventDefault();
    mutation.mutate({
      status,
      rating,
      played_on: playedOn,
      start_date: startDate,
      end_date: endDate,
      mastered,
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {libraryStatus?.attributes?.id ? "Update" : "Add to"} library
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={onSubmit} className="flex flex-col gap-4 mt-2">
        <div className="flex md:items-center justify-between max-sm:flex-col max-sm:gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-4">
              <Select
                onValueChange={(value) => setRating(Number(value))}
                value={rating.toString()}
              >
                <SelectTrigger className="w-[179px]">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Unplayable</SelectItem>
                  <SelectItem value="2">Frustrating</SelectItem>
                  <SelectItem value="3">Disappointing</SelectItem>
                  <SelectItem value="4">Mediocre</SelectItem>
                  <SelectItem value="5">Average</SelectItem>
                  <SelectItem value="6">Decent</SelectItem>
                  <SelectItem value="7">Good</SelectItem>
                  <SelectItem value="8">Great</SelectItem>
                  <SelectItem value="9">Excellent</SelectItem>
                  <SelectItem value="10">Masterpiece</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <Select onValueChange={setStatus} value={status}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="playing">Playing</SelectItem>
                  <SelectItem value="on_hold">On-Hold</SelectItem>
                  <SelectItem value="dropped">Dropped</SelectItem>
                  <SelectItem value="plan_to_play">Plan To Play</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Checkbox
              id="mastered"
              checked={mastered}
              onCheckedChange={(state) => setMastered(state === true)}
            />
            <label htmlFor="mastered">Mastered</label>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {playedOn && (
            <Select onValueChange={setPlayedOn} value={playedOn}>
              <SelectTrigger className="ww-[180px]">
                <SelectValue placeholder="Played on" />
              </SelectTrigger>
              <SelectContent>
                {gameData?.attributes.platforms.map((platform) => (
                  <SelectItem key={platform.id} value={platform.id}>
                    {platform.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Popover modal={true}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "ww-[280px] justify-start text-left font-normal",
                  !startDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? (
                  Intl.DateTimeFormat(undefined, {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  }).format(new Date(startDate))
                ) : (
                  <span>Start Date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate ? new Date(startDate) : undefined}
                onSelect={(date) => setStartDate(date?.toISOString()!)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover modal={true}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "ww-[280px] justify-start text-left font-normal",
                  !endDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? (
                  Intl.DateTimeFormat(undefined, {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  }).format(new Date(endDate))
                ) : (
                  <span>End Date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate ? new Date(endDate) : undefined}
                onSelect={(date) => setEndDate(date?.toISOString()!)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline-destructive" type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" className="max-sm:mb-2">
            {libraryStatus?.attributes?.id ? "Update" : "Add"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}

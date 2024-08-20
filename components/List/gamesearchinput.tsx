import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { GameType } from "@/lib/types/game";
import { useDebounceValue } from "@/lib/hooks/useDebounceValue";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/lib/utils";

export default function GameSearchInput({
  onGameSelect,
}: {
  onGameSelect: (game: GameType) => void;
}) {
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState(search);

  const debouncedSearch = useDebounceValue(searchInput, 300);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch]);

  const { data: games, isLoading } = useQuery({
    enabled: !!search,
    queryKey: ["games_search", search],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/games?search=${search}`);
      return response.json<GameType[]>();
    },
  });

  return (
    <div className="">
      <Input
        ref={searchInputRef}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search for a game..."
      />
      {search && (
        <div className="mt-2 space-y-2 px-4 py-2 overflow-y-scroll max-h-48 border border-neutral-400 rounded-lg shadow-sm bg-neutral-200 dark:border-neutral-800 dark:bg-neutral-900">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            games?.attributes.map((game) => (
              <button
                className="w-full flex items-center gap-2 relative border border-neutral-400 rounded-lg shadow-sm bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-950 overflow-hidden group"
                onClick={() => onGameSelect(game)}
                key={game.id}
              >
                <img
                  className="object-cover w-14 h-14"
                  src={game.cover_url!}
                  alt={game.title}
                />
                <h3 className="font-semibold truncate">{game.title}</h3>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

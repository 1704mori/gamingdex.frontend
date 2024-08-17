"use client";

import { createContext, useContext, useState } from "react";

type Definitions = {
  page: number;
  setPage: (page: number) => void;
  limit: number;
  setLimit: (limit: number) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  search: string;
  setSearch: (search: string) => void;
};

const GamesContext = createContext<Definitions>({} as Definitions);

export function GamesProvider({ children }: { children: React.ReactNode }) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [sortBy, setSortBy] = useState("");
  const [search, setSearch] = useState("");

  return (
    <GamesContext.Provider
      value={{
        page,
        setPage,
        limit,
        setLimit,
        sortBy,
        setSortBy,
        search,
        setSearch,
      }}
    >
      {children}
    </GamesContext.Provider>
  );
}

export function useGamesContext() {
  return useContext(GamesContext);
}

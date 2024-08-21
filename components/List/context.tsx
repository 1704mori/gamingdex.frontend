"use client";

import { createContext, useContext, useState } from "react";

type ListsContextType = {
  page: number;
  limit: number;
  search: string;
  sortBy: string;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearch: (search: string) => void;
  setSortBy: (sortBy: string) => void;
};

const ListsContext = createContext<ListsContextType | undefined>(undefined);

export function ListsProvider({ children }: { children: React.ReactNode }) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");

  const value = {
    page,
    limit,
    search,
    sortBy,
    setPage,
    setLimit,
    setSearch,
    setSortBy,
  };

  return (
    <ListsContext.Provider value={value}>{children}</ListsContext.Provider>
  );
}

export function useListsContext() {
  const context = useContext(ListsContext);
  if (!context) {
    throw new Error("useListsContext must be used within a ListsProvider");
  }
  return context;
}

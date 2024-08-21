"use client";

import { ListsCards, ListsFilters } from "@/components/List";
import { ListsProvider } from "@/components/List/context";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function Lists() {
  return (
    <ListsProvider>
      <section className="py-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-end gap-2 mb-4">
            <ListsFilters />
          </div>
          <div className="flex flex-col gap-2">
            <Suspense
              fallback={
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div
                      key={i}
                      className="relative border border-neutral-200 rounded-lg shadow-sm bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden p-4"
                    >
                      {/* Skeleton for the image */}
                      <Skeleton className="h-40 w-full rounded-md mb-4" />
                      {/* Skeleton for the title */}
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      {/* Skeleton for the description */}
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  ))}
                </div>
              }
            >
              <ListsCards />
            </Suspense>
          </div>
        </div>
      </section>
    </ListsProvider>
  );
}

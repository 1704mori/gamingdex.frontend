import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { GamesFilters, GamesCards } from "@/components/Games";
import { GamesProvider } from "@/components/Games/context";

export default function Games() {
  return (
    <GamesProvider>
      <section className="py-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-end gap-2 mb-4">
            <GamesFilters />
          </div>
          <div className="flex flex-col gap-2">
            <Suspense
              fallback={
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div
                      key={i}
                      className="relative border border-neutral-200 rounded-lg shadow-sm bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden"
                    >
                      <Skeleton className="h-72 w-72" />
                    </div>
                  ))}
                </div>
              }
            >
              <GamesCards />
            </Suspense>
          </div>
        </div>
      </section>
    </GamesProvider>
  );
}

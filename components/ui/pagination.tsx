import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface IPagination {
  total: number;
  perPage?: number;
  onPageClick: (page: number) => void;
  maxButtons?: number;
}

export default function Pagination({
  total,
  perPage = 10,
  onPageClick,
  maxButtons = 5,
}: IPagination) {
  const numPages = Math.ceil(total / perPage);
  const [currentPage, setCurrentPage] = React.useState(1);

  const handleClick = (page: number) => {
    setCurrentPage(page);
    onPageClick(page);
  };

  const renderPageButtons = () => {
    const buttons: JSX.Element[] = [];
    const maxPagesToShow = Math.min(maxButtons, numPages);
    const halfWay = Math.ceil(maxPagesToShow / 2);
    let startPage = Math.max(1, currentPage - halfWay);
    let endPage = startPage + maxPagesToShow - 1;

    if (endPage > numPages) {
      endPage = numPages;
      startPage = Math.max(1, numPages - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          className={cn(
            "flex items-center justify-center w-min min-w-[2rem] h-8 p-2 m-1 font-medium cursor-pointer rounded-full transition-colors",
            i === currentPage &&
              "bg-neutral-900 text-neutral-50 enabled:hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:enabled:hover:bg-neutral-50/90",
          )}
          disabled={currentPage === i}
          onClick={() => handleClick(i)}
        >
          {i}
        </button>,
      );
    }
    return buttons;
  };

  return (
    <div className="flex items-center flex-wrap justify-center m-auto py-1">
      <button
        className="flex items-center px-2 m-1 h-8 rounded-lg transition-colors bg-neutral-900 text-neutral-50 enabled:hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:enabled:hover:bg-neutral-50/90"
        onClick={() => currentPage > 1 && handleClick(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ArrowLeft />
        <span className="text-sm font-medium">Back</span>
      </button>
      {renderPageButtons()}
      <button
        className="flex items-center px-2 m-1 h-8 rounded-lg transition-colors bg-neutral-900 text-neutral-50 enabled:hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:enabled:hover:bg-neutral-50/90"
        onClick={() => currentPage < numPages && handleClick(currentPage + 1)}
        disabled={currentPage === numPages}
      >
        <span className="text-sm font-medium">Next</span>
        <ArrowRight />
      </button>
    </div>
  );
}

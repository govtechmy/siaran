"use client";

import React from "react";
import RightArrow from "../icons/rightarrow";
import LeftArrow from "../icons/leftarrow";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPage,
}) => {
  const getPageNumbers = () => {
    const pageNumbers = [];

    pageNumbers.push(1);

    if (currentPage > 2) {
      pageNumbers.push("ellipsis-start");
    }

    let startPage, endPage;
    if (currentPage <= 2) {
      startPage = 2;
      endPage = Math.min(4, totalPages - 1);
    } else if (currentPage >= totalPages - 2) {
      startPage = Math.max(2, totalPages - 3);
      endPage = totalPages - 1;
    } else {
      startPage = currentPage - 1;
      endPage = currentPage + 1;
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (currentPage < totalPages - 2) {
      pageNumbers.push("ellipsis-end");
    }

    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const renderPageNumbers = () => {
    const pageNumbers = getPageNumbers();

    return (
      <div className="flex items-center rounded">
        {pageNumbers.map((pageNumber, index) => {
          if (typeof pageNumber === "number") {
            return (
              <button
                key={index}
                onClick={() => onPage(pageNumber)}
                className={`h-10 w-10 rounded-lg ${
                  pageNumber === currentPage
                    ? "bg-[#FFF6ED] text-[#DD420A]"
                    : "bg-transparent text-black-700 dark:text-[#D4D4D8]"
                }`}
              >
                {pageNumber}
              </button>
            );
          } else {
            return (
              <span key={index} className="px-2 py-2">
                ...
              </span>
            );
          }
        })}
      </div>
    );
  };

  return (
    <div className="mt-4 flex items-center justify-center rounded-lg pb-7">
      <button
        onClick={() => onPage(currentPage - 1)}
        disabled={currentPage === 1}
        className={`h-10 w-10 rounded-lg border-[1px] border-[#E4E4E7] bg-[#FFFFFF] text-[#FFFFFF] shadow-button dark:border-[#27272A] dark:bg-[#18181B] ${
          currentPage === 1 ? "opacity-30" : "opacity-100"
        }`}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-lg">
          <div className="flex h-5 w-5 items-center justify-center">
            <LeftArrow className="stroke-[#18181B] dark:stroke-[#FFFFFF]" />
          </div>
        </div>
      </button>

      <div className="rounded-lg p-3">{renderPageNumbers()}</div>

      <button
        onClick={() => onPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`h-10 w-10 rounded-lg border-[1px] border-[#E4E4E7] bg-[#FFFFFF] text-[#FFFFFF] shadow-button dark:border-[#27272A] dark:bg-[#18181B] ${
          currentPage === totalPages ? "opacity-30" : "opacity-100"
        }`}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-lg">
          <div className="flex h-5 w-5 items-center justify-center">
            <RightArrow className="stroke-[#18181B] dark:stroke-[#FFFFFF]" />
          </div>
        </div>
      </button>
    </div>
  );
};

export default Pagination;

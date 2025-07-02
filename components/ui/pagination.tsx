"use client";
import * as React from "react";
import { Button } from "./button";

interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, pageCount, onPageChange }: PaginationProps) {
  return (
    <nav className="flex items-center justify-center gap-4 mt-8">
      <Button
        variant="outline"
        size="sm"
        className="liquid-bg liquid-hover text-black dark:text-white border-black dark:border-white"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        &lt;
      </Button>
      <span className="px-4 text-lg text-black dark:text-white font-bold">
        Page {page} of {pageCount}
      </span>
      <Button
        variant="outline"
        size="sm"
        className="liquid-bg liquid-hover text-black dark:text-white border-black dark:border-white"
        onClick={() => onPageChange(page + 1)}
        disabled={page === pageCount}
      >
        &gt;
      </Button>
    </nav>
  );
}

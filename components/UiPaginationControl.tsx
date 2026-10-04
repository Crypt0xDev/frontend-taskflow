"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type UiPaginationControlProps = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
};

function pageWindow(page: number, pageCount: number): (number | "ellipsis")[] {
  const items: (number | "ellipsis")[] = [];
  const window = new Set([1, pageCount, page, page - 1, page + 1]);

  let prev: number | undefined;
  for (let i = 1; i <= pageCount; i++) {
    if (!window.has(i)) continue;
    if (prev !== undefined && i - prev > 1) items.push("ellipsis");
    items.push(i);
    prev = i;
  }

  return items;
}

export function UiPaginationControl({ page, pageCount, onPageChange }: UiPaginationControlProps) {
  if (pageCount <= 1) return null;

  return (
    <Pagination>
      <PaginationContent className="flex-wrap justify-center gap-y-2">
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onPageChange(Math.max(1, page - 1));
            }}
          />
        </PaginationItem>
        {pageWindow(page, pageCount).map((item, i) =>
          item === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                href="#"
                isActive={page === item}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(item);
                }}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onPageChange(Math.min(pageCount, page + 1));
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

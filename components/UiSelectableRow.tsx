"use client";

import type { ComponentProps } from "react";

import { TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

type Props = ComponentProps<typeof TableRow> & {
  selected: boolean;
  onSelect: () => void;
};

export function UiSelectableRow({ selected, onSelect, className, ...props }: Props) {
  return (
    <TableRow
      data-state={selected ? "selected" : undefined}
      onClick={onSelect}
      className={cn("cursor-pointer", className)}
      {...props}
    />
  );
}

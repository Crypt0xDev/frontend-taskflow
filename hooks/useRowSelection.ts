"use client";

import { useCallback, useMemo, useState } from "react";

export function useRowSelection<T extends { id: number }>(rows: T[]) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selected = useMemo(
    () => (selectedId === null ? null : rows.find((row) => row.id === selectedId) ?? null),
    [rows, selectedId],
  );

  const toggle = useCallback(
    (row: T) => setSelectedId((prev) => (prev === row.id ? null : row.id)),
    [],
  );

  const clear = useCallback(() => setSelectedId(null), []);

  const isSelected = useCallback((row: T) => row.id === selected?.id, [selected]);

  return { selected, hasSelection: selected !== null, toggle, clear, isSelected };
}

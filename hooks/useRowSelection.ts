"use client";

import { useCallback, useState } from "react";

export function useRowSelection<T extends { id: number }>() {
  const [selected, setSelected] = useState<T | null>(null);

  const toggle = useCallback(
    (row: T) => setSelected((prev) => (prev?.id === row.id ? null : row)),
    [],
  );

  const clear = useCallback(() => setSelected(null), []);

  const isSelected = useCallback((row: T) => row.id === selected?.id, [selected]);

  return { selected, hasSelection: selected !== null, toggle, clear, isSelected };
}

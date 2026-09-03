"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/api";
import { deferMicrotask } from "@/lib/utils";

function msg(error: unknown): string {
  return error instanceof ApiError ? error.message : "Ocurrió un error inesperado.";
}

type TrashMessages = {
  restored: string;
  deleted: string;
  restoredAll: string;
  emptied: string;
};

const DEFAULT_MESSAGES: TrashMessages = {
  restored: "Restaurado.",
  deleted: "Eliminado definitivamente.",
  restoredAll: "Se restauró todo.",
  emptied: "Papelera vaciada.",
};

export function useTrash<T extends { id: number }>(
  enabled: boolean,
  list: () => Promise<T[]>,
  restore: (id: number) => Promise<unknown>,
  forceRemove: (id: number) => Promise<unknown>,
  messages: Partial<TrashMessages> = {},
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const fns = useRef({ list, restore, forceRemove, messages: { ...DEFAULT_MESSAGES, ...messages } });
  useEffect(() => {
    fns.current = { list, restore, forceRemove, messages: { ...DEFAULT_MESSAGES, ...messages } };
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await fns.current.list());
    } catch (error) {
      toast.error(msg(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (enabled) deferMicrotask(load);
  }, [enabled, load]);

  const restoreOne = useCallback(async (id: number) => {
    try {
      await fns.current.restore(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success(fns.current.messages.restored);
      return true;
    } catch (error) {
      toast.error(msg(error));
      return false;
    }
  }, []);

  const forceOne = useCallback(async (id: number) => {
    try {
      await fns.current.forceRemove(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success(fns.current.messages.deleted);
      return true;
    } catch (error) {
      toast.error(msg(error));
      return false;
    }
  }, []);

  const restoreAll = useCallback(async () => {
    const ids = items.map((i) => i.id);
    if (ids.length === 0) return false;
    try {
      await Promise.all(ids.map((id) => fns.current.restore(id)));
      setItems([]);
      toast.success(fns.current.messages.restoredAll);
      return true;
    } catch (error) {
      toast.error(msg(error));
      await load();
      return false;
    }
  }, [items, load]);

  const forceAll = useCallback(async () => {
    const ids = items.map((i) => i.id);
    if (ids.length === 0) return false;
    try {
      await Promise.all(ids.map((id) => fns.current.forceRemove(id)));
      setItems([]);
      toast.success(fns.current.messages.emptied);
      return true;
    } catch (error) {
      toast.error(msg(error));
      await load();
      return false;
    }
  }, [items, load]);

  return { items, loading, restoreOne, forceOne, restoreAll, forceAll };
}

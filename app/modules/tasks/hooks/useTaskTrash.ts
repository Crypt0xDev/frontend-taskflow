"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/api";

import { serviceTaskForceDelete } from "../services/serviceTaskForceDelete";
import { serviceTaskRestore } from "../services/serviceTaskRestore";
import { serviceTaskTrashed } from "../services/serviceTaskTrashed";
import type { Task } from "../type/typeTaskBase";

function errorMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : "Ocurrió un error inesperado.";
}

export function useTaskTrash(enabled: boolean) {
  const [items, setItems] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await serviceTaskTrashed());
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (enabled) void Promise.resolve().then(load);
  }, [enabled, load]);

  const restore = useCallback(async (id: number) => {
    try {
      await serviceTaskRestore(id);
      setItems((prev) => prev.filter((t) => t.id !== id));
      toast.success("Tarea restaurada.");
      return true;
    } catch (error) {
      toast.error(errorMessage(error));
      return false;
    }
  }, []);

  const forceRemove = useCallback(async (id: number) => {
    try {
      await serviceTaskForceDelete(id);
      setItems((prev) => prev.filter((t) => t.id !== id));
      toast.success("Tarea eliminada definitivamente.");
      return true;
    } catch (error) {
      toast.error(errorMessage(error));
      return false;
    }
  }, []);

  const restoreAll = useCallback(async () => {
    const ids = items.map((t) => t.id);
    if (ids.length === 0) return false;
    try {
      await Promise.all(ids.map((id) => serviceTaskRestore(id)));
      setItems([]);
      toast.success("Se restauraron todas las tareas.");
      return true;
    } catch (error) {
      toast.error(errorMessage(error));
      await load();
      return false;
    }
  }, [items, load]);

  const forceRemoveAll = useCallback(async () => {
    const ids = items.map((t) => t.id);
    if (ids.length === 0) return false;
    try {
      await Promise.all(ids.map((id) => serviceTaskForceDelete(id)));
      setItems([]);
      toast.success("Papelera vaciada.");
      return true;
    } catch (error) {
      toast.error(errorMessage(error));
      await load();
      return false;
    }
  }, [items, load]);

  return { items, loading, restore, forceRemove, restoreAll, forceRemoveAll };
}

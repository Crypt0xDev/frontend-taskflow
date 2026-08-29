"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/api";

import { serviceTaskList } from "../services/serviceTaskList";
import type { Task } from "../type/typeTaskBase";

export function useTaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const load = useCallback(async (q?: string) => {
    setLoading(true);
    try {
      setTasks(await serviceTaskList(q));
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "No se pudieron cargar las tareas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handle = setTimeout(() => load(query.trim() || undefined), query ? 300 : 0);
    return () => clearTimeout(handle);
  }, [query, load]);

  return { tasks, loading, query, setQuery, reload: () => load(query.trim() || undefined) };
}

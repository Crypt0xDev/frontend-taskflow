"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { serviceCategoryList } from "@/app/modules/categories/services";
import { serviceTaskList } from "@/app/modules/tasks/services";
import type { Task } from "@/app/modules/tasks/type";
import { ApiError } from "@/lib/api";

export type DashboardStats = {
  pending: number;
  in_progress: number;
  completed: number;
  categories: number;
  total: number;
  pct: number;
};

export function useDashboardSummary() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recent, setRecent] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const [tasks, categories] = await Promise.all([serviceTaskList(), serviceCategoryList()]);
        if (!active) return;

        const by = (status: Task["status"]) => tasks.filter((t) => t.status === status).length;
        const completed = by("completed");
        const total = tasks.length;

        setStats({
          pending: by("pending"),
          in_progress: by("in_progress"),
          completed,
          categories: categories.length,
          total,
          pct: total ? Math.round((completed / total) * 100) : 0,
        });
        setRecent(tasks.slice(0, 5));
      } catch (error) {
        if (active) {
          toast.error(error instanceof ApiError ? error.message : "No se pudo cargar el panel.");
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return { stats, recent, loading };
}

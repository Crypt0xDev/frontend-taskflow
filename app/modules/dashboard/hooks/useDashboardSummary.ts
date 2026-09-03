"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { serviceCategoryList } from "@/app/modules/categories/services";
import { serviceTaskList } from "@/app/modules/tasks/services";
import type { Task } from "@/app/modules/tasks/type";
import { ApiError } from "@/lib/api";
import { useSession } from "@/lib/session";

import type { DashboardStats } from "../type/typeDashboardStats";

export function useDashboardSummary() {
  const { hasPermission } = useSession();
  const canViewTasks = hasPermission("tasks", "view");
  const canViewCategories = hasPermission("categories", "view");

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recent, setRecent] = useState<Task[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!canViewTasks) return;

    let active = true;

    (async () => {
      try {
        const [tasks, categories] = await Promise.all([
          serviceTaskList(),
          canViewCategories ? serviceCategoryList() : Promise.resolve([]),
        ]);
        if (!active) return;

        const by = (status: Task["status"]) => tasks.filter((t) => t.status === status).length;
        const completed = by("completed");
        const total = tasks.length;

        const todayKey = new Date().toISOString().slice(0, 10);
        const pending = tasks.filter((t) => t.status !== "completed" && t.due_date);
        const overdue = pending.filter((t) => t.due_date!.slice(0, 10) < todayKey).length;
        const dueToday = pending.filter((t) => t.due_date!.slice(0, 10) === todayKey).length;

        setStats({
          pending: by("pending"),
          in_progress: by("in_progress"),
          completed,
          overdue,
          dueToday,
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
        if (active) setFetching(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [canViewTasks, canViewCategories]);

  return { stats, recent, loading: canViewTasks && fetching, canViewTasks, canViewCategories };
}

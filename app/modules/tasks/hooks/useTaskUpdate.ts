"use client";

import { useCallback } from "react";
import { toast } from "sonner";

import { serviceTaskUpdate } from "../services/serviceTaskUpdate";
import type { TaskInput } from "../type/typeTaskInput";

export function useTaskUpdate() {
  const update = useCallback(async (id: number, input: TaskInput) => {
    const task = await serviceTaskUpdate(id, input);
    toast.success("Tarea actualizada.");
    return task;
  }, []);

  return { update };
}

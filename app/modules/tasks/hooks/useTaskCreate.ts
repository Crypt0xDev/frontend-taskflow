"use client";

import { useCallback } from "react";
import { toast } from "sonner";

import { serviceTaskCreate } from "../services/serviceTaskCreate";
import type { TaskInput } from "../type/typeTaskInput";

export function useTaskCreate() {
  const create = useCallback(async (input: TaskInput) => {
    const task = await serviceTaskCreate(input);
    toast.success("Tarea creada.");
    return task;
  }, []);

  return { create };
}

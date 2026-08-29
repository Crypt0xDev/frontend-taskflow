"use client";

import { useCallback } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/api";

import { serviceTaskDelete } from "../services/serviceTaskDelete";

export function useTaskDelete() {
  const remove = useCallback(async (id: number) => {
    try {
      await serviceTaskDelete(id);
      toast.success("Tarea enviada a la papelera.");
      return true;
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "No se pudo eliminar.");
      return false;
    }
  }, []);

  return { remove };
}

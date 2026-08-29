"use client";

import { useCallback } from "react";
import { toast } from "sonner";

import { serviceCategoryCreate } from "../services/serviceCategoryCreate";
import type { CategoryValues } from "../schema";

export function useCategoryCreate() {
  const create = useCallback(async (input: CategoryValues) => {
    const category = await serviceCategoryCreate(input);
    toast.success("Categoría creada.");
    return category;
  }, []);

  return { create };
}

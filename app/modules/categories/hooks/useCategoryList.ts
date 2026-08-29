"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/api";

import { serviceCategoryList } from "../services/serviceCategoryList";
import type { Category } from "../type/typeCategoryBase";

function byName(a: Category, b: Category) {
  return a.name.localeCompare(b.name);
}

export function useCategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setCategories((await serviceCategoryList()).sort(byName));
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "No se pudieron cargar las categorías.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);

  return { categories, loading, reload: load };
}

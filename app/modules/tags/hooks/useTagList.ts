"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/api";

import { serviceTagDelete, serviceTagList } from "../services/serviceTag";
import type { Tag } from "../type/typeTagBase";

export function useTagList() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setTags(await serviceTagList());
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "No se pudieron cargar las etiquetas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const remove = useCallback(async (id: number) => {
    try {
      await serviceTagDelete(id);
      toast.success("Etiqueta eliminada.");
      return true;
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "No se pudo eliminar.");
      return false;
    }
  }, []);

  return { tags, loading, reload: load, remove };
}

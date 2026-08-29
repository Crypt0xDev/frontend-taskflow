"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/api";

import { serviceCommentDelete } from "../services/serviceCommentDelete";
import { serviceCommentList } from "../services/serviceCommentList";
import type { Comment } from "../type/typeCommentBase";

export function useCommentModeration() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setComments(await serviceCommentList());
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "No se pudieron cargar los comentarios.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);

  const remove = useCallback(async (id: number) => {
    try {
      await serviceCommentDelete(id);
      setComments((prev) => prev.filter((c) => c.id !== id));
      toast.success("Comentario eliminado.");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Ocurrió un error inesperado.");
    }
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return comments;
    return comments.filter(
      (c) =>
        c.body.toLowerCase().includes(q) ||
        (c.author?.username ?? "").toLowerCase().includes(q),
    );
  }, [comments, query]);

  return { comments: filtered, total: comments.length, loading, query, setQuery, remove };
}

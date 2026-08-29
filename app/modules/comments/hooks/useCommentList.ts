"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/api";

import { serviceCommentCreate } from "../services/serviceCommentCreate";
import { serviceCommentDelete } from "../services/serviceCommentDelete";
import type { Comment } from "../type/typeCommentBase";

export function useCommentList(initial: Comment[]) {
  const [comments, setComments] = useState<Comment[]>(initial);

  const post = useCallback(async (body: string) => {
    const comment = await serviceCommentCreate(body);
    setComments((prev) => [comment, ...prev]);
    toast.success("Comentario publicado.");
    return comment;
  }, []);

  const remove = useCallback(async (id: number) => {
    try {
      await serviceCommentDelete(id);
      setComments((prev) => prev.filter((c) => c.id !== id));
      toast.success("Comentario eliminado.");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Ocurrió un error inesperado.");
    }
  }, []);

  return { comments, post, remove };
}

"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import type { Comment } from "../type";

type Props = {
  comments: Comment[];
  isAdmin: boolean;
  currentUserId?: number;
  onRemove: (id: number) => void;
};

export function UiCommentList({ comments, isAdmin, currentUserId, onRemove }: Props) {
  if (comments.length === 0) {
    return (
      <p className="py-8 text-center text-ink-400">
        Todavía no hay comentarios. ¡Sé el primero!
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {comments.map((c) => (
        <li key={c.id} className="rounded-3xl border border-ink-100 bg-surface p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <Avatar className="size-9">
              <AvatarFallback className="bg-brand-100 font-display font-bold text-brand-700">
                {(c.author?.username ?? "?").charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-semibold">{c.author?.username ?? "Anónimo"}</p>
              <p className="text-xs text-ink-400">
                {new Date(c.created_at).toLocaleDateString("es")}
              </p>
            </div>
            {(isAdmin || c.author?.id === currentUserId) && (
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto text-destructive hover:text-destructive"
                onClick={() => onRemove(c.id)}
              >
                Eliminar
              </Button>
            )}
          </div>
          <p className="mt-3 whitespace-pre-line text-ink-700">{c.body}</p>
        </li>
      ))}
    </ul>
  );
}

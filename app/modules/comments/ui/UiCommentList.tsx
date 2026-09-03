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

const AVATAR_TONES = [
  "bg-brand-100 text-brand-700",
  "bg-warm-100 text-warm-600",
  "bg-ink-100 text-ink-700",
];

function toneFor(id: number) {
  return AVATAR_TONES[id % AVATAR_TONES.length];
}

export function UiCommentList({ comments, isAdmin, currentUserId, onRemove }: Props) {
  if (comments.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-ink-200 py-14 text-center">
        <p className="font-display text-lg font-bold text-ink-600">Todavía no hay comentarios</p>
        <p className="mt-1 text-sm text-ink-400">¡Sé la primera persona en compartir tu opinión!</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {comments.map((c) => (
        <li key={c.id} className="rounded-3xl border border-ink-100 bg-surface p-5 shadow-soft transition hover:-translate-y-0.5">
          <div className="flex items-center gap-3">
            <Avatar className="size-9">
              <AvatarFallback className={`font-display font-bold ${toneFor(c.author?.id ?? 0)}`}>
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

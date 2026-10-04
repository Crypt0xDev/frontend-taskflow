"use client";

import Link from "next/link";

import { useSession } from "@/lib/session";

import { useCommentList } from "./hooks";
import type { Comment } from "./type";
import { UiCommentForm } from "./ui/UiCommentForm";
import { UiCommentList } from "./ui/UiCommentList";

export default function UiCommentPage({ initial }: { initial: Comment[] }) {
  const { user, isAdmin } = useSession();
  const { comments, post, remove } = useCommentList(initial);

  return (
    <main className="mx-auto max-w-2xl px-6 py-16 sm:py-20">
      <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-700">
        Comunidad
      </span>
      <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
        Comentarios
      </h1>
      <p className="mt-4 text-lg text-ink-500">
        Lee lo que opina la gente y suma tu voz.{" "}
        {comments.length > 0 && (
          <span className="font-semibold text-ink-700">
            {comments.length} {comments.length === 1 ? "comentario" : "comentarios"}
          </span>
        )}
      </p>

      <div className="mt-8 space-y-6">
        {user ? (
          <UiCommentForm onPost={post} />
        ) : (
          <div className="rounded-3xl border border-ink-100 bg-surface p-5 text-center text-ink-600 shadow-soft">
            <Link href="/login" className="font-semibold text-brand-700 dark:text-brand-400 hover:underline">
              Inicia sesión
            </Link>{" "}
            para dejar un comentario.
          </div>
        )}
        <UiCommentList comments={comments} isAdmin={isAdmin} currentUserId={user?.id} onRemove={remove} />
      </div>
    </main>
  );
}

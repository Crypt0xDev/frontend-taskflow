"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api";
import { apiFieldErrors, zodFieldErrors } from "@/lib/form";

import { commentSchema } from "../schema";

export function UiCommentForm({ onPost }: { onPost: (body: string) => Promise<unknown> }) {
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);

    const parsed = commentSchema.safeParse({ body });
    if (!parsed.success) {
      setError(zodFieldErrors(parsed.error).body);
      return;
    }

    setSubmitting(true);
    try {
      await onPost(parsed.data.body);
      setBody("");
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        setError(apiFieldErrors(err.errors).body);
      } else {
        toast.error(err instanceof ApiError ? err.message : "Error inesperado.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-ink-100 bg-surface p-5 shadow-soft">
      <Textarea
        rows={3}
        placeholder="Comparte lo que piensas…"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        aria-invalid={!!error}
      />
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      <div className="mt-3 flex justify-end">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Publicando…" : "Publicar"}
        </Button>
      </div>
    </form>
  );
}

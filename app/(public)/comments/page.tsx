import type { Metadata } from "next";

import UiCommentPage from "@/app/modules/comments/UiCommentPage";
import type { Comment } from "@/app/modules/comments/type";
import { API_URL } from "@/config/constants";

export const metadata: Metadata = {
  title: "Comentarios",
  description: "Lo que opina la comunidad sobre TaskFlow.",
};

async function getComments(): Promise<Comment[]> {
  try {
    const res = await fetch(`${API_URL}/comments`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return [];
    return (await res.json()) as Comment[];
  } catch {
    return [];
  }
}

export default async function CommentsPage() {
  const initial = await getComments();
  return <UiCommentPage initial={initial} />;
}

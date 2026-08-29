import type { Metadata } from "next";

import UiCommentModeration from "@/app/modules/comments/ui/UiCommentModeration";

export const metadata: Metadata = {
  title: "Comentarios",
};

export default function AdminCommentsRoute() {
  return <UiCommentModeration />;
}

import type { Metadata } from "next";

import UiCommentModerationPage from "@/app/modules/comments/UiCommentModerationPage";

export const metadata: Metadata = {
  title: "Comentarios",
};

export default function AdminCommentsRoute() {
  return <UiCommentModerationPage />;
}

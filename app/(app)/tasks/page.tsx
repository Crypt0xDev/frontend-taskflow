import type { Metadata } from "next";
import { Suspense } from "react";

import UiTaskPage from "@/app/modules/tasks/UiTaskPage";

export const metadata: Metadata = {
  title: "Tareas",
};

export default function TasksRoute() {
  // Suspense: UiTaskPage lee ?new=1 con useSearchParams.
  return (
    <Suspense>
      <UiTaskPage />
    </Suspense>
  );
}

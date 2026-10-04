import type { Metadata } from "next";
import { Suspense } from "react";

import TasksView from "@/app/modules/tasks/UiTaskPage";

export const metadata: Metadata = {
  title: "Tareas",
};

export default function TasksRoute() {
  // Suspense: TasksView lee ?new=1 con useSearchParams.
  return (
    <Suspense>
      <TasksView />
    </Suspense>
  );
}

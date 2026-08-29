import type { Metadata } from "next";

import TasksView from "@/app/modules/tasks/UiTaskPage";

export const metadata: Metadata = {
  title: "Tareas",
};

export default function TasksRoute() {
  return <TasksView />;
}

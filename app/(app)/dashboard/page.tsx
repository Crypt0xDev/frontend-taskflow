import type { Metadata } from "next";

import DashboardView from "@/app/modules/dashboard/UiDashboardPage";

export const metadata: Metadata = {
  title: "Panel",
};

export default function DashboardRoute() {
  return <DashboardView />;
}

import type { Metadata } from "next";

import UiAdminOverview from "@/app/modules/admin/ui/UiAdminOverview";

export const metadata: Metadata = {
  title: "Panel de administración",
};

export default function AdminOverviewRoute() {
  return <UiAdminOverview />;
}

import type { Metadata } from "next";

import UiRolePage from "@/app/modules/roles/UiRolePage";

export const metadata: Metadata = {
  title: "Roles y permisos",
};

export default function AdminRolesRoute() {
  return <UiRolePage />;
}

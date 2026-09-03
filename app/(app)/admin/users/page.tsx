import type { Metadata } from "next";

import UiUserPage from "@/app/modules/users/UiUserPage";

export const metadata: Metadata = {
  title: "Usuarios",
};

export default function AdminUsersRoute() {
  return <UiUserPage />;
}

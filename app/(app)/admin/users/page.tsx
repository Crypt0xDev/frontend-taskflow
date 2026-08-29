import type { Metadata } from "next";

import UiUserList from "@/app/modules/users/ui/UiUserList";

export const metadata: Metadata = {
  title: "Usuarios",
};

export default function AdminUsersRoute() {
  return <UiUserList />;
}

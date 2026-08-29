import type { Metadata } from "next";

import UiProfilePage from "@/app/modules/profile/UiProfilePage";

export const metadata: Metadata = {
  title: "Mi perfil",
};

export default function ProfileRoute() {
  return <UiProfilePage />;
}

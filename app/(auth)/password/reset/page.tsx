import type { Metadata } from "next";

import UiPasswordResetPage from "@/app/modules/auth/UiPasswordResetPage";

export const metadata: Metadata = {
  title: "Recuperar contraseña",
};

export default function PasswordResetRoute() {
  return <UiPasswordResetPage />;
}

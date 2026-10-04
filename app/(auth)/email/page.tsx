import type { Metadata } from "next";

import UiEmailPage from "@/app/modules/auth/UiEmailPage";

export const metadata: Metadata = {
  title: "Verificar correo",
};

export default function EmailRoute() {
  return <UiEmailPage />;
}

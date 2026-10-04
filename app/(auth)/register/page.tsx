import type { Metadata } from "next";

import UiRegisterPage from "@/app/modules/auth/UiRegisterPage";

export const metadata: Metadata = {
  title: "Crear cuenta",
};

export default function RegisterRoute() {
  return <UiRegisterPage />;
}

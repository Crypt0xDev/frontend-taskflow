import type { Metadata } from "next";

import UiLoginPage from "@/app/modules/auth/UiLoginPage";

export const metadata: Metadata = {
  title: "Iniciar sesión",
};

export default function LoginRoute() {
  return <UiLoginPage />;
}

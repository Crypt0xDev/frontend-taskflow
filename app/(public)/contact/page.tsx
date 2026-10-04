import type { Metadata } from "next";

import UiContactPage from "@/app/modules/contact/UiContactPage";

export const metadata: Metadata = {
  title: "Contacto",
  description: "¿Tienes dudas o sugerencias sobre TaskFlow? Escríbenos.",
};

export default function ContactRoute() {
  return <UiContactPage />;
}

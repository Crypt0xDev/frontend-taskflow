import type { Metadata } from "next";

import UiTagPage from "@/app/modules/tags/UiTagPage";

export const metadata: Metadata = {
  title: "Etiquetas",
};

export default function TagsRoute() {
  return <UiTagPage />;
}

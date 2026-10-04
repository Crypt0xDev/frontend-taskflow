import type { Metadata } from "next";

import UiCategoryPage from "@/app/modules/categories/UiCategoryPage";

export const metadata: Metadata = {
  title: "Categorías",
};

export default function CategoriesRoute() {
  return <UiCategoryPage />;
}

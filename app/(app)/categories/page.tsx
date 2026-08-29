import type { Metadata } from "next";

import CategoriesView from "@/app/modules/categories/UiCategoryPage";

export const metadata: Metadata = {
  title: "Categorías",
};

export default function CategoriesRoute() {
  return <CategoriesView />;
}

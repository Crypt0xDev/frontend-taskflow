"use client";

import { useEffect, useState } from "react";

import { serviceCategoryList } from "../services/serviceCategoryList";
import type { Category } from "../type/typeCategoryBase";

export function useCategoryOptions() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    serviceCategoryList()
      .then(setCategories)
      .catch(() => {
      });
  }, []);

  return categories;
}

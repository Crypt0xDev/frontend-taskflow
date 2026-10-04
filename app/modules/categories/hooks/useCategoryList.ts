'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { ApiError } from '@/lib/api';
import { deferMicrotask } from '@/lib/utils';

import { serviceCategoryList } from '../services/serviceCategoryList';
import type { Category } from '../type/typeCategoryBase';

function byName(a: Category, b: Category) {
  return a.name.localeCompare(b.name);
}

export function useCategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      setCategories((await serviceCategoryList()).sort(byName));
    } catch (error) {
      setError(true);
      toast.error(
        error instanceof ApiError
          ? error.message
          : 'No se pudieron cargar las categorías.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    deferMicrotask(load);
  }, [load]);

  return { categories, loading, error, reload: load };
}

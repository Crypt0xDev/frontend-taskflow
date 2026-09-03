'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';

import { serviceCategoryUpdate } from '../services/serviceCategoryUpdate';
import type { CategoryValues } from '../schema';

export function useCategoryUpdate() {
  const update = useCallback(async (id: number, input: CategoryValues) => {
    const category = await serviceCategoryUpdate(id, input);
    toast.success('Categoría actualizada.');
    return category;
  }, []);

  return { update };
}

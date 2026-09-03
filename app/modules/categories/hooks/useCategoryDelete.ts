'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';

import { ApiError } from '@/lib/api';

import { serviceCategoryDelete } from '../services/serviceCategoryDelete';

export function useCategoryDelete() {
  const remove = useCallback(async (id: number) => {
    try {
      await serviceCategoryDelete(id);
      toast.success('Categoría eliminada.');
      return true;
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : 'No se pudo eliminar.'
      );
      return false;
    }
  }, []);

  return { remove };
}

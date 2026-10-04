"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/api";
import { deferMicrotask } from "@/lib/utils";

import { serviceRoleList } from "../services/serviceRoleList";
import { serviceRoleDelete } from "../services/serviceRoleDelete";
import type { Role } from "../type/typeRoleBase";

export function useRoleList() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      setRoles(await serviceRoleList());
    } catch (error) {
      setError(true);
      toast.error(error instanceof ApiError ? error.message : "No se pudieron cargar los roles.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    deferMicrotask(load);
  }, [load]);

  const remove = useCallback(async (id: number) => {
    try {
      await serviceRoleDelete(id);
      toast.success("Rol eliminado.");
      return true;
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "No se pudo eliminar el rol.");
      return false;
    }
  }, []);

  return { roles, loading, error, reload: load, remove };
}

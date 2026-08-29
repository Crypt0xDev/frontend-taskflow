"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/api";

import { serviceRoleList } from "../services/serviceRoleList";
import { serviceRoleDelete } from "../services/serviceRoleDelete";
import type { Role } from "../type/typeRoleBase";

export function useRoleList() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRoles(await serviceRoleList());
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "No se pudieron cargar los roles.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
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

  return { roles, loading, reload: load, remove };
}

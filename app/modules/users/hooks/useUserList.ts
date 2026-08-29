"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/api";
import type { Role, User } from "@/lib/session";

import { serviceUserDelete } from "../services/serviceUserDelete";
import { serviceUserList } from "../services/serviceUserList";
import { serviceUserUpdate } from "../services/serviceUserUpdate";

function errorMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : "Ocurrió un error inesperado.";
}

export function useUserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setUsers(await serviceUserList());
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);

  const changeRole = useCallback(async (id: number, role: Role) => {
    try {
      const updated = await serviceUserUpdate(id, { role });
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
      toast.success("Rol actualizado.");
    } catch (error) {
      toast.error(errorMessage(error));
    }
  }, []);

  const remove = useCallback(async (id: number) => {
    try {
      await serviceUserDelete(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("Usuario eliminado.");
    } catch (error) {
      toast.error(errorMessage(error));
    }
  }, []);

  return { users, loading, reload: load, changeRole, remove };
}

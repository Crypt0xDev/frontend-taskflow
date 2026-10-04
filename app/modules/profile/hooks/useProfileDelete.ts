"use client";

import { useCallback } from "react";
import { toast } from "sonner";

import { useSession } from "@/lib/session";

import type { DeleteAccountValues } from "../schema";
import { serviceProfileDelete } from "../services/serviceProfileDelete";

export function useProfileDelete() {
  const { logout } = useSession();

  const remove = useCallback(
    async (values: DeleteAccountValues) => {
      const { message } = await serviceProfileDelete(values);
      // El token ya no existe en el servidor: limpia la sesión local.
      await logout();
      toast.success(message);
    },
    [logout],
  );

  return { remove };
}

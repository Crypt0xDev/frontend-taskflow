"use client";

import { useCallback } from "react";
import { toast } from "sonner";

import { useSession } from "@/lib/session";

import type { LoginValues } from "../schema";
import { serviceAuthLogin } from "../services";

export function useAuthLogin() {
  const { login: openSession } = useSession();

  const login = useCallback(
    async (values: LoginValues) => {
      const { token, user } = await serviceAuthLogin(values);
      openSession(token, user);
      toast.success(`Hola de nuevo, ${user.username}`);
      return user;
    },
    [openSession],
  );

  return { login };
}

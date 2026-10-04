"use client";

import { useCallback } from "react";
import { toast } from "sonner";

import { setToken } from "@/lib/api";
import { useSession } from "@/lib/session";
import { serviceProfileUpdate } from "@/app/modules/profile/services/serviceProfileUpdate";

import type { RegisterProfileValues, RegisterValues } from "../schema";
import { serviceAuthRegister } from "../services";
import type { AuthResponse } from "../type";

export function useAuthRegister() {
  const { login: openSession } = useSession();

  const register = useCallback((values: RegisterValues) => serviceAuthRegister(values), []);

  const finish = useCallback(
    async (created: AuthResponse, profile: RegisterProfileValues) => {
      setToken(created.token);
      const user =
        profile.birth_date || profile.avatar ? await serviceProfileUpdate(profile) : created.user;

      openSession(created.token, user);
      toast.success(`Cuenta creada. Revisa ${user.email} para verificar tu correo.`);
      return user;
    },
    [openSession],
  );

  return { register, finish };
}

"use client";

import { useCallback } from "react";
import { toast } from "sonner";

import type { ForgotPasswordValues, ResetPasswordValues } from "../schema";
import { serviceAuthForgotPassword, serviceAuthResetPassword } from "../services";

export function useAuthPasswordReset() {
  const requestCode = useCallback(async (values: ForgotPasswordValues) => {
    await serviceAuthForgotPassword(values);
    toast.success("Si el correo existe, te enviamos un código.");
  }, []);

  const resetPassword = useCallback(async (values: ResetPasswordValues) => {
    await serviceAuthResetPassword(values);
    toast.success("Contraseña restablecida. Ya puedes iniciar sesión.");
  }, []);

  return { requestCode, resetPassword };
}

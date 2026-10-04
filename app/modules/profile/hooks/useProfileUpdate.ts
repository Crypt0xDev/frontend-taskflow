"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { ApiError } from "@/lib/api";
import { useSession } from "@/lib/session";

import { serviceProfileUpdate } from "../services/serviceProfileUpdate";
import { profileSchema, type ProfileValues } from "../schema";

export function useProfileUpdate() {
  const { user, updateUser } = useSession();

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { username: user?.username ?? "", email: user?.email ?? "", current_password: "" },
  });

  useEffect(() => {
    if (user) form.reset({ username: user.username, email: user.email ?? "", current_password: "" });
  }, [user, form]);

  // Cambiar el correo exige la contraseña actual (el backend lo verifica).
  const emailChanged =
    (useWatch({ control: form.control, name: "email" }) ?? "").trim().toLowerCase() !== (user?.email ?? "").trim().toLowerCase();

  const submit = form.handleSubmit(async (values) => {
    if (emailChanged && !values.current_password) {
      form.setError("current_password", { message: "Confirma tu contraseña actual para cambiar el correo." });
      return;
    }
    try {
      const updated = await serviceProfileUpdate({
        user_name: values.username,
        email: values.email,
        ...(emailChanged ? { current_password: values.current_password } : {}),
      });
      updateUser({
        username: updated?.username ?? values.username,
        email: updated?.email ?? values.email,
        email_verified: updated?.email_verified,
      });
      toast.success(
        emailChanged
          ? `Perfil actualizado. Te enviamos un correo a ${values.email} para verificarlo.`
          : "Perfil actualizado.",
      );
    } catch (error) {
      if (error instanceof ApiError && error.errors) {
        const fields = error.errors;
        if (fields.user_name) form.setError("username", { message: fields.user_name[0] });
        if (fields.email) form.setError("email", { message: fields.email[0] });
        if (fields.current_password) form.setError("current_password", { message: fields.current_password[0] });
      } else {
        toast.error(error instanceof ApiError ? error.message : "No se pudo actualizar el perfil.");
      }
    }
  });

  return { form, submit, emailChanged, submitting: form.formState.isSubmitting };
}

"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
    defaultValues: { username: user?.username ?? "", email: user?.email ?? "" },
  });

  useEffect(() => {
    if (user) form.reset({ username: user.username, email: user.email ?? "" });
  }, [user, form]);

  const submit = form.handleSubmit(async (values) => {
    try {
      const updated = await serviceProfileUpdate({
        user_name: values.username,
        email: values.email,
      });
      updateUser({
        username: updated?.username ?? values.username,
        email: updated?.email ?? values.email,
      });
      toast.success("Perfil actualizado.");
    } catch (error) {
      if (error instanceof ApiError && error.errors) {
        const fields = error.errors;
        if (fields.user_name) form.setError("username", { message: fields.user_name[0] });
        if (fields.email) form.setError("email", { message: fields.email[0] });
      } else {
        toast.error(error instanceof ApiError ? error.message : "No se pudo actualizar el perfil.");
      }
    }
  });

  return { form, submit, submitting: form.formState.isSubmitting };
}

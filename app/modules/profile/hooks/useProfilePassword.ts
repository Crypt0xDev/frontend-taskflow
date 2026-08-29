"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { ApiError } from "@/lib/api";
import { apiFieldErrors } from "@/lib/form";

import { serviceProfilePassword } from "../services/serviceProfilePassword";
import { passwordSchema, type PasswordValues } from "../schema";

export function useProfilePassword() {
  const form = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { current_password: "", password: "", password_confirmation: "" },
  });

  const submit = form.handleSubmit(async (values) => {
    try {
      await serviceProfilePassword(values);
      form.reset();
      toast.success("Contraseña actualizada.");
    } catch (error) {
      if (error instanceof ApiError && error.errors) {
        const fields = apiFieldErrors(error.errors);
        for (const [name, message] of Object.entries(fields)) {
          if (name in form.getValues()) {
            form.setError(name as keyof PasswordValues, { message });
          }
        }
      } else {
        toast.error(error instanceof ApiError ? error.message : "No se pudo cambiar la contraseña.");
      }
    }
  });

  return { form, submit, submitting: form.formState.isSubmitting };
}

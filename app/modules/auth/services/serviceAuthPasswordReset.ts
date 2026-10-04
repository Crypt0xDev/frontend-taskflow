import { apiFetch } from "@/lib/api";

export function serviceAuthForgotPassword(email: string) {
  return apiFetch<{ message: string }>("/forgot-password", { method: "POST", body: { email } });
}

export function serviceAuthResetPassword(data: {
  email: string;
  code: string;
  password: string;
  password_confirmation: string;
}) {
  return apiFetch<{ message: string }>("/reset-password", { method: "POST", body: data });
}

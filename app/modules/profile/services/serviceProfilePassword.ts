import { apiFetch } from "@/lib/api";

export function serviceProfilePassword(data: {
  current_password: string;
  password: string;
  password_confirmation: string;
}) {
  return apiFetch<{ message: string }>("/me/password", { method: "PUT", body: data });
}

import { apiFetch } from "@/lib/api";

export const serviceTagDelete = (id: number) =>
  apiFetch<{ message: string }>(`/tags/${id}`, { method: "DELETE" });

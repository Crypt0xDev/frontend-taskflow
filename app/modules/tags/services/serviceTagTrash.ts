import { apiFetch } from "@/lib/api";

import type { Tag } from "../type/typeTagBase";

export const serviceTagTrashed = () => apiFetch<Tag[]>("/tags/trashed");
export const serviceTagRestore = (id: number) =>
  apiFetch<Tag>(`/tags/${id}/restore`, { method: "POST" });
export const serviceTagForceDelete = (id: number) =>
  apiFetch<{ message: string }>(`/tags/${id}/force`, { method: "DELETE" });

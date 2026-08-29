import { apiFetch } from "@/lib/api";

import type { Tag } from "../type/typeTagBase";

export type TagInput = { name: string; description: string | null; color: string | null };

export const serviceTagList = () => apiFetch<Tag[]>("/tags");
export const serviceTagCreate = (data: TagInput) =>
  apiFetch<Tag>("/tags", { method: "POST", body: data });
export const serviceTagUpdate = (id: number, data: TagInput) =>
  apiFetch<Tag>(`/tags/${id}`, { method: "PUT", body: data });
export const serviceTagDelete = (id: number) =>
  apiFetch<{ message: string }>(`/tags/${id}`, { method: "DELETE" });

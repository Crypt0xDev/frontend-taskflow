import { apiFetch } from "@/lib/api";

import type { Tag } from "../type/typeTagBase";
import type { TagInput } from "../type/typeTagInput";

export const serviceTagUpdate = (id: number, data: TagInput) =>
  apiFetch<Tag>(`/tags/${id}`, { method: "PUT", body: data });

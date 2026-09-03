import { apiFetch } from "@/lib/api";

import type { Tag } from "../type/typeTagBase";
import type { TagInput } from "../type/typeTagInput";

export const serviceTagCreate = (data: TagInput) => apiFetch<Tag>("/tags", { method: "POST", body: data });

import { apiFetchAllPages } from "@/lib/api";

import type { Tag } from "../type/typeTagBase";

export function serviceTagTrashed() {
  return apiFetchAllPages<Tag>("/tags/trashed");
}

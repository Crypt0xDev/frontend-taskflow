import { apiFetchList } from "@/lib/api";

import type { Tag } from "../type/typeTagBase";

export const serviceTagList = () => apiFetchList<Tag>("/tags");

"use client";

import { useEffect, useState } from "react";

import { servicePermissionList } from "../services/servicePermissionList";
import type { Permission } from "../type/typeRoleBase";

export function usePermissionList() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    servicePermissionList()
      .then((list) => active && setPermissions(list))
      .catch(() => active && setPermissions([]))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return { permissions, loading };
}

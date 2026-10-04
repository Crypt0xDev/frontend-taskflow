"use client";

import { useEffect, useState } from "react";

import { useSession } from "@/lib/session";

import { serviceAuthMe } from "../services";

export type VerificationStatus = "verified" | "already-verified" | "invalid";

export function useAuthEmailVerify(status: VerificationStatus) {
  const { updateUser } = useSession();
  const needsRefresh = status !== "invalid";
  const [refreshed, setRefreshed] = useState(false);

  useEffect(() => {
    if (!needsRefresh) return;
    serviceAuthMe()
      .then((me) => updateUser({ email_verified: me.email_verified }))
      .catch(() => {})
      .finally(() => setRefreshed(true));
  }, [needsRefresh, updateUser]);

  return { ready: !needsRefresh || refreshed };
}

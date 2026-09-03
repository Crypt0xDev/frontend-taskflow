"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminOverviewRoute() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return null;
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useSession } from "@/lib/session";

import UiUserDashboard from "./ui/UiUserDashboard";

export default function DashboardView() {
  const { isAdmin } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isAdmin) router.replace("/admin");
  }, [isAdmin, router]);

  if (isAdmin) return null;

  return <UiUserDashboard />;
}

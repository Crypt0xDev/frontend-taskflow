"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { UiLoadingSpinner } from "@/components/UiLoading";
import { useSession } from "@/lib/session";

const ADMIN_VIEW_PERMISSIONS: Array<[string, string]> = [
  ["users", "view"],
  ["roles", "view"],
  ["comments", "view"],
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, hasPermission } = useSession();
  const router = useRouter();

  const canAccessAdmin = ADMIN_VIEW_PERMISSIONS.some(([module, action]) => hasPermission(module, action));

  useEffect(() => {
    if (!loading && user && !canAccessAdmin) router.replace("/dashboard");
  }, [loading, user, canAccessAdmin, router]);

  if (loading || !user || !canAccessAdmin) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <UiLoadingSpinner />
      </div>
    );
  }

  return <>{children}</>;
}

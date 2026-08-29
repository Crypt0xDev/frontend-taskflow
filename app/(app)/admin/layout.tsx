"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { UiLoadingSpinner } from "@/components/UiLoading";
import { useSession } from "@/lib/session";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && !isAdmin) router.replace("/dashboard");
  }, [loading, user, isAdmin, router]);

  if (loading || !user || !isAdmin) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <UiLoadingSpinner />
      </div>
    );
  }

  return <>{children}</>;
}

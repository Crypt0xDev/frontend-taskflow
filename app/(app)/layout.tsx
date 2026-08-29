"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { UiAppSidebar } from "@/components/UiAppSidebar";
import { UiLoadingSpinner } from "@/components/UiLoading";
import { UiSiteHeader } from "@/components/UiSiteHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UiForcePasswordChange } from "@/app/modules/profile/ui/UiForcePasswordChange";
import { useSession } from "@/lib/session";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <UiLoadingSpinner />
      </div>
    );
  }
  if (user.must_change_password) {
    return <UiForcePasswordChange />;
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <UiAppSidebar />
        <SidebarInset>
          <UiSiteHeader />
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}

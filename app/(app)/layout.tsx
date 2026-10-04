"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { UiAppSidebar } from "@/components/UiAppSidebar";
import { UiBottomNav } from "@/components/UiBottomNav";
import { UiSectionTabs } from "@/components/UiSectionTabs";
import { UiLoadingSpinner } from "@/components/UiLoading";
import { UiSiteHeader } from "@/components/UiSiteHeader";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UiProfilePasswordForce } from "@/app/modules/profile/ui/UiProfilePasswordForce";
import { UiEmailVerifyNotice } from "@/app/modules/auth/ui/UiEmailVerifyNotice";
import { useSession } from "@/lib/session";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, loadError, retry } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user && !loadError) router.replace("/login");
  }, [loading, user, loadError, router]);

  if (!loading && !user && loadError) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 p-4 text-center">
        <p className="text-sm">No se pudo conectar con el servidor.</p>
        <Button onClick={retry}>Reintentar</Button>
      </div>
    );
  }
  if (loading || !user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <UiLoadingSpinner />
      </div>
    );
  }
  if (user.must_change_password) {
    return <UiProfilePasswordForce />;
  }
  if (user.email_verified === false) {
    return <UiEmailVerifyNotice />;
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <UiAppSidebar />
        <SidebarInset>
          <UiSiteHeader />
          <main className="flex-1 p-4 pb-20 sm:p-6 md:pb-6">
            <UiSectionTabs />
            {children}
          </main>
        </SidebarInset>
        <UiBottomNav />
      </SidebarProvider>
    </TooltipProvider>
  );
}

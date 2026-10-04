import Link from "next/link";
import { ListChecks } from "lucide-react";

import { UiModeToggle } from "@/components/UiModeToggle";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function UiSiteHeader({ title }: { title?: string }) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-ink-100 bg-surface px-4 md:h-16">
      <SidebarTrigger className="-ml-1 hidden md:inline-flex" />
      <Separator orientation="vertical" className="mx-1 hidden data-[orientation=vertical]:h-4 md:block" />
      <Link href="/dashboard" className="flex items-center gap-2 md:hidden">
        <span className="grid size-7 place-items-center rounded-lg bg-brand-500 text-white">
          <ListChecks className="size-4" strokeWidth={2.2} />
        </span>
        <span className="font-display font-bold">TaskFlow</span>
      </Link>
      {title && <h1 className="text-base font-medium">{title}</h1>}
      <div className="ml-auto flex items-center gap-2">
        <UiModeToggle />
      </div>
    </header>
  );
}

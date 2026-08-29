import { UiModeToggle } from "@/components/UiModeToggle";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function UiSiteHeader({ title }: { title?: string }) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-ink-100 bg-surface px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mx-1 data-[orientation=vertical]:h-4" />
      {title && <h1 className="text-base font-medium">{title}</h1>}
      <div className="ml-auto flex items-center gap-2">
        <UiModeToggle />
      </div>
    </header>
  );
}

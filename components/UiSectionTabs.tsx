"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { isActivePath, useNavSections } from "@/hooks/useNavItems";
import { cn } from "@/lib/utils";

export function UiSectionTabs() {
  const pathname = usePathname();
  const sections = useNavSections();
  const section = sections.find((s) => s.items.some((item) => isActivePath(pathname, item.href)));

  if (!section || section.items.length < 2) return null;

  return (
    <nav aria-label={`Secciones de ${section.label}`} className="-mx-4 mb-4 overflow-x-auto px-4 md:hidden">
      <div className="flex min-w-max gap-0.5 rounded-full bg-muted p-1">
        {section.items.map((item) => {
          const active = isActivePath(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-9 flex-1 items-center justify-center rounded-full px-2 text-sm whitespace-nowrap transition-colors",
                active ? "bg-surface font-medium text-ink-900 shadow-sm" : "text-ink-600",
              )}
            >
              {item.tabLabel ?? item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

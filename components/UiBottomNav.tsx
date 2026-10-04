"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MoreHorizontal } from "lucide-react";

import { useSidebar } from "@/components/ui/sidebar";
import { useNavItems } from "@/hooks/useNavItems";
import { cn } from "@/lib/utils";

const MAX_ITEMS = 4;

export function UiBottomNav() {
  const pathname = usePathname();
  const navItems = useNavItems();
  const { toggleSidebar } = useSidebar();

  const primary = navItems.slice(0, MAX_ITEMS);
  const hasMore = navItems.length > MAX_ITEMS;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 border-t border-ink-100 bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label="Navegación principal"
    >
      <div className="flex items-stretch justify-around">
        {primary.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2 text-xs",
                active ? "text-brand-700 dark:text-brand-400" : "text-ink-500",
              )}
            >
              <Icon className="size-5" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
        {hasMore && (
          <button
            type="button"
            onClick={toggleSidebar}
            className="flex flex-1 flex-col items-center gap-1 py-2 text-xs text-ink-500"
          >
            <MoreHorizontal className="size-5" />
            <span>Más</span>
          </button>
        )}
      </div>
    </nav>
  );
}

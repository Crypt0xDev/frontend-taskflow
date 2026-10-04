"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, UserCircle, UserCog } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { isActivePath, useNavSections } from "@/hooks/useNavItems";
import { useSession } from "@/lib/session";
import { cn } from "@/lib/utils";

const tabClass = (active: boolean) =>
  cn(
    "flex flex-1 flex-col items-center gap-1 py-2 text-xs",
    active ? "text-brand-700 dark:text-brand-400" : "text-ink-500",
  );

export function UiBottomNav() {
  const pathname = usePathname();
  const sections = useNavSections();
  const [accountOpen, setAccountOpen] = useState(false);
  const accountActive = isActivePath(pathname, "/profile");

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 border-t border-ink-100 bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label="Navegación principal"
    >
      <div className="flex items-stretch justify-around">
        {sections.map((section) => {
          const active = section.items.some((item) => isActivePath(pathname, item.href));
          const Icon = section.icon;
          return (
            <Link
              key={section.id}
              href={section.items[0].href}
              aria-current={active ? "page" : undefined}
              className={tabClass(active)}
            >
              <Icon className="size-5" />
              <span className="truncate">{section.label}</span>
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setAccountOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={accountOpen}
          className={tabClass(accountActive)}
        >
          <UserCircle className="size-5" />
          <span>Cuenta</span>
        </button>
      </div>

      <UiAccountSheet open={accountOpen} onOpenChange={setAccountOpen} profileActive={accountActive} />
    </nav>
  );
}

function UiAccountSheet({
  open,
  onOpenChange,
  profileActive,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileActive: boolean;
}) {
  const { user, isAdmin, logout } = useSession();
  const router = useRouter();
  const close = () => onOpenChange(false);

  async function handleLogout() {
    close();
    await logout();
    router.replace("/login");
  }

  if (!user) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="gap-0 rounded-t-2xl pb-[env(safe-area-inset-bottom)]">
        <SheetHeader className="pb-2">
          <SheetTitle>Cuenta</SheetTitle>
        </SheetHeader>
        <div className="px-2 pb-4">
          <div className="flex items-center gap-3 px-3 pb-3">
            <Avatar className="size-9">
              <AvatarFallback className="bg-brand-100 text-sm font-bold text-brand-700">
                {user.avatar ?? user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-medium">{user.username}</p>
              <p className="truncate text-xs text-muted-foreground">{isAdmin ? "Administrador" : user.email}</p>
            </div>
          </div>
          <Link
            href="/profile"
            onClick={close}
            aria-current={profileActive ? "page" : undefined}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm active:bg-muted",
              profileActive && "bg-muted font-medium text-brand-700 dark:text-brand-400",
            )}
          >
            <UserCog className="size-5" />
            Mi perfil
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm text-destructive active:bg-muted"
          >
            <LogOut className="size-5" />
            Cerrar sesión
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

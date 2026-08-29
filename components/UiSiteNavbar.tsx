"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { UiModeToggle } from "@/components/UiModeToggle";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/about", label: "Acerca de" },
  { href: "/comments", label: "Comentarios" },
  { href: "/contact", label: "Contacto" },
];

export function UiSiteNavbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-surface/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid size-8 -rotate-6 place-items-center rounded-xl bg-brand-500 text-white shadow-brand">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </span>
          <span className="font-display text-lg font-bold tracking-tight">TaskFlow</span>
        </Link>

        <NavigationMenu className="hidden sm:flex">
          <NavigationMenuList>
            {LINKS.map(({ href, label }) => {
              const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <NavigationMenuItem key={href}>
                  <NavigationMenuLink
                    render={<Link href={href} />}
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent",
                      active && "bg-brand-500/10 text-brand-700 dark:text-brand-300",
                    )}
                  >
                    {label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          <UiModeToggle />
          <Link
            href="/login"
            className="rounded-full px-4 py-2 text-sm font-semibold text-ink-600 transition hover:text-ink-900"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-brand transition hover:-translate-y-0.5 hover:bg-brand-600"
          >
            Empezar
          </Link>
        </div>
      </div>
    </header>
  );
}

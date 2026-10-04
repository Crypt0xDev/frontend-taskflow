"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";

import { UiModeToggle } from "@/components/UiModeToggle";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/about", label: "Acerca de" },
  { href: "/comments", label: "Comentarios" },
  { href: "/contact", label: "Contacto" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function UiSiteNavbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

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
          <NavigationMenuList className="gap-1">
            {LINKS.map(({ href, label }) => {
              const active = isActive(pathname, href);
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

          {/* Móvil: CTA principal + menú con las secciones (el NavigationMenu se oculta bajo `sm`). */}
          <Link
            href="/register"
            className="rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-white shadow-brand transition hover:-translate-y-0.5 hover:bg-brand-800 sm:hidden"
          >
            Empezar
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            className="grid size-9 place-items-center rounded-full text-ink-700 transition hover:bg-ink-100 sm:hidden"
          >
            <Menu className="size-5" />
          </button>

          <Link
            href="/login"
            className="hidden rounded-full px-4 py-2 text-sm font-semibold text-ink-600 transition hover:text-ink-900 sm:block"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="hidden rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-white shadow-brand transition hover:-translate-y-0.5 hover:bg-brand-800 sm:block"
          >
            Empezar
          </Link>
        </div>
      </div>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="right" className="gap-0 sm:hidden">
          <SheetHeader className="border-b">
            <SheetTitle>Menú</SheetTitle>
          </SheetHeader>
          <nav aria-label="Secciones" className="flex flex-col gap-1 p-2">
            {LINKS.map(({ href, label }) => {
              const active = isActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 items-center rounded-lg px-3 text-base transition-colors active:bg-muted",
                    active ? "bg-brand-500/10 font-semibold text-brand-700 dark:text-brand-300" : "text-ink-700",
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto flex flex-col gap-2 border-t p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <Link
              href="/register"
              onClick={() => setMenuOpen(false)}
              className="rounded-full bg-brand-700 px-4 py-2.5 text-center font-semibold text-white shadow-brand transition hover:bg-brand-800"
            >
              Crear cuenta
            </Link>
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="rounded-full border border-ink-200 px-4 py-2.5 text-center font-semibold text-ink-700 transition hover:border-ink-300"
            >
              Iniciar sesión
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}

import Link from "next/link";

import { SOCIAL_LINKS } from "@/config/constants";

export function UiSiteFooter() {
  return (
    <footer className="border-t border-ink-100 bg-surface">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-sm text-ink-400 sm:flex-row">
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <p>© {new Date().getFullYear()} TaskFlow - Derechos Reservados.</p>
          <nav aria-label="Información legal" className="flex gap-4">
            <Link href="/privacy" className="transition hover:text-ink-700">
              Privacidad
            </Link>
            <Link href="/security" className="transition hover:text-ink-700">
              Seguridad
            </Link>
          </nav>
        </div>
        <nav className="flex items-center gap-4">
          {[
            ["GitHub", SOCIAL_LINKS.github, "ic-github"],
            ["LinkedIn", SOCIAL_LINKS.linkedin, "ic-linkedin"],
            ["Instagram", SOCIAL_LINKS.instagram, "ic-instagram"],
            ["X", SOCIAL_LINKS.x, "ic-x"],
          ]
            .filter(([, href]) => href)
            .map(([name, href, icon]) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={`TaskFlow en ${name}`}
              className="transition hover:text-ink-700"
            >
              <svg aria-hidden="true" className="size-5 fill-current">
                <use href={`/socialIcons.svg#${icon}`} />
              </svg>
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}

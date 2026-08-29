export function UiSiteFooter() {
  return (
    <footer className="border-t border-ink-100 bg-surface">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-sm text-ink-400 sm:flex-row">
        <p>© {new Date().getFullYear()} TaskFlow - Derechos Reservados. </p>
        <nav className="flex items-center gap-4">
          {[
            ["GitHub", "https://github.com/Crypt0xDev", "ic-github"],
            ["LinkedIn", "https://www.linkedin.com/in/crypt0xdev", "ic-linkedin"],
            ["Instagram", "https://www.instagram.com/crypt0xdev", "ic-instagram"],
            ["X", "https://x.com/Crypt0xDev", "ic-x"],
          ].map(([name, href, icon]) => (
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

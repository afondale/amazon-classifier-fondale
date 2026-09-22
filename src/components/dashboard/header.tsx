export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <a href="#top" className="flex items-baseline gap-2.5">
          <span className="font-display text-xl italic text-fg">Foil</span>
          <span className="hidden text-xs tracking-[0.16em] text-muted uppercase sm:inline">
            Gift-card sentiment
          </span>
        </a>
        <nav className="flex items-center gap-4 text-sm text-muted sm:gap-5">
          <a href="#classify" className="hover:text-fg">
            Try it
          </a>
          <a href="#results" className="hover:text-fg">
            Results
          </a>
          <a href="#examples" className="hover:text-fg">
            Examples
          </a>
          <a href="#trained" className="hidden hover:text-fg sm:inline">
            Training
          </a>
        </nav>
      </div>
    </header>
  );
}

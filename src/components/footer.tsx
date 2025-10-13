export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-transparent">
      <div className="page-container flex flex-col gap-3 py-6 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
        <p className="font-medium text-[var(--foreground)]">
          (c) {new Date().getFullYear()} Avans Keuze Compass
        </p>
        <div className="flex flex-wrap gap-4">
          <a className="transition hover:text-[var(--accent)]" href="#inspiratie">
            Inspiratie
          </a>
          <a className="transition hover:text-[var(--accent)]" href="#coaching">
            Coaching
          </a>
          <a className="transition hover:text-[var(--accent)]" href="#contact">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

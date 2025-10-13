"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/Stories", label: "Verhalen" },
  { href: "/login", label: "Login" },
  { href: "/register", label: "Registreren" },
];

const linkClasses =
  "rounded-full px-4 py-2 text-sm font-semibold transition hover:text-[var(--accent-foreground)]";

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <header className="bg-transparent">
      <nav className="page-container flex items-center justify-between gap-6 py-6">
        <Link
          href="/"
          className="flex items-center gap-3 text-lg font-bold text-[var(--foreground)]"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-foreground)] shadow-lg">
            AKC
          </span>
          <div className="flex flex-col leading-tight">
            <span>Avans Keuze Compass</span>
            <span className="text-xs font-normal text-[var(--muted)]">
              Vind jouw studierichting
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] p-1 lg:flex">
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${linkClasses} ${
                    isActive
                      ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                      : "text-[var(--muted)] hover:bg-[var(--accent)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          <ThemeToggle />
        </div>
      </nav>
      <div className="page-container pt-0 lg:hidden">
        <div className="flex flex-wrap gap-2">
          {NAV_LINKS.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full border border-[var(--border)] px-3 py-1.5 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                    : "bg-[var(--card)] text-[var(--muted)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
};

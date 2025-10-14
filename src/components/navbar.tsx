"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "@/contexts/auth-context";

const PUBLIC_LINKS = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/Stories", label: "Verhalen", icon: "📖" },
];

const AUTH_LINKS = [
  { href: "/login", label: "Login", icon: "🔐" },
  { href: "/register", label: "Registreren", icon: "✨" },
];

const STUDENT_LINKS = [
  { href: "/modules", label: "Modules", icon: "📚" },
  { href: "/favorites", label: "Favorieten", icon: "⭐" },
];

export const Navbar = () => {
  const pathname = usePathname();
  const { isAuthenticated, logout, user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Combine navigation links based on auth state
  const navLinks = [
    ...PUBLIC_LINKS,
    ...(isAuthenticated ? STUDENT_LINKS : AUTH_LINKS),
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[var(--glass-bg)] backdrop-blur-md shadow-lg border-b border-[var(--glass-border)]"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link
              href="/"
              className="group flex items-center gap-3 transition-transform hover:scale-105"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-[var(--accent)] opacity-20 blur-lg transition-all group-hover:opacity-40 group-hover:blur-xl" />
                <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] text-lg font-bold text-[var(--accent-foreground)] shadow-lg transition-all group-hover:shadow-xl">
                  AKC
                </span>
              </div>
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="text-lg font-bold text-[var(--foreground)] transition-colors">
                  Avans Keuze Compass
                </span>
                <span className="text-xs font-medium text-[var(--foreground-muted)]">
                  Vind jouw studierichting
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--card)] p-1 shadow-md backdrop-blur-sm">
                {navLinks.map((link) => {
                  const isActive =
                    pathname === link.href ||
                    (link.href !== "/" && pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`group relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] text-[var(--accent-foreground)] shadow-md"
                          : "text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      <span className="text-base">{link.icon}</span>
                      <span>{link.label}</span>
                      {isActive && (
                        <div className="absolute inset-0 rounded-full bg-[var(--accent)] opacity-20 blur-md" />
                      )}
                    </Link>
                  );
                })}
              </div>
              {isAuthenticated && (
                <button
                  onClick={logout}
                  className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-semibold text-[var(--foreground-muted)] shadow-md transition-all hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
                  title={`Uitloggen (${user?.username})`}
                >
                  <span className="text-base">👋</span>
                  <span>Uitloggen</span>
                </button>
              )}
              <ThemeToggle />
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 lg:hidden">
              <ThemeToggle />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] shadow-md transition-all hover:border-[var(--accent)] hover:shadow-lg"
                aria-label="Toggle menu"
              >
                <div className="flex flex-col gap-1.5">
                  <span
                    className={`block h-0.5 w-5 rounded-full bg-[var(--foreground)] transition-all duration-300 ${
                      isMobileMenuOpen ? "translate-y-2 rotate-45" : ""
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-5 rounded-full bg-[var(--foreground)] transition-all duration-300 ${
                      isMobileMenuOpen ? "opacity-0" : ""
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-5 rounded-full bg-[var(--foreground)] transition-all duration-300 ${
                      isMobileMenuOpen ? "-translate-y-2 -rotate-45" : ""
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-[var(--card)] shadow-2xl transition-transform duration-300 lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between border-b border-[var(--border)] p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] text-sm font-bold text-[var(--accent-foreground)] shadow-md">
                AKC
              </span>
              <span className="text-lg font-bold text-[var(--foreground)]">Menu</span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background)] transition-all hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
              aria-label="Close menu"
            >
              <span className="text-xl">✕</span>
            </button>
          </div>

          {/* Mobile Menu Links */}
          <div className="flex-1 overflow-y-auto p-6">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link, index) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`group flex items-center gap-4 rounded-xl p-4 transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] text-[var(--accent-foreground)] shadow-lg"
                        : "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:border-[var(--accent)] hover:shadow-md"
                    }`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: isMobileMenuOpen ? "slideInFromRight 0.3s ease-out" : "none",
                    }}
                  >
                    <span className="text-2xl transition-transform group-hover:scale-110">
                      {link.icon}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-base font-semibold">{link.label}</span>
                      {link.href === "/" && (
                        <span className="text-xs opacity-70">Ontdek de mogelijkheden</span>
                      )}
                      {link.href === "/Stories" && (
                        <span className="text-xs opacity-70">Epics & User Stories</span>
                      )}
                      {link.href === "/modules" && (
                        <span className="text-xs opacity-70">Bekijk alle VKM modules</span>
                      )}
                      {link.href === "/favorites" && (
                        <span className="text-xs opacity-70">Jouw favoriete modules</span>
                      )}
                      {link.href === "/login" && (
                        <span className="text-xs opacity-70">Toegang tot je account</span>
                      )}
                      {link.href === "/register" && (
                        <span className="text-xs opacity-70">Maak een nieuw account</span>
                      )}
                    </div>
                    {isActive && (
                      <div className="ml-auto flex h-2 w-2 items-center justify-center">
                        <span className="absolute h-2 w-2 rounded-full bg-white animate-ping" />
                        <span className="relative h-2 w-2 rounded-full bg-white" />
                      </div>
                    )}
                  </Link>
                );
              })}
              {isAuthenticated && (
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="group flex items-center gap-4 rounded-xl p-4 border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-all duration-300"
                >
                  <span className="text-2xl transition-transform group-hover:scale-110">
                    👋
                  </span>
                  <div className="flex flex-col">
                    <span className="text-base font-semibold">Uitloggen</span>
                    <span className="text-xs opacity-70">Tot ziens, {user?.username}</span>
                  </div>
                </button>
              )}
            </nav>
          </div>

          {/* Mobile Menu Footer */}
          <div className="border-t border-[var(--border)] p-6">
            <div className="space-y-3">
              <p className="text-xs text-[var(--foreground-muted)]">
                © 2025 Avans Keuze Compass
              </p>
              <p className="text-xs text-[var(--foreground-muted)]">
                Vind jouw perfecte studierichting
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-20" />
    </>
  );
};

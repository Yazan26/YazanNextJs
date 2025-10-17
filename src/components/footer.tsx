import Link from "next/link";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Navigatie",
      links: [
        { label: "Home", href: "/" },
        { label: "Login", href: "/login" },
        { label: "Registreren", href: "/register" },
      ],
    },

    {
      title: "Over Ons",
      links: [
        { label: "privacy", href: "/privacy" },
        { label: "Verhalen", href: "/Stories" },
      ],
    },
  ];

  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--background-secondary)] relative overflow-hidden">
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-[var(--accent)] blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-[var(--accent)] blur-3xl" />
      </div>

      <div className="relative">
        {/* Main Footer Content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-[var(--accent)] opacity-20 blur-md" />
                  <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] text-base font-bold text-[var(--accent-foreground)] shadow-lg">
                    AKC
                  </span>
                </div>
                <span className="text-xl font-bold text-[var(--foreground)]">
                  Avans Keuze Compass
                </span>
              </div>
              <p className="text-sm text-[var(--foreground-muted)] max-w-md">
                Ontdek jouw perfecte studierichting met gepersonaliseerde aanbevelingen, 
                slimme filters en expert coaching. Jouw toekomst begint hier.
              </p>
            </div>
              
              

            {/* Footer Links */}
            {footerLinks.map((section) => (
              <div key={section.title} className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)]">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-[var(--foreground-muted)] transition-colors hover:text-[var(--accent)]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[var(--border)]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--foreground-muted)]">
              <p>
                © {currentYear} Avans Keuze Compass. Alle rechten voorbehouden.
              </p>
              <div className="flex gap-6">
                <a href="/privacy" className="transition-colors hover:text-[var(--accent)]">
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

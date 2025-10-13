"use client";

import { useTheme } from "./theme-provider";

const icon = {
  light: (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-current"
      focusable="false"
    >
      <path d="M12 18.25a6.25 6.25 0 1 1 6.25-6.25A6.258 6.258 0 0 1 12 18.25Zm0-10.5A4.25 4.25 0 1 0 16.25 12 4.255 4.255 0 0 0 12 7.75ZM12 2a1 1 0 0 1 1 1v1.5a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1Zm0 17.5a1 1 0 0 1 1 1V22a1 1 0 0 1-2 0v-1.5a1 1 0 0 1 1-1ZM4.222 4.222a1 1 0 0 1 1.414 0l1.061 1.061a1 1 0 1 1-1.414 1.414L4.222 5.636a1 1 0 0 1 0-1.414Zm12.081 12.082a1 1 0 0 1 1.414 0l1.061 1.06a1 1 0 0 1-1.414 1.415l-1.061-1.061a1 1 0 0 1 0-1.414ZM2 12a1 1 0 0 1 1-1h1.5a1 1 0 0 1 0 2H3a1 1 0 0 1-1-1Zm17.5 0a1 1 0 0 1 1-1H22a1 1 0 0 1 0 2h-1.5a1 1 0 0 1-1-1ZM5.636 18.364a1 1 0 0 1 0-1.414l1.061-1.061a1 1 0 1 1 1.414 1.414l-1.061 1.061a1 1 0 0 1-1.414 0Zm12.082-12.081a1 1 0 0 1 0-1.414l1.06-1.061A1 1 0 0 1 20.192 5l-1.06 1.061a1 1 0 0 1-1.414 0Z" />
    </svg>
  ),
  dark: (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-current"
      focusable="false"
    >
      <path d="M12.84 2.008a1 1 0 0 1 .954.314A9.5 9.5 0 0 0 21.678 15.6a9.5 9.5 0 0 1-11.282-11.29 1 1 0 0 1 .444-1.004ZM11 4.829a7.5 7.5 0 0 0 8.172 8.172 7.498 7.498 0 0 1-8.172-8.172Z" />
    </svg>
  ),
};

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      aria-label={`Schakel naar ${isDark ? "lichte" : "donkere"} modus`}
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition hover:border-transparent hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
    >
      {isDark ? icon.light : icon.dark}
      <span className="hidden sm:inline">{isDark ? "Licht" : "Donker"}</span>
    </button>
  );
};

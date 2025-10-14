"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { VKMModule, VKMFilters, VKMLevel, VKMLocation, VKMStudyCredit } from "@/types/vkm";
import { API_AUTH_ENDPOINTS, API_BASE_URL } from "@/lib/config";

export default function ModulesPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [modules, setModules] = useState<VKMModule[]>([]);
  const [filteredModules, setFilteredModules] = useState<VKMModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<VKMFilters>({
    isActive: true,
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch modules
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchModules = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Geen authenticatie token gevonden");
        }

        // Build query string from filters
        const params = new URLSearchParams();
        if (filters.location) params.append("location", filters.location);
        if (filters.level) params.append("level", filters.level);
        if (filters.studyCredit) params.append("studyCredit", filters.studyCredit.toString());
        if (filters.isActive !== undefined) params.append("isActive", filters.isActive.toString());

        const queryString = params.toString();
        const url = `${API_BASE_URL}${API_AUTH_ENDPOINTS.modules}${queryString ? `?${queryString}` : ""}`;

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Kan modules niet ophalen");
        }

        const data = await response.json();
        setModules(data);
        setFilteredModules(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Er is een fout opgetreden");
      } finally {
        setIsLoading(false);
      }
    };

    fetchModules();
  }, [isAuthenticated, filters]);

  // Handle search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredModules(modules);
      return;
    }

    const lowercaseSearch = searchTerm.toLowerCase();
    const filtered = modules.filter(
      (module) =>
        module.name.toLowerCase().includes(lowercaseSearch) ||
        module.shortDescription.toLowerCase().includes(lowercaseSearch) ||
        module.description.toLowerCase().includes(lowercaseSearch)
    );
    setFilteredModules(filtered);
  }, [searchTerm, modules]);

  // Toggle favorite
  const toggleFavorite = async (moduleId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const url = `${API_BASE_URL}${API_AUTH_ENDPOINTS.toggleFavorite.replace(":id", moduleId)}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Kan favoriet niet wijzigen");
      }

      // Update local state
      setModules((prev) =>
        prev.map((mod) =>
          mod.id === moduleId ? { ...mod, isFavorited: !mod.isFavorited } : mod
        )
      );
      setFilteredModules((prev) =>
        prev.map((mod) =>
          mod.id === moduleId ? { ...mod, isFavorited: !mod.isFavorited } : mod
        )
      );
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[var(--accent)] border-r-transparent" />
          <p className="mt-4 text-[var(--foreground-muted)]">Bezig met laden...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[var(--accent)] border-r-transparent" />
          <p className="mt-4 text-[var(--foreground-muted)]">Modules laden...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="card-surface p-8 text-center">
          <span className="text-6xl">⚠️</span>
          <h2 className="mt-4 text-2xl font-bold text-[var(--foreground)]">Foutmelding</h2>
          <p className="mt-2 text-[var(--foreground-muted)]">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container pb-20">
      {/* Header */}
      <div className="mb-8 space-y-3 text-center">
        <span className="badge mx-auto">📚 VKM Modules</span>
        <h1 className="text-4xl font-bold text-[var(--foreground)]">
          Ontdek Alle Modules
        </h1>
        <p className="text-[var(--foreground-muted)]">
          Bekijk, filter en favoriseer modules die bij jou passen
        </p>
        
        {/* Link to Favorites */}
        <div className="pt-2">
          <Link
            href="/favorites"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] transition hover:gap-3"
          >
            <span className="text-base">⭐</span>
            Bekijk mijn favorieten
            <span>→</span>
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card-surface mb-8 p-6">
        {/* Search */}
        <div className="mb-6">
          <label
            htmlFor="search"
            className="mb-2 block text-sm font-semibold text-[var(--foreground)]"
          >
            🔍 Zoeken
          </label>
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Zoek op naam of beschrijving..."
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--foreground)] placeholder-[var(--foreground-muted)] transition focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
          />
        </div>

        {/* Filters */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Location Filter */}
          <div>
            <label
              htmlFor="location"
              className="mb-2 block text-sm font-semibold text-[var(--foreground)]"
            >
              📍 Locatie
            </label>
            <select
              id="location"
              value={filters.location || ""}
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value as VKMLocation || undefined })
              }
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-[var(--foreground)] transition focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
            >
              <option value="">Alle locaties</option>
              <option value="Breda">Breda</option>
              <option value="Den Bosch">Den Bosch</option>
              <option value="Tilburg">Tilburg</option>
              <option value="Den Bosch en Tilburg">Den Bosch en Tilburg</option>
              <option value="Breda en Den Bosch">Breda en Den Bosch</option>
            </select>
          </div>

          {/* Level Filter */}
          <div>
            <label
              htmlFor="level"
              className="mb-2 block text-sm font-semibold text-[var(--foreground)]"
            >
              🎓 Niveau
            </label>
            <select
              id="level"
              value={filters.level || ""}
              onChange={(e) =>
                setFilters({ ...filters, level: e.target.value as VKMLevel || undefined })
              }
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-[var(--foreground)] transition focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
            >
              <option value="">Alle niveaus</option>
              <option value="NLQF5">NLQF5</option>
              <option value="NLQF6">NLQF6</option>
            </select>
          </div>

          {/* Study Credit Filter */}
          <div>
            <label
              htmlFor="studyCredit"
              className="mb-2 block text-sm font-semibold text-[var(--foreground)]"
            >
              ⭐ Studiepunten
            </label>
            <select
              id="studyCredit"
              value={filters.studyCredit || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  studyCredit: e.target.value ? (parseInt(e.target.value) as VKMStudyCredit) : undefined,
                })
              }
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-[var(--foreground)] transition focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
            >
              <option value="">Alle punten</option>
              <option value="15">15 punten</option>
              <option value="30">30 punten</option>
            </select>
          </div>

          {/* Active Filter */}
          <div>
            <label
              htmlFor="isActive"
              className="mb-2 block text-sm font-semibold text-[var(--foreground)]"
            >
              ✅ Status
            </label>
            <select
              id="isActive"
              value={filters.isActive === undefined ? "" : filters.isActive.toString()}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  isActive: e.target.value === "" ? undefined : e.target.value === "true",
                })
              }
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-[var(--foreground)] transition focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
            >
              <option value="">Alle statussen</option>
              <option value="true">Alleen actief</option>
              <option value="false">Alleen inactief</option>
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        {(filters.location || filters.level || filters.studyCredit || searchTerm) && (
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setFilters({ isActive: true });
                setSearchTerm("");
              }}
              className="text-sm font-semibold text-[var(--accent)] transition hover:underline"
            >
              ✕ Filters wissen
            </button>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-4 text-center text-sm text-[var(--foreground-muted)]">
        {filteredModules.length} {filteredModules.length === 1 ? "module" : "modules"} gevonden
      </div>

      {/* Modules Grid */}
      {filteredModules.length === 0 ? (
        <div className="card-surface p-12 text-center">
          <span className="text-6xl">🔍</span>
          <h3 className="mt-4 text-xl font-bold text-[var(--foreground)]">
            Geen modules gevonden
          </h3>
          <p className="mt-2 text-[var(--foreground-muted)]">
            Probeer andere filters of zoektermen
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredModules.map((module) => (
            <div
              key={module.id}
              className="card-surface group relative overflow-hidden p-6 transition-all hover:shadow-xl"
            >
              {/* Favorite Button */}
              <button
                onClick={() => toggleFavorite(module.id)}
                className="absolute right-4 top-4 z-10 rounded-full bg-[var(--background)] p-2 shadow-md transition-all hover:scale-110"
                aria-label={module.isFavorited ? "Verwijder van favorieten" : "Toevoegen aan favorieten"}
              >
                <span className="text-2xl">
                  {module.isFavorited ? "⭐" : "☆"}
                </span>
              </button>

              {/* Module Content */}
              <div className="mb-4">
                <div className="mb-2 flex flex-wrap gap-2">
                  <span className="badge text-xs">{module.level}</span>
                  <span className="badge text-xs">📍 {module.location}</span>
                  <span className="badge text-xs">⭐ {module.studyCredit} EC</span>
                  {!module.isActive && (
                    <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-300">
                      Inactief
                    </span>
                  )}
                </div>

                <h3 className="mb-3 text-lg font-bold text-[var(--foreground)] line-clamp-2">
                  {module.name}
                </h3>

                <p className="mb-4 text-sm text-[var(--foreground-muted)] line-clamp-3">
                  {module.shortDescription}
                </p>
              </div>

              {/* View Details Link */}
              <Link
                href={`/modules/${module.id}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] transition hover:gap-3"
              >
                Bekijk details
                <span>→</span>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

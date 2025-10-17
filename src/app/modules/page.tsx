"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { VKMModule, VKMFilters, VKMLevel, VKMLocation, VKMStudyCredit } from "@/types/vkm";
import { API_AUTH_ENDPOINTS } from "@/lib/config";
import { apiGet, apiPost } from "@/lib/api";
import { LoadingState } from "@/components/loading-state";
import { useRequireAuth } from "@/hooks/use-require-auth";

const applyFavoriteToggle = (moduleId: string) => (list: VKMModule[]) =>
  list.map((mod) =>
    mod.id === moduleId ? { ...mod, isFavorited: !mod.isFavorited } : mod
  );

export default function ModulesPage() {
  const { isAuthenticated, isChecking, canAccess } = useRequireAuth();
  const [modules, setModules] = useState<VKMModule[]>([]);
  const [filteredModules, setFilteredModules] = useState<VKMModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<VKMFilters>({
    isActive: true,
  });
  const { location, level, studyCredit, isActive } = filters;

  // Fetch modules
  useEffect(() => {
    if (!canAccess) {
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    apiGet<VKMModule[]>(API_AUTH_ENDPOINTS.modules, {
      query: { location, level, studyCredit, isActive },
      signal: controller.signal,
    })
      .then((data) => {
        setModules(data);
        setFilteredModules(data);
      })
      .catch((err) => {
        if (controller.signal.aborted) {
          return;
        }
        setError(err instanceof Error ? err.message : "Er is een fout opgetreden");
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [canAccess, location, level, studyCredit, isActive]);

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
      if (!canAccess) {
        return;
      }

      await apiPost(API_AUTH_ENDPOINTS.toggleFavorite.replace(":id", moduleId));

      setModules(applyFavoriteToggle(moduleId));
      setFilteredModules(applyFavoriteToggle(moduleId));
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  if (isChecking) {
    return <LoadingState message="Bezig met laden..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return <LoadingState message="Modules laden..." />;
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

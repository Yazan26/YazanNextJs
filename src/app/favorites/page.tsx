"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { VKMModule } from "@/types/vkm";
import { API_AUTH_ENDPOINTS } from "@/lib/config";
import { apiGet, apiPost } from "@/lib/api";
import { LoadingState } from "@/components/loading-state";
import { useRequireAuth } from "@/hooks/use-require-auth";

export default function FavoritesPage() {
  const { isAuthenticated, isChecking, canAccess } = useRequireAuth();
  const [favorites, setFavorites] = useState<VKMModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch favorites
  useEffect(() => {
    if (!canAccess) {
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    apiGet<VKMModule[]>(API_AUTH_ENDPOINTS.favorites, { signal: controller.signal })
      .then((data) => {
        setFavorites(data);
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
  }, [canAccess]);

  // Toggle favorite (remove from favorites)
  const toggleFavorite = async (moduleId: string) => {
    try {
      if (!canAccess) {
        return;
      }

      await apiPost(API_AUTH_ENDPOINTS.toggleFavorite.replace(":id", moduleId));

      setFavorites((prev) => prev.filter((mod) => mod.id !== moduleId));
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
    return <LoadingState message="Favorieten laden..." />;
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="card-surface p-8 text-center">
          <span className="text-6xl">⚠️</span>
          <h2 className="mt-4 text-2xl font-bold text-[var(--foreground)]">Foutmelding</h2>
          <p className="mt-2 text-[var(--foreground-muted)]">{error}</p>
          <p className="mt-4 text-sm text-[var(--foreground-muted)]">
            Probeer de pagina opnieuw te laden of ga terug naar modules.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[var(--accent)] bg-transparent px-6 py-3 font-semibold text-[var(--accent)] transition hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
            >
              🔄 Opnieuw laden
            </button>
            <Link
              href="/modules"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 font-semibold text-[var(--accent-foreground)] transition hover:shadow-lg"
            >
              ← Terug naar modules
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container pb-20">
      {/* Header */}
      <div className="mb-8 space-y-3 text-center">
        <span className="badge mx-auto">⭐ Mijn Favorieten</span>
        <h1 className="text-4xl font-bold text-[var(--foreground)]">
          Jouw Favoriete Modules
        </h1>
        <p className="text-[var(--foreground-muted)]">
          Alle modules die je hebt gefavouriseerd op één plek
        </p>
      </div>

      {/* Back to Modules */}
      <div className="mb-6">
        <Link
          href="/modules"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] transition hover:gap-3"
        >
          ← Terug naar alle modules
        </Link>
      </div>

      {/* Favorites Count */}
      <div className="mb-6 text-center">
        <p className="text-sm text-[var(--foreground-muted)]">
          {favorites.length === 0
            ? "Je hebt nog geen favorieten"
            : `${favorites.length} ${favorites.length === 1 ? "favoriet" : "favorieten"}`}
        </p>
      </div>

      {/* Empty State */}
      {favorites.length === 0 ? (
        <div className="card-surface p-12 text-center">
          <span className="text-6xl">⭐</span>
          <h3 className="mt-4 text-xl font-bold text-[var(--foreground)]">
            Nog geen favorieten
          </h3>
          <p className="mt-2 text-[var(--foreground-muted)]">
            Voeg modules toe aan je favorieten om ze hier te zien
          </p>
          <Link
            href="/modules"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 font-semibold text-[var(--accent-foreground)] shadow-lg transition hover:scale-105"
          >
            Ontdek modules
            <span>→</span>
          </Link>
        </div>
      ) : (
        /* Favorites Grid */
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((module) => (
            <div
              key={module.id}
              className="card-surface group relative overflow-hidden p-6 transition-all hover:shadow-xl"
            >
              {/* Favorite Button */}
              <button
                onClick={() => toggleFavorite(module.id)}
                className="absolute right-4 top-4 z-10 rounded-full bg-[var(--background)] p-2 shadow-md transition-all hover:scale-110 hover:bg-red-50 dark:hover:bg-red-950"
                aria-label="Verwijder van favorieten"
                title="Verwijder van favorieten"
              >
                <span className="text-2xl">⭐</span>
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

      {/* CTA Section */}
      {favorites.length > 0 && (
        <div className="mt-12 card-gradient p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">
            Klaar om te starten?
          </h2>
          <p className="mb-6 opacity-90">
            Neem contact op om je in te schrijven voor deze modules
          </p>
          <button className="rounded-full bg-white px-8 py-3 font-bold text-[var(--accent)] shadow-lg transition hover:scale-105">
            Contact opnemen
          </button>
        </div>
      )}
    </div>
  );
}

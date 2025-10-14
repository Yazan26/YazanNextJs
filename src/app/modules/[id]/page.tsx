"use client";

import { useState, useEffect, use } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { VKMModule } from "@/types/vkm";
import { API_AUTH_ENDPOINTS, API_BASE_URL } from "@/lib/config";

export default function ModuleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params promise using React.use()
  const unwrappedParams = use(params);
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [module, setModule] = useState<VKMModule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch module details
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchModule = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Geen authenticatie token gevonden");
        }

        const url = `${API_BASE_URL}${API_AUTH_ENDPOINTS.moduleById}${unwrappedParams.id}`;
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Kan module niet ophalen");
        }

        const data = await response.json();
        setModule(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Er is een fout opgetreden");
      } finally {
        setIsLoading(false);
      }
    };

    fetchModule();
  }, [isAuthenticated, unwrappedParams.id]);

  // Toggle favorite
  const toggleFavorite = async () => {
    if (!module) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const url = `${API_BASE_URL}${API_AUTH_ENDPOINTS.toggleFavorite.replace(":id", module.id)}`;
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
      setModule((prev) => (prev ? { ...prev, isFavorited: !prev.isFavorited } : null));
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
          <p className="mt-4 text-[var(--foreground-muted)]">Module laden...</p>
        </div>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="page-container">
        <div className="card-surface p-8 text-center">
          <span className="text-6xl">⚠️</span>
          <h2 className="mt-4 text-2xl font-bold text-[var(--foreground)]">Foutmelding</h2>
          <p className="mt-2 text-[var(--foreground-muted)]">
            {error || "Module niet gevonden"}
          </p>
          <Link
            href="/modules"
            className="mt-6 inline-flex items-center gap-2 text-[var(--accent)] transition hover:underline"
          >
            ← Terug naar alle modules
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container pb-20">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href="/modules"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] transition hover:gap-3"
        >
          ← Terug naar modules
        </Link>
      </div>

      {/* Module Header */}
      <div className="card-surface mb-8 p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            {/* Badges */}
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="badge">{module.level}</span>
              <span className="badge">📍 {module.location}</span>
              <span className="badge">⭐ {module.studyCredit} EC</span>
              {!module.isActive && (
                <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-300">
                  Inactief
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="mb-4 text-3xl font-bold text-[var(--foreground)] lg:text-4xl">
              {module.name}
            </h1>

            {/* Short Description */}
            <p className="text-lg text-[var(--foreground-muted)]">
              {module.shortDescription}
            </p>
          </div>

          {/* Favorite Button */}
          <button
            onClick={toggleFavorite}
            className="flex items-center gap-2 rounded-full border-2 border-[var(--border)] bg-[var(--background)] px-6 py-3 font-semibold transition-all hover:border-[var(--accent)] hover:scale-105"
          >
            <span className="text-2xl">{module.isFavorited ? "⭐" : "☆"}</span>
            <span>{module.isFavorited ? "Favoriet" : "Voeg toe aan favorieten"}</span>
          </button>
        </div>
      </div>

      {/* Module Details */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <div className="card-surface p-8">
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-[var(--foreground)]">
              <span>📖</span>
              Beschrijving
            </h2>
            <p className="whitespace-pre-line text-[var(--foreground-muted)] leading-relaxed">
              {module.description}
            </p>
          </div>

          {/* Learning Outcomes */}
          <div className="card-surface p-8">
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-[var(--foreground)]">
              <span>🎯</span>
              Leerresultaten
            </h2>
            <p className="whitespace-pre-line text-[var(--foreground-muted)] leading-relaxed">
              {module.learningOutcomes}
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Module Info */}
          <div className="card-surface p-6">
            <h3 className="mb-4 text-xl font-bold text-[var(--foreground)]">
              Module Informatie
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-[var(--foreground-muted)]">
                  Module ID
                </p>
                <p className="text-[var(--foreground)] font-mono text-sm">
                  {module.id}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-[var(--foreground-muted)]">
                  Contactpersoon ID
                </p>
                <p className="text-[var(--foreground)]">
                  {module.contactId}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-[var(--foreground-muted)]">
                  Locatie
                </p>
                <p className="text-[var(--foreground)]">
                  {module.location}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-[var(--foreground-muted)]">
                  Niveau
                </p>
                <p className="text-[var(--foreground)]">
                  {module.level}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-[var(--foreground-muted)]">
                  Studiepunten
                </p>
                <p className="text-[var(--foreground)]">
                  {module.studyCredit} EC
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-[var(--foreground-muted)]">
                  Status
                </p>
                <p className={module.isActive ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                  {module.isActive ? "Actief" : "Inactief"}
                </p>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="card-surface p-6">
            <h3 className="mb-4 text-xl font-bold text-[var(--foreground)]">
              Data
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-[var(--foreground-muted)]">
                  Aangemaakt op
                </p>
                <p className="text-[var(--foreground)]">
                  {new Date(module.createdAt).toLocaleDateString("nl-NL", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-[var(--foreground-muted)]">
                  Laatst bijgewerkt
                </p>
                <p className="text-[var(--foreground)]">
                  {new Date(module.updatedAt).toLocaleDateString("nl-NL", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="card-gradient p-6 text-center">
            <h3 className="mb-3 text-xl font-bold">
              Geïnteresseerd?
            </h3>
            <p className="mb-4 text-sm opacity-90">
              Neem contact op voor meer informatie over deze module
            </p>
            <button className="w-full rounded-full bg-white px-6 py-3 font-bold text-[var(--accent)] shadow-lg transition hover:scale-105">
              Contact opnemen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

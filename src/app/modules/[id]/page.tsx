"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { VKMModule } from "@/types/vkm";
import { API_AUTH_ENDPOINTS } from "@/lib/config";
import { apiGet, apiPost } from "@/lib/api";
import { LoadingState } from "@/components/loading-state";
import { useRequireAuth } from "@/hooks/use-require-auth";
// imports above already include API_AUTH_ENDPOINTS and apiGet

export default function ModuleDetailPage({ params }: { params: { id: string } }) {
  const { isAuthenticated, isChecking, canAccess } = useRequireAuth();
  const [module, setModule] = useState<VKMModule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // `params` may be a Promise in newer Next.js versions. Prefer unwrapping with
  // React.use(params) when available; otherwise fall back to direct access.
  // `params` may be a Promise in newer Next.js versions. Prefer unwrapping with
  // React.use(params) when available. Use unknown and feature-detect without `any`.
  const maybeReactUse = (React as unknown as { use?: (p: unknown) => unknown }).use;
  const resolvedParams = maybeReactUse ? maybeReactUse(params) : params;
  const moduleId = (resolvedParams as { id: string }).id;

  useEffect(() => {
    if (!canAccess) {
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    apiGet<VKMModule>(`${API_AUTH_ENDPOINTS.moduleById}${moduleId}`, {
      signal: controller.signal,
    })
      .then((data) => {
        setModule(data);
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
  }, [canAccess, moduleId]);

  // Toggle favorite
  const toggleFavorite = async () => {
    if (!module || !canAccess) {
      return;
    }

    try {
      await apiPost(API_AUTH_ENDPOINTS.toggleFavorite.replace(":id", module.id));
      setModule((prev) => (prev ? { ...prev, isFavorited: !prev.isFavorited } : null));
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
    return <LoadingState message="Module laden..." />;
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
        </div>
      </div>

      {/* Recommendations - Full Width */}
      <div className="card-surface mt-8 p-8">
        <h3 className="mb-6 text-2xl font-bold text-[var(--foreground)]">Aanbevolen VKMs</h3>
        <RecommendedVKMs currentId={module.id} />
      </div>

      {/* CTA */}
      <div className="card-gradient mt-8 p-8 text-center">
        <h3 className="mb-3 text-xl font-bold">
          Geïnteresseerd?
        </h3>
        <p className="mb-6 text-sm opacity-90">
          Neem contact op voor meer informatie over deze module
        </p>
        <button className="w-full max-w-xs mx-auto rounded-full bg-white px-6 py-3 font-bold text-[var(--accent)] shadow-lg transition hover:scale-105">
          Contact opnemen
        </button>
      </div>

      {/* Dates - Small Card */}
      <div className="mt-8 lg:col-span-1">
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
      </div>
    </div>
  );
}

function RecommendedVKMs({ currentId }: { currentId: string }) {
  const [recs, setRecs] = useState<VKMModule[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchRecs = async () => {
      setLoading(true);
      try {
        // Try API endpoint first
        const data = await apiGet<VKMModule[]>(`${API_AUTH_ENDPOINTS.recommendations}?limit=8`);
        if (cancelled) return;
        // Filter out current module and take 4 random
        const filtered = (data || []).filter((m) => m.id !== currentId && m.isActive);
        setRecs(pickRandom(filtered, 4));
      } catch (err) {
        // Fallback to mock data if API fails
        const mock: VKMModule[] = mockVKMs().filter((m) => m.id !== currentId).slice(0, 4);
        if (!cancelled) setRecs(mock);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchRecs();

    return () => {
      cancelled = true;
    };
  }, [currentId]);

  if (loading) return <p className="text-sm text-[var(--muted)]">Aanbevelingen laden...</p>;
  if (!recs || recs.length === 0) return <p className="text-sm text-[var(--muted)]">Geen aanbevelingen beschikbaar.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {recs.map((r) => (
        <Link
          key={r.id}
          href={`/modules/${r.id}`}
          className="block rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 hover:border-[var(--accent)] hover:shadow-lg transition-all hover:-translate-y-1"
          aria-label={`Bekijk ${r.name}`}
        >
          <div className="flex h-full flex-col justify-between">
            <div>
              <p className="font-semibold text-[var(--foreground)]">{r.name}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">{r.location} · {r.studyCredit} EC</p>
            </div>
            <div className="mt-3 text-sm text-[var(--muted)]">{r.level}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function pickRandom<T>(arr: T[], n: number) {
  const copy = [...arr];
  const res: T[] = [];
  while (res.length < n && copy.length > 0) {
    const idx = Math.floor(Math.random() * copy.length);
    res.push(copy.splice(idx, 1)[0]);
  }
  return res;
}

function mockVKMs(): VKMModule[] {
  // Minimal mock entries; keep consistent with VKMModule type
  const now = new Date().toISOString();
  return [
    {
      id: "MCK101",
      name: "Introductie Creative Coding",
      shortDescription: "Leer creatieve programmeertechnieken.",
      description: "Volledige beschrijving",
      studyCredit: 15,
      location: "Breda" as any,
      contactId: "c1",
      level: "NLQF5",
      learningOutcomes: "...",
      isActive: true,
      createdAt: now,
      updatedAt: now,
      isFavorited: false,
    },
    {
      id: "DS200",
      name: "Data Science Basics",
      shortDescription: "Introductie tot data science.",
      description: "Volledige beschrijving",
      studyCredit: 30,
      location: "Den Bosch" as any,
      contactId: "c2",
      level: "NLQF6",
      learningOutcomes: "...",
      isActive: true,
      createdAt: now,
      updatedAt: now,
      isFavorited: false,
    },
    {
      id: "UX300",
      name: "UX Design Praktijk",
      shortDescription: "Leer gebruikersgericht ontwerpen.",
      description: "Volledige beschrijving",
      studyCredit: 15,
      location: "Tilburg" as any,
      contactId: "c3",
      level: "NLQF5",
      learningOutcomes: "...",
      isActive: true,
      createdAt: now,
      updatedAt: now,
      isFavorited: false,
    },
    {
      id: "AI404",
      name: "Praktische AI technieken",
      shortDescription: "Hands-on AI labs.",
      description: "Volledige beschrijving",
      studyCredit: 30,
      location: "Breda" as any,
      contactId: "c4",
      level: "NLQF6",
      learningOutcomes: "...",
      isActive: true,
      createdAt: now,
      updatedAt: now,
      isFavorited: false,
    },
    {
      id: "MK500",
      name: "Marketing Strategie",
      shortDescription: "Strategieën voor digitale marketing.",
      description: "Volledige beschrijving",
      studyCredit: 15,
      location: "Den Bosch" as any,
      contactId: "c5",
      level: "NLQF5",
      learningOutcomes: "...",
      isActive: true,
      createdAt: now,
      updatedAt: now,
      isFavorited: false,
    },
  ];
}

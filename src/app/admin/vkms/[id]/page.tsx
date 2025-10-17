"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useRequireAdmin } from "@/hooks/use-require-admin";
import { apiGet, adminUpdateVKM, adminDeleteVKM } from "@/lib/api";
import { VKMModule } from "@/types/vkm";
import { CreateVKMData } from "@/types/admin";

export default function AdminEditVKMPage() {
  const params = useParams();
  const router = useRouter();
  const vkmId = params.id as string;
  const { isAdmin, isLoading: authLoading } = useRequireAdmin();

  // vkm state removed (we use form state for editing)
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<Partial<CreateVKMData & { isActive?: boolean }>>({});

  useEffect(() => {
    if (!isAdmin) return;
    if (!vkmId) return;

    const controller = new AbortController();
    async function load() {
      try {
        setIsLoading(true);
        setError(null);
  const data = await apiGet<VKMModule>(`/vkm/${vkmId}`, { signal: controller.signal });
  setForm(data);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Fout bij laden VKM");
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [isAdmin, vkmId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vkmId) return;
    try {
      setError(null);
      // Build cleaned payload expected by the API
      const payload: CreateVKMData & { isActive: boolean } = {
        name: (form.name || "").toString(),
        shortDescription: (form.shortDescription || "").toString(),
        description: (form.description || "").toString(),
        content: (form.content || "").toString(),
  studyCredit: (Number(form.studyCredit) === 30 ? 30 : 15) as 15 | 30,
  location: (form.location || "Den Bosch") as import("@/types/vkm").VKMLocation,
        contactId: (form.contactId || "").toString(),
        level: (form.level === "NLQF6" ? "NLQF6" : "NLQF5") as "NLQF5" | "NLQF6",
        learningOutcomes: (form.learningOutcomes || "").toString(),
        isActive: typeof form.isActive === "boolean" ? form.isActive : true,
      };

      console.log("PUT /vkm/" + vkmId, payload);

      await adminUpdateVKM(vkmId, payload);
      router.push("/admin/vkms");
    } catch (err) {
      // Show more useful server error when possible
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Fout bij updaten VKM");
      }
    }
  };

  const handleDelete = async () => {
    if (!vkmId) return;
    if (!confirm("Weet u zeker dat u deze VKM wilt verwijderen?")) return;
    try {
      setError(null);
      await adminDeleteVKM(vkmId);
      router.push("/admin/vkms");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fout bij verwijderen VKM");
    }
  };

  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[var(--foreground-muted)]">Loading...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[var(--foreground-muted)]">VKM laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin/vkms" className="text-sm text-[var(--accent)] hover:underline mb-4 inline-block">← Terug naar VKM beheer</Link>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
          <h1 className="text-2xl font-bold mb-4">VKM bewerken</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Naam</label>
              <input
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2 border border-[var(--border)] rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Korte beschrijving</label>
              <input
                value={form.shortDescription || ""}
                onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                className="w-full px-4 py-2 border border-[var(--border)] rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Beschrijving</label>
              <textarea
                rows={4}
                value={form.description || ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-2 border border-[var(--border)] rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Content</label>
              <textarea
                rows={4}
                value={form.content || ""}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full px-4 py-2 border border-[var(--border)] rounded-lg"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Studiepunten</label>
                <select
                  value={String(form.studyCredit || 15)}
                  onChange={(e) => setForm({ ...form, studyCredit: Number(e.target.value) as 15 | 30 })}
                  className="w-full px-4 py-2 border border-[var(--border)] rounded-lg"
                >
                  <option value={15}>15</option>
                  <option value={30}>30</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Niveau</label>
                <select
                  value={form.level || "NLQF5"}
                  onChange={(e) => setForm({ ...form, level: e.target.value as "NLQF5" | "NLQF6" })}
                  className="w-full px-4 py-2 border border-[var(--border)] rounded-lg"
                >
                  <option value="NLQF5">NLQF5</option>
                  <option value="NLQF6">NLQF6</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Locatie</label>
                <select
                  value={form.location || "Den Bosch"}
                  onChange={(e) => setForm({ ...form, location: e.target.value as "Breda" | "Den Bosch" | "Tilburg" })}
                  className="w-full px-4 py-2 border border-[var(--border)] rounded-lg"
                >
                  <option value="Breda">Breda</option>
                  <option value="Den Bosch">Den Bosch</option>
                  <option value="Tilburg">Tilburg</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Leeruitkomsten</label>
              <textarea
                rows={3}
                value={form.learningOutcomes || ""}
                onChange={(e) => setForm({ ...form, learningOutcomes: e.target.value })}
                className="w-full px-4 py-2 border border-[var(--border)] rounded-lg"
              />
            </div>

            <div className="flex gap-2">
              <button type="submit" className="px-6 py-3 bg-[var(--accent)] text-[var(--accent-foreground)] rounded-lg font-semibold">Opslaan</button>
              <button type="button" onClick={handleDelete} className="px-6 py-3 bg-red-100 text-red-800 rounded-lg">Verwijderen</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

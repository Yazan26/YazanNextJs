"use client";

import { useState, useEffect } from "react";
import { useRequireAdmin } from "@/hooks/use-require-admin";
import { adminGetVKMs, adminCreateVKM, adminDeleteVKM } from "@/lib/api";
import { VKMModule, VKMFilters, VKMLocation, VKMLevel } from "@/types/vkm";
import { CreateVKMData } from "@/types/admin";
import Link from "next/link";

export default function AdminVKMsPage() {
  const { isAdmin, isLoading: authLoading } = useRequireAdmin();
  const [vkms, setVkms] = useState<VKMModule[]>([]);
  const [filteredVkms, setFilteredVkms] = useState<VKMModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filters, setFilters] = useState<VKMFilters>({});
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState<CreateVKMData>({
    name: "",
    shortDescription: "",
    description: "",
    content: "",
    studyCredit: 15,
    location: "Breda",
    contactId: "",
    level: "NLQF5",
    learningOutcomes: "",
  });

  const { location, level, studyCredit, isActive } = filters;

  useEffect(() => {
    if (isAdmin) {
      loadVKMs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, location, level, studyCredit, isActive]);

  const loadVKMs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await adminGetVKMs<VKMModule[]>({ location, level, studyCredit, isActive } as Record<string, string | number | boolean>);
      setVkms(data);
      setFilteredVkms(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fout bij laden VKMs");
    } finally {
      setIsLoading(false);
    }
  };

  // Client-side search (mirror ModulesPage)
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredVkms(vkms);
      return;
    }

    const lowercaseSearch = searchTerm.toLowerCase();
    const filtered = vkms.filter(
      (module) =>
        module.name.toLowerCase().includes(lowercaseSearch) ||
        module.shortDescription.toLowerCase().includes(lowercaseSearch) ||
        module.description.toLowerCase().includes(lowercaseSearch)
    );
    setFilteredVkms(filtered);
  }, [searchTerm, vkms]);

  const handleCreateVKM = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      // Build a cleaned payload matching CreateVKMData to avoid backend 400s
      const payload: CreateVKMData = {
        name: (formData.name || "").toString(),
        shortDescription: (formData.shortDescription || "").toString(),
        description: (formData.description || "").toString(),
        content: (formData.content || "").toString(),
        studyCredit: (Number(formData.studyCredit) === 30 ? 30 : 15) as 15 | 30,
        location: (formData.location || "Den Bosch") as import("@/types/vkm").VKMLocation,
        contactId: (formData.contactId || "").toString(),
        level: (formData.level === "NLQF6" ? "NLQF6" : "NLQF5") as "NLQF5" | "NLQF6",
        learningOutcomes: (formData.learningOutcomes || "").toString(),
      };

      // Try create and surface backend message when available
      try {
        await adminCreateVKM(payload);
      } catch (err) {
        // If server returned a message string, show it
        if (err instanceof Error) throw err;
        throw new Error("Fout bij aanmaken VKM");
      }
      setShowCreateForm(false);
      setFormData({
        name: "",
        shortDescription: "",
        description: "",
        content: "",
        studyCredit: 15,
        location: "Breda",
        contactId: "",
        level: "NLQF5",
        learningOutcomes: "",
      });
      loadVKMs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fout bij aanmaken VKM");
    }
  };

  const handleDeleteVKM = async (id: string) => {
    if (!confirm("Weet u zeker dat u deze VKM wilt verwijderen?")) return;
    
    try {
      setError(null);
      await adminDeleteVKM(id);
      loadVKMs();
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

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="text-sm text-[var(--accent)] hover:underline mb-2 inline-block">
              ← Terug naar Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-[var(--foreground)]">VKM Beheer</h1>
            <p className="text-[var(--foreground-muted)] mt-2">Beheer alle VKM modules</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-6 py-3 bg-[var(--accent)] text-[var(--accent-foreground)] rounded-lg font-semibold hover:bg-[var(--accent-hover)] transition-colors"
          >
            {showCreateForm ? "Annuleren" : "+ Nieuwe VKM"}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        {/* Create Form */}
        {showCreateForm && (
          <div className="mb-8 p-6 bg-[var(--card)] border border-[var(--border)] rounded-xl">
            <h2 className="text-xl font-bold mb-4">Nieuwe VKM Aanmaken</h2>
            <form onSubmit={handleCreateVKM} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Naam *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] focus:ring-2 focus:ring-[var(--accent)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contact ID *</label>
                  <input
                    type="text"
                    required
                    value={formData.contactId}
                    onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
                    className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] focus:ring-2 focus:ring-[var(--accent)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Korte Beschrijving *</label>
                <input
                  type="text"
                  required
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Beschrijving *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Content *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Leeruitkomsten *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.learningOutcomes}
                  onChange={(e) => setFormData({ ...formData, learningOutcomes: e.target.value })}
                  className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Studiepunten *</label>
                  <select
                    value={formData.studyCredit}
                    onChange={(e) => setFormData({ ...formData, studyCredit: Number(e.target.value) as 15 | 30 })}
                    className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] focus:ring-2 focus:ring-[var(--accent)]"
                  >
                    <option value={15}>15</option>
                    <option value={30}>30</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Niveau *</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value as "NLQF5" | "NLQF6" })}
                    className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] focus:ring-2 focus:ring-[var(--accent)]"
                  >
                    <option value="NLQF5">NLQF5</option>
                    <option value="NLQF6">NLQF6</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Locatie *</label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] focus:ring-2 focus:ring-[var(--accent)]"
                  >
                    <option value="Breda">Breda</option>
                    <option value="Den Bosch">Den Bosch</option>
                    <option value="Tilburg">Tilburg</option>
                    <option value="Den Bosch en Tilburg">Den Bosch en Tilburg</option>
                    <option value="Breda en Den Bosch">Breda en Den Bosch</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-[var(--accent)] text-[var(--accent-foreground)] rounded-lg font-semibold hover:bg-[var(--accent-hover)] transition-colors"
              >
                VKM Aanmaken
              </button>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl">
          <h3 className="font-semibold mb-3">Filters</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Zoeken</label>
              <input
                type="text"
                placeholder="Zoek op naam..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Locatie</label>
              <select
                value={filters.location || ""}
                onChange={(e) => setFilters({ ...filters, location: e.target.value as VKMLocation | undefined })}
                className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] focus:ring-2 focus:ring-[var(--accent)]"
              >
                <option value="">Alle</option>
                <option value="Breda">Breda</option>
                <option value="Den Bosch">Den Bosch</option>
                <option value="Tilburg">Tilburg</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Niveau</label>
              <select
                value={filters.level || ""}
                onChange={(e) => setFilters({ ...filters, level: e.target.value as VKMLevel | undefined })}
                className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] focus:ring-2 focus:ring-[var(--accent)]"
              >
                <option value="">Alle</option>
                <option value="NLQF5">NLQF5</option>
                <option value="NLQF6">NLQF6</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={filters.isActive === undefined ? "" : String(filters.isActive)}
                onChange={(e) => setFilters({ ...filters, isActive: e.target.value === "" ? undefined : e.target.value === "true" })}
                className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] focus:ring-2 focus:ring-[var(--accent)]"
              >
                <option value="">Alle</option>
                <option value="true">Actief</option>
                <option value="false">Inactief</option>
              </select>
            </div>
          </div>
        </div>

        {/* VKMs List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-[var(--foreground-muted)] mt-4">VKMs laden...</p>
          </div>
        ) : filteredVkms.length === 0 ? (
          <div className="text-center py-12 bg-[var(--card)] border border-[var(--border)] rounded-xl">
            <p className="text-[var(--foreground-muted)]">Geen VKMs gevonden</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredVkms.map((vkm) => (
              <div key={vkm.id} className="p-6 bg-[var(--card)] border border-[var(--border)] rounded-xl hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-[var(--foreground)]">{vkm.name}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        vkm.isActive 
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                          : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                      }`}>
                        {vkm.isActive ? "Actief" : "Inactief"}
                      </span>
                    </div>
                    <p className="text-[var(--foreground-muted)] mb-3">{vkm.shortDescription}</p>
                    <div className="flex flex-wrap gap-2 text-sm">
                      <span className="px-3 py-1 bg-[var(--background-secondary)] rounded-full">📍 {vkm.location}</span>
                      <span className="px-3 py-1 bg-[var(--background-secondary)] rounded-full">📊 {vkm.level}</span>
                      <span className="px-3 py-1 bg-[var(--background-secondary)] rounded-full">⭐ {vkm.studyCredit} EC</span>
                      <span className="px-3 py-1 bg-[var(--background-secondary)] rounded-full">👤 Contact: {vkm.contactId}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Link
                      href={`/modules/${vkm.id}`}
                      className="px-4 py-2 bg-[var(--background-secondary)] text-[var(--foreground)] rounded-lg hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-colors"
                    >
                      Bekijken
                    </Link>
                    <Link
                      href={`/admin/vkms/${vkm.id}`}
                      className="px-4 py-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                    >
                      Bewerken
                    </Link>
                    <button
                      onClick={() => handleDeleteVKM(vkm.id)}
                      className="px-4 py-2 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                    >
                      Verwijderen
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useRequireAdmin } from "@/hooks/use-require-admin";
import { adminGetUser, adminUpdateUser, adminDeleteUser, apiGet } from "@/lib/api";
import { UserWithFavorites, UpdateUserData } from "@/types/admin";
import { VKMModule } from "@/types/vkm";
import Link from "next/link";

export default function AdminUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const { isAdmin, isLoading: authLoading } = useRequireAdmin();
  
  const [user, setUser] = useState<UserWithFavorites | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState<UpdateUserData>({
    username: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    if (isAdmin && userId) {
      loadUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, userId]);

  const loadUser = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await adminGetUser<UserWithFavorites>(userId);
      // If backend returns only favorite IDs, resolve them to full VKM objects
      const maybeFavIds = (data as unknown as Record<string, unknown>)["favoriteVkmIds"];
      if ((!data.favoriteVKMs || data.favoriteVKMs.length === 0) && Array.isArray(maybeFavIds) && maybeFavIds.length > 0) {
        try {
          const ids = maybeFavIds as string[];
          const vkmPromises = ids.map((id) => apiGet<VKMModule>(`/vkm/${id}`));
          const vkmFull = await Promise.all(vkmPromises);
          // Map to the simplified favorite shape expected by the UI
          const favorites = vkmFull.map((v) => ({ id: v.id, name: v.name, shortDescription: v.shortDescription }));
          setUser({ ...data, favoriteVKMs: favorites });
        } catch (err) {
          // If resolving favorites fails, still set user data without favorites
          console.error("Failed to resolve favorite VKMs", err);
          setUser(data);
        }
      } else {
        setUser(data);
      }
      setFormData({
        username: data.username,
        email: data.email,
        role: data.role,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fout bij laden gebruiker");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      await adminUpdateUser(userId, formData);
      setIsEditing(false);
      loadUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fout bij updaten gebruiker");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Weet u zeker dat u deze gebruiker wilt verwijderen?")) return;
    
    try {
      setError(null);
      await adminDeleteUser(userId);
      router.push("/admin/users");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fout bij verwijderen gebruiker");
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
          <p className="text-[var(--foreground-muted)]">Gebruiker laden...</p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <Link href="/admin/users" className="text-[var(--accent)] hover:underline">
            ← Terug naar gebruikers
          </Link>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/users" className="text-sm text-[var(--accent)] hover:underline mb-2 inline-block">
            ← Terug naar Gebruikers
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[var(--foreground)]">{user.username}</h1>
              <p className="text-[var(--foreground-muted)] mt-2">{user.email}</p>
            </div>
            <span className={`px-4 py-2 text-sm font-semibold rounded-full ${
              user.role === "admin" 
                ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" 
                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            }`}>
              {user.role}
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        {/* User Details */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Gebruikersgegevens</h2>
            <div className="flex gap-2">
              {!isEditing && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-[var(--accent)] text-[var(--accent-foreground)] rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
                  >
                    Bewerken
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                  >
                    Verwijderen
                  </button>
                </>
              )}
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Gebruikersnaam</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rol</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] focus:ring-2 focus:ring-[var(--accent)]"
                >
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[var(--accent)] text-[var(--accent-foreground)] rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
                >
                  Opslaan
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      username: user.username,
                      email: user.email,
                      role: user.role,
                    });
                  }}
                  className="px-4 py-2 bg-[var(--background-secondary)] text-[var(--foreground)] rounded-lg hover:bg-[var(--border)] transition-colors"
                >
                  Annuleren
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <div>
                <p className="text-sm text-[var(--foreground-muted)]">Gebruikers ID</p>
                <p className="font-medium">{user.id}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--foreground-muted)]">Aangemaakt op</p>
                <p className="font-medium">{new Date(user.createdAt).toLocaleString('nl-NL')}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--foreground-muted)]">Laatst bijgewerkt</p>
                <p className="font-medium">{new Date(user.updatedAt).toLocaleString('nl-NL')}</p>
              </div>
            </div>
          )}
        </div>

        {/* Favorite VKMs */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Favoriete VKMs</h2>
          {user.favoriteVKMs && user.favoriteVKMs.length > 0 ? (
            <div className="space-y-3">
              {user.favoriteVKMs.map((vkm) => (
                <Link
                  key={vkm.id}
                  href={`/modules/${vkm.id}`}
                  className="block p-4 bg-[var(--background-secondary)] rounded-lg hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-colors"
                >
                  <h3 className="font-semibold">{vkm.name}</h3>
                  <p className="text-sm opacity-80 mt-1">{vkm.shortDescription}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-[var(--foreground-muted)]">Deze gebruiker heeft nog geen favoriete VKMs</p>
          )}
        </div>
      </div>
    </div>
  );
}

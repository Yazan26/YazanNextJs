"use client";

import { useState, useEffect } from "react";
import { useRequireAdmin } from "@/hooks/use-require-admin";
import { adminGetUsers, adminDeleteUser } from "@/lib/api";
import { AdminUser } from "@/types/admin";
import Link from "next/link";

export default function AdminUsersPage() {
  const { isAdmin, isLoading: authLoading } = useRequireAdmin();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await adminGetUsers<AdminUser[]>();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fout bij laden gebruikers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Weet u zeker dat u deze gebruiker wilt verwijderen?")) return;
    
    try {
      setError(null);
      await adminDeleteUser(id);
      loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fout bij verwijderen gebruiker");
    }
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className="mb-8">
          <Link href="/admin" className="text-sm text-[var(--accent)] hover:underline mb-2 inline-block">
            ← Terug naar Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Gebruikersbeheer</h1>
          <p className="text-[var(--foreground-muted)] mt-2">Bekijk en beheer alle gebruikers</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Zoek op gebruikersnaam, email of rol..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--background)] focus:ring-2 focus:ring-[var(--accent)]"
          />
        </div>

        {/* Users List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-[var(--foreground-muted)] mt-4">Gebruikers laden...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12 bg-[var(--card)] border border-[var(--border)] rounded-xl">
            <p className="text-[var(--foreground-muted)]">Geen gebruikers gevonden</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="p-6 bg-[var(--card)] border border-[var(--border)] rounded-xl hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-[var(--foreground)]">{user.username}</h3>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        user.role === "admin" 
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" 
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      }`}>
                        {user.role}
                      </span>
                    </div>
                    <p className="text-[var(--foreground-muted)] mb-2">📧 {user.email}</p>
                    <div className="flex gap-4 text-sm text-[var(--foreground-muted)]">
                      <span>🆔 {user.id}</span>
                      <span>📅 Aangemaakt: {new Date(user.createdAt).toLocaleDateString('nl-NL')}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="px-4 py-2 bg-[var(--accent)] text-[var(--accent-foreground)] rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
                    >
                      Details
                    </Link>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
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

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl text-center">
            <p className="text-2xl font-bold text-[var(--accent)]">{users.length}</p>
            <p className="text-sm text-[var(--foreground-muted)]">Totaal gebruikers</p>
          </div>
          <div className="p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl text-center">
            <p className="text-2xl font-bold text-[var(--accent)]">{users.filter(u => u.role === "admin").length}</p>
            <p className="text-sm text-[var(--foreground-muted)]">Admins</p>
          </div>
          <div className="p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl text-center">
            <p className="text-2xl font-bold text-[var(--accent)]">{users.filter(u => u.role === "student").length}</p>
            <p className="text-sm text-[var(--foreground-muted)]">Studenten</p>
          </div>
          <div className="p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl text-center">
            <p className="text-2xl font-bold text-[var(--accent)]">{filteredUsers.length}</p>
            <p className="text-sm text-[var(--foreground-muted)]">Gefilterd</p>
          </div>
        </div>
      </div>
    </div>
  );
}

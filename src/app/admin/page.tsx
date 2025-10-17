"use client";

import { useRequireAdmin } from "@/hooks/use-require-admin";
import Link from "next/link";

export default function AdminDashboard() {
  const { isAdmin, isLoading } = useRequireAdmin();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[var(--foreground-muted)]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const adminFeatures = [
    {
      title: "VKM Beheer",
      description: "Bekijk, maak, bewerk en verwijder VKM modules",
      icon: "📚",
      href: "/admin/vkms",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Gebruikersbeheer",
      description: "Bekijk en beheer gebruikers en hun favorieten",
      icon: "👥",
      href: "/admin/users",
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-5xl">👑</span>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto">
            Welkom bij het beheerderspaneel. Hier kunt u VKM modules en gebruikers beheren.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {adminFeatures.map((feature) => (
            <Link
              key={feature.href}
              href={feature.href}
              className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 transition-all hover:shadow-2xl hover:scale-105"
            >
              {/* Background gradient on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
              
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-5xl">{feature.icon}</span>
                  <div className="w-10 h-10 rounded-full bg-[var(--background-secondary)] flex items-center justify-center group-hover:bg-[var(--accent)] transition-colors">
                    <span className="text-xl group-hover:text-[var(--accent-foreground)]">→</span>
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
                  {feature.title}
                </h2>
                
                <p className="text-[var(--foreground-muted)]">
                  {feature.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Stats Section (Optional - can be populated with real data) */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 text-center">
            <p className="text-3xl font-bold text-[var(--accent)]">-</p>
            <p className="text-sm text-[var(--foreground-muted)] mt-1">Totaal VKMs</p>
          </div>
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 text-center">
            <p className="text-3xl font-bold text-[var(--accent)]">-</p>
            <p className="text-sm text-[var(--foreground-muted)] mt-1">Actieve VKMs</p>
          </div>
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 text-center">
            <p className="text-3xl font-bold text-[var(--accent)]">-</p>
            <p className="text-sm text-[var(--foreground-muted)] mt-1">Gebruikers</p>
          </div>
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 text-center">
            <p className="text-3xl font-bold text-[var(--accent)]">-</p>
            <p className="text-sm text-[var(--foreground-muted)] mt-1">Admins</p>
          </div>
        </div>
      </div>
    </div>
  );
}

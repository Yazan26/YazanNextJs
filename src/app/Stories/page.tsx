"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Story = {
  id: number;
  title: string;
  summary: string;
  student: string;
  study: string;
  theme: "Techniek" | "Business" | "Creatief" | "Zorg";
  tags: string[];
};

const stories: Story[] = [
  {
    id: 1,
    title: "Van profielkeuze naar Data Science",
    summary:
      "Ruben ontdekte via het Compass dat zijn passie voor puzzels en data perfect aansloot bij de Avans-opleiding Data Science en AI.",
    student: "Ruben",
    study: "Data Science en AI",
    theme: "Techniek",
    tags: ["AI", "Analyse", "Innovatie"],
  },
  {
    id: 2,
    title: "Impact maken met Social Work",
    summary:
      "Na een tussenjaar vond Amina haar drive om jongeren te begeleiden. Dankzij coaching vanuit Compass durfde ze de stap te zetten.",
    student: "Amina",
    study: "Social Work",
    theme: "Zorg",
    tags: ["Coaching", "Mensgericht", "Stage"],
  },
  {
    id: 3,
    title: "Ondernemen in creatieve teams",
    summary:
      "Nora combineert creativiteit met ondernemerschap. Met Programma Match ontdekte ze dat Creative Business perfect aansloot.",
    student: "Nora",
    study: "Creative Business",
    theme: "Creatief",
    tags: ["Strategie", "Marketing", "Concept"],
  },
  {
    id: 4,
    title: "Smart Industry in de praktijk",
    summary:
      "Lee werkte al deeltijd in de techniek en zocht verdieping. Met Compass koos hij voor de Associate degree Smart Industry.",
    student: "Lee",
    study: "Smart Industry",
    theme: "Techniek",
    tags: ["Robotics", "Productie", "Associate degree"],
  },
  {
    id: 5,
    title: "Finance maar dan duurzaam",
    summary:
      "Eline wil financiele processen verduurzamen. Dankzij Coach Connect sprak ze met alumni en koos ze voor Finance en Control.",
    student: "Eline",
    study: "Finance en Control",
    theme: "Business",
    tags: ["Duurzaamheid", "Strategie", "Stage"],
  },
];

const filters = ["Alle", "Techniek", "Business", "Creatief", "Zorg"] as const;

export default function StoriesPage() {
  const [selectedFilter, setSelectedFilter] = useState<(typeof filters)[number]>("Alle");

  const filteredStories = useMemo(() => {
    if (selectedFilter === "Alle") {
      return stories;
    }
    return stories.filter((story) => story.theme === selectedFilter);
  }, [selectedFilter]);

  return (
    <div className="page-container space-y-10">
      <div className="flex flex-col gap-4 text-center">
        <span className="badge mx-auto">Echte ervaringen</span>
        <h1 className="text-3xl font-semibold text-[var(--foreground)] sm:text-4xl">
          Avans verhalen die richting geven
        </h1>
        <p className="mx-auto max-w-3xl text-sm text-[var(--muted)]">
          Laat je inspireren door studenten en alumni die hun weg vonden met de hulp van Avans Keuze Compass. Filter op thema en ontdek hoe zij hun keuzes maakten.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {filters.map((filter) => {
          const isActive = selectedFilter === filter;
          return (
            <button
              key={filter}
              type="button"
              onClick={() => setSelectedFilter(filter)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? "border-transparent bg-[var(--accent)] text-[var(--accent-foreground)]"
                  : "border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filteredStories.map((story) => (
          <article key={story.id} className="card-surface flex h-full flex-col gap-4 p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="rounded-full bg-[color-mix(in srgb, var(--accent) 15%, transparent)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--accent-foreground)]">
                {story.theme}
              </span>
              <span className="text-xs font-semibold text-[var(--muted)]">
                {story.student} - {story.study}
              </span>
            </div>
            <h2 className="text-2xl font-semibold text-[var(--foreground)]">{story.title}</h2>
            <p className="text-sm text-[var(--muted)]">{story.summary}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              {story.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-auto pt-4">
              <Link
                href="#contact"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] transition hover:underline"
              >
                Lees hoe jij jouw route plant{" ->"}
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="card-surface flex flex-col gap-6 px-8 py-10 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-[var(--foreground)]">
            Deel jouw kompas-verhaal
          </h2>
          <p className="max-w-xl text-sm text-[var(--muted)]">
            Gebruik je Avans Keuze Compass al? Laat andere studenten weten hoe jij keuzes maakte en inspireer volgende lichtingen.
          </p>
        </div>
        <Link
          href="/register"
          className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-[var(--accent-foreground)] transition hover:shadow-lg"
        >
          Deel je verhaal
        </Link>
      </div>
    </div>
  );
}

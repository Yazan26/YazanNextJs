"use client";

import { useMemo, useState } from "react";

type UserStory = {
  id: string;
  title: string;
  description: string;
  given: string;
  when: string;
  then: string;
  priority: "high" | "medium" | "low";
  functionalRequirements?: string[];
};

type Epic = {
  id: string;
  title: string;
  description: string;
  stories: UserStory[];
  color: string;
};

type RoleData = {
  role: string;
  icon: string;
  description: string;
  epics: Epic[];
  totalStories: number;
};

const rolesData: RoleData[] = [
  {
    role: "Student",
    icon: "🎓",
    description: "Ontdek, vergelijk en kies de perfecte modules voor jouw leerpad",
    totalStories: 9,
    epics: [
      {
        id: "EP-STU-1",
        title: "Ontdekken & Zoeken",
        description: "Vind en filter modules op basis van jouw voorkeuren",
        color: "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400",
        stories: [
          {
            id: "US-STU-01",
            title: "Zoeken en filteren",
            description: "Filter modules op thema, periode, taal en modality",
            given: "ik ben op /modules",
            when: "ik filter op thema, periode, taal, modality",
            then: "dan zie ik alleen passende modules met totaalresultaat",
            priority: "high",
            functionalRequirements: ["FR-01"],
          },
          {
            id: "US-STU-02",
            title: "Module-details bekijken",
            description: "Bekijk alle informatie over een specifieke module",
            given: "ik open een resultaat",
            when: "ik bekijk de detailpagina",
            then: "dan zie ik omschrijving, ects, periode, taal, modality, tags en vereisten",
            priority: "high",
            functionalRequirements: ["FR-02"],
          },
          {
            id: "US-STU-03",
            title: "Vergelijken",
            description: "Vergelijk meerdere modules naast elkaar",
            given: "ik selecteer 2–4 modules",
            when: "ik open \"Vergelijken\"",
            then: "dan zie ik een tabel met kernvelden naast elkaar",
            priority: "medium",
            functionalRequirements: ["FR-03"],
          },
        ],
      },
      {
        id: "EP-STU-2",
        title: "Shortlist & Beslissen",
        description: "Bewaar en beheer jouw favoriete modules",
        color: "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400",
        stories: [
          {
            id: "US-STU-04",
            title: "Shortlist toevoegen/verwijderen",
            description: "Voeg modules toe aan jouw persoonlijke shortlist",
            given: "ik bekijk een module",
            when: "ik klik \"Toevoegen aan shortlist\"",
            then: "dan staat hij in mijn shortlist en blijft bewaard na refresh",
            priority: "high",
            functionalRequirements: ["FR-04"],
          },
          {
            id: "US-STU-05",
            title: "Shortlist inzien",
            description: "Bekijk alle modules die je hebt opgeslagen",
            given: "ik open /shortlist",
            when: "ik bekijk mijn lijst",
            then: "dan zie ik alle items met link naar details",
            priority: "high",
            functionalRequirements: ["FR-04"],
          },
        ],
      },
      {
        id: "EP-STU-3",
        title: "Profiel & Beschikbaarheid",
        description: "Personaliseer jouw ervaring met interesses en planning",
        color: "bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400",
        stories: [
          {
            id: "US-STU-06",
            title: "Interesses en perioden instellen",
            description: "Configureer jouw voorkeuren en beschikbaarheid",
            given: "ik open /me",
            when: "ik sla interesses en beschikbare perioden op",
            then: "dan worden aanbevelingen en conflictdetectie hiermee bijgewerkt",
            priority: "medium",
            functionalRequirements: ["FR-05"],
          },
        ],
      },
      {
        id: "EP-STU-4",
        title: "Aanbevelingen",
        description: "Ontvang gepersonaliseerde module-aanbevelingen",
        color: "bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-400",
        stories: [
          {
            id: "US-STU-07",
            title: "Aanbevelingen op basis van profiel",
            description: "Krijg slimme suggesties gebaseerd op jouw interesses",
            given: "ik heb interesses ingevuld",
            when: "ik open \"Aanbevelingen\"",
            then: "dan zie ik min. 5 modules met matchscore en reden (tags-overlap)",
            priority: "low",
          },
        ],
      },
      {
        id: "EP-STU-5",
        title: "Conflictdetectie",
        description: "Voorkom rooster- en planningsconflicten",
        color: "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400",
        stories: [
          {
            id: "US-STU-08",
            title: "Rooster/conflict waarschuwing",
            description: "Krijg waarschuwingen bij planningsconflicten",
            given: "mijn beschikbare perioden zijn P2–P3",
            when: "ik bekijk module in P1",
            then: "dan toont de UI een conflictwarning met alternatieven",
            priority: "medium",
            functionalRequirements: ["FR-06"],
          },
        ],
      },
      {
        id: "EP-STU-6",
        title: "Authenticatie",
        description: "Veilig inloggen en toegang tot persoonlijke features",
        color: "bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400",
        stories: [
          {
            id: "US-STU-09",
            title: "Registreren & Inloggen (JWT)",
            description: "Maak een account en log veilig in",
            given: "ik heb accountgegevens",
            when: "ik log in",
            then: "dan krijg ik toegang tot protected routes en mijn shortlist",
            priority: "high",
            functionalRequirements: ["FR-07"],
          },
        ],
      },
    ],
  },
  {
    role: "Admin",
    icon: "⚙️",
    description: "Beheer modules, vereisten en onderhoud de applicatie",
    totalStories: 6,
    epics: [
      {
        id: "EP-ADM-1",
        title: "Modulebeheer (CRU)",
        description: "Maak, lees en wijzig modules",
        color: "bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400",
        stories: [
          {
            id: "US-ADM-01",
            title: "Module aanmaken (Create)",
            description: "Voeg nieuwe modules toe aan het systeem",
            given: "ik ben admin op /admin/modules/new",
            when: "ik vul verplichte velden in",
            then: "dan wordt de module aangemaakt en verschijnt in /modules",
            priority: "high",
            functionalRequirements: ["FR-08"],
          },
          {
            id: "US-ADM-02",
            title: "Module bewerken (Update)",
            description: "Wijzig bestaande module-informatie",
            given: "een bestaande module",
            when: "ik wijzig bv. periode of tags",
            then: "dan is de wijziging zichtbaar in detail en zoekresultaten",
            priority: "high",
            functionalRequirements: ["FR-08"],
          },
          {
            id: "US-ADM-03",
            title: "Modules lijst & zoeken (Read)",
            description: "Bekijk en filter alle modules in het systeem",
            given: "ik open /admin/modules",
            when: "ik filter op periode/actief",
            then: "dan zie ik gefilterde resultaten met status",
            priority: "high",
            functionalRequirements: ["FR-08"],
          },
        ],
      },
      {
        id: "EP-ADM-2",
        title: "Prereqs, status en tagging",
        description: "Beheer vereisten en module-eigenschappen",
        color: "bg-pink-500/10 border-pink-500/30 text-pink-600 dark:text-pink-400",
        stories: [
          {
            id: "US-ADM-04",
            title: "Vereisten instellen",
            description: "Configureer prerequisites voor modules",
            given: "een module \"AI-Intro\"",
            when: "ik voeg \"Math-Basics\" toe als prerequisite",
            then: "dan toont de student-view dit als vereiste",
            priority: "medium",
          },
          {
            id: "US-ADM-05",
            title: "Activeren/deactiveren",
            description: "Beheer zichtbaarheid van modules",
            given: "een module",
            when: "ik zet 'active=false'",
            then: "dan verdwijnt hij uit student-zoekresultaten",
            priority: "medium",
          },
        ],
      },
      {
        id: "EP-ADM-3",
        title: "Audit & Toezicht",
        description: "Volg wijzigingen en beheer systeemintegriteit",
        color: "bg-teal-500/10 border-teal-500/30 text-teal-600 dark:text-teal-400",
        stories: [
          {
            id: "US-ADM-06",
            title: "Auditlog inzien",
            description: "Bekijk historiek van systeemwijzigingen",
            given: "ik open /admin/audit",
            when: "ik filter op entity=Module en datum",
            then: "dan zie ik wie wat heeft gewijzigd met timestamp",
            priority: "low",
            functionalRequirements: ["FR-09"],
          },
        ],
      },
    ],
  },
  {
    role: "Studiecoach",
    icon: "💼",
    description: "Begeleid studenten bij hun keuzes en geef persoonlijk advies",
    totalStories: 2,
    epics: [
      {
        id: "EP-COA-1",
        title: "Coachen op keuze",
        description: "Ondersteun studenten in hun beslissingsproces",
        color: "bg-cyan-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-400",
        stories: [
          {
            id: "US-COA-01",
            title: "Studentprofiel inzien",
            description: "Bekijk studentgegevens en voorkeuren",
            given: "ik open een student",
            when: "ik bekijk profiel, shortlist en interesses",
            then: "dan zie ik context en mogelijke conflicten",
            priority: "medium",
          },
          {
            id: "US-COA-02",
            title: "Voorstel doen",
            description: "Suggereer modules aan studenten",
            given: "ik bekijk shortlist",
            when: "ik voeg een module-suggestie toe met notitie",
            then: "dan ziet de student het voorstel en kan accepteren/weigeren",
            priority: "low",
          },
        ],
      },
    ],
  },
  {
    role: "QA/Beheer",
    icon: "🔧",
    description: "Monitor systeemgezondheid en technische metrics",
    totalStories: 2,
    epics: [
      {
        id: "EP-OPS-1",
        title: "Health & Observability",
        description: "Bewaak applicatie-status en performance",
        color: "bg-slate-500/10 border-slate-500/30 text-slate-600 dark:text-slate-400",
        stories: [
          {
            id: "US-OPS-01",
            title: "Health-endpoint",
            description: "Controleer API-status en uptime",
            given: "API draait",
            when: "ik call /health",
            then: "dan krijg ik db: ok, uptime en versie",
            priority: "high",
          },
          {
            id: "US-OPS-02",
            title: "Request logging",
            description: "Volg API-verzoeken voor debugging",
            given: "er zijn API-calls",
            when: "ik bekijk logs",
            then: "dan zie ik method, route, status, duration met correlationId",
            priority: "medium",
          },
        ],
      },
    ],
  },
];

type CrossCuttingStory = {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  functionalRequirements?: string[];
};

const crossCuttingEpics: Array<{
  id: string;
  title: string;
  color: string;
  stories: CrossCuttingStory[];
}> = [
  {
    id: "EP-SEC-1",
    title: "Security & Validatie",
    color: "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400",
    stories: [
      {
        id: "US-SEC-01",
        title: "Double validation",
        description: "G: ik post onvolledige payload → W: backend valideert DTO → T: 400 met duidelijke fout",
        priority: "high",
      },
      {
        id: "US-SEC-02",
        title: "RBAC",
        description: "G: role=student → W: ik POST /modules → T: 403; role=admin → 201",
        priority: "high",
        functionalRequirements: ["FR-07"],
      },
    ],
  },
  {
    id: "EP-PERF-1",
    title: "Performance & Indexen",
    color: "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
    stories: [
      {
        id: "US-PERF-01",
        title: "Indexen actief voor zoeken",
        description: "G: modules bevat title/tags index → W: ik zoek op q + period → T: P95 < 400 ms",
        priority: "medium",
      },
    ],
  },
];

export default function StoriesPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [expandedEpic, setExpandedEpic] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCrossCutting, setShowCrossCutting] = useState(false);

  const filteredRoles = useMemo(() => {
    if (!searchQuery) return rolesData;
    
    const query = searchQuery.toLowerCase();
    return rolesData
      .map((role) => ({
        ...role,
        epics: role.epics
          .map((epic) => ({
            ...epic,
            stories: epic.stories.filter(
              (story) =>
                story.title.toLowerCase().includes(query) ||
                story.description.toLowerCase().includes(query) ||
                story.id.toLowerCase().includes(query) ||
                epic.title.toLowerCase().includes(query)
            ),
          }))
          .filter((epic) => epic.stories.length > 0),
      }))
      .filter((role) => role.epics.length > 0);
  }, [searchQuery]);

  const displayedRoles = selectedRole
    ? filteredRoles.filter((r) => r.role === selectedRole)
    : filteredRoles;

  const totalStories = rolesData.reduce((sum, role) => sum + role.totalStories, 0);
  const totalEpics = rolesData.reduce((sum, role) => sum + role.epics.length, 0);

  return (
    <div className="page-container space-y-10">
      {/* Hero Section */}
      <div className="flex flex-col gap-6 text-center">
        <span className="badge mx-auto">Product Roadmap</span>
        <h1 className="text-4xl font-bold text-[var(--foreground)] sm:text-5xl">
          Epics & User Stories
        </h1>
        <p className="mx-auto max-w-3xl text-base text-[var(--muted)]">
          Ontdek de volledige functionaliteit van Avans Keuze Compass, georganiseerd per gebruikersrol. 
          Van student tot admin, van zoeken tot beheer—elk verhaal is ontworpen met jouw ervaring in gedachten.
        </p>

        {/* Stats */}
        <div className="mx-auto flex flex-wrap items-center justify-center gap-6 text-center">
          <div className="flex flex-col gap-1">
            <span className="text-3xl font-bold text-[var(--accent)]">{totalEpics}</span>
            <span className="text-xs uppercase tracking-wide text-[var(--muted)]">Epics</span>
          </div>
          <div className="h-8 w-px bg-[var(--border)]" />
          <div className="flex flex-col gap-1">
            <span className="text-3xl font-bold text-[var(--accent)]">{totalStories}</span>
            <span className="text-xs uppercase tracking-wide text-[var(--muted)]">User Stories</span>
          </div>
          <div className="h-8 w-px bg-[var(--border)]" />
          <div className="flex flex-col gap-1">
            <span className="text-3xl font-bold text-[var(--accent)]">{rolesData.length}</span>
            <span className="text-xs uppercase tracking-wide text-[var(--muted)]">Rollen</span>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="card-surface space-y-4 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="search"
            placeholder="Zoek op epic, story ID of keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--foreground)] transition focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
          <button
            type="button"
            onClick={() => {
              setSelectedRole(null);
              setSearchQuery("");
              setExpandedEpic(null);
            }}
            className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-semibold text-[var(--muted)] transition hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
          >
            Reset filters
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {rolesData.map((role) => {
            const isActive = selectedRole === role.role;
            return (
              <button
                key={role.role}
                type="button"
                onClick={() => setSelectedRole(isActive ? null : role.role)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "border-transparent bg-[var(--accent)] text-[var(--accent-foreground)]"
                    : "border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
                }`}
              >
                {role.icon} {role.role}
              </button>
            );
          })}
        </div>
      </div>

      {/* Roles & Epics */}
      <div className="space-y-8">
        {displayedRoles.map((roleData) => (
          <div key={roleData.role} className="space-y-4">
            {/* Role Header */}
            <div className="card-surface p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{roleData.icon}</span>
                    <h2 className="text-2xl font-bold text-[var(--foreground)]">
                      {roleData.role}
                    </h2>
                    <span className="rounded-full bg-[var(--accent)]/20 px-3 py-1 text-xs font-bold text-[var(--accent)]">
                      {roleData.totalStories} stories
                    </span>
                  </div>
                  <p className="text-sm text-[var(--muted)]">{roleData.description}</p>
                </div>
              </div>
            </div>

            {/* Epics Grid */}
            <div className="grid gap-4 lg:grid-cols-2">
              {roleData.epics.map((epic) => {
                const isExpanded = expandedEpic === epic.id;
                const completedStories = epic.stories.filter((s) => s.priority === "high").length;
                const progress = (completedStories / epic.stories.length) * 100;

                return (
                  <div
                    key={epic.id}
                    className="card-surface overflow-hidden transition-all hover:shadow-lg"
                  >
                    {/* Epic Header */}
                    <button
                      type="button"
                      onClick={() => setExpandedEpic(isExpanded ? null : epic.id)}
                      className="w-full p-6 text-left transition"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${epic.color}`}
                            >
                              {epic.id}
                            </span>
                            <span className="text-xs text-[var(--muted)]">
                              {epic.stories.length} stories
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-[var(--foreground)]">
                            {epic.title}
                          </h3>
                          <p className="text-sm text-[var(--muted)]">{epic.description}</p>

                          {/* Progress Bar */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-[var(--muted)]">High priority</span>
                              <span className="font-semibold text-[var(--foreground)]">
                                {completedStories}/{epic.stories.length}
                              </span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--border)]">
                              <div
                                className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="text-[var(--muted)] transition">
                          {isExpanded ? "▲" : "▼"}
                        </div>
                      </div>
                    </button>

                    {/* Stories List */}
                    {isExpanded && (
                      <div className="space-y-3 border-t border-[var(--border)] bg-[var(--card)]/30 p-6">
                        {epic.stories.map((story) => (
                          <div
                            key={story.id}
                            className="space-y-3 rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 transition hover:border-[var(--accent)]"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs font-bold text-[var(--accent)]">
                                    {story.id}
                                  </span>
                                  <span
                                    className={`rounded-full px-2 py-0.5 text-xs font-semibold uppercase ${
                                      story.priority === "high"
                                        ? "bg-red-500/20 text-red-600 dark:text-red-400"
                                        : story.priority === "medium"
                                        ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                                        : "bg-green-500/20 text-green-600 dark:text-green-400"
                                    }`}
                                  >
                                    {story.priority}
                                  </span>
                                </div>
                                <h4 className="font-semibold text-[var(--foreground)]">
                                  {story.title}
                                </h4>
                                <p className="text-xs text-[var(--muted)]">{story.description}</p>

                                {/* Given-When-Then */}
                                <div className="space-y-1 rounded-md bg-[var(--background)]/50 p-3 text-xs">
                                  <div>
                                    <span className="font-semibold text-green-600 dark:text-green-400">
                                      Given:{" "}
                                    </span>
                                    <span className="text-[var(--muted)]">{story.given}</span>
                                  </div>
                                  <div>
                                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                                      When:{" "}
                                    </span>
                                    <span className="text-[var(--muted)]">{story.when}</span>
                                  </div>
                                  <div>
                                    <span className="font-semibold text-purple-600 dark:text-purple-400">
                                      Then:{" "}
                                    </span>
                                    <span className="text-[var(--muted)]">{story.then}</span>
                                  </div>
                                </div>

                                {/* Functional Requirements */}
                                {story.functionalRequirements && (
                                  <div className="flex flex-wrap gap-1">
                                    {story.functionalRequirements.map((fr) => (
                                      <span
                                        key={fr}
                                        className="rounded bg-[var(--accent)]/10 px-2 py-0.5 font-mono text-xs font-semibold text-[var(--accent)]"
                                      >
                                        {fr}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Cross-Cutting Concerns */}
      <div className="card-surface space-y-4 p-6">
        <button
          type="button"
          onClick={() => setShowCrossCutting(!showCrossCutting)}
          className="flex w-full items-center justify-between text-left"
        >
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-[var(--foreground)]">
              🔒 Cross-Cutting Epics
            </h2>
            <p className="text-sm text-[var(--muted)]">
              Security, performance en andere systeem-brede vereisten
            </p>
          </div>
          <span className="text-[var(--muted)]">{showCrossCutting ? "▲" : "▼"}</span>
        </button>

        {showCrossCutting && (
          <div className="grid gap-4 border-t border-[var(--border)] pt-4 md:grid-cols-2">
            {crossCuttingEpics.map((epic) => (
              <div key={epic.id} className="space-y-3 rounded-lg border border-[var(--border)] p-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold uppercase ${epic.color}`}
                  >
                    {epic.id}
                  </span>
                </div>
                <h3 className="font-bold text-[var(--foreground)]">{epic.title}</h3>
                <div className="space-y-2">
                  {epic.stories.map((story) => (
                    <div
                      key={story.id}
                      className="rounded border border-[var(--border)] bg-[var(--card)] p-3 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[var(--accent)]">
                          {story.id}
                        </span>
                        <span className="font-semibold text-[var(--foreground)]">
                          {story.title}
                        </span>
                      </div>
                      <p className="mt-1 text-[var(--muted)]">{story.description}</p>
                      {story.functionalRequirements && (
                        <div className="mt-2 flex gap-1">
                          {story.functionalRequirements.map((fr) => (
                            <span
                              key={fr}
                              className="rounded bg-[var(--accent)]/10 px-2 py-0.5 font-mono text-xs font-semibold text-[var(--accent)]"
                            >
                              {fr}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="card-surface flex flex-col gap-6 px-8 py-10 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-[var(--foreground)]">
            Klaar om te beginnen?
          </h2>
          <p className="max-w-xl text-sm text-[var(--muted)]">
            Ervaar de kracht van Avans Keuze Compass. Registreer vandaag en ontdek welke modules perfect bij jou passen.
          </p>
        </div>
        <a
          href="/register"
          className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-[var(--accent-foreground)] transition hover:shadow-lg"
        >
          Start nu →
        </a>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";

type FunctionalRequirement = {
  id: string;
  description: string;
};

type NonFunctionalRequirement = {
  id: string;
  category: string;
  description: string;
};

type UserStory = {
  id: string;
  title: string;
  acceptanceCriteria: string[];
};

type Epic = {
  id: string;
  title: string;
  description: string;
  stories: UserStory[];
  color: string;
};

const functionalRequirements: FunctionalRequirement[] = [
  { id: "FR1", description: "De gebruiker kan kiezen tussen lightmode en darkmode." },
  { id: "FR2", description: "De gebruiker kan inloggen met een geregistreerd account." },
  { id: "FR3", description: "De gebruiker kan een nieuw account registreren." },
  { id: "FR4", description: "Een student kan een lijst met vrije keuzemodules (VKMs) bekijken." },
  { id: "FR5", description: "Een student kan de details van een specifieke VKM bekijken (zoals titel, niveau, locatie, studiepunten, docent)." },
  { id: "FR6", description: "Een admin kan een overzicht zien van alle studenten en VKMs." },
  { id: "FR7", description: "Een admin kan studenten en VKMs beheren: aanmaken (Create), bekijken (Read), aanpassen (Update) en verwijderen (Delete)." },
  { id: "FR8", description: "Gebruikers kunnen zoeken en filteren op locatie, studiepunten en niveau." },
  { id: "FR9", description: "Een student kan VKMs toevoegen aan zijn favorietenlijst." },
  { id: "FR10", description: "Een admin kan de favorieten van studenten bekijken." },
  { id: "FR11", description: "De app bevat een Privacy Policy pagina met informatie over gegevensverwerking." },
];

const nonFunctionalRequirements: NonFunctionalRequirement[] = [
  { id: "NFR1", category: "Usability", description: "De UI moet intuïtief en gebruiksvriendelijk zijn voor zowel studenten als admins." },
  { id: "NFR2", category: "Performance", description: "Pagina's moeten binnen 2 seconden laden bij een stabiele internetverbinding." },
  { id: "NFR3", category: "Security", description: "Wachtwoorden worden gehasht opgeslagen in de database." },
  { id: "NFR4", category: "Security", description: "Alleen geauthenticeerde gebruikers hebben toegang tot beschermde routes." },
  { id: "NFR5", category: "Maintainability", description: "De codebase volgt de Onion architecture (scheiding tussen controller, service, DAO, enz.)." },
  { id: "NFR6", category: "Scalability", description: "De app moet uitbreidbaar zijn voor toekomstige functionaliteiten (zoals notificaties)." },
  { id: "NFR7", category: "Compatibility", description: "De app werkt in light en dark mode op zowel desktop als mobiel." },
  { id: "NFR8", category: "Reliability", description: "De app moet stabiel blijven bij meerdere gelijktijdige gebruikers." },
  { id: "NFR9", category: "Privacy", description: "De applicatie voldoet aan de AVG (GDPR)-richtlijnen." },
  { id: "NFR10", category: "Accessibility", description: "Kleuren en contrasten moeten toegankelijk zijn volgens WCAG 2.1-richtlijnen." },
];

const epics: Epic[] = [
  {
    id: "Epic 1",
    title: "Gebruikersbeheer",
    description: "Als gebruiker wil ik kunnen registreren en inloggen zodat ik toegang heb tot mijn gepersonaliseerde omgeving.",
    color: "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400",
    stories: [
      {
        id: "US1.1",
        title: "Als student wil ik een account kunnen registreren, zodat ik kan inloggen in de app.",
        acceptanceCriteria: [
          "Gebruiker kan een nieuw account aanmaken met unieke e-mail en wachtwoord.",
          "Foutmelding bij al bestaand e-mailadres.",
          "Registratieformulier valideert verplichte velden.",
        ],
      },
      {
        id: "US1.2",
        title: "Als gebruiker wil ik kunnen inloggen, zodat ik mijn persoonlijke data kan zien.",
        acceptanceCriteria: [
          "Gebruiker kan inloggen met geldig e-mailadres en wachtwoord.",
          "Onjuiste inloggegevens geven foutmelding.",
          "Na inloggen wordt gebruiker doorgestuurd naar de dashboardpagina.",
        ],
      },
      {
        id: "US1.3",
        title: "Als admin wil ik gebruikers kunnen beheren (CRUD), zodat ik controle houd over studentenaccounts.",
        acceptanceCriteria: [],
      },
    ],
  },
  {
    id: "Epic 2",
    title: "VKM Overzicht & Details",
    description: "Als student wil ik alle vrije keuzemodules kunnen bekijken en filteren zodat ik een geschikte module kan vinden.",
    color: "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400",
    stories: [
      {
        id: "US2.1",
        title: "Als student wil ik een overzicht van alle VKMs kunnen zien.",
        acceptanceCriteria: [
          "Lijst met VKMs wordt opgehaald uit de database.",
          "Elke VKM toont titel, locatie, niveau en studiepunten.",
          "Laden duurt maximaal 2 seconden.",
        ],
      },
      {
        id: "US2.2",
        title: "Als student wil ik de details van een VKM kunnen bekijken.",
        acceptanceCriteria: [],
      },
      {
        id: "US2.3",
        title: "Als student wil ik kunnen zoeken op naam, locatie, niveau of studiepunten.",
        acceptanceCriteria: [],
      },
      {
        id: "US2.4",
        title: "Als student wil ik VKMs kunnen filteren op locatie, studiepunten en niveau.",
        acceptanceCriteria: [
          "Gebruiker kan filters toepassen op locatie, studiepunten en niveau.",
          "Resultaten passen zich dynamisch aan.",
          "Geen resultaten tonen melding 'Geen VKMs gevonden'.",
        ],
      },
      {
        id: "US2.5",
        title: "Als admin wil ik VKMs kunnen aanmaken, aanpassen of verwijderen.",
        acceptanceCriteria: [],
      },
    ],
  },
  {
    id: "Epic 3",
    title: "Favorietenbeheer",
    description: "Als student wil ik mijn favoriete VKMs kunnen opslaan, zodat ik deze later snel terugvind.",
    color: "bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400",
    stories: [
      {
        id: "US3.1",
        title: "Als student wil ik VKMs kunnen toevoegen aan mijn favorieten.",
        acceptanceCriteria: [
          "Student kan een VKM als favoriet markeren.",
          "Favorieten worden opgeslagen in de database.",
          "Dubbele favorieten worden voorkomen.",
        ],
      },
      {
        id: "US3.2",
        title: "Als student wil ik mijn favorietenlijst kunnen bekijken.",
        acceptanceCriteria: [],
      },
      {
        id: "US3.3",
        title: "Als admin wil ik de favorieten van studenten kunnen inzien.",
        acceptanceCriteria: [
          "Admin kan per student de favorietenlijst bekijken.",
          "Data wordt correct geladen uit de database.",
        ],
      },
    ],
  },
  {
    id: "Epic 4",
    title: "Interface & Gebruikerservaring",
    description: "Als gebruiker wil ik de app kunnen gebruiken in een visueel prettige en toegankelijke omgeving.",
    color: "bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-400",
    stories: [
      {
        id: "US4.1",
        title: "Als gebruiker wil ik kunnen wisselen tussen lightmode en darkmode.",
        acceptanceCriteria: [
          "Gebruiker kan wisselen tussen light en dark mode via een toggle.",
          "Keuze blijft behouden bij herladen van de pagina.",
        ],
      },
      {
        id: "US4.2",
        title: "Als gebruiker wil ik een consistente interface op desktop en mobiel.",
        acceptanceCriteria: [],
      },
      {
        id: "US4.3",
        title: "Als gebruiker wil ik een Privacy Policy kunnen raadplegen.",
        acceptanceCriteria: [
          "Privacy Policy is bereikbaar via het menu.",
          "Pagina bevat informatie over gegevensverwerking en AVG.",
        ],
      },
    ],
  },
];

export default function StoriesPage() {
  const [expandedEpic, setExpandedEpic] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"fr" | "nfr" | "epics">("epics");

  const filteredEpics = useMemo(() => {
    if (!searchQuery) return epics;
    
    const query = searchQuery.toLowerCase();
    return epics
      .map((epic) => ({
        ...epic,
        stories: epic.stories.filter(
          (story) =>
            story.title.toLowerCase().includes(query) ||
            story.id.toLowerCase().includes(query) ||
            epic.title.toLowerCase().includes(query)
        ),
      }))
      .filter((epic) => epic.stories.length > 0);
  }, [searchQuery]);

  const totalStories = epics.reduce((sum, epic) => sum + epic.stories.length, 0);

  return (
    <div className="page-container space-y-10">
      {/* Hero Section */}
      <div className="flex flex-col gap-6 text-center">
        <span className="badge mx-auto">Requirements & Product Roadmap</span>
        <h1 className="text-4xl font-bold text-[var(--foreground)] sm:text-5xl">
          Requirements, Epics & User Stories
        </h1>
        <p className="mx-auto max-w-3xl text-base text-[var(--muted)]">
          Ontdek de volledige functionaliteit van Avans Keuze Compass: van functionele en niet-functionele requirements 
          tot epics en user stories met acceptatiecriteria.
        </p>

        {/* Stats */}
        <div className="mx-auto flex flex-wrap items-center justify-center gap-6 text-center">
          <div className="flex flex-col gap-1">
            <span className="text-3xl font-bold text-[var(--accent)]">{functionalRequirements.length}</span>
            <span className="text-xs uppercase tracking-wide text-[var(--muted)]">Functionele Requirements</span>
          </div>
          <div className="h-8 w-px bg-[var(--border)]" />
          <div className="flex flex-col gap-1">
            <span className="text-3xl font-bold text-[var(--accent)]">{nonFunctionalRequirements.length}</span>
            <span className="text-xs uppercase tracking-wide text-[var(--muted)]">Niet-Functionele Requirements</span>
          </div>
          <div className="h-8 w-px bg-[var(--border)]" />
          <div className="flex flex-col gap-1">
            <span className="text-3xl font-bold text-[var(--accent)]">{epics.length}</span>
            <span className="text-xs uppercase tracking-wide text-[var(--muted)]">Epics</span>
          </div>
          <div className="h-8 w-px bg-[var(--border)]" />
          <div className="flex flex-col gap-1">
            <span className="text-3xl font-bold text-[var(--accent)]">{totalStories}</span>
            <span className="text-xs uppercase tracking-wide text-[var(--muted)]">User Stories</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card-surface p-6">
        <div className="flex flex-wrap gap-2 border-b border-[var(--border)] pb-4">
          <button
            type="button"
            onClick={() => setActiveTab("fr")}
            className={`rounded-t-lg px-6 py-3 text-sm font-semibold transition ${
              activeTab === "fr"
                ? "border-b-2 border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                : "text-[var(--muted)] hover:bg-[var(--accent)]/5 hover:text-[var(--foreground)]"
            }`}
          >
            🧩 Functionele Requirements
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("nfr")}
            className={`rounded-t-lg px-6 py-3 text-sm font-semibold transition ${
              activeTab === "nfr"
                ? "border-b-2 border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                : "text-[var(--muted)] hover:bg-[var(--accent)]/5 hover:text-[var(--foreground)]"
            }`}
          >
            ⚙️ Niet-Functionele Requirements
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("epics")}
            className={`rounded-t-lg px-6 py-3 text-sm font-semibold transition ${
              activeTab === "epics"
                ? "border-b-2 border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                : "text-[var(--muted)] hover:bg-[var(--accent)]/5 hover:text-[var(--foreground)]"
            }`}
          >
            🧱 Epics & User Stories
          </button>
        </div>
      </div>

      {/* Content Tabs */}
      {activeTab === "fr" && (
        <div className="card-surface p-6">
          <h2 className="mb-6 text-2xl font-bold text-[var(--foreground)]">🧩 Functionele Requirements</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-[var(--border)]">
                  <th className="px-4 py-3 text-left font-bold text-[var(--foreground)]">Nr</th>
                  <th className="px-4 py-3 text-left font-bold text-[var(--foreground)]">Omschrijving</th>
                </tr>
              </thead>
              <tbody>
                {functionalRequirements.map((fr) => (
                  <tr key={fr.id} className="border-b border-[var(--border)] hover:bg-[var(--accent)]/5">
                    <td className="px-4 py-3 font-mono font-semibold text-[var(--accent)]">{fr.id}</td>
                    <td className="px-4 py-3 text-[var(--foreground)]">{fr.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "nfr" && (
        <div className="card-surface p-6">
          <h2 className="mb-6 text-2xl font-bold text-[var(--foreground)]">⚙️ Niet-Functionele Requirements</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-[var(--border)]">
                  <th className="px-4 py-3 text-left font-bold text-[var(--foreground)]">Nr</th>
                  <th className="px-4 py-3 text-left font-bold text-[var(--foreground)]">Categorie</th>
                  <th className="px-4 py-3 text-left font-bold text-[var(--foreground)]">Omschrijving</th>
                </tr>
              </thead>
              <tbody>
                {nonFunctionalRequirements.map((nfr) => (
                  <tr key={nfr.id} className="border-b border-[var(--border)] hover:bg-[var(--accent)]/5">
                    <td className="px-4 py-3 font-mono font-semibold text-[var(--accent)]">{nfr.id}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-[var(--accent)]/10 px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                        {nfr.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--foreground)]">{nfr.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "epics" && (
        <div className="space-y-6">
          <div className="card-surface p-4">
            <input
              type="search"
              placeholder="Zoek op epic, story ID of keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--foreground)] transition focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>

          <div className="space-y-6">
            {filteredEpics.map((epic) => {
              const isExpanded = expandedEpic === epic.id;

              return (
                <div key={epic.id} className="card-surface overflow-hidden">
                  {/* Epic Header */}
                  <button
                    type="button"
                    onClick={() => setExpandedEpic(isExpanded ? null : epic.id)}
                    className="w-full p-6 text-left transition hover:bg-[var(--accent)]/5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase ${epic.color}`}>
                            {epic.id}
                          </span>
                          <h3 className="text-xl font-bold text-[var(--foreground)]">{epic.title}</h3>
                          <span className="text-sm text-[var(--muted)]">({epic.stories.length} stories)</span>
                        </div>
                        <p className="text-sm text-[var(--muted)]">{epic.description}</p>
                      </div>
                      <span className="text-2xl text-[var(--muted)]">{isExpanded ? "▲" : "▼"}</span>
                    </div>
                  </button>

                  {/* Stories List */}
                  {isExpanded && (
                    <div className="space-y-4 border-t border-[var(--border)] bg-[var(--card)]/30 p-6">
                      {epic.stories.map((story) => (
                        <div
                          key={story.id}
                          className="space-y-3 rounded-lg border border-[var(--border)] bg-[var(--card)] p-5 transition hover:border-[var(--accent)] hover:shadow-md"
                        >
                          <div className="flex items-start gap-3">
                            <span className="font-mono text-sm font-bold text-[var(--accent)]">{story.id}</span>
                            <div className="flex-1 space-y-3">
                              <p className="text-sm font-medium text-[var(--foreground)]">{story.title}</p>

                              {/* Acceptance Criteria */}
                              {story.acceptanceCriteria.length > 0 && (
                                <div className="space-y-2">
                                  <h4 className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
                                    ✅ Acceptatiecriteria:
                                  </h4>
                                  <ul className="space-y-1">
                                    {story.acceptanceCriteria.map((criterion, idx) => (
                                      <li key={idx} className="flex gap-2 text-xs text-[var(--muted)]">
                                        <span className="text-green-600 dark:text-green-400">•</span>
                                        <span>{criterion}</span>
                                      </li>
                                    ))}
                                  </ul>
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
      )}

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

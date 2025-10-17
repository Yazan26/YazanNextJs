"use client";

import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="page-container pb-20">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-2 text-center">
          <span className="badge mx-auto">Privacy & Gegevens</span>
          <h1 className="text-4xl font-bold text-[var(--foreground)]">
            Privacyverklaring
          </h1>
          <p className="text-[var(--foreground-muted)]">
            Wij nemen jouw privacy serieus. Hieronder lees je hoe we gegevens verzamelen, gebruiken en beschermen.
          </p>
        </header>

        <section className="card-surface p-8">
          <h2 className="mb-3 text-2xl font-semibold text-[var(--foreground)]">1. Welke gegevens verzamelen we?</h2>
          <p className="text-[var(--foreground-muted)] leading-relaxed">
            Wanneer je een account aanmaakt of inlogt, verzamelen we alleen de benodigde gegevens om je toegang te geven en de dienst te leveren. Dit kan omvatten:
          </p>

          <ul className="mt-4 list-disc pl-6 text-[var(--foreground-muted)] space-y-2">
            <li>Gebruikersnaam, voornaam, achternaam en e-mailadres</li>
            <li>Authenticatietokens (JWT) voor sessiebeheer</li>
            <li>Voorkeursinstellingen en favorieten (lokale of server-side opgeslagen)</li>
          </ul>
        </section>

        <section className="card-surface p-8">
          <h2 className="mb-3 text-2xl font-semibold text-[var(--foreground)]">2. Waarom gebruiken we deze gegevens?</h2>
          <p className="text-[var(--foreground-muted)] leading-relaxed">
            We gebruiken je gegevens om:
          </p>
          <ul className="mt-4 list-disc pl-6 text-[var(--foreground-muted)] space-y-2">
            <li>Toegang en beveiliging van je account te beheren</li>
            <li>Je gepersonaliseerde inhoud te tonen (bijv. favorieten en aanbevolen modules)</li>
            <li>Communicatie te sturen met belangrijke updates of informatie</li>
          </ul>
        </section>

        <section className="card-surface p-8">
          <h2 className="mb-3 text-2xl font-semibold text-[var(--foreground)]">3. Hoe lang bewaren we gegevens?</h2>
          <p className="text-[var(--foreground-muted)] leading-relaxed">
            We bewaren je account- en voorkeurgegevens zolang je account bestaat of totdat je verzoekt deze te verwijderen. Logbestanden en tijdelijke gegevens kunnen voor een korte periode langer bewaard worden voor beveiligings- en analyse doeleinden.
          </p>
        </section>

        <section className="card-surface p-8">
          <h2 className="mb-3 text-2xl font-semibold text-[var(--foreground)]">4. Delen we gegevens met derden?</h2>
          <p className="text-[var(--foreground-muted)] leading-relaxed">
            We delen geen persoonlijke gegevens met derden, behalve wanneer dit noodzakelijk is om de dienst te leveren of wanneer we wettelijk verplicht zijn. Services die we mogelijk gebruiken (zoals authenticatie of hosting) zullen alleen de minimaal benodigde gegevens ontvangen en zijn contractueel gebonden aan vertrouwelijkheid.
          </p>
        </section>

        <section className="card-surface p-8">
          <h2 className="mb-3 text-2xl font-semibold text-[var(--foreground)]">5. Beveiliging</h2>
          <p className="text-[var(--foreground-muted)] leading-relaxed">
            We nemen passende technische en organisatorische maatregelen om je gegevens te beschermen tegen verlies, onbevoegde toegang of misbruik. Denk aan beveiligde verbindingen (HTTPS), veilige opslag van tokens en minimale toegang tot productiedata.
          </p>
        </section>

        <section className="card-surface p-8">
          <h2 className="mb-3 text-2xl font-semibold text-[var(--foreground)]">6. Jouw rechten</h2>
          <p className="text-[var(--foreground-muted)] leading-relaxed">
            Je hebt het recht om inzage te vragen in de gegevens die we van je bewaren. Je kunt verzoeken om correctie of verwijdering van je gegevens. Neem contact op via de contactknop hieronder als je een verzoek wilt indienen.
          </p>
          <div className="mt-4">
          </div>
        </section>

        <section className="card-surface p-8">
          <h2 className="mb-3 text-2xl font-semibold text-[var(--foreground)]">7. Wijzigingen in deze verklaring</h2>
          <p className="text-[var(--foreground-muted)] leading-relaxed">
            We kunnen deze privacyverklaring bijwerken. We zullen significante wijzigingen communiceren via de applicatie of via e-mail waar mogelijk.
          </p>
        </section>

        <footer className="text-center text-sm text-[var(--foreground-muted)]">
          <p>© 2025 Avans Keuze Compass</p>
          <p>Laatste update: 17 oktober 2025</p>
        </footer>
      </div>
    </div>
  );
}

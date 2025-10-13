import Link from "next/link";

const highlights = [
  {
    title: "Compass Check",
    description:
      "Ontdek jouw interesses met interactieve vragenlijsten die inzicht geven in vaardigheden en ambities.",
  },
  {
    title: "Programma Match",
    description:
      "Vergelijk opleidingen op basis van jouw voorkeuren en ontvang aanbevelingen op maat.",
  },
  {
    title: "Coach Connect",
    description:
      "Plan gesprekken met Avans-coaches en ervaar persoonlijke begeleiding bij het maken van je keuze.",
  },
];

const steps = [
  {
    label: "1",
    title: "Verken",
    description:
      "Beantwoord vragen en verken verhalen van studenten die jou voorgingen.",
  },
  {
    label: "2",
    title: "Vergelijk",
    description: "Bekijk welke opleidingen passen bij jouw profiel en ambities.",
  },
  {
    label: "3",
    title: "Verbind",
    description:
      "Leg contact met coaches of meld je aan voor proefstudeerdagen bij Avans.",
  },
];

const testimonials = [
  {
    name: "Mila",
    study: "Creative Business",
    quote:
      "Dankzij Avans Keuze Compass vond ik snel de opleiding die echt bij me past. De verhalen en begeleiding gaven vertrouwen.",
  },
  {
    name: "Dani",
    study: "Data Science en AI",
    quote:
      "De persoonlijke tips maakten een wereld van verschil. Ik wist precies welke volgende stappen ik moest zetten.",
  },
];

export default function Home() {
  return (
    <div className="space-y-24">
      <section className="page-container mt-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <span className="badge">Start jouw ontdekkingstocht</span>
          <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl">
            Jouw richting, jouw toekomst. Kies met vertrouwen dankzij Avans Keuze Compass.
          </h1>
          <p className="max-w-2xl text-lg text-[var(--muted)]">
            We begeleiden je stap voor stap naar een studie die aansluit bij wie jij bent. Met praktische tools, eerlijke verhalen en persoonlijke coaching vind je jouw ideale pad binnen Avans Hogeschool.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-[var(--accent-foreground)] transition hover:shadow-lg"
            >
              Start gratis
            </Link>
            <Link
              href="/Stories"
              className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-[var(--foreground)] transition hover:border-transparent hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
            >
              Ontdek verhalen
            </Link>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-gradient-to-br from-[var(--card)] via-[#fde8e8] to-transparent p-8 shadow-xl dark:via-[#2b1920]">
          <div className="absolute -top-10 -right-6 h-32 w-32 rounded-full bg-[var(--accent)] opacity-40 blur-3xl" />
          <div className="absolute -bottom-8 -left-6 h-32 w-32 rounded-full bg-[var(--accent)] opacity-20 blur-3xl" />
          <div className="relative space-y-6">
            <h2 className="text-2xl font-semibold text-[var(--foreground)]">Avans navigator</h2>
            <p className="text-sm text-[var(--muted)]">
              Met realtime inzichten, persoonlijke aanbevelingen en directe coaching stuur jij je eigen route.
            </p>
            <ul className="space-y-4 text-sm">
              {highlights.map((item) => (
                <li
                  key={item.title}
                  className="rounded-[var(--radius)] border border-[var(--border)] bg-[color-mix(in srgb, var(--accent) 12%, transparent)] px-4 py-3 text-[var(--foreground)] shadow-sm backdrop-blur-sm"
                >
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-[var(--muted)]">{item.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="inspiratie" className="bg-[color-mix(in srgb, var(--accent) 6%, transparent)] py-16">
        <div className="page-container space-y-10">
          <div className="flex flex-col gap-3 text-center">
            <h2 className="text-3xl font-semibold text-[var(--foreground)] sm:text-4xl">Inspiratie die bij jou past</h2>
            <p className="mx-auto max-w-2xl text-sm text-[var(--muted)]">
              Krijg heldere inzichten, ontdek nieuwe opleidingen en leer van studenten die dezelfde route hebben bewandeld.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {highlights.map((item) => (
              <div key={item.title} className="card-surface p-6 text-left">
                <h3 className="text-xl font-semibold text-[var(--foreground)]">{item.title}</h3>
                <p className="mt-3 text-sm text-[var(--muted)]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="coaching" className="page-container space-y-10">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold text-[var(--foreground)] sm:text-4xl">Zo werkt het</h2>
          <p className="max-w-3xl text-sm text-[var(--muted)]">
            We combineren data met persoonlijke begeleiding. In drie duidelijke stappen krijg jij overzicht, focus en actiepunten om zeker te kiezen.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {steps.map((step) => (
            <div key={step.label} className="card-surface space-y-4 p-6">
              <span className="badge w-fit">{step.label}</span>
              <h3 className="text-xl font-semibold text-[var(--foreground)]">{step.title}</h3>
              <p className="text-sm text-[var(--muted)]">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[color-mix(in srgb, var(--accent) 8%, transparent)] py-16">
        <div className="page-container space-y-10">
          <div className="flex flex-col gap-3 text-center">
            <h2 className="text-3xl font-semibold text-[var(--foreground)] sm:text-4xl">Wat studenten zeggen</h2>
            <p className="mx-auto max-w-2xl text-sm text-[var(--muted)]">
              Echte verhalen van Avans-studenten die hun keuze met Compass maakten.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {testimonials.map((item) => (
              <figure key={item.name} className="card-surface flex h-full flex-col justify-between gap-6 p-6">
                <blockquote className="text-base font-medium text-[var(--foreground)]">
                  {`"${item.quote}"`}
                </blockquote>
                <figcaption className="text-sm font-semibold text-[var(--muted)]">
                  {item.name} - {item.study}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="page-container">
        <div className="card-surface flex flex-col items-center gap-6 overflow-hidden px-8 py-12 text-center sm:px-12">
          <h2 className="text-3xl font-semibold text-[var(--foreground)] sm:text-4xl">Klaar voor jouw volgende stap?</h2>
          <p className="max-w-2xl text-sm text-[var(--muted)]">
            Maak een account aan, plan een gesprek met een Avans-coach en krijg direct toegang tot gepersonaliseerde tools. Jij bepaalt het tempo, wij staan naast je.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full border border-transparent bg-[var(--foreground)] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-[var(--background)] transition hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
            >
              Inloggen
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-[var(--foreground)] transition hover:border-transparent hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
            >
              Nu starten
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

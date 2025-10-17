"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const highlights = [
  {
    icon: "🧭",
    title: "Compass Check",
    description:
      "Ontdek jouw interesses met interactieve vragenlijsten die inzicht geven in vaardigheden en ambities.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: "🎯",
    title: "Programma Match",
    description:
      "Vergelijk opleidingen op basis van jouw voorkeuren en ontvang aanbevelingen op maat.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: "💬",
    title: "Coach Connect",
    description:
      "Plan gesprekken met Avans-coaches en ervaar persoonlijke begeleiding bij het maken van je keuze.",
    color: "from-orange-500 to-red-500",
  },
];

const steps = [
  {
    label: "1",
    title: "Verken",
    description:
      "Beantwoord vragen en verken verhalen van studenten die jou voorgingen.",
    icon: "🔍",
  },
  {
    label: "2",
    title: "Vergelijk",
    description: "Bekijk welke opleidingen passen bij jouw profiel en ambities.",
    icon: "⚖️",
  },
  {
    label: "3",
    title: "Verbind",
    description:
      "Leg contact met coaches of meld je aan voor proefstudeerdagen bij Avans.",
    icon: "🤝",
  },
];

const testimonials = [
  {
    name: "Mila",
    study: "Creative Business",
    quote:
      "Dankzij Avans Keuze Compass vond ik snel de opleiding die echt bij me past. De verhalen en begeleiding gaven vertrouwen.",
    avatar: "👩‍🎨",
  },
  {
    name: "Dani",
    study: "Data Science en AI",
    quote:
      "De persoonlijke tips maakten een wereld van verschil. Ik wist precies welke volgende stappen ik moest zetten.",
    avatar: "👨‍💻",
  },
];

const stats = [
  { value: "1000+", label: "Studenten geholpen" },
  { value: "50+", label: "Opleidingen" },
  { value: "95%", label: "Tevredenheid" },
  { value: "24/7", label: "Beschikbaar" },
];

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute h-96 w-96 rounded-full bg-[var(--accent)] opacity-10 blur-3xl transition-transform duration-700"
          style={{
            transform: `translate(${mousePosition.x / 20}px, ${mousePosition.y / 20}px)`,
            top: "10%",
            left: "10%",
          }}
        />
        <div
          className="absolute h-96 w-96 rounded-full bg-blue-500 opacity-10 blur-3xl transition-transform duration-700"
          style={{
            transform: `translate(${-mousePosition.x / 30}px, ${-mousePosition.y / 30}px)`,
            bottom: "10%",
            right: "10%",
          }}
        />
        <div className="bg-grid absolute inset-0 opacity-30" />
      </div>

      <div className="space-y-32">
        {/* Hero Section */}
        <section className="section-hero relative">
          <div className="page-container">
            <div className={`grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center transition-all duration-4000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 shadow-md animate-delay-100" style={{animation: "fadeIn 0.6s ease-out"}}>
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
                  </span>
                  <span className="text-sm font-semibold text-[var(--foreground)]">
                    Start jouw ontdekkingstocht
                  </span>
                </div>

                <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl animate-delay-200" style={{animation: "slideInFromLeft 0.8s ease-out"}}>
                  <span className="block text-[var(--foreground)]">Jouw richting,</span>
                  <span className="block text-gradient-animated">jouw toekomst.</span>
                </h1>

                <p className="max-w-2xl text-lg leading-relaxed text-[var(--foreground-muted)] animate-delay-300" style={{animation: "fadeIn 1s ease-out"}}>
                  We begeleiden je stap voor stap naar een studie die aansluit bij wie jij bent. 
                  Met <span className="font-semibold text-[var(--accent)]">praktische tools</span>, 
                  eerlijke verhalen en persoonlijke coaching vind je jouw ideale pad binnen Avans Hogeschool.
                </p>

                <div className="flex flex-col gap-4 sm:flex-row animate-delay-400" style={{animation: "fadeIn 1.2s ease-out"}}>
                  <Link href="/register" className="btn btn-primary group">
                    Start gratis
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                  <Link href="/Stories" className="btn btn-secondary">
                    Ontdek verhalen
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-8 sm:grid-cols-4 animate-delay-500" style={{animation: "fadeIn 1.4s ease-out"}}>
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl font-bold text-[var(--accent)]">{stat.value}</div>
                      <div className="text-xs text-[var(--foreground-muted)]">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hero Card */}
              <div className="relative animate-delay-300" style={{animation: "slideInFromRight 1s ease-out"}}>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-purple-600 opacity-20 blur-2xl" />
                <div className="card-glass relative space-y-6 p-8 lg:p-10">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] text-2xl shadow-lg">
                      🧭
                    </span>
                    <h2 className="text-2xl font-bold text-[var(--foreground)]">
                      Avans Navigator
                    </h2>
                  </div>
                  
                  <p className="text-sm text-[var(--foreground-muted)]">
                    Met realtime inzichten, persoonlijke aanbevelingen en directe coaching stuur jij je eigen route.
                  </p>

                  <div className="space-y-3">
                    {highlights.map((item, index) => (
                      <div
                        key={item.title}
                        className="group relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 transition-all hover:border-[var(--accent)] hover:shadow-lg"
                        style={{
                          animationDelay: `${(index + 1) * 100}ms`,
                          animation: "scaleIn 0.5s ease-out",
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl transition-transform group-hover:scale-110">
                            {item.icon}
                          </span>
                          <div className="flex-1">
                            <p className="font-semibold text-[var(--foreground)]">
                              {item.title}
                            </p>
                            <p className="text-xs text-[var(--foreground-muted)]">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="inspiratie" className="relative">
          <div className="page-container space-y-12">
            <div className="text-center space-y-4">
              <span className="badge-outline">Features</span>
              <h2 className="text-4xl font-bold text-[var(--foreground)] sm:text-5xl">
                Inspiratie die bij <span className="text-gradient">jou</span> past
              </h2>
              <p className="mx-auto max-w-2xl text-base text-[var(--foreground-muted)]">
                Krijg heldere inzichten, ontdek nieuwe opleidingen en leer van studenten die dezelfde route hebben bewandeld.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {highlights.map((item, index) => (
                <div
                  key={item.title}
                  className="card-glass group relative overflow-hidden p-8 transition-all hover:scale-105"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: "fadeIn 0.8s ease-out",
                  }}
                >
                  <div className={`absolute top-0 right-0 h-32 w-32 rounded-full bg-gradient-to-br ${item.color} opacity-10 blur-2xl transition-all group-hover:opacity-20`} />
                  
                  <div className="relative space-y-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--card)] to-[var(--background)] text-4xl shadow-lg">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold text-[var(--foreground)]">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-[var(--foreground-muted)]">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="coaching" className="section-features relative">
          <div className="page-container space-y-12">
            <div className="text-center space-y-4">
              <span className="badge-outline">Proces</span>
              <h2 className="text-4xl font-bold text-[var(--foreground)] sm:text-5xl">
                Zo werkt het
              </h2>
              <p className="mx-auto max-w-3xl text-base text-[var(--foreground-muted)]">
                We combineren data met persoonlijke begeleiding. In drie duidelijke stappen krijg jij overzicht, focus en actiepunten om zeker te kiezen.
              </p>
            </div>

            <div className="relative">
              {/* Connection Line */}
              <div className="absolute top-1/2 left-0 right-0 hidden h-0.5 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent lg:block" />

              <div className="grid gap-8 lg:grid-cols-3">
                {steps.map((step, index) => (
                  <div
                    key={step.label}
                    className="card-surface relative space-y-4 p-8 text-center transition-all hover:scale-105"
                    style={{
                      animationDelay: `${index * 150}ms`,
                      animation: "scaleIn 0.8s ease-out",
                    }}
                  >
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] text-4xl shadow-xl">
                      {step.icon}
                    </div>
                    <div className="inline-flex items-center justify-center rounded-full bg-[var(--accent)]/20 px-4 py-1 text-sm font-bold text-[var(--accent)]">
                      Stap {step.label}
                    </div>
                    <h3 className="text-2xl font-bold text-[var(--foreground)]">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-[var(--foreground-muted)]">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="relative overflow-hidden bg-[var(--background-secondary)] py-20">
          <div className="page-container space-y-12">
            <div className="text-center space-y-4">
              <span className="badge-outline">Testimonials</span>
              <h2 className="text-4xl font-bold text-[var(--foreground)] sm:text-5xl">
                Wat studenten zeggen
              </h2>
              <p className="mx-auto max-w-2xl text-base text-[var(--foreground-muted)]">
                Echte verhalen van Avans-studenten die hun keuze met Compass maakten.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {testimonials.map((item, index) => (
                <div
                  key={item.name}
                  className="card-glass group relative p-8 transition-all hover:scale-105"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: "fadeIn 0.8s ease-out",
                  }}
                >
                  <div className="absolute -top-4 -right-4 text-6xl opacity-20 transition-all group-hover:scale-110">
                    💬
                  </div>
                  
                  <div className="relative space-y-6">
                    <blockquote className="text-lg font-medium leading-relaxed text-[var(--foreground)]">
                      &quot;{item.quote}&quot;
                    </blockquote>
                    
                    <div className="flex items-center gap-4">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] text-2xl shadow-lg">
                        {item.avatar}
                      </span>
                      <div>
                        <p className="font-bold text-[var(--foreground)]">{item.name}</p>
                        <p className="text-sm text-[var(--foreground-muted)]">{item.study}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="page-container pb-20">
          <div className="card-gradient relative overflow-hidden p-12 text-center lg:p-16">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent" />
            
            <div className="relative mx-auto max-w-3xl space-y-8">
              <h2 className="text-4xl font-bold sm:text-5xl">
                Klaar voor jouw volgende stap?
              </h2>
              <p className="text-lg leading-relaxed opacity-90">
                Maak een account aan, plan een gesprek met een Avans-coach en krijg direct toegang tot gepersonaliseerde tools. 
                Jij bepaalt het tempo, wij staan naast je.
              </p>
              
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white bg-white px-8 py-4 text-base font-bold uppercase tracking-wide text-[var(--accent)] shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
                >
                  Nu starten
                  <span className="text-xl">→</span>
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white bg-transparent px-8 py-4 text-base font-bold uppercase tracking-wide text-white transition-all hover:bg-white hover:text-[var(--accent)]"
                >
                  Inloggen
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

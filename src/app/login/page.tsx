"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import Link from "next/link";
import { FormField } from "@/components/form-field";
import { API_AUTH_ENDPOINTS, API_BASE_URL } from "@/lib/config";

type LoginFormState = {
  username: string;
  password: string;
};

type FormErrors = Partial<Record<keyof LoginFormState, string>>;

const initialState: LoginFormState = {
  username: "",
  password: "",
};


const getEndpoint = (path: string) => {
  if (!API_BASE_URL) {
    return null;
  }
  return `${API_BASE_URL}${path}`;
};

export default function LoginPage() {
  const [formState, setFormState] = useState<LoginFormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const validationErrors: FormErrors = {};

    if (!formState.username.trim()) {
      validationErrors.username = "Gebruikersnaam is verplicht.";
    }

    if (!formState.password) {
      validationErrors.password = "Wachtwoord is verplicht.";
    } else if (formState.password.length < 8) {
      validationErrors.password = "Wachtwoord moet minimaal 8 tekens bevatten.";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleChange =
    (field: keyof LoginFormState) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setFormState((current) => ({ ...current, [field]: event.target.value }));
      if (errors[field]) {
        setErrors((current) => ({ ...current, [field]: undefined }));
      }
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage(null);

    if (!validate()) {
      return;
    }

    const endpoint = getEndpoint(API_AUTH_ENDPOINTS.login);
    if (!endpoint) {
      setStatusMessage(
        "API-configuratie ontbreekt. Voeg NEXT_PUBLIC_API_URL toe aan je .env.local."
      );
      return;
    }

    setIsLoading(true);
    try {
      // Build payload and log it so the developer can inspect what's being posted
      const payload = {
        username: formState.username.trim(),
        password: formState.password,
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as {
          message?: string;
          error?: string;
        };
        const message =
          payload.message ?? payload.error ?? "Inloggen is niet gelukt.";
        throw new Error(message);
      }

      setStatusMessage("Succes! Je bent ingelogd.");
      setFormState(initialState);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Er ging iets mis tijdens het inloggen.";
      setStatusMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="mx-auto flex max-w-lg flex-col gap-8">
        <div className="space-y-3 text-center">
          <span className="badge mx-auto">Welkom terug</span>
          <h1 className="text-3xl font-semibold text-[var(--foreground)]">
            Log in bij Avans Keuze Compass
          </h1>
          <p className="text-sm text-[var(--muted)]">
            Ontgrendel je persoonlijke dashboard en ga verder met jouw kompas.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="card-surface space-y-6 p-8"
          noValidate
        >
          <FormField
            id="email"
            label="Gebruikersnaam"
            type="text"
            value={formState.username}
            onChange={handleChange("username")}
            error={errors.username}
            required
            placeholder="Bijvoorbeeld: Noor"
          />

          <FormField
            id="password"
            label="Wachtwoord"
            type="password"
            value={formState.password}
            onChange={handleChange("password")}
            error={errors.password}
            required
            placeholder="Minimaal 8 tekens"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-[var(--accent-foreground)] transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Bezig met inloggen..." : "Inloggen"}
          </button>

          {statusMessage ? (
            <p className="text-center text-sm font-medium text-[var(--muted)]">
              {statusMessage}
            </p>
          ) : null}
        </form>

        <p className="text-center text-sm text-[var(--muted)]">
          Nog geen account?{" "}
          <Link
            href="/register"
            className="font-semibold text-[var(--accent)] transition hover:underline"
          >
            Maak een account aan
          </Link>
        </p>
      </div>
    </div>
  );
}

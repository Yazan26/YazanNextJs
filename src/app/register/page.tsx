"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/form-field";
import { API_AUTH_ENDPOINTS, API_BASE_URL } from "@/lib/config";
import { useAuth } from "@/contexts/auth-context";
import { getUserFromToken } from "@/lib/jwt";

type RegisterFormState = {
  username : string;
  email: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = Partial<Record<keyof RegisterFormState, string>>;

const initialState: RegisterFormState = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getEndpoint = (path: string) => {
  if (!API_BASE_URL) {
    return null;
  }
  return `${API_BASE_URL}${path}`;
};

export default function RegisterPage() {
  const [formState, setFormState] = useState<RegisterFormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  const validate = (): boolean => {
    const validationErrors: FormErrors = {};

    if (!formState.username.trim()) {
      validationErrors.username = "Gebruikersnaam is verplicht.";
    }

    if (!formState.email.trim()) {
      validationErrors.email = "E-mail is verplicht.";
    } else if (!EMAIL_PATTERN.test(formState.email.trim())) {
      validationErrors.email = "Voer een geldig e-mailadres in.";
    }

    if (!formState.password) {
      validationErrors.password = "Wachtwoord is verplicht.";
    } else if (formState.password.length < 8) {
      validationErrors.password = "Wachtwoord moet minimaal 8 tekens bevatten.";
    }

    if (!formState.confirmPassword) {
      validationErrors.confirmPassword = "Bevestig je wachtwoord.";
    } else if (formState.confirmPassword !== formState.password) {
      validationErrors.confirmPassword = "Wachtwoorden komen niet overeen.";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleChange =
    (field: keyof RegisterFormState) => (event: ChangeEvent<HTMLInputElement>) => {
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

    const endpoint = getEndpoint(API_AUTH_ENDPOINTS.register);
    if (!endpoint) {
      setStatusMessage(
        "API-configuratie ontbreekt. Voeg NEXT_PUBLIC_API_URL toe aan je .env.local."
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formState.username.trim(),
          email: formState.email.trim(),
          password: formState.password,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as {
          message?: string;
          error?: string;
        };
        const message =
          payload.message ?? payload.error ?? "Registreren is niet gelukt.";
        throw new Error(message);
      }

      const registeredUser = await response.json();
      
      // Registration successful, now log the user in automatically
      setStatusMessage("Account aangemaakt! Je wordt ingelogd...");
      
      // Auto-login: make a login request with the same credentials
      const loginEndpoint = getEndpoint(API_AUTH_ENDPOINTS.login);
      if (!loginEndpoint) {
        throw new Error("Kan niet automatisch inloggen.");
      }

      const loginResponse = await fetch(loginEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formState.username.trim(),
          password: formState.password,
        }),
      });

      if (!loginResponse.ok) {
        // Registration succeeded but login failed - redirect to login page
        setStatusMessage("Account aangemaakt! Redirecting naar login...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
        return;
      }

      const loginData = await loginResponse.json();

      if (loginData.access_token) {
        // Decode JWT to get user info
        const user = getUserFromToken(loginData.access_token);
        
        login(loginData.access_token, user);
        setStatusMessage("Welkom! Je wordt doorgestuurd...");
        setTimeout(() => {
          router.push("/modules");
        }, 1000);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Er ging iets mis tijdens het registreren.";
      setStatusMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="mx-auto flex max-w-2xl flex-col gap-8">
        <div className="space-y-3 text-center">
          <span className="badge mx-auto">Maak je kompas aan</span>
          <h1 className="text-3xl font-semibold text-[var(--foreground)]">
            Meld je aan voor Avans Keuze Compass
          </h1>
          <p className="text-sm text-[var(--muted)]">
            Vul je gegevens in en krijg toegang tot persoonlijke begeleiding, tools en inspirerende verhalen.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="card-surface space-y-6 p-8"
          noValidate
        >
            <FormField
              id="username"
              label="Gebruikersnaam"
              value={formState.username}
              onChange={handleChange("username")}
              error={errors.username}
              required
              placeholder="Bijvoorbeeld: Noor"
            />

           

          <FormField
            id="email"
            label="E-mailadres"
            type="email"
            value={formState.email}
            onChange={handleChange("email")}
            error={errors.email}
            required
            placeholder="naam@avans.nl"
          />

          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              id="password"
              label="Wachtwoord"
              type="password"
              value={formState.password}
              onChange={handleChange("password")}
              error={errors.password}
              required
              placeholder="Minimaal 10 tekens en 1 symbool"
            />
            <FormField
              id="confirmPassword"
              label="Bevestig wachtwoord"
              type="password"
              value={formState.confirmPassword}
              onChange={handleChange("confirmPassword")}
              error={errors.confirmPassword}
              required
              placeholder="Herhaal je wachtwoord"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-[var(--accent-foreground)] transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Account wordt aangemaakt..." : "Registreren"}
          </button>

          {statusMessage ? (
            <p className="text-center text-sm font-medium text-[var(--muted)]">
              {statusMessage}
            </p>
          ) : null}
        </form>

        <p className="text-center text-sm text-[var(--muted)]">
          Al een account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[var(--accent)] transition hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

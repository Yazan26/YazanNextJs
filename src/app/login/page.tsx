"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/form-field";
import { API_AUTH_ENDPOINTS } from "@/lib/config";
import { useAuth } from "@/contexts/auth-context";
import { getUserFromToken } from "@/lib/jwt";
import { apiPost } from "@/lib/api";

type LoginFormState = {
  username: string;
  password: string;
};

type FormErrors = Partial<Record<keyof LoginFormState, string>>;

const initialState: LoginFormState = {
  username: "",
  password: "",
};


export default function LoginPage() {
  const [formState, setFormState] = useState<LoginFormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

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

    setIsLoading(true);
    try {
      // Build payload and log it so the developer can inspect what's being posted
      const payload = {
        username: formState.username.trim(),
        password: formState.password,
      };

      const data = await apiPost<{ access_token?: string }>(
        API_AUTH_ENDPOINTS.login,
        payload,
        { auth: false }
      );

      if (!data?.access_token) {
        throw new Error("Geen access token ontvangen van de server.");
      }

      // Decode JWT to get user info
      try {
        const user = getUserFromToken(data.access_token);
        login(data.access_token, user);
        setStatusMessage("Succes! Je wordt doorgestuurd...");
        setTimeout(() => {
          router.push("/modules");
        }, 1000);
      } catch {
        throw new Error("Kan gebruikersgegevens niet decoderen.");
      }
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
            id="username"
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

          <div className="flex items-center justify-between gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex flex-1 items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-[var(--accent-foreground)] transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "Bezig met inloggen..." : "Inloggen"}
            </button>

            <Link
              href="/forgot-password"
              className="text-sm text-[var(--muted)] hover:underline"
            >
              Wachtwoord vergeten?
            </Link>
          </div>

          {statusMessage ? (
            <p
              className={`text-center text-sm font-medium ${
                statusMessage?.toLowerCase().includes("succes")
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {statusMessage}
            </p>
          ) : null}

          <div className="mt-2">
            <p className="text-center text-sm text-[var(--muted)] mb-3">
              Of log in met een testaccount:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-md border border-[rgba(0,0,0,0.06)] p-3 bg-white/5">
                <p className="font-medium text-sm">Fabianopungol</p>
                <p className="mt-1 text-xs font-mono text-[var(--muted)]">Username: Fabianopungol</p>
                <p className="text-xs font-mono text-[var(--muted)]">Password: Fabianopungol123!</p>
              </div>

              <div className="rounded-md border border-[rgba(0,0,0,0.06)] p-3 bg-white/5">
                <p className="font-medium text-sm">Admin</p>
                <p className="mt-1 text-xs font-mono text-[var(--muted)]">Username: Admin</p>
                <p className="text-xs font-mono text-[var(--muted)]">Password: Admin@Admin.com</p>
              </div>
            </div>
          </div>
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

"use client";

type LoadingStateProps = {
  message?: string;
};

export function LoadingState({ message = "Bezig met laden..." }: LoadingStateProps) {
  return (
    <div className="page-container flex min-h-[60vh] items-center justify-center">
      <div className="text-center" role="status" aria-live="polite">
        <div
          className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[var(--accent)] border-r-transparent"
          aria-hidden="true"
        />
        <p className="mt-4 text-[var(--foreground-muted)]">{message}</p>
      </div>
    </div>
  );
}

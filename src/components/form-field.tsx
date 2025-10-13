"use client";

import { ChangeEventHandler, FocusEventHandler } from "react";

type FormFieldProps = {
  id: string;
  label: string;
  type?: string;
  value: string;
  placeholder?: string;
  error?: string;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onBlur?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  isTextArea?: boolean;
  required?: boolean;
};

export const FormField = ({
  id,
  label,
  type = "text",
  value,
  placeholder,
  error,
  onChange,
  onBlur,
  isTextArea = false,
  required = false,
}: FormFieldProps) => {
  const InputElement = isTextArea ? "textarea" : "input";

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-sm font-semibold text-[var(--foreground)]"
      >
        {label} {required ? <span className="text-[var(--accent)]">*</span> : null}
      </label>
      <InputElement
        id={id}
        name={id}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        className={`w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--foreground)] shadow-sm transition focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${
          error ? "border-[var(--accent)]" : ""
        }`}
        {...(!isTextArea ? { type } : { rows: 4 })}
      />
      {error ? (
        <p className="text-xs font-medium text-[var(--accent)]">{error}</p>
      ) : null}
    </div>
  );
};

"use client";

import { ChangeEventHandler, FocusEventHandler, useState } from "react";

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
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const computedType = !isTextArea && type === "password" ? (showPassword ? "text" : "password") : type;
  const InputElement = isTextArea ? "textarea" : "input";

  return (
    <div className="flex flex-col gap-2 animate-fadeIn">
      <label
        htmlFor={id}
        className="text-sm font-bold text-[var(--foreground)] transition-colors"
      >
        {label}
        {required && (
          <span className="ml-1 text-[var(--accent)]" aria-label="Required">
            *
          </span>
        )}
      </label>
      
      <div className="relative group">
        <InputElement
          id={id}
          name={id}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          onFocus={() => setIsFocused(true)}
          required={required}
          className={`input-field pr-12 transition-all duration-300 ${
            error 
              ? "border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)]/20" 
              : ""
          } ${
            isFocused && !error
              ? "border-[var(--accent)] ring-4 ring-[var(--accent)]/10"
              : ""
          }`}
          {...(!isTextArea ? { type: computedType } : { rows: 4 })}
        />

        {/* Password Toggle */}
        {!isTextArea && type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg text-[var(--foreground-muted)] transition-all hover:bg-[var(--accent)]/10 hover:text-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
            aria-label={showPassword ? "Verberg wachtwoord" : "Toon wachtwoord"}
            tabIndex={-1}
          >
            {showPassword ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}

        {/* Focus indicator line */}
        <div
          className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[var(--accent)] to-purple-500 transition-all duration-300 ${
            isFocused && !error ? "w-full opacity-100" : "w-0 opacity-0"
          }`}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-xs font-semibold text-[var(--error)] animate-fadeIn">
          <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Success indicator (when value exists and no error) */}
      {value && !error && !isFocused && (
        <div className="flex items-center gap-2 text-xs font-semibold text-[var(--success)] animate-fadeIn">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Ziet er goed uit!</span>
        </div>
      )}
    </div>
  );
};

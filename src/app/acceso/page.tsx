"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui";
import { CLIENTS } from "@/lib/data";
import { useL, useStore } from "@/lib/store";

export default function AccesoPage() {
  const router = useRouter();
  const { t, login } = useStore();
  const l = useL();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found = login(email, password);
    if (!found) {
      setError(true);
      return;
    }
    // La sesión no se abre aquí: primero hay que pasar la verificación.
    router.push(`/verificacion?c=${found.id}`);
  }

  return (
    <AuthShell>
      <h2 className="ui-display text-lg text-ink">{t("login.title")}</h2>
      <div className="ui-rule mt-3 w-16" />

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <div>
          <label
            htmlFor="email"
            className="ui-eyebrow block text-ink-faint"
          >
            {t("login.email")}
          </label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(false);
            }}
            className="mt-2 w-full border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-accent"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="ui-eyebrow block text-ink-faint"
          >
            {t("login.password")}
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            className="mt-2 w-full border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-accent"
          />
        </div>

        {error && (
          <p className="border-l-2 border-[#A33A3A] bg-[#F9EFEF] px-3 py-2 text-[0.8125rem] text-[#A33A3A]">
            {t("login.error")}
          </p>
        )}

        <Button type="submit" full>
          {t("login.submit")}
        </Button>

        <Link
          href="/recuperar"
          className="block text-center text-xs text-ink-muted underline-offset-4 hover:text-ink hover:underline"
        >
          {t("login.forgot")}
        </Link>
      </form>

      {/* Atajo para la reunión: rellena el formulario con cada perfil. */}
      <div className="mt-10 border-t border-line pt-6">
        <p className="ui-eyebrow text-ink-faint">{t("login.demoTitle")}</p>
        <p className="mt-1.5 text-xs text-ink-faint">{t("login.demoHint")}</p>

        <ul className="mt-4 space-y-2">
          {CLIENTS.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => {
                  setEmail(c.email);
                  setPassword(c.password);
                  setError(false);
                }}
                className="w-full border border-line px-3 py-2.5 text-left transition-colors hover:border-accent hover:bg-accent-wash"
              >
                <span className="flex items-baseline justify-between gap-3">
                  <span className="text-sm font-medium text-ink">
                    {c.name}
                  </span>
                  <span className="shrink-0 text-[0.6875rem] text-ink-faint">
                    {c.email}
                  </span>
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-ink-faint">
                  {l(c.demoBlurb)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </AuthShell>
  );
}

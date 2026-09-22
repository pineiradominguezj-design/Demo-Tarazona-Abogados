"use client";

import type { ReactNode } from "react";
import { FIRM } from "@/config/identity";
import { useStore } from "@/lib/store";
import { LanguageSwitcher, Logo } from "./ui";
import { LockIcon } from "./icons";

/**
 * Marco de las pantallas de acceso: panel de marca a la izquierda,
 * formulario a la derecha. El selector de idioma está visible ya desde aquí.
 */
export function AuthShell({ children }: { children: ReactNode }) {
  const { t } = useStore();

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Panel de marca */}
        <aside className="relative flex flex-col justify-between bg-accent-dark px-8 py-8 lg:w-[42%] lg:px-14 lg:py-14">
          <div>
            <div className="inline-block bg-white px-5 py-4">
              <Logo className="h-9 lg:h-11" priority />
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="ui-rule mb-8 w-24" />
            <h1 className="ui-display max-w-sm text-2xl leading-snug text-white">
              {t("common.portal")}
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
              {t("login.subtitle")}
            </p>
          </div>

          <div className="mt-8 text-xs leading-relaxed text-white/45 lg:mt-0">
            <p>{FIRM.address}</p>
            <p className="mt-1">
              {FIRM.phone} · {FIRM.website}
            </p>
          </div>
        </aside>

        {/* Formulario */}
        <main className="flex flex-1 flex-col px-6 py-8 sm:px-10 lg:px-16 lg:py-14">
          <div className="mb-10 flex items-center justify-between gap-4">
            <span className="ui-eyebrow text-ink-faint">
              {t("common.language")}
            </span>
            <LanguageSwitcher />
          </div>

          <div className="flex flex-1 items-center">
            <div className="w-full max-w-md">{children}</div>
          </div>

          <p className="mt-10 flex items-center gap-2 text-xs text-ink-faint">
            <LockIcon className="h-3.5 w-3.5" />
            {t("login.securityNote")}
          </p>
        </main>
      </div>
    </div>
  );
}

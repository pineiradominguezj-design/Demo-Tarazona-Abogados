"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FIRM } from "@/config/identity";
import { useStore } from "@/lib/store";
import { formatDateTime } from "@/lib/format";
import { unreadMessagesForCase } from "@/lib/selectors";
import { LanguageSwitcher, Logo } from "./ui";
import { Onboarding } from "./Onboarding";
import {
  CalendarIcon,
  CloseIcon,
  EuroIcon,
  FolderIcon,
  MenuIcon,
  MessageIcon,
  UserIcon,
} from "./icons";
import type { TKey } from "@/lib/i18n";

/**
 * Navegación principal. Privacidad no está aquí a propósito: es texto legal,
 * no una sección del portal, así que vive al pie como en cualquier web.
 */
const NAV: { href: string; label: TKey; icon: typeof FolderIcon }[] = [
  { href: "/asuntos", label: "nav.cases", icon: FolderIcon },
  { href: "/mensajes", label: "nav.messages", icon: MessageIcon },
  { href: "/economico", label: "nav.billing", icon: EuroIcon },
  { href: "/perfil", label: "nav.profile", icon: UserIcon },
];

/**
 * Marco del portal: cabecera de marca, navegación y guardia de sesión.
 * Muestra la bienvenida la primera vez que entra cada cliente.
 */
export function PortalShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    hydrated,
    client,
    cases,
    messages,
    onboardedClientIds,
    markOnboarded,
    logout,
    t,
    locale,
  } = useStore();

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (hydrated && !client) router.replace("/acceso");
  }, [hydrated, client, router]);

  if (!hydrated || !client) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="ui-eyebrow text-ink-faint">{t("common.loading")}</span>
      </div>
    );
  }

  const unread = cases.reduce(
    (n, c) => n + unreadMessagesForCase(messages, c.id).length,
    0,
  );

  const needsOnboarding = !onboardedClientIds.includes(client.id);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="ui-no-print sticky top-0 z-30 border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/asuntos" className="shrink-0">
            <Logo className="h-7 sm:h-8" priority />
          </Link>

          <div className="flex items-center gap-3 sm:gap-5">
            {/* Último acceso, visible una vez dentro */}
            <span className="hidden text-right text-[0.6875rem] leading-tight text-ink-faint lg:block">
              <span className="block">{t("nav.lastAccess")}</span>
              <span className="block text-ink-muted">
                {formatDateTime(client.lastAccess, locale)}
              </span>
            </span>

            <LanguageSwitcher />

            <button
              type="button"
              onClick={() => {
                logout();
                router.replace("/acceso");
              }}
              className="hidden text-[0.6875rem] font-medium tracking-[0.1em] uppercase text-ink-muted transition-colors hover:text-ink sm:block"
            >
              {t("nav.logout")}
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={t("nav.menu")}
              aria-expanded={menuOpen}
              className="text-ink md:hidden"
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Navegación de escritorio */}
        <nav className="mx-auto hidden max-w-6xl px-4 sm:px-6 md:block">
          <ul className="flex gap-1">
            {NAV.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`relative flex items-center gap-2 px-3 py-3 text-xs font-medium tracking-wide transition-colors ${
                      active
                        ? "text-ink"
                        : "text-ink-faint hover:text-ink"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {t(item.label)}
                    {item.href === "/mensajes" && unread > 0 && (
                      <span className="ml-0.5 flex h-4 min-w-4 items-center justify-center bg-accent px-1 text-[0.625rem] font-semibold text-ink">
                        {unread}
                      </span>
                    )}
                    {active && (
                      <span className="absolute inset-x-0 -bottom-px h-0.5 bg-accent" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      {/* Navegación móvil */}
      {menuOpen && (
        <div className="ui-no-print fixed inset-0 z-40 bg-ink/60 md:hidden">
          <nav className="absolute inset-x-0 top-0 bg-white px-4 py-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="ui-eyebrow text-ink-faint">
                {t("nav.menu")}
              </span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label={t("common.close")}
                className="text-ink"
              >
                <CloseIcon />
              </button>
            </div>

            <ul>
              {NAV.map((item) => {
                const Icon = item.icon;
                const active =
                  pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-3 border-b border-line py-3.5 text-sm ${
                        active ? "font-medium text-ink" : "text-ink-muted"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {t(item.label)}
                    </Link>
                  </li>
                );
              })}
              <li>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    router.replace("/acceso");
                  }}
                  className="flex w-full items-center gap-3 py-3.5 text-sm text-ink-muted"
                >
                  {t("nav.logout")}
                </button>
              </li>
            </ul>

            <p className="mt-2 text-[0.6875rem] text-ink-faint">
              {t("nav.lastAccess")}: {formatDateTime(client.lastAccess, locale)}
            </p>
          </nav>
        </div>
      )}

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>

      <PortalFooter />

      {needsOnboarding && (
        <Onboarding onDone={() => markOnboarded(client.id)} />
      )}
    </div>
  );
}

function PortalFooter() {
  const { t } = useStore();
  return (
    <footer className="ui-no-print mt-8 border-t border-line bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          {FIRM.name} · {t("common.portal")}
        </p>
        <div className="flex items-center gap-4">
          {/* Lo legal vive al pie, no en la navegación. */}
          <Link
            href="/privacidad"
            className="underline-offset-4 hover:text-ink hover:underline"
          >
            {t("privacy.title")}
          </Link>
          <Link
            href="/despacho"
            className="flex items-center gap-1.5 underline-offset-4 hover:text-ink hover:underline"
          >
            <CalendarIcon className="h-3.5 w-3.5" />
            {t("nav.firmView")}
          </Link>
        </div>
      </div>
    </footer>
  );
}

"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher, Logo } from "@/components/ui";
import {
  ArrowLeft,
  CalendarIcon,
  ClipIcon,
  DocIcon,
  EuroIcon,
  FirmActionIcon,
  MessageIcon,
  ShieldIcon,
  UserIcon,
} from "@/components/icons";
import { useStore } from "@/lib/store";
import type { TKey } from "@/lib/i18n";

/**
 * Marco de la vista despacho.
 *
 * A diferencia del portal, aquí sí hay menú lateral fijo: es una pantalla de
 * trabajo con nueve apartados, y hay que poder saltar entre ellos sin volver
 * atrás. El portal del cliente sigue sin menú a propósito —no debe parecer un
 * gestor de expedientes—, y esa restricción no alcanza a esta pantalla.
 *
 * No se envuelve en `PortalShell`: no hay sesión de cliente que guardar.
 */
export default function DespachoLayout({ children }: { children: ReactNode }) {
  const { hydrated, t, resetDemo } = useStore();

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="ui-eyebrow text-ink-faint">
          {t("common.loading")}
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-30 border-b border-line bg-white">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-4">
            <Logo className="h-7 sm:h-8" priority />
            <span className="border-l border-line pl-4 text-[0.6875rem] tracking-[0.14em] text-ink-faint uppercase">
              {t("nav.firmView")}
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <LanguageSwitcher />
            <button
              type="button"
              onClick={resetDemo}
              className="text-xs text-ink-faint underline-offset-4 hover:text-ink hover:underline"
            >
              {t("firm.reset")}
            </button>
            {/* Vuelta al portal del cliente: visible siempre, también en móvil. */}
            <Link
              href="/asuntos"
              className="inline-flex items-center gap-1.5 border border-ink/15 px-2.5 py-1.5 text-[0.6875rem] font-medium tracking-[0.1em] text-ink-muted uppercase transition-colors hover:border-ink hover:text-ink"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {t("common.portal")}
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1440px] flex-col lg:flex-row">
        <Sidebar />
        <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Menú lateral                                                        */
/* ------------------------------------------------------------------ */

interface NavItem {
  href: string;
  label: TKey;
  icon: (p: { className?: string }) => ReactNode;
}

/**
 * El menú es solo icono y nombre, por decisión del despacho: ni contadores ni
 * distintivo de vista previa. Las cifras de trabajo pendiente siguen estando
 * donde se decide —la pantalla de Hoy—, que es la única que las necesita.
 */
function Sidebar() {
  const { t } = useStore();
  const pathname = usePathname();

  const items: NavItem[] = [
    { href: "/despacho", label: "firm.navToday", icon: CalendarIcon },
    { href: "/despacho/actualizaciones", label: "firm.navUpdates", icon: FirmActionIcon },
    { href: "/despacho/documentos", label: "firm.navDocs", icon: DocIcon },
    { href: "/despacho/mensajes", label: "firm.navMessages", icon: MessageIcon },
    { href: "/despacho/clientes", label: "firm.navClients", icon: UserIcon },
    { href: "/despacho/economico", label: "firm.navBilling", icon: EuroIcon },
    { href: "/despacho/configuracion", label: "firm.navSettings", icon: ShieldIcon },
    { href: "/despacho/equipo", label: "firm.navTeam", icon: ClipIcon },
    { href: "/despacho/actividad", label: "firm.navActivity", icon: DocIcon },
  ];

  return (
    /* El ancho lo fija ahora la entrada más larga, "Clientes y accesos", que
       sigue teniendo que caber en una línea sin cortarse. */
    <aside className="shrink-0 border-b border-line bg-white lg:sticky lg:top-[57px] lg:h-[calc(100vh-57px)] lg:w-[15rem] lg:border-r lg:border-b-0">
      <nav
        aria-label={t("firm.nav")}
        className="ui-scroll-thin flex h-full flex-col overflow-x-auto lg:overflow-x-visible lg:overflow-y-auto"
      >
        <ul className="flex gap-0.5 px-2 py-2 lg:flex-col lg:gap-0 lg:px-2 lg:py-4">
          {items.map((item) => {
            const active =
              item.href === "/despacho"
                ? pathname === "/despacho"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <li key={item.href} className="shrink-0">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-2.5 px-3 py-2.5 text-[0.8125rem] whitespace-nowrap transition-colors lg:gap-3 ${
                    active
                      ? "bg-accent-wash font-medium text-ink"
                      : "text-ink-muted hover:bg-surface hover:text-ink"
                  }`}
                  style={
                    active
                      ? { boxShadow: "inset 2px 0 0 var(--color-accent)" }
                      : undefined
                  }
                >
                  <Icon className="h-4 w-4 shrink-0 opacity-70" />
                  <span className="flex-1 lg:min-w-0 lg:truncate">
                    {t(item.label)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

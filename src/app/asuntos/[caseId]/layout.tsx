"use client";

import { use, type ReactNode } from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { PortalShell } from "@/components/PortalShell";
import {
  AreaBadge,
  AreaStripe,
  Card,
  FinePrint,
  PhaseBar,
} from "@/components/ui";
import { AlertIcon, ArrowLeft, CheckIcon } from "@/components/icons";
import { AREAS } from "@/config/areas";
import { LAWYERS } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { pendingDocs } from "@/lib/selectors";
import { useL, useStore } from "@/lib/store";
import type { TKey } from "@/lib/i18n";
import { useCase } from "./shared";

export default function CaseLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = use(params);
  return (
    <PortalShell>
      <CaseFrame caseId={caseId}>{children}</CaseFrame>
    </PortalShell>
  );
}

/**
 * Las pestañas de la ficha. `segment` es `null` en la ruta índice, que es el
 * historial: es la pestaña que se abre por defecto porque continúa el relato
 * del resumen y porque deja a la vista la última actuación publicada.
 */
const TABS: { segment: string | null; path: string; label: TKey }[] = [
  { segment: null, path: "", label: "case.tabHistory" },
  { segment: "documentos", path: "/documentos", label: "case.tabDocuments" },
  { segment: "fechas", path: "/fechas", label: "case.tabDates" },
];

function CaseFrame({
  caseId,
  children,
}: {
  caseId: string;
  children: ReactNode;
}) {
  const { cases, t, locale } = useStore();
  const l = useL();
  const c = useCase(caseId);
  const segment = useSelectedLayoutSegment();

  const lawyer = LAWYERS[c.lawyerId];
  const pending = pendingDocs(c);
  const color = AREAS[c.area].color;
  const showBackLink = cases.length > 1;

  return (
    <>
      {showBackLink && (
        <Link
          href="/asuntos"
          className="inline-flex items-center gap-1.5 text-xs text-ink-faint transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t("case.backToCases")}
        </Link>
      )}

      <header className={showBackLink ? "mt-5" : ""}>
        <div className="flex flex-wrap items-center gap-3">
          <AreaBadge area={c.area} />
          <span className="text-xs text-ink-faint">
            {t("cases.ref")} {c.ref}
          </span>
        </div>
        <h1 className="mt-3.5 max-w-3xl text-xl leading-snug font-light text-ink sm:text-2xl">
          {l(c.title)}
        </h1>
        <p className="mt-2 text-xs text-ink-faint">
          {t("case.openedOn")} {formatDate(c.openedOn, locale)}
        </p>
      </header>

      {/* ---------------- RESUMEN ----------------
          Fuera de las pestañas a propósito: es lo que el cliente viene a ver
          y lo que el despacho quiere comunicar, así que nunca cuesta un clic. */}
      <section className="mt-8">
        <Card>
          <AreaStripe area={c.area} />
          <div className="p-5 sm:p-7">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="ui-display text-sm text-ink">
                {t("case.summary")}
              </h2>
              <span className="shrink-0 text-xs text-ink-faint">
                {t("case.phaseProgress", {
                  n: c.currentPhase + 1,
                  total: c.phases.length,
                })}
              </span>
            </div>

            <div className="mt-5">
              <PhaseBar
                phases={c.phases}
                current={c.currentPhase}
                area={c.area}
              />
            </div>

            <div className="mt-8 grid gap-7 lg:grid-cols-[1fr_17rem]">
              <div className="space-y-6">
                <div>
                  <h3 className="ui-eyebrow text-ink-faint">
                    {t("case.whatIsHappening")}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {l(c.whatIsHappening)}
                  </p>
                </div>

                <div>
                  <h3 className="ui-eyebrow text-ink-faint">
                    {t("case.whatComesNext")}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {l(c.whatComesNext)}
                  </p>

                  {/* El plazo solo se muestra si es de la Administración, y como orientativo */}
                  {c.administrativeEstimate && (
                    <div className="mt-4 border-l-2 border-info bg-info-wash px-3.5 py-3">
                      <p className="ui-eyebrow text-info-ink">
                        {t("case.estimateLabel")}
                      </p>
                      <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink-soft">
                        {l(c.administrativeEstimate)}
                      </p>
                      <FinePrint className="mt-2">
                        {t("case.estimateDisclaimer")}
                      </FinePrint>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-5">
                {/* ¿Necesitamos algo de ti? */}
                <div>
                  <h3 className="ui-eyebrow text-ink-faint">
                    {t("case.needFromYou")}
                  </h3>
                  {pending.length === 0 ? (
                    <p className="mt-2 flex items-start gap-2 bg-[#EDF5EE] px-3 py-2.5 text-[0.8125rem] font-medium text-[#2F6340]">
                      <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      {t("case.needNothing")}
                    </p>
                  ) : (
                    <div className="mt-2 bg-accent-wash px-3 py-2.5">
                      <p className="flex items-start gap-2 text-[0.8125rem] font-medium text-[#8A5A12]">
                        <AlertIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        {pending.length === 1
                          ? t("case.needSomethingOne")
                          : t("case.needSomething", { n: pending.length })}
                      </p>
                      {/* Antes era un ancla que bajaba 300 px sin avisar; ahora
                          lleva a la pestaña, que es un movimiento explicable. */}
                      <Link
                        href={`/asuntos/${c.id}/documentos`}
                        className="mt-1.5 ml-5.5 inline-block text-xs font-medium text-[#8A5A12] underline underline-offset-4"
                      >
                        {t("case.goToPending")}
                      </Link>
                    </div>
                  )}
                </div>

                {/* Persona de contacto */}
                <div>
                  <h3 className="ui-eyebrow text-ink-faint">
                    {t("case.contactPerson")}
                  </h3>
                  <div className="mt-2 flex items-start gap-3 border border-line p-3">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center text-xs font-medium text-white"
                      style={{ backgroundColor: color }}
                    >
                      {lawyer.initials}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink">
                        {lawyer.name}
                      </p>
                      <p className="mt-0.5 text-xs text-ink-faint">
                        {l(lawyer.role)}
                      </p>
                      <p className="mt-1.5 text-xs break-words text-ink-muted">
                        {lawyer.email}
                      </p>
                      <p className="text-xs text-ink-muted">{lawyer.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* ---------------- PESTAÑAS ----------------
          Son enlaces, no `role="tab"`: cada una es una ruta de verdad, con su
          URL y su sitio en el historial del navegador. El subrayado toma el
          color del área para distinguirlas de la navegación principal, que es
          dorada. */}
      <nav
        aria-label={t("case.sectionsNav")}
        className="ui-scroll-thin mt-10 overflow-x-auto border-b border-line"
      >
        <ul className="flex gap-1">
          {TABS.map((tab) => {
            const active = segment === tab.segment;
            const count = tab.segment === "documentos" ? pending.length : 0;
            return (
              <li key={tab.label}>
                <Link
                  href={`/asuntos/${c.id}${tab.path}`}
                  aria-current={active ? "page" : undefined}
                  className={`-mb-px flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-[0.8125rem] whitespace-nowrap transition-colors ${
                    active
                      ? "font-medium text-ink"
                      : "border-transparent text-ink-faint hover:text-ink"
                  }`}
                  style={active ? { borderBottomColor: color } : undefined}
                >
                  {t(tab.label)}
                  {count > 0 && (
                    <span className="flex h-4 min-w-4 items-center justify-center bg-accent px-1 text-[0.625rem] font-semibold text-ink">
                      {count}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-6">{children}</div>
    </>
  );
}

"use client";

import { use } from "react";
import { Card, Notice, SectionTitle } from "@/components/ui";
import { DateIcon } from "@/components/icons";
import { AREAS } from "@/config/areas";
import { daysUntil, formatDate, formatTime, relativeLabel } from "@/lib/format";
import { expiryLevel } from "@/lib/selectors";
import { STATES } from "@/lib/states";
import { useL, useStore } from "@/lib/store";
import { useCase } from "../shared";

/**
 * Fechas señaladas y caducidades comparten pestaña por ser las dos de
 * calendario, pero se mantienen como dos bloques con sus dos avisos: unas las
 * comunica el despacho sobre el procedimiento y las otras son documentos del
 * cliente. Ninguna de las dos es un control de plazos procesales.
 */
export default function CaseDatesPage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = use(params);
  const { t, locale } = useStore();
  const l = useL();
  const c = useCase(caseId);

  const color = AREAS[c.area].color;

  return (
    <>
      <section>
        <SectionTitle>{t("case.datesTitle")}</SectionTitle>

        {c.keyDates.length === 0 ? (
          <Card className="p-5">
            <p className="text-sm text-ink-faint">{t("case.datesEmpty")}</p>
          </Card>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {c.keyDates.map((d) => (
              <li key={d.id}>
                <Card className="flex h-full gap-4 p-4">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center"
                    style={{ backgroundColor: AREAS[c.area].tint, color }}
                  >
                    <DateIcon kind={d.kind} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="ui-eyebrow text-ink-faint">
                      {t(`date.${d.kind}`)}
                    </p>
                    <p className="mt-1 text-sm font-medium text-ink">
                      {formatDate(d.date, locale)}
                      {d.date.includes("T") && ` · ${formatTime(d.date, locale)}`}
                      <span className="ml-2 font-normal text-ink-faint">
                        {relativeLabel(d.date, t)}
                      </span>
                    </p>
                    <p className="mt-1 text-[0.8125rem] leading-snug text-ink-soft">
                      {l(d.title)}
                    </p>
                    <p className="mt-1 text-xs leading-snug text-ink-faint">
                      {l(d.place)}
                    </p>
                    {d.note && (
                      <p className="mt-2 text-xs leading-relaxed text-ink-muted">
                        {l(d.note)}
                      </p>
                    )}
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}

        <Notice tone="neutral" className="mt-3">
          {t("case.datesDisclaimer")}
        </Notice>
      </section>

      {/* ---------------- CADUCIDADES ---------------- */}
      {c.expiries.length > 0 && (
        <section className="mt-10">
          <SectionTitle>{t("case.expiriesTitle")}</SectionTitle>

          <ul className="grid gap-3 sm:grid-cols-2">
            {c.expiries.map((e) => {
              const level = expiryLevel(e);
              const days = daysUntil(e.expiresOn);
              // Mismo código de color que el resto del portal.
              const tone =
                STATES[
                  level === "alert"
                    ? "alert"
                    : level === "warn"
                      ? "pending"
                      : "done"
                ];
              return (
                <li key={e.id}>
                  <Card className="h-full border-l-2 p-4">
                    {/* La barra superior traduce el semáforo a color. */}
                    <div
                      className="-mx-4 -mt-4 mb-3 h-1"
                      style={{ backgroundColor: tone.dot }}
                      aria-hidden
                    />
                    <p className="text-sm font-medium text-ink">
                      {l(e.document)}
                    </p>
                    <p className="mt-1.5 text-xs text-ink-muted">
                      {t("case.expiresOn")} {formatDate(e.expiresOn, locale)} ·{" "}
                      <span style={{ color: tone.fg }} className="font-medium">
                        {days < 0
                          ? t("case.expiryExpired")
                          : days === 0
                            ? t("case.expiryToday")
                            : t("case.expiryDaysLeft", { n: days })}
                      </span>
                    </p>
                    <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-ink-soft">
                      {l(e.advice)}
                    </p>
                  </Card>
                </li>
              );
            })}
          </ul>

          <Notice tone="neutral" className="mt-3">
            {t("case.expiriesDisclaimer")}
          </Notice>
        </section>
      )}
    </>
  );
}

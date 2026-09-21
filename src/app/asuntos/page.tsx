"use client";

import Link from "next/link";
import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { PortalShell } from "@/components/PortalShell";
import {
  AreaBadge,
  AreaStripe,
  Card,
  PhaseBarMini,
  Relative,
  StatePill,
} from "@/components/ui";
import {
  AlertIcon,
  ArrowRight,
  CalendarIcon,
  CheckIcon,
  MessageIcon,
  UploadIcon,
} from "@/components/icons";
import { useL, useStore } from "@/lib/store";
import { formatDateShort, daysUntil } from "@/lib/format";
import { expiryLevel, summarize } from "@/lib/selectors";
import { STATES } from "@/lib/states";
import type { TKey } from "@/lib/i18n";

type Translate = (key: TKey, vars?: Record<string, string | number>) => string;

export default function AsuntosPage() {
  return (
    <PortalShell>
      <AsuntosContent />
    </PortalShell>
  );
}

function AsuntosContent() {
  const router = useRouter();
  const { cases, messages, client, t, locale } = useStore();
  const l = useL();

  // Si solo hay un asunto, el cliente va directo a su ficha.
  useEffect(() => {
    if (cases.length === 1) router.replace(`/asuntos/${cases[0].id}`);
  }, [cases, router]);

  if (!client) return null;

  const summaries = cases.map((c) => ({ c, s: summarize(c, messages) }));

  const totalPendingDocs = summaries.reduce(
    (n, { s }) => n + s.pendingDocCount,
    0,
  );
  const totalUnread = summaries.reduce((n, { s }) => n + s.unreadCount, 0);
  const nextDates = summaries
    .flatMap(({ c, s }) => (s.nextDate ? [{ c, d: s.nextDate }] : []))
    .sort((a, b) => a.d.date.localeCompare(b.d.date));
  const expiries = summaries
    .flatMap(({ c, s }) => s.expiries.map((e) => ({ c, e })))
    .sort((a, b) => a.e.expiresOn.localeCompare(b.e.expiresOn));

  // El expediente al que lleva el botón de acción directa.
  const firstPending = summaries.find(({ s }) => s.pendingDocCount > 0);
  const nextDate = nextDates[0];
  const urgentExpiry = expiries.find((x) => expiryLevel(x.e) !== "ok");

  // La caducidad solo baja a la línea de secundarios si no ocupa ya la caja.
  const expiryChip = expiries.find(
    (x) => firstPending || !urgentExpiry || x.e.id !== urgentExpiry.e.id,
  );

  const hasNotices =
    totalPendingDocs > 0 ||
    totalUnread > 0 ||
    nextDates.length > 0 ||
    expiries.length > 0;

  return (
    <>
      <header>
        <h1 className="ui-display text-xl text-ink">{t("cases.title")}</h1>
        <div className="ui-rule mt-3 w-16" />
      </header>

      {/* Franja de avisos: una caja destacada con acción y el resto en línea. */}
      <section className="mt-6" aria-label={t("cases.noticesTitle")}>
        {firstPending ? (
          <PrimaryNotice
            tone="pending"
            icon={<AlertIcon className="h-5 w-5" />}
            text={
              totalPendingDocs === 1
                ? t("cases.noticeDocsOne")
                : t("cases.noticeDocsMany", { n: totalPendingDocs })
            }
            detail={l(firstPending.c.title)}
            href={`/asuntos/${firstPending.c.id}/documentos`}
            cta={t("cases.uploadCta")}
            ctaIcon={<UploadIcon className="h-3.5 w-3.5" />}
          />
        ) : urgentExpiry ? (
          <PrimaryNotice
            tone={expiryLevel(urgentExpiry.e) === "alert" ? "alert" : "pending"}
            icon={<AlertIcon className="h-5 w-5" />}
            text={t("cases.noticeExpiry")}
            detail={`${l(urgentExpiry.e.document)} · ${expiryWording(
              daysUntil(urgentExpiry.e.expiresOn),
              t,
            )}`}
            href={`/asuntos/${urgentExpiry.c.id}/fechas`}
            cta={t("cases.renewCta")}
          />
        ) : (
          !hasNotices && (
            <PrimaryNotice
              tone="done"
              icon={<CheckIcon className="h-5 w-5" />}
              text={t("cases.allClear")}
            />
          )
        )}

        {/* Avisos secundarios, todos en una sola línea. */}
        {(totalUnread > 0 || nextDate || expiryChip) && (
          <ul className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
            {totalUnread > 0 && (
              <ChipLink
                href="/mensajes"
                icon={<MessageIcon className="h-3.5 w-3.5" />}
              >
                {totalUnread === 1
                  ? t("cases.noticeMessagesOne")
                  : t("cases.noticeMessagesMany", { n: totalUnread })}
              </ChipLink>
            )}

            {nextDate && (
              <ChipLink
                href={`/asuntos/${nextDate.c.id}/fechas`}
                icon={<CalendarIcon className="h-3.5 w-3.5" />}
              >
                {formatDateShort(nextDate.d.date, locale)} ·{" "}
                {l(nextDate.d.title)}
              </ChipLink>
            )}

            {expiryChip && (
              <ChipLink
                href={`/asuntos/${expiryChip.c.id}/fechas`}
                icon={<AlertIcon className="h-3.5 w-3.5" />}
              >
                {l(expiryChip.e.document)} ·{" "}
                {expiryWording(daysUntil(expiryChip.e.expiresOn), t)}
              </ChipLink>
            )}
          </ul>
        )}
      </section>

      {/* Expedientes */}
      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {summaries.map(({ c, s }) => (
          <li key={c.id}>
            <Link href={`/asuntos/${c.id}`} className="group block h-full">
              <Card hover className="h-full">
                <AreaStripe area={c.area} />

                <div className="flex h-full flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <AreaBadge area={c.area} size="sm" />
                    <span className="shrink-0 text-[0.6875rem] text-ink-faint">
                      {c.ref}
                    </span>
                  </div>

                  <h3 className="mt-3.5 text-base leading-snug font-medium text-ink">
                    {l(c.title)}
                  </h3>

                  <div className="mt-4">
                    <PhaseBarMini
                      phases={c.phases}
                      current={c.currentPhase}
                      area={c.area}
                    />
                  </div>

                  <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink-muted">
                    {l(c.statusLine)}
                  </p>

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pt-4">
                    <span className="text-xs text-ink-faint">
                      {t("cases.updated")}{" "}
                      <Relative iso={c.lastUpdate} className="text-ink-muted" />
                    </span>

                    <span className="flex flex-wrap items-center gap-2">
                      {s.pendingDocCount > 0 ? (
                        <StatePill tone="pending">
                          {s.pendingDocCount === 1
                            ? t("cases.pendingBadge", { n: 1 })
                            : t("cases.pendingBadgeMany", {
                                n: s.pendingDocCount,
                              })}
                        </StatePill>
                      ) : (
                        <StatePill tone="done">
                          {t("cases.nothingPending")}
                        </StatePill>
                      )}

                      {s.unreadCount > 0 && (
                        <StatePill tone="ongoing">
                          {s.unreadCount === 1
                            ? t("cases.noticeMessagesOne")
                            : t("cases.noticeMessagesMany", {
                                n: s.unreadCount,
                              })}
                        </StatePill>
                      )}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

/** Aviso principal: una sola caja, con el color del estado y su acción directa. */
function PrimaryNotice({
  tone,
  icon,
  text,
  detail,
  href,
  cta,
  ctaIcon,
}: {
  tone: "pending" | "done" | "alert";
  icon: ReactNode;
  text: string;
  detail?: string;
  href?: string;
  cta?: string;
  ctaIcon?: ReactNode;
}) {
  const s = STATES[tone];

  return (
    <div
      className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-l-2 px-4 py-3.5"
      style={{
        backgroundColor: s.bg,
        borderLeftColor: s.dot,
        color: s.fg,
      }}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="shrink-0">{icon}</span>
        <p className="min-w-0 text-sm font-medium">
          {text}
          {detail && (
            <span className="ml-2 font-normal opacity-75">{detail}</span>
          )}
        </p>
      </div>

      {href && cta && (
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-2 bg-ink px-4 py-2 text-[0.6875rem] font-medium tracking-[0.1em] text-white uppercase transition-colors hover:bg-ink-soft"
        >
          {ctaIcon}
          {cta}
        </Link>
      )}
    </div>
  );
}

/** Aviso secundario: icono y una línea, sin caja. */
function ChipLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="group inline-flex items-center gap-2 text-xs text-ink-muted transition-colors hover:text-ink"
      >
        <span className="text-ink-faint transition-colors group-hover:text-accent-dark">
          {icon}
        </span>
        {children}
        <ArrowRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
      </Link>
    </li>
  );
}

/** Cuánto queda para que caduque, en lenguaje claro. Siempre orientativo. */
function expiryWording(days: number, t: Translate) {
  if (days < 0) return t("case.expiryExpired");
  if (days === 0) return t("case.expiryToday");
  return t("case.expiryDaysLeft", { n: days });
}

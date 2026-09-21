"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { PortalShell } from "@/components/PortalShell";
import { Card, FinePrint } from "@/components/ui";
import { CheckIcon } from "@/components/icons";
import { countdownLabel, daysUntil, formatCurrency } from "@/lib/format";
import { STATES } from "@/lib/states";
import { useStore } from "@/lib/store";
import type { TKey } from "@/lib/i18n";
import { useBilling } from "./shared";

export default function BillingLayout({ children }: { children: ReactNode }) {
  return (
    <PortalShell>
      <BillingFrame>{children}</BillingFrame>
    </PortalShell>
  );
}

/**
 * Las pestañas del área económica. `segment` es `null` en la ruta índice, que
 * son las facturas: es lo que el cliente consulta más a menudo.
 */
const TABS: { segment: string | null; path: string; label: TKey }[] = [
  { segment: null, path: "", label: "billing.tabInvoices" },
  { segment: "provisiones", path: "/provisiones", label: "billing.tabProvisions" },
  { segment: "encargo", path: "/encargo", label: "billing.tabEngagement" },
];

function BillingFrame({ children }: { children: ReactNode }) {
  const { t, locale } = useStore();
  const segment = useSelectedLayoutSegment();
  const b = useBilling();

  const totalPending = b.totalFees + b.totalProvisions;

  return (
    <>
      <header>
        <h1 className="ui-display text-xl text-ink">{t("billing.title")}</h1>
        <div className="ui-rule mt-3 w-16" />
      </header>

      {/* ---------------- RESUMEN ----------------
          Fuera de las pestañas a propósito: la pregunta que trae al cliente
          aquí es «¿debo algo y para cuándo?», y se responde con dos cifras.
          El detalle —qué factura, qué impuesto— vive en las pestañas.

          Las dos cajas nunca se suman en una: honorarios son del despacho y
          provisiones son dinero de terceros que el despacho solo adelanta. */}
      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <Figure
          label={t("billing.feesPendingTitle")}
          amount={b.totalFees}
          caption={t("billing.feesPendingTotal")}
          emptyCaption={t("billing.feesUpToDate")}
          count={
            b.pendingInvoices.length === 1
              ? t("billing.countInvoicesOne")
              : t("billing.countInvoicesMany", { n: b.pendingInvoices.length })
          }
          due={b.feesDue}
          multiple={b.pendingInvoices.length > 1}
        />

        <Figure
          label={t("billing.provisionsPendingTitle")}
          amount={b.totalProvisions}
          caption={t("billing.provisionsPendingTotal")}
          emptyCaption={t("billing.provisionsUpToDate")}
          count={
            b.pendingProvisions.length === 1
              ? t("billing.countProvisionsOne")
              : t("billing.countProvisionsMany", {
                  n: b.pendingProvisions.length,
                })
          }
          due={b.provisionsDue}
          multiple={b.pendingProvisions.length > 1}
          note={t("billing.provisionsShort")}
        />
      </section>

      {/* El total conjunto existe, pero sin jerarquía: es una comprobación,
          no lo que el cliente debe al despacho. */}
      <FinePrint className="mt-3 text-ink-muted">
        {totalPending > 0 && (
          <>
            {t("billing.grandTotal")}: {formatCurrency(totalPending, locale)} ·{" "}
          </>
        )}
        {t("billing.noPaymentNotice")}
      </FinePrint>

      {/* ---------------- PESTAÑAS ----------------
          Enlaces, no `role="tab"`: cada sección es una ruta con su URL, igual
          que en la ficha del expediente. Aquí el subrayado es dorado porque el
          área económica no pertenece a ningún área de práctica. */}
      <nav
        aria-label={t("billing.summaryNav")}
        className="ui-scroll-thin mt-9 overflow-x-auto border-b border-line"
      >
        <ul className="flex gap-1">
          {TABS.map((tab) => {
            const active = segment === tab.segment;
            return (
              <li key={tab.label}>
                <Link
                  href={`/economico${tab.path}`}
                  aria-current={active ? "page" : undefined}
                  className={`-mb-px flex shrink-0 items-center border-b-2 px-3 py-2.5 text-[0.8125rem] whitespace-nowrap transition-colors ${
                    active
                      ? "border-accent font-medium text-ink"
                      : "border-transparent text-ink-faint hover:text-ink"
                  }`}
                >
                  {t(tab.label)}
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

/**
 * Una cifra grande y lo mínimo para situarla. Cuando no hay nada pendiente la
 * caja se pone en verde y desaparece el número: no hay nada que mirar.
 */
function Figure({
  label,
  amount,
  caption,
  emptyCaption,
  count,
  due,
  multiple,
  note,
}: {
  label: string;
  amount: number;
  caption: string;
  emptyCaption: string;
  count: string;
  due?: string;
  multiple: boolean;
  note?: string;
}) {
  const { t, locale } = useStore();
  const settled = amount === 0;
  /*
   * Una fecha de vencimiento ya pasada no es "pendiente", es otra cosa, y el
   * código de color del portal ya tiene sitio para ella. Sin esto la caja decía
   * "vence hace diez días", que no es español.
   */
  const overdue = !settled && due !== undefined && daysUntil(due) < 0;
  const s = STATES[settled ? "done" : overdue ? "alert" : "pending"];

  return (
    <Card className="flex h-full flex-col p-5">
      {/* Filo de color: el mismo semáforo que el resto del portal. */}
      <span
        className="-mx-5 -mt-5 mb-4 h-1"
        style={{ backgroundColor: s.dot }}
        aria-hidden
      />

      <h2 className="ui-eyebrow text-ink-faint">{label}</h2>

      {settled ? (
        <p
          className="mt-3 flex items-center gap-2 text-sm font-medium"
          style={{ color: s.fg }}
        >
          <CheckIcon className="h-4 w-4 shrink-0" />
          {emptyCaption}
        </p>
      ) : (
        <>
          <p className="mt-3 text-3xl leading-none font-light tabular-nums text-ink">
            {formatCurrency(amount, locale)}
          </p>
          <p className="mt-2 text-xs text-ink-muted">
            {caption}
            {" · "}
            {count}
            {due && (
              <>
                {" · "}
                <span style={{ color: s.fg }} className="font-medium">
                  {overdue
                    ? t("billing.overdueSince", { when: countdownLabel(due, t) })
                    : multiple
                      ? t("billing.nextDue", { when: countdownLabel(due, t) })
                      : t("billing.onlyDue", { when: countdownLabel(due, t) })}
                </span>
              </>
            )}
          </p>
        </>
      )}

      {note && (
        <p className="mt-auto pt-4 text-xs leading-relaxed text-ink-faint">
          {note}
        </p>
      )}
    </Card>
  );
}

"use client";

import { StatePill } from "@/components/ui";
import { ENGAGEMENTS, INVOICES, PROVISIONS } from "@/lib/data";
import { formatCurrency } from "@/lib/format";
import { useL, useStore } from "@/lib/store";
import type { Engagement, FundProvision, Invoice } from "@/lib/types";

/**
 * Los tres bloques del área económica salen de los mismos datos filtrados por
 * los asuntos del cliente. Vive aquí para que el marco (que pinta el resumen)
 * y cada pestaña (que pinta el detalle) no repitan el filtrado ni puedan
 * desincronizarse: el total de arriba y la lista de abajo son la misma fuente.
 */
export function useBilling() {
  const { cases } = useStore();
  const l = useL();

  const caseIds = cases.map((c) => c.id);

  const engagements: Engagement[] = ENGAGEMENTS.filter((e) =>
    caseIds.includes(e.caseId),
  );
  const invoices: Invoice[] = INVOICES.filter((i) =>
    caseIds.includes(i.caseId),
  ).sort((a, b) => b.date.localeCompare(a.date));
  const provisions: FundProvision[] = PROVISIONS.filter((p) =>
    caseIds.includes(p.caseId),
  ).sort((a, b) => b.requestedOn.localeCompare(a.requestedOn));

  const pendingInvoices = invoices.filter((i) => i.status === "pendiente");
  const pendingProvisions = provisions.filter((p) => p.status === "pendiente");

  const sum = (rows: { amount: number }[]) =>
    rows.reduce((n, r) => n + r.amount, 0);

  /** La fecha de vencimiento más próxima de un grupo, si alguna la tiene. */
  const soonestDue = (rows: { dueDate?: string }[]) =>
    rows
      .map((r) => r.dueDate)
      .filter((d): d is string => Boolean(d))
      .sort()[0];

  return {
    engagements,
    invoices,
    provisions,
    pendingInvoices,
    pendingProvisions,
    totalFees: sum(pendingInvoices),
    totalProvisions: sum(pendingProvisions),
    feesDue: soonestDue(pendingInvoices),
    provisionsDue: soonestDue(pendingProvisions),
    caseTitle: (id: string) =>
      l(cases.find((c) => c.id === id)?.title ?? { es: "", en: "" }),
    caseArea: (id: string) => cases.find((c) => c.id === id)?.area,
  };
}

/** Pagada o pendiente, con el mismo código de color que el resto del portal. */
export function StatusTag({ paid }: { paid: boolean }) {
  const { t } = useStore();
  return (
    <StatePill tone={paid ? "done" : "pending"}>
      {paid ? t("billing.paid") : t("billing.pending")}
    </StatePill>
  );
}

/**
 * Importe alineado a la derecha. Los pagados se apagan: el ojo tiene que caer
 * en lo que queda por pagar, no en el historial.
 */
export function Amount({ value, muted }: { value: number; muted?: boolean }) {
  const { locale } = useStore();
  return (
    <span
      className={`shrink-0 text-sm font-medium tabular-nums ${
        muted ? "text-ink-faint" : "text-ink"
      }`}
    >
      {formatCurrency(value, locale)}
    </span>
  );
}

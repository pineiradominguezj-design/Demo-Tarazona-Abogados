"use client";

import { useState } from "react";
import { AreaBadge, StatePill } from "@/components/ui";
import { CLIENTS, INVOICES, PROVISIONS } from "@/lib/data";
import { formatCurrency, formatDate, daysUntil } from "@/lib/format";
import { useL, useStore } from "@/lib/store";
import type { Case, Client, LocalizedText } from "@/lib/types";
import {
  Collapsible,
  Done,
  MiniButton,
  SectionHeader,
  usePaged,
} from "../shared";

/**
 * Económico — maqueta.
 *
 * Esto no es un programa de facturación y no debe llegar a serlo: no se emiten
 * facturas, no se calculan honorarios y no hay pasarela de pago por ningún
 * lado. Lo único que decide esta pantalla es **qué ve el cliente** —una factura
 * publicada o no— y deja constancia de lo que el despacho ya ha hecho fuera del
 * portal: pedir una provisión, darla por cobrada, guardar el justificante.
 *
 * Ninguna acción se persiste: se queda en la pantalla, como corresponde a una
 * maqueta.
 */
export default function FirmBillingPage() {
  const { t } = useStore();
  const { slice, pager } = usePaged(CLIENTS);

  return (
    <>
      <SectionHeader title={t("firm.billingTitle")} preview />

      <div className="divide-y divide-line border-y border-line">
        {slice.map((client) => (
          <ClientBilling key={client.id} client={client} />
        ))}
      </div>
      {pager}
    </>
  );
}

/* ------------------------------------------------------------------ */

function ClientBilling({ client }: { client: Client }) {
  const { t, allCases } = useStore();
  const files = allCases.filter((c) => c.clientId === client.id);
  const ids = files.map((f) => f.id);

  const invoices = INVOICES.filter((i) => ids.includes(i.caseId));
  const provisions = PROVISIONS.filter((p) => ids.includes(p.caseId));

  const pending =
    invoices.filter((i) => i.status === "pendiente").length +
    provisions.filter((p) => p.status === "pendiente").length;

  return (
    <Collapsible
      summary={
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="min-w-[10rem] flex-1 truncate text-sm font-medium text-ink">
            {client.name}
          </span>
          <span className="flex shrink-0 flex-wrap gap-1">
            {files.map((f) => (
              <AreaBadge key={f.id} area={f.area} size="sm" />
            ))}
          </span>
          <span className="shrink-0 text-xs text-ink-faint">
            {t("billing.pending")}:{" "}
            <span className="tabular-nums text-ink-muted">{pending}</span>
          </span>
        </span>
      }
    >
      <div className="space-y-5">
        {/* --- Honorarios --- */}
        <div>
          <p className="ui-eyebrow mb-2 text-ink-faint">
            {t("billing.feesPendingTitle")}
          </p>
          <ul className="divide-y divide-line border-y border-line bg-white">
            {invoices.map((i) => (
              <InvoiceRow
                key={i.id}
                number={i.number}
                concept={i.concept}
                amount={i.amount}
                paid={i.status === "pagada"}
                dueDate={i.dueDate}
                file={files.find((f) => f.id === i.caseId)}
              />
            ))}
          </ul>
        </div>

        {/* --- Provisiones. Dinero de terceros: nunca en el mismo total. --- */}
        <div>
          <p className="ui-eyebrow mb-2 text-ink-faint">
            {t("billing.provisionsPendingTitle")}
          </p>
          <ul className="divide-y divide-line border-y border-line bg-white">
            {provisions.map((p) => (
              <ProvisionRow
                key={p.id}
                concept={p.concept}
                payee={p.payee}
                amount={p.amount}
                paid={p.status === "pagada"}
                requestedOn={p.requestedOn}
                file={files.find((f) => f.id === p.caseId)}
              />
            ))}
          </ul>
          {provisions.length === 0 && (
            <p className="text-xs text-ink-faint">
              {t("billing.provisionsPendingEmpty")}
            </p>
          )}
        </div>
      </div>
    </Collapsible>
  );
}

/* ------------------------------------------------------------------ */

function InvoiceRow({
  number,
  concept,
  amount,
  paid,
  dueDate,
  file,
}: {
  number: string;
  concept: LocalizedText;
  amount: number;
  paid: boolean;
  dueDate?: string;
  file?: Case;
}) {
  const { t, locale } = useStore();
  const l = useL();
  /* Lo que decide esta fila: si el cliente la ve o no. */
  const [visible, setVisible] = useState(true);

  const overdue = !paid && dueDate !== undefined && daysUntil(dueDate) < 0;

  return (
    <li className="px-3 py-2.5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="min-w-[10rem] flex-1">
          <span className="block truncate text-xs text-ink">
            <span className="text-ink-faint">{number} · </span>
            {l(concept)}
          </span>
          {file && (
            <span className="mt-0.5 block text-xs text-ink-faint">
              {file.ref}
              {dueDate &&
                !paid &&
                ` · ${
                  daysUntil(dueDate) < 0
                    ? t("billing.dueOnPast")
                    : t("billing.dueOn")
                } ${formatDate(dueDate, locale)}`}
            </span>
          )}
        </span>

        <span className="shrink-0 text-xs font-medium tabular-nums text-ink">
          {formatCurrency(amount, locale)}
        </span>

        <StatePill tone={paid ? "done" : overdue ? "alert" : "pending"}>
          {paid ? t("billing.paid") : t("billing.pending")}
        </StatePill>

        <MiniButton onClick={() => setVisible((v) => !v)}>
          {visible ? t("firm.unpublishInvoice") : t("firm.publishInvoice")}
        </MiniButton>
      </div>

      {visible && (
        <p className="mt-1 text-xs text-ink-faint">
          {t("firm.visibleToClient")}
        </p>
      )}
    </li>
  );
}

/* ------------------------------------------------------------------ */

function ProvisionRow({
  concept,
  payee,
  amount,
  paid,
  requestedOn,
  file,
}: {
  concept: LocalizedText;
  payee: LocalizedText;
  amount: number;
  paid: boolean;
  requestedOn: string;
  file?: Case;
}) {
  const { t, locale } = useStore();
  const l = useL();
  const [state, setState] = useState<"solicitada" | "pagada">(
    paid ? "pagada" : "solicitada",
  );
  const [receipt, setReceipt] = useState(false);

  return (
    <li className="px-3 py-2.5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="min-w-[10rem] flex-1">
          <span className="block truncate text-xs text-ink">
            {l(concept)}
          </span>
          <span className="mt-0.5 block text-xs text-ink-faint">
            {t("billing.payee")}: {l(payee)}
            {file && ` · ${file.ref}`} · {t("billing.requestedOn")}{" "}
            {formatDate(requestedOn, locale)}
          </span>
        </span>

        <span className="shrink-0 text-xs font-medium tabular-nums text-ink">
          {formatCurrency(amount, locale)}
        </span>

        <StatePill tone={state === "pagada" ? "done" : "pending"}>
          {state === "pagada" ? t("billing.paid") : t("billing.pending")}
        </StatePill>

        <MiniButton
          onClick={() =>
            setState((s) => (s === "pagada" ? "solicitada" : "pagada"))
          }
        >
          {state === "pagada" ? t("firm.markRequested") : t("firm.markPaid")}
        </MiniButton>
        <MiniButton onClick={() => setReceipt(true)} disabled={receipt}>
          {t("firm.uploadReceipt")}
        </MiniButton>
      </div>

      {receipt && <Done>{t("firm.uploadReceipt")}</Done>}
    </li>
  );
}

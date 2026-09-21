"use client";

import { Card, Notice } from "@/components/ui";
import { daysUntil, formatDate } from "@/lib/format";
import { useL, useStore } from "@/lib/store";
import { DownloadButton } from "../asuntos/[caseId]/shared";
import { Amount, StatusTag, useBilling } from "./shared";

/**
 * Pestaña por defecto del área económica.
 *
 * Antes era una tabla de siete columnas con `min-width: 42rem`, que en
 * cualquier portátil obligaba a arrastrar en horizontal para llegar al importe.
 * Ahora cada factura es una fila que se dobla: concepto arriba, el resto en una
 * línea de contexto, y el importe siempre a la derecha.
 */
export default function InvoicesPage() {
  const { t, locale } = useStore();
  const l = useL();
  const { invoices, caseTitle } = useBilling();

  if (invoices.length === 0) {
    return <Notice tone="neutral">{t("billing.pendingEmpty")}</Notice>;
  }

  return (
    <Card>
      <ul className="divide-y divide-line">
        {invoices.map((i) => {
          const paid = i.status === "pagada";
          return (
            <li
              key={i.id}
              className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 px-5 py-4"
            >
              {/* `min-w` y no `min-w-0`: con base cero la columna se encogía
                  hasta partir el concepto palabra a palabra en móvil en vez de
                  mandar el importe a la línea siguiente. */}
              <div className="min-w-[13rem] flex-1">
                <p className="text-sm text-ink">{l(i.concept)}</p>
                <p className="mt-1 text-xs text-ink-faint">
                  {t("billing.invoiceSingular")} {i.number} ·{" "}
                  {formatDate(i.date, locale)} · {caseTitle(i.caseId)}
                  {/* "Vence" solo si aún no ha vencido; si la fecha ya pasó,
                      se dice en pasado. */}
                  {i.dueDate &&
                    !paid &&
                    ` · ${
                      daysUntil(i.dueDate) < 0
                        ? t("billing.dueOnPast")
                        : t("billing.dueOn")
                    } ${formatDate(i.dueDate, locale)}`}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-4">
                <StatusTag paid={paid} />
                <Amount value={i.amount} muted={paid} />
                <DownloadButton label={t("common.download")} />
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

"use client";

import { Card, Notice } from "@/components/ui";
import { daysUntil, formatDate } from "@/lib/format";
import { useL, useStore } from "@/lib/store";
import { Amount, StatusTag, useBilling } from "../shared";

/**
 * Provisiones de fondos: dinero que el cliente adelanta para que el despacho
 * pague impuestos y gastos de terceros en su nombre.
 *
 * El `payee` va en su propia línea y no mezclado con las fechas: es el dato que
 * distingue una provisión de una factura de honorarios, y el que evita pensar
 * que ese dinero se lo queda el despacho.
 */
export default function ProvisionsPage() {
  const { t, locale } = useStore();
  const l = useL();
  const { provisions, caseTitle } = useBilling();

  if (provisions.length === 0) {
    return <Notice tone="neutral">{t("billing.provisionsPendingEmpty")}</Notice>;
  }

  return (
    <>
      <Card>
        <ul className="divide-y divide-line">
          {provisions.map((p) => {
            const paid = p.status === "pagada";
            return (
              <li
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 px-5 py-4"
              >
                {/* Ver la nota de la pestaña de facturas: base cero partía el
                    concepto palabra a palabra en móvil. */}
                <div className="min-w-[13rem] flex-1">
                  <p className="text-sm text-ink">{l(p.concept)}</p>
                  <p className="mt-1 text-xs text-ink-soft">
                    {t("billing.payee")}:{" "}
                    <span className="font-medium">{l(p.payee)}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-ink-faint">
                    {caseTitle(p.caseId)} · {t("billing.requestedOn")}{" "}
                    {formatDate(p.requestedOn, locale)}
                    {p.paidOn &&
                      ` · ${t("billing.paidOn")} ${formatDate(p.paidOn, locale)}`}
                    {p.dueDate &&
                      !paid &&
                      ` · ${
                        daysUntil(p.dueDate) < 0
                          ? t("billing.dueOnPast")
                          : t("billing.dueOn")
                      } ${formatDate(p.dueDate, locale)}`}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-4">
                  <StatusTag paid={paid} />
                  <Amount value={p.amount} muted={paid} />
                </div>
              </li>
            );
          })}
        </ul>
      </Card>

      <Notice tone="neutral" className="mt-3">
        {t("billing.provisionsPendingIntro")}
      </Notice>
    </>
  );
}

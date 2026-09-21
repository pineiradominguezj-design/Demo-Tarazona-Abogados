"use client";

import Link from "next/link";
import { AreaBadge, Card, Disclosure, Notice } from "@/components/ui";
import { ArrowRight } from "@/components/icons";
import { formatCurrency, formatDate } from "@/lib/format";
import { useL, useStore } from "@/lib/store";
import { useBilling } from "../shared";

/**
 * La hoja de encargo aceptada de cada asunto.
 *
 * Alcance y forma de pago son los dos párrafos más largos de todo el portal y
 * se consultan una vez. Van plegados: en abierto la pestaña es una lista de
 * «qué encargué y por cuánto», que es la pregunta frecuente.
 */
export default function EngagementPage() {
  const { t, locale } = useStore();
  const l = useL();
  const { engagements, caseTitle, caseArea } = useBilling();

  if (engagements.length === 0) {
    return <Notice tone="neutral">{t("case.historyEmpty")}</Notice>;
  }

  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {engagements.map((e) => {
        const area = caseArea(e.caseId);
        return (
          <li key={e.id}>
            <Card className="flex h-full flex-col p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                {area && <AreaBadge area={area} size="sm" />}
                <span className="shrink-0 text-base font-light tabular-nums text-ink">
                  {formatCurrency(e.amount, locale)}
                </span>
              </div>

              <Link
                href={`/asuntos/${e.caseId}`}
                className="group mt-3 inline-flex items-start gap-1.5 text-sm font-medium text-ink transition-colors hover:text-accent-dark"
              >
                {caseTitle(e.caseId)}
                <ArrowRight className="mt-1 h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>

              <p className="mt-1.5 text-xs text-ink-faint">
                {t("billing.acceptedOn")} {formatDate(e.acceptedOn, locale)}
              </p>

              <div className="mt-auto border-t border-line pt-4">
                <Disclosure summary={t("billing.engagementDetail")}>
                  <dl className="border-l-2 border-line pl-4">
                    <dt className="ui-eyebrow text-ink-faint">
                      {t("billing.engagementScope")}
                    </dt>
                    <dd className="mt-1 text-[0.8125rem] leading-relaxed text-ink-soft">
                      {l(e.scope)}
                    </dd>
                    <dt className="ui-eyebrow mt-3 text-ink-faint">
                      {t("billing.engagementTerms")}
                    </dt>
                    <dd className="mt-1 text-[0.8125rem] leading-relaxed text-ink-soft">
                      {l(e.terms)}
                    </dd>
                  </dl>
                </Disclosure>
              </div>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}

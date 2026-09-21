"use client";

import { use } from "react";
import { Card, Disclosure, SectionTitle } from "@/components/ui";
import { FirmActionIcon, ProcedureIcon } from "@/components/icons";
import { AREAS } from "@/config/areas";
import { formatDate, relativeLabel } from "@/lib/format";
import { visibleActions } from "@/lib/selectors";
import { useL, useStore } from "@/lib/store";
import { DocumentRow, useCase } from "./shared";

/** Pestaña por defecto de la ficha: el historial de actuaciones. */
export default function CaseHistoryPage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = use(params);
  const { t, locale } = useStore();
  const l = useL();
  const c = useCase(caseId);

  const actions = visibleActions(c);
  const color = AREAS[c.area].color;

  return (
    <section>
      <SectionTitle
        action={
          <span className="ui-eyebrow text-ink-faint">
            {t("case.historyReadOnly")}
          </span>
        }
      >
        {t("case.historyTitle")}
      </SectionTitle>
      <p className="mb-4 text-xs text-ink-faint">{t("case.historyIntro")}</p>

      {actions.length === 0 ? (
        <Card className="p-5">
          <p className="text-sm text-ink-faint">{t("case.historyEmpty")}</p>
        </Card>
      ) : (
        <ol className="mt-5">
          {actions.map((a, i) => {
            const fromCourt = a.kind === "procedimiento";
            const NodeIcon = fromCourt ? ProcedureIcon : FirmActionIcon;
            const last = i === actions.length - 1;

            return (
              <li key={a.id} className="relative flex gap-4 pb-7 last:pb-0">
                {/* Raíl continuo de la línea temporal */}
                {!last && (
                  <span
                    className="absolute top-9 bottom-0 left-[15px] w-px bg-line"
                    aria-hidden
                  />
                )}

                {/* Nodo: el icono distingue procedimiento de despacho */}
                <span
                  className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border"
                  style={
                    fromCourt
                      ? {
                          backgroundColor: AREAS[c.area].tint,
                          borderColor: color,
                          color,
                        }
                      : {
                          backgroundColor: "#FFFFFF",
                          borderColor: "#E2E2E2",
                          color: "#4B4F58",
                        }
                  }
                  aria-hidden
                >
                  <NodeIcon className="h-4 w-4" />
                </span>

                <article className="min-w-0 flex-1 pt-0.5">
                  <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                    <time className="text-xs text-ink-faint">
                      {formatDate(a.date, locale)}
                    </time>
                    <span className="text-xs text-ink-faint/80">
                      · {relativeLabel(a.date, t)}
                    </span>
                    <span
                      className="text-[0.625rem] font-medium tracking-[0.14em] uppercase"
                      style={{ color: fromCourt ? color : "#767B85" }}
                    >
                      {fromCourt
                        ? t("case.actionProcedure")
                        : t("case.actionFirm")}
                    </span>
                  </div>

                  <h3 className="mt-1 text-sm leading-snug font-medium text-ink">
                    {l(a.title)}
                  </h3>

                  <div className="mt-2.5">
                    <Disclosure summary={t("case.detail")}>
                      <div className="border-l-2 border-line pl-4">
                        <p className="ui-eyebrow text-ink-faint">
                          {t("case.formalName")}
                        </p>
                        <p className="mt-1 text-[0.8125rem] leading-relaxed text-ink-muted italic">
                          {l(a.formalName)}
                        </p>

                        <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink-soft">
                          {l(a.detail)}
                        </p>

                        {a.attachment && (
                          <div className="mt-4">
                            <p className="ui-eyebrow text-ink-faint">
                              {t("case.attachedDoc")}
                            </p>
                            <DocumentRow
                              name={l(a.attachment.name)}
                              meta={a.attachment.meta}
                            />
                          </div>
                        )}
                      </div>
                    </Disclosure>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}

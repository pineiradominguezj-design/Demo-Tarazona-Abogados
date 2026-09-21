"use client";

import { use, useState } from "react";
import { Button, Card, SectionTitle, StatusPill } from "@/components/ui";
import { DocIcon, UploadIcon } from "@/components/icons";
import { formatDate } from "@/lib/format";
import { useL, useStore } from "@/lib/store";
import type { DocRequest } from "@/lib/types";
import { DownloadButton, useCase } from "../shared";

export default function CaseDocumentsPage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = use(params);
  const { t, locale } = useStore();
  const l = useL();
  const c = useCase(caseId);

  return (
    <section>
      <SectionTitle>{t("case.documentsTitle")}</SectionTitle>

      <div className="space-y-4">
        {/* Documentos del despacho */}
        <Card className="p-5">
          <h3 className="text-sm font-medium text-ink">
            {t("case.firmDocs")}
          </h3>
          <p className="mt-1 text-xs text-ink-faint">
            {t("case.firmDocsIntro")}
          </p>

          {c.firmDocs.length === 0 ? (
            <p className="mt-4 text-sm text-ink-faint">
              {t("case.firmDocsEmpty")}
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-line border-t border-line">
              {c.firmDocs.map((d) => (
                <li
                  key={d.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <DocIcon className="mt-0.5 h-4 w-4 shrink-0 text-ink-faint" />
                    <div className="min-w-0">
                      <p className="text-sm text-ink">{l(d.name)}</p>
                      <p className="mt-0.5 text-xs text-ink-faint">
                        {l(d.kind)} · {formatDate(d.date, locale)} · {d.meta}
                      </p>
                    </div>
                  </div>
                  <DownloadButton label={t("common.download")} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Documentos que necesitamos */}
        <Card className="p-5">
          <h3 className="text-sm font-medium text-ink">
            {t("case.requestedDocs")}
          </h3>

          {c.docRequests.length === 0 ? (
            <p className="mt-4 text-sm text-ink-faint">
              {t("case.requestedDocsEmpty")}
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-line border-t border-line">
              {c.docRequests.map((r) => (
                <DocRequestRow key={r.id} request={r} />
              ))}
            </ul>
          )}
        </Card>

        {/* Documentos enviados */}
        <Card className="p-5">
          <h3 className="text-sm font-medium text-ink">
            {t("case.uploadedDocs")}
          </h3>

          {c.uploadedDocs.length === 0 ? (
            <p className="mt-4 text-sm text-ink-faint">
              {t("case.uploadedDocsEmpty")}
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-line border-t border-line">
              {c.uploadedDocs.map((d) => (
                <li
                  key={d.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <DocIcon className="mt-0.5 h-4 w-4 shrink-0 text-ink-faint" />
                    <div className="min-w-0">
                      <p className="text-sm break-words text-ink">
                        {l(d.name)}
                      </p>
                      <p className="mt-0.5 text-xs text-ink-faint">
                        {t("case.uploadedOn")} {formatDate(d.uploadedOn, locale)}{" "}
                        · {d.meta}
                      </p>
                    </div>
                  </div>
                  <DownloadButton label={t("common.download")} />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </section>
  );
}

/** Fila de un documento pedido al cliente, con su estado y la subida. */
function DocRequestRow({ request: r }: { request: DocRequest }) {
  const { t, locale, uploadDocument } = useStore();
  const l = useL();
  const [busy, setBusy] = useState(false);

  const canUpload = r.status === "pendiente" || r.status === "rechazado";

  function simulateUpload() {
    setBusy(true);
    // En la demo no hay backend: se simula la recepción y pasa a revisión.
    window.setTimeout(() => {
      uploadDocument(r.id, `${l(r.name)}.pdf`);
      setBusy(false);
    }, 700);
  }

  return (
    <li className="py-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <p className="text-sm font-medium text-ink">{l(r.name)}</p>
            <StatusPill status={r.status} />
          </div>

          <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
            {l(r.help)}
          </p>

          <p className="mt-2 text-xs text-ink-faint">
            {t("case.requestedOn")} {formatDate(r.requestedOn, locale)}
            {r.submittedOn &&
              ` · ${t("case.submittedOn")} ${formatDate(r.submittedOn, locale)}`}
          </p>

          {r.status === "rechazado" && r.rejectionReason && (
            <div className="mt-3 border-l-2 border-[#A33A3A] bg-[#F9EFEF] px-3 py-2.5">
              <p className="ui-eyebrow text-[#A33A3A]">{t("case.whyRejected")}</p>
              <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink-soft">
                {l(r.rejectionReason)}
              </p>
            </div>
          )}
        </div>

        {canUpload && (
          <Button
            variant="secondary"
            onClick={simulateUpload}
            disabled={busy}
            className="shrink-0"
          >
            <UploadIcon className="h-3.5 w-3.5" />
            {busy
              ? "…"
              : r.status === "rechazado"
                ? t("case.uploadAgain")
                : t("case.upload")}
          </Button>
        )}
      </div>
    </li>
  );
}

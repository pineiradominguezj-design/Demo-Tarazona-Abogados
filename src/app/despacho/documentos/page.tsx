"use client";

import { useState } from "react";
import { AreaBadge, Card, Notice, StatusPill } from "@/components/ui";
import { DocIcon, UploadIcon } from "@/components/icons";
import { AREAS } from "@/config/areas";
import { getClientById } from "@/lib/data";
import { DOC_CHECKLISTS, REJECTION_REASONS } from "@/lib/firm";
import { formatDate } from "@/lib/format";
import { useL, useStore } from "@/lib/store";
import type { Case, DocRequest } from "@/lib/types";
import {
  Check,
  Collapsible,
  Done,
  MiniButton,
  SectionHeader,
  Select,
  daysSince,
  useFirmData,
  usePaged,
} from "../shared";

/**
 * Documentos.
 *
 * Las dos caras del mismo trato: lo que el cliente ya ha enviado y espera una
 * decisión, y lo que el despacho le ha pedido y todavía no llega. Son pestañas
 * dentro de la sección, no rutas: se alternan mucho y siempre en el mismo sitio.
 *
 * Validar y rechazar son de verdad: cambian el estado en el expediente del
 * cliente, igual que publicar una actuación.
 */
type Tab = "review" | "requested";

export default function DocumentsPage() {
  const { t, allCases } = useStore();
  const { docsToReview } = useFirmData();
  const [tab, setTab] = useState<Tab>("review");
  const [panel, setPanel] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const requested: { request: DocRequest; file: Case }[] = allCases
    .flatMap((file) => file.docRequests.map((request) => ({ request, file })))
    .sort((a, b) => b.request.requestedOn.localeCompare(a.request.requestedOn));

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "review", label: t("firm.tabToReview"), count: docsToReview.length },
    { id: "requested", label: t("firm.tabRequested"), count: requested.length },
  ];

  return (
    <>
      <SectionHeader
        title={t("firm.docsTitle")}
        action={
          <MiniButton
            tone={panel ? "neutral" : "primary"}
            onClick={() => setPanel((p) => !p)}
          >
            <UploadIcon className="h-3.5 w-3.5" />
            {t("firm.requestDocs")}
          </MiniButton>
        }
      />

      {panel && (
        <RequestPanel
          onDone={(n) => {
            setPanel(false);
            setToast(t("firm.requestDone"));
            void n;
          }}
        />
      )}

      {toast && <Done>{toast}</Done>}

      {/* Pestañas dentro de la sección: el mismo subrayado dorado que el área
          económica del cliente, porque tampoco pertenecen a un área. */}
      <nav className="mt-6 mb-4 border-b border-line">
        <ul className="flex gap-1">
          {tabs.map((x) => (
            <li key={x.id}>
              <button
                type="button"
                onClick={() => setTab(x.id)}
                aria-current={tab === x.id ? "page" : undefined}
                className={`-mb-px flex items-center gap-2 border-b-2 px-3 py-2.5 text-[0.8125rem] transition-colors ${
                  tab === x.id
                    ? "border-accent font-medium text-ink"
                    : "border-transparent text-ink-faint hover:text-ink"
                }`}
              >
                {x.label}
                <span className="text-xs tabular-nums text-ink-faint">
                  {x.count}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {tab === "review" ? (
        <ReviewTab onDecided={setToast} />
      ) : (
        <RequestedTab rows={requested} onReminded={setToast} />
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Por revisar                                                         */
/* ------------------------------------------------------------------ */

function ReviewTab({ onDecided }: { onDecided: (msg: string) => void }) {
  const { t } = useStore();
  const { docsToReview } = useFirmData();
  const { slice, pager } = usePaged(docsToReview);

  if (docsToReview.length === 0) {
    return <Notice tone="ok">{t("firm.noneToReview")}</Notice>;
  }

  return (
    <>
      <Card className="divide-y divide-line">
        {slice.map((d) => (
          <ReviewRow
            key={d.request.id}
            request={d.request}
            file={d.file}
            fileName={d.fileName}
            onDecided={onDecided}
          />
        ))}
      </Card>
      {pager}
    </>
  );
}

function ReviewRow({
  request,
  file,
  fileName,
  onDecided,
}: {
  request: DocRequest;
  file: Case;
  fileName?: string;
  onDecided: (msg: string) => void;
}) {
  const { t, locale, decideDoc } = useStore();
  const l = useL();
  const client = getClientById(file.clientId);

  const [rejecting, setRejecting] = useState(false);
  const [reasonId, setReasonId] = useState(REJECTION_REASONS[0].id);
  const [ownReason, setOwnReason] = useState("");

  const sent = request.submittedOn ?? request.requestedOn;

  function reject() {
    const preset = REJECTION_REASONS.find((r) => r.id === reasonId);
    const text = reasonId === "other" ? ownReason.trim() : l(preset?.text ?? { es: "", en: "" });
    if (!text) return;
    decideDoc(request.id, false, text);
    onDecided(t("firm.rejectedToast"));
  }

  return (
    <Collapsible
      accent={AREAS[file.area].color}
      summary={
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {/* Hueco fijo, para que los nombres de documento empiecen todos en
              la misma columna pese a que los distintivos de área midan
              distinto. */}
          <span className="shrink-0 sm:w-40">
            <AreaBadge area={file.area} size="sm" />
          </span>
          <span className="min-w-[12rem] flex-1">
            <span className="block truncate text-sm text-ink">
              {l(request.name)}
            </span>
            <span className="mt-0.5 block truncate text-xs text-ink-faint">
              {client?.name} · {l(file.shortTitle)}
            </span>
          </span>
          <StatusPill status={request.status} />
          <span className="w-10 text-right text-xs tabular-nums text-ink-faint">
            {t("firm.daysElapsed", { n: daysSince(sent) })}
          </span>
        </span>
      }
    >
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-ink-muted">
        <span className="flex items-center gap-2">
          <DocIcon className="h-3.5 w-3.5 shrink-0" />
          <span className="ui-eyebrow text-ink-faint">
            {t("firm.uploadedFile")}
          </span>
          {fileName ?? l(request.name)}
        </span>
        <span>
          {t("firm.sentOn")} {formatDate(sent, locale)}
        </span>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-ink-faint">
        {l(request.help)}
      </p>

      {rejecting ? (
        <div className="mt-4 border-t border-line pt-3">
          <p className="ui-eyebrow mb-2 text-ink-faint">
            {t("firm.rejectReason")}
          </p>
          <div className="space-y-1.5">
            {REJECTION_REASONS.map((r) => (
              <label
                key={r.id}
                className="flex cursor-pointer items-start gap-2 text-xs text-ink-soft"
              >
                <input
                  type="radio"
                  name={`reason-${request.id}`}
                  checked={reasonId === r.id}
                  onChange={() => setReasonId(r.id)}
                  className="mt-0.5 accent-accent-dark"
                />
                {l(r.text)}
              </label>
            ))}
            <label className="flex cursor-pointer items-start gap-2 text-xs text-ink-soft">
              <input
                type="radio"
                name={`reason-${request.id}`}
                checked={reasonId === "other"}
                onChange={() => setReasonId("other")}
                className="mt-0.5 accent-accent-dark"
              />
              {t("firm.rejectOther")}
            </label>
          </div>

          {reasonId === "other" && (
            <textarea
              value={ownReason}
              onChange={(e) => setOwnReason(e.target.value)}
              rows={2}
              className="mt-2 w-full border border-line bg-white px-2.5 py-1.5 text-xs text-ink"
            />
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            <MiniButton tone="danger" onClick={reject}>
              {t("firm.rejectSend")}
            </MiniButton>
            <MiniButton onClick={() => setRejecting(false)}>
              {t("firm.editCancel")}
            </MiniButton>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-3">
          <MiniButton
            tone="primary"
            onClick={() => {
              decideDoc(request.id, true);
              onDecided(t("firm.validatedToast"));
            }}
          >
            {t("firm.validate")}
          </MiniButton>
          <MiniButton tone="danger" onClick={() => setRejecting(true)}>
            {t("firm.reject")}
          </MiniButton>
        </div>
      )}
    </Collapsible>
  );
}

/* ------------------------------------------------------------------ */
/* Solicitados                                                         */
/* ------------------------------------------------------------------ */

function RequestedTab({
  rows,
  onReminded,
}: {
  rows: { request: DocRequest; file: Case }[];
  onReminded: (msg: string) => void;
}) {
  const { t, locale } = useStore();
  const l = useL();
  const { slice, pager } = usePaged(rows);

  if (rows.length === 0) {
    return <Notice tone="neutral">{t("firm.noRequests")}</Notice>;
  }

  return (
    <>
      <Card className="divide-y divide-line">
        {slice.map(({ request, file }) => {
          const client = getClientById(file.clientId);
          return (
            <Collapsible
              key={request.id}
              accent={AREAS[file.area].color}
              summary={
                <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="shrink-0 sm:w-40">
                    <AreaBadge area={file.area} size="sm" />
                  </span>
                  <span className="min-w-[12rem] flex-1">
                    <span className="block truncate text-sm text-ink">
                      {l(request.name)}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-ink-faint">
                      {client?.name} · {l(file.shortTitle)}
                    </span>
                  </span>
                  <StatusPill status={request.status} />
                  <span className="text-xs whitespace-nowrap text-ink-faint">
                    {formatDate(request.requestedOn, locale)}
                  </span>
                </span>
              }
            >
              <p className="text-xs leading-relaxed text-ink-muted">
                {l(request.help)}
              </p>

              {request.rejectionReason && (
                <p className="mt-2 text-xs text-[#A33A3A]">
                  {l(request.rejectionReason)}
                </p>
              )}

              {(request.status === "pendiente" ||
                request.status === "rechazado") && (
                <div className="mt-3 border-t border-line pt-3">
                  <MiniButton
                    onClick={() => onReminded(t("firm.remindedToast"))}
                  >
                    {t("firm.remind")}
                  </MiniButton>
                </div>
              )}
            </Collapsible>
          );
        })}
      </Card>
      {pager}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Panel de solicitud                                                  */
/* ------------------------------------------------------------------ */

/**
 * Lista de comprobación por tipo de asunto. Se marca lo que hay que pedir y el
 * cliente lo recibe con la explicación en lenguaje claro que lleva cada línea:
 * es la mitad del valor del portal, y no debe quedar en manos de quien redacta.
 */
function RequestPanel({ onDone }: { onDone: (n: number) => void }) {
  const { t, allCases, requestDocuments } = useStore();
  const l = useL();

  const [caseId, setCaseId] = useState(allCases[0]?.id ?? "");
  const [picked, setPicked] = useState<string[]>([]);

  const file = allCases.find((c) => c.id === caseId);
  const checklist = file ? DOC_CHECKLISTS[file.area] : [];

  function send() {
    if (!file) return;
    const items = checklist
      .filter((i) => picked.includes(i.id))
      .map((i) => ({ name: i.name, help: i.help }));
    requestDocuments(file.id, items);
    setPicked([]);
    onDone(items.length);
  }

  return (
    <Card className="mt-2 p-5">
      <p className="text-xs leading-relaxed text-ink-muted">
        {t("firm.requestPanelIntro")}
      </p>

      <div className="mt-4 max-w-sm">
        <Select
          label={t("firm.requestFor")}
          value={caseId}
          onChange={(v) => {
            setCaseId(v);
            setPicked([]);
          }}
          options={allCases.map((c) => {
            const client = getClientById(c.clientId);
            return {
              value: c.id,
              label: `${client?.name} · ${c.ref}`,
            };
          })}
        />
      </div>

      <ul className="mt-4 space-y-2.5 border-t border-line pt-4">
        {checklist.map((item) => (
          <li key={item.id}>
            <Check
              checked={picked.includes(item.id)}
              onChange={(v) =>
                setPicked((p) =>
                  v ? [...p, item.id] : p.filter((x) => x !== item.id),
                )
              }
              label={
                <span>
                  <span className="text-ink">{l(item.name)}</span>
                  <span className="mt-0.5 block text-ink-faint">
                    {l(item.help)}
                  </span>
                </span>
              }
            />
          </li>
        ))}
      </ul>

      <div className="mt-4 border-t border-line pt-3">
        <MiniButton tone="primary" disabled={picked.length === 0} onClick={send}>
          {picked.length === 1
            ? t("firm.requestSendOne")
            : t("firm.requestSend", { n: picked.length })}
        </MiniButton>
      </div>
    </Card>
  );
}

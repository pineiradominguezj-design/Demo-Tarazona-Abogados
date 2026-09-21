"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AreaBadge, Card, Notice } from "@/components/ui";
import {
  ArrowRight,
  CheckIcon,
  DocIcon,
  FirmActionIcon,
  ProcedureIcon,
} from "@/components/icons";
import { AREA_ORDER, AREAS } from "@/config/areas";
import { getClientById } from "@/lib/data";
import { ACTION_TEMPLATES, TEAM } from "@/lib/firm";
import { formatDate } from "@/lib/format";
import { useL, useStore } from "@/lib/store";
import type { AreaId, Case, CaseAction } from "@/lib/types";
import {
  Check,
  Collapsible,
  Done,
  MiniButton,
  SectionHeader,
  Select,
  Toggle,
  daysSince,
  ownerOf,
  useFirmData,
  usePaged,
} from "../shared";

/**
 * Borradores de actuación.
 *
 * Es la sección que sostiene la promesa del portal: nada llega al cliente
 * hasta que alguien del despacho lo publica. Por eso todo el detalle —el texto
 * que verá, los canales de aviso, quién más puede verlo— vive dentro del
 * desplegable de cada borrador, y no repartido por la pantalla.
 */
export default function UpdatesPage() {
  const { t, publishAction } = useStore();
  const { sessionDrafts } = useFirmData();

  const [area, setArea] = useState("");
  const [owner, setOwner] = useState("");
  const [age, setAge] = useState("0");
  const [selected, setSelected] = useState<string[]>([]);

  const minDays = Number(age);
  const filtered = sessionDrafts.filter(
    (d) =>
      (!area || d.file.area === area) &&
      (!owner || d.file.lawyerId === owner) &&
      daysSince(d.action.date) >= minDays,
  );

  const { slice, pager } = usePaged(filtered);
  const selectable = filtered.filter((d) => !d.published).map((d) => d.action.id);
  const allSelected =
    selectable.length > 0 && selectable.every((id) => selected.includes(id));

  function publishSelected() {
    selected.forEach(publishAction);
    setSelected([]);
  }

  return (
    <>
      <SectionHeader title={t("firm.title")} />

      {/* ---------------- FILTROS ---------------- */}
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <Select
          label={t("firm.filterArea")}
          value={area}
          onChange={setArea}
          options={[
            { value: "", label: t("firm.filterAll") },
            ...AREA_ORDER.map((id) => ({
              value: id,
              label: AREAS[id].label.es,
            })),
          ]}
        />
        <Select
          label={t("firm.filterOwner")}
          value={owner}
          onChange={setOwner}
          options={[
            { value: "", label: t("firm.filterAllOwners") },
            ...TEAM.filter((m) => m.permission === "publica").map((m) => ({
              value: m.id,
              label: m.name,
            })),
          ]}
        />
        <Select
          label={t("firm.filterAge")}
          value={age}
          onChange={setAge}
          options={[
            { value: "0", label: t("firm.ageAny") },
            { value: "3", label: t("firm.age3") },
            { value: "7", label: t("firm.age7") },
            { value: "15", label: t("firm.age15") },
          ]}
        />

        <div className="ml-auto flex items-center gap-3">
          {selectable.length > 0 && (
            <Check
              checked={allSelected}
              onChange={(v) => setSelected(v ? selectable : [])}
              label={t("firm.selectAll")}
            />
          )}
          <MiniButton
            tone="primary"
            disabled={selected.length === 0}
            onClick={publishSelected}
          >
            {t("firm.publishSelected", { n: selected.length })}
          </MiniButton>
        </div>
      </div>

      {filtered.length === 0 ? (
        <Notice tone="neutral">{t("firm.noDrafts")}</Notice>
      ) : (
        <>
          <Card className="divide-y divide-line">
            {slice.map((d) => (
              <DraftRow
                key={d.action.id}
                action={d.action}
                file={d.file}
                published={d.published}
                selected={selected.includes(d.action.id)}
                onSelect={(v) =>
                  setSelected((s) =>
                    v
                      ? [...s, d.action.id]
                      : s.filter((id) => id !== d.action.id),
                  )
                }
              />
            ))}
          </Card>
          {pager}
        </>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Una fila de borrador                                                */
/* ------------------------------------------------------------------ */

function DraftRow({
  action,
  file,
  published,
  selected,
  onSelect,
}: {
  action: CaseAction;
  file: Case;
  published: boolean;
  selected: boolean;
  onSelect: (v: boolean) => void;
}) {
  const { t, locale, publishAction, discardAction, editAction, completeLogin } =
    useStore();
  const l = useL();
  const router = useRouter();
  const client = getClientById(file.clientId);
  const owner = ownerOf(file);

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(l(action.title));
  const [detail, setDetail] = useState(l(action.detail));
  const [template, setTemplate] = useState("");

  // Los canales arrancan en las preferencias que el cliente ya tiene fijadas.
  const [byEmail, setByEmail] = useState(client?.notifyByEmail ?? true);
  const [bySms, setBySms] = useState(client?.notifyBySms ?? false);
  const [byWhatsapp, setByWhatsapp] = useState(false);
  const [toThirdParties, setToThirdParties] = useState(
    (client?.authorizedPeople ?? []).some((p) => p.caseIds.includes(file.id)),
  );
  const [discarded, setDiscarded] = useState(false);

  const templates = ACTION_TEMPLATES.filter(
    (tp) => tp.area === null || tp.area === (file.area as AreaId),
  );

  function applyTemplate(id: string) {
    setTemplate(id);
    const tpl = templates.find((tp) => tp.id === id);
    if (!tpl) return;
    /*
     * La plantilla se vuelca en el idioma en que se está trabajando. El texto
     * editado se guarda igual en los dos —mismo criterio que los mensajes que
     * escribe el cliente—: quien redacta escribe en un idioma, no en dos.
     */
    setTitle(l(tpl.title));
    setDetail(l(tpl.detail));
    setEditing(true);
  }

  function save() {
    editAction(action.id, title, detail);
    setEditing(false);
  }

  if (discarded) {
    return (
      <div className="px-4 py-3">
        <p className="text-xs text-ink-faint">{t("firm.discarded")}</p>
      </div>
    );
  }

  return (
    <Collapsible
      accent={AREAS[file.area].color}
      leading={
        published ? undefined : (
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => onSelect(e.target.checked)}
            aria-label={l(action.title)}
            className="h-3.5 w-3.5 accent-accent-dark"
          />
        )
      }
      summary={
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {/* Hueco fijo para el distintivo: los nombres de área van de
              "Penal" a "Ecuestre y deportivo", y sin reservarles el mismo
              ancho los títulos de los borradores empiezan cada uno en un
              sitio. */}
          <span className="shrink-0 sm:w-40">
            <AreaBadge area={file.area} size="sm" />
          </span>
          <span className="min-w-[12rem] flex-1">
            <span className="block truncate text-sm text-ink">
              {l(action.title)}
            </span>
            <span className="mt-0.5 block truncate text-xs text-ink-faint">
              {client?.name} · {l(file.shortTitle)} · {owner?.initials}
            </span>
          </span>
          {published && (
            <span
              className="inline-flex items-center gap-1 text-[0.6875rem] font-medium"
              style={{ color: "#2F6340" }}
            >
              <CheckIcon className="h-3.5 w-3.5" />
              {t("firm.published")}
            </span>
          )}
          <span className="text-xs whitespace-nowrap text-ink-faint">
            {formatDate(action.date, locale)}
          </span>
        </span>
      }
    >
      {/* ---- Lo que verá el cliente ---- */}
      <div className="border-l-2 border-accent bg-accent-wash/60 px-4 py-3.5">
        <p className="ui-eyebrow text-[#8A5A12]">{t("firm.clientSees")}</p>

        {editing ? (
          <div className="mt-2 space-y-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-accent-light bg-white px-2.5 py-1.5 text-sm font-medium text-ink"
            />
            <textarea
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              rows={4}
              className="w-full border border-accent-light bg-white px-2.5 py-1.5 text-[0.8125rem] leading-relaxed text-ink-soft"
            />
          </div>
        ) : (
          <>
            <h3 className="mt-1.5 text-sm font-medium text-ink">{title}</h3>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-soft">
              {detail}
            </p>
          </>
        )}

        {action.attachment && (
          <p className="mt-2.5 flex items-center gap-2 text-xs text-ink-muted">
            <DocIcon className="h-3.5 w-3.5" />
            {l(action.attachment.name)}
          </p>
        )}
      </div>

      {/* ---- Denominación formal ---- */}
      <div className="mt-3 px-1">
        <p className="ui-eyebrow text-ink-faint">{t("firm.formalRecord")}</p>
        <p className="mt-1 flex items-center gap-2 text-xs leading-relaxed text-ink-muted italic">
          {action.kind === "procedimiento" ? (
            <ProcedureIcon className="h-3.5 w-3.5 shrink-0 not-italic" />
          ) : (
            <FirmActionIcon className="h-3.5 w-3.5 shrink-0 not-italic" />
          )}
          {l(action.formalName)}
        </p>
      </div>

      {published ? (
        <div className="mt-4 border-t border-line pt-3">
          <button
            type="button"
            onClick={() => {
              completeLogin(file.clientId);
              router.push(`/asuntos/${file.id}`);
            }}
            className="inline-flex items-center gap-1.5 text-xs text-ink-muted underline-offset-4 hover:text-ink hover:underline"
          >
            {t("firm.viewAsClient")}
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <>
          {/* ---- Ajustes de la publicación ---- */}
          <div className="mt-4 grid gap-4 border-t border-line pt-4 sm:grid-cols-2">
            <div className="space-y-3">
              <Select
                label={t("firm.template")}
                value={template}
                onChange={applyTemplate}
                options={[
                  { value: "", label: t("firm.templateNone") },
                  ...templates.map((tp) => ({
                    value: tp.id,
                    label: l(tp.label),
                  })),
                ]}
              />
              <Toggle
                checked={toThirdParties}
                onChange={setToThirdParties}
                label={t("firm.thirdParties")}
              />
            </div>

            {/* Los tres canales caben en una línea, pero `Check` es
                `inline-flex`: sin este contenedor se pegan unos a otros y la
                etiqueta de uno parece del siguiente. */}
            <fieldset className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <legend className="ui-eyebrow mb-1 text-ink-faint">
                {t("firm.channels")}
              </legend>
              <Check
                checked={byEmail}
                onChange={setByEmail}
                label={t("firm.channelEmail")}
              />
              <Check
                checked={bySms}
                onChange={setBySms}
                label={t("firm.channelSms")}
              />
              <Check
                checked={byWhatsapp}
                onChange={setByWhatsapp}
                label={t("firm.channelWhatsapp")}
              />
            </fieldset>
          </div>

          {/* ---- Decisión ---- */}
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-3">
            {editing ? (
              <>
                <MiniButton onClick={save}>{t("firm.editSave")}</MiniButton>
                <MiniButton
                  onClick={() => {
                    setTitle(l(action.title));
                    setDetail(l(action.detail));
                    setEditing(false);
                  }}
                >
                  {t("firm.editCancel")}
                </MiniButton>
              </>
            ) : (
              <MiniButton onClick={() => setEditing(true)}>
                {t("firm.edit")}
              </MiniButton>
            )}

            <MiniButton
              tone="danger"
              onClick={() => {
                discardAction(action.id);
                setDiscarded(true);
              }}
            >
              {t("firm.discard")}
            </MiniButton>

            <MiniButton
              tone="primary"
              className="ml-auto"
              onClick={() => {
                if (editing) save();
                publishAction(action.id);
              }}
            >
              {t("firm.publish")}
            </MiniButton>
          </div>

          <p className="mt-2 text-xs text-ink-faint">
            {t("firm.publishHint")}
          </p>
        </>
      )}

      {published && <Done>{t("firm.publishedToast")}</Done>}
    </Collapsible>
  );
}

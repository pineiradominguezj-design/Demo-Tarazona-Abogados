"use client";

import { useMemo, useState } from "react";
import { AreaBadge } from "@/components/ui";
import { AREAS, AREA_ORDER } from "@/config/areas";
import { getClientById } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { FIRM_SETTINGS, QUICK_REPLIES, TEAM } from "@/lib/firm";
import { STATES } from "@/lib/states";
import { useL, useStore } from "@/lib/store";
import type { Case, LocalizedText } from "@/lib/types";
import {
  Collapsible,
  MiniButton,
  SectionHeader,
  Select,
  Toggle,
  daysSince,
  ownerOf,
  usePaged,
} from "../shared";

/**
 * Mensajes — maqueta.
 *
 * La bandeja lee los mensajes de verdad del escenario, pero nada de lo que se
 * hace aquí sale de la pantalla: no se envía, no se asigna, no se guarda. Es a
 * propósito. El portal no tiene chat en tiempo real ni responde consultas
 * jurídicas de forma automática, y la mensajería real del cliente ya vive en su
 * propia sección; esto solo enseña cómo se vería del lado del despacho.
 */
export default function MessagesPage() {
  const { t, messages, allCases } = useStore();
  const l = useL();
  const [area, setArea] = useState("all");
  const [owner, setOwner] = useState("all");
  const [away, setAway] = useState(false);

  const threads = useMemo(() => {
    return allCases
      .map((file) => {
        const thread = messages
          .filter((m) => m.caseId === file.id)
          .sort((a, b) => a.date.localeCompare(b.date));
        const last = thread.at(-1);
        if (!last) return null;
        const waiting = last.from === "cliente" ? daysSince(last.date) : 0;
        return { file, thread, last, waiting };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null)
      .sort((a, b) => b.last.date.localeCompare(a.last.date));
  }, [allCases, messages]);

  const filtered = threads.filter(
    (x) =>
      (area === "all" || x.file.area === area) &&
      (owner === "all" || x.file.lawyerId === owner),
  );

  const { slice, pager } = usePaged(filtered);

  return (
    <>
      <SectionHeader title={t("firm.messagesTitle")} preview />

      <div className="mb-4 flex flex-wrap items-end gap-3 border-b border-line pb-4">
        <Select
          label={t("firm.filterArea")}
          value={area}
          onChange={setArea}
          options={[
            { value: "all", label: t("firm.filterAll") },
            ...AREA_ORDER.map((a) => ({ value: a, label: l(AREAS[a].label) })),
          ]}
        />
        <Select
          label={t("firm.filterOwner")}
          value={owner}
          onChange={setOwner}
          options={[
            { value: "all", label: t("firm.filterAllOwners") },
            ...TEAM.map((m) => ({ value: m.id, label: m.name })),
          ]}
        />

        <div className="ml-auto min-w-[14rem]">
          <Toggle checked={away} onChange={setAway} label={t("firm.awayMode")} />
          {away && (
            <p className="mt-1 text-xs text-ink-faint">{t("firm.awayOn")}</p>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-ink-faint">
          {t("firm.inboxEmpty")}
        </p>
      ) : (
        <>
          <div className="divide-y divide-line border-y border-line">
            {slice.map((x) => (
              <ThreadRow
                key={x.file.id}
                file={x.file}
                waiting={x.waiting}
                lastFrom={x.last.from}
                lastBody={x.last.body}
                lastDate={x.last.date}
              />
            ))}
          </div>
          {pager}
        </>
      )}

      <p className="mt-4 text-xs text-ink-faint">
        {t("firm.responseDaysLabel")} {FIRM_SETTINGS.responseDays}{" "}
        {t("firm.days")}.
      </p>
    </>
  );
}

/* ------------------------------------------------------------------ */

function ThreadRow({
  file,
  waiting,
  lastFrom,
  lastBody,
  lastDate,
}: {
  file: Case;
  waiting: number;
  lastFrom: "cliente" | "despacho";
  lastBody: LocalizedText;
  lastDate: string;
}) {
  const { t, locale } = useStore();
  const l = useL();
  const client = getClientById(file.clientId);
  const [assignee, setAssignee] = useState(file.lawyerId);
  const [reply, setReply] = useState("");

  const overdue = waiting > FIRM_SETTINGS.responseDays;

  return (
    <Collapsible
      accent={AREAS[file.area].color}
      summary={
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {/* Hueco fijo, para que los nombres de cliente empiecen todos en la
              misma columna pese a que los distintivos de área midan distinto. */}
          <span className="shrink-0 sm:w-40">
            <AreaBadge area={file.area} size="sm" />
          </span>
          <span className="min-w-[12rem] flex-1">
            <span className="block truncate text-sm text-ink">
              <span className="font-medium">{client?.name}</span>
              <span className="text-ink-faint"> · {l(file.shortTitle)}</span>
            </span>
            <span className="mt-0.5 block truncate text-xs text-ink-faint">
              {lastFrom === "despacho" && (
                <span className="text-ink-muted">
                  {ownerOf(file)?.initials}:{" "}
                </span>
              )}
              {l(lastBody)}
            </span>
          </span>

          {waiting > 0 && (
            <span
              className="shrink-0 text-xs"
              style={{ color: overdue ? STATES.alert.fg : STATES.ongoing.fg }}
            >
              {t("firm.waitingDays", { n: waiting })}
            </span>
          )}
          <span className="shrink-0 text-xs text-ink-faint">
            {formatDate(lastDate, locale)}
          </span>
        </span>
      }
    >
      <div className="space-y-4">
        <div className="max-w-md">
          <Select
            label={t("firm.assignTo")}
            value={assignee}
            onChange={setAssignee}
            options={[
              { value: "", label: t("firm.assignNobody") },
              ...TEAM.map((m) => ({
                value: m.id,
                label: `${m.name} — ${t(
                  m.permission === "publica"
                    ? "firm.permPublica"
                    : "firm.permRedacta",
                )}`,
              })),
            ]}
          />
        </div>

        <div>
          <p className="ui-eyebrow mb-2 text-ink-faint">
            {t("firm.quickReplies")}
          </p>
          <div className="flex flex-wrap gap-2">
            {QUICK_REPLIES.map((q) => (
              <MiniButton key={q.id} onClick={() => setReply(l(q.text))}>
                {l(q.text).slice(0, 34)}…
              </MiniButton>
            ))}
          </div>
        </div>

        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          rows={3}
          className="w-full border border-line bg-white px-2.5 py-2 text-xs leading-relaxed text-ink focus:border-accent focus:outline-none"
        />
      </div>
    </Collapsible>
  );
}

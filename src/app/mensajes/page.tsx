"use client";

import { useEffect, useRef, useState } from "react";
import { PortalShell } from "@/components/PortalShell";
import { Button, Card, FinePrint } from "@/components/ui";
import {
  AreaIcon,
  ClipIcon,
  DocIcon,
  DownloadIcon,
  SendIcon,
} from "@/components/icons";
import { AREAS } from "@/config/areas";
import { LAWYERS } from "@/lib/data";
import { formatDate, formatTime, relativeLabel } from "@/lib/format";
import { messagesForCase, unreadMessagesForCase } from "@/lib/selectors";
import { useL, useStore } from "@/lib/store";
import type { Message } from "@/lib/types";

export default function MensajesPage() {
  return (
    <PortalShell>
      <MensajesContent />
    </PortalShell>
  );
}

/** Una fila de la conversación con lo que necesita para pintarse. */
interface Row {
  message: Message;
  /** El interlocutor ha cambiado: toca mostrar nombre y avatar. */
  showAuthor: boolean;
  isLast: boolean;
}

/** Agrupa las filas por día natural, conservando el orden cronológico. */
function groupByDay(rows: Row[]): { day: string; rows: Row[] }[] {
  const groups: { day: string; rows: Row[] }[] = [];
  for (const row of rows) {
    const day = row.message.date.slice(0, 10);
    const last = groups[groups.length - 1];
    if (last && last.day === day) last.rows.push(row);
    else groups.push({ day, rows: [row] });
  }
  return groups;
}

/**
 * El tamaño que se muestra en la ficha de adjunto. `meta` viene como
 * "PDF · 210 KB": el icono ya dice que es un documento, así que basta la cola.
 */
function attachmentSize(meta: string): string {
  return meta.split("·").pop()?.trim() ?? meta;
}

function MensajesContent() {
  const { cases, messages, t, locale, sendMessage } = useStore();
  const l = useL();

  const [activeId, setActiveId] = useState<string>(cases[0]?.id ?? "");
  const [draft, setDraft] = useState("");
  const [attached, setAttached] = useState<string | null>(null);
  const [justSent, setJustSent] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const active = cases.find((c) => c.id === activeId) ?? cases[0];
  const thread = active ? messagesForCase(messages, active.id) : [];

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [thread.length, activeId]);

  if (!active) return null;

  const lawyer = LAWYERS[active.lawyerId];
  const areaColor = AREAS[active.area].color;

  // El nombre solo se repite cuando cambia el interlocutor; el resto del
  // tiempo la hora basta para situar el mensaje.
  const rows: Row[] = thread.map((message, i) => ({
    message,
    showAuthor: thread[i - 1]?.from !== message.from,
    isLast: i === thread.length - 1,
  }));
  const groups = groupByDay(rows);

  function send(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim() || !active) return;
    sendMessage(active.id, draft.trim(), attached ?? undefined);
    setDraft("");
    setAttached(null);
    setJustSent(true);
    window.setTimeout(() => setJustSent(false), 4000);
  }

  return (
    <>
      <header>
        <h1 className="ui-display text-xl text-ink">{t("messages.title")}</h1>
        <div className="ui-rule mt-3 w-16" />
      </header>

      <Card className="mt-6 flex min-h-[32rem] flex-col">
        {/* Pestañas de expediente */}
        <div
          role="tablist"
          aria-label={t("messages.selectCase")}
          className="ui-scroll-thin flex gap-1 overflow-x-auto border-b border-line px-2 pt-2"
        >
          {cases.map((c) => {
            const unread = unreadMessagesForCase(messages, c.id).length;
            const isActive = c.id === active.id;
            return (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveId(c.id)}
                className={`-mb-px flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-[0.8125rem] whitespace-nowrap transition-colors ${
                  isActive
                    ? "font-medium text-ink"
                    : "border-transparent text-ink-faint hover:text-ink"
                }`}
                style={isActive ? { borderBottomColor: areaColor } : undefined}
              >
                {/* El icono pinta con `currentColor`: el color del área lo
                    aporta el contenedor. */}
                <span
                  className="flex shrink-0"
                  style={{ color: AREAS[c.area].color }}
                  aria-hidden
                >
                  <AreaIcon area={c.area} className="h-3.5 w-3.5" />
                </span>
                {l(c.shortTitle)}
                {unread > 0 && (
                  <>
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                      aria-hidden
                    />
                    <span className="sr-only">{t("messages.unread")}</span>
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Cabecera de la conversación */}
        <div className="flex items-center gap-3 border-b border-line px-4 py-3 sm:px-5">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center text-xs font-medium text-white"
            style={{ backgroundColor: areaColor }}
            aria-hidden
          >
            {lawyer.initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">
              {lawyer.name}
            </p>
            <p className="truncate text-xs text-ink-faint">
              {l(active.title)} · {active.ref}
            </p>
          </div>
        </div>

        {/* Conversación */}
        <div className="ui-scroll-thin flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-5">
          {thread.length === 0 ? (
            <p className="text-sm text-ink-faint">{t("messages.empty")}</p>
          ) : (
            groups.map((group) => (
              <div key={group.day} className="space-y-3">
                <div className="flex items-center gap-3" role="separator">
                  <span className="h-px flex-1 bg-line" aria-hidden />
                  <span className="text-[0.6875rem] text-ink-faint">
                    {formatDate(group.day, locale)}
                  </span>
                  <span className="h-px flex-1 bg-line" aria-hidden />
                </div>

                {group.rows.map(({ message: m, showAuthor, isLast }) => {
                  const mine = m.from === "cliente";
                  const unread = !mine && !m.read;

                  const meta = (
                    <time
                      className="shrink-0 text-[0.6875rem] text-ink-faint"
                      dateTime={m.date}
                    >
                      {formatTime(m.date, locale)}
                      {isLast && <> · {relativeLabel(m.date, t)}</>}
                    </time>
                  );

                  if (mine) {
                    return (
                      <article key={m.id} className="flex justify-end">
                        <div className="max-w-[85%] min-w-0 bg-surface px-3.5 py-2.5">
                          <div className="flex items-baseline justify-end gap-2.5">
                            {showAuthor && (
                              <span className="text-xs font-medium text-ink">
                                {t("messages.you")}
                              </span>
                            )}
                            {meta}
                          </div>
                          <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink-soft">
                            {l(m.body)}
                          </p>
                          {m.attachment && (
                            <AttachmentCard
                              name={l(m.attachment.name)}
                              size={attachmentSize(m.attachment.meta)}
                            />
                          )}
                        </div>
                      </article>
                    );
                  }

                  return (
                    <article key={m.id} className="flex gap-2.5">
                      {showAuthor ? (
                        <span
                          className="flex h-7 w-7 shrink-0 items-center justify-center text-[0.625rem] font-medium text-white"
                          style={{ backgroundColor: areaColor }}
                          aria-hidden
                        >
                          {lawyer.initials}
                        </span>
                      ) : (
                        <span className="w-7 shrink-0" aria-hidden />
                      )}

                      <div
                        className={`max-w-[85%] min-w-0 border-l border-accent pl-3 ${
                          unread ? "bg-accent-wash py-2 pr-3" : ""
                        }`}
                      >
                        <div className="flex flex-wrap items-baseline gap-x-2.5">
                          {showAuthor && (
                            <span className="text-xs font-medium text-ink">
                              {m.authorName}
                            </span>
                          )}
                          {meta}
                          {unread && (
                            <span className="text-[0.625rem] font-semibold tracking-wide text-[#8A5A12] uppercase">
                              {t("messages.unread")}
                            </span>
                          )}
                        </div>
                        <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink-soft">
                          {l(m.body)}
                        </p>
                        {m.attachment && (
                          <AttachmentCard
                            name={l(m.attachment.name)}
                            size={attachmentSize(m.attachment.meta)}
                          />
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            ))
          )}
          <div ref={endRef} />
        </div>

        {/* Redacción */}
        <form onSubmit={send} className="border-t border-line p-4">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={t("messages.placeholder")}
            rows={3}
            className="w-full resize-none border border-line px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-accent"
          />

          {attached && (
            <p className="mt-2 flex items-center gap-2 border border-line bg-surface px-2.5 py-1.5 text-xs text-ink-muted">
              <DocIcon className="h-3.5 w-3.5 shrink-0" />
              <span className="min-w-0 flex-1 truncate">{attached}</span>
              <button
                type="button"
                onClick={() => setAttached(null)}
                aria-label={t("common.close")}
                className="shrink-0 text-ink-faint hover:text-ink"
              >
                ×
              </button>
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() =>
                setAttached(attached ? null : "documento-adjunto.pdf")
              }
              className="inline-flex items-center gap-1.5 text-xs text-ink-muted transition-colors hover:text-ink"
            >
              <ClipIcon className="h-4 w-4" />
              {t("messages.attach")}
            </button>

            <Button type="submit" disabled={!draft.trim()}>
              <SendIcon className="h-3.5 w-3.5" />
              {t("messages.send")}
            </Button>
          </div>

          {justSent && (
            <FinePrint className="mt-3 text-ink-muted">
              {t("messages.sentDemo")}
            </FinePrint>
          )}
        </form>
      </Card>
    </>
  );
}

/** Adjunto en una sola línea: icono, nombre truncado, tamaño y descarga. */
function AttachmentCard({ name, size }: { name: string; size: string }) {
  const { t } = useStore();
  return (
    <p className="mt-2 flex items-center gap-2 border border-line bg-white px-2.5 py-1.5">
      <DocIcon className="h-3.5 w-3.5 shrink-0 text-ink-faint" />
      <span className="min-w-0 flex-1 truncate text-xs text-ink-muted">
        {name}
      </span>
      <span className="shrink-0 text-[0.6875rem] whitespace-nowrap text-ink-faint">
        {size}
      </span>
      <button
        type="button"
        aria-label={t("common.download")}
        title={t("common.download")}
        className="shrink-0 text-ink-faint transition-colors hover:text-ink"
      >
        <DownloadIcon className="h-3.5 w-3.5" />
      </button>
    </p>
  );
}

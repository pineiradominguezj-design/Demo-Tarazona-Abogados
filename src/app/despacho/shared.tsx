"use client";

/**
 * Piezas comunes de la vista despacho.
 *
 * `useFirmData()` es la única fuente de los contadores: los números del menú
 * lateral y las listas que se despliegan en "Hoy" salen del mismo cálculo, así
 * que no pueden decir cosas distintas.
 *
 * El resto son los ladrillos del principio de diseño: todo plegado, todo se
 * abre en línea, y ninguna lista pasa de ocho elementos sin paginarse.
 */

import { useMemo, useState, type ReactNode } from "react";
import { INVOICES, PROVISIONS } from "@/lib/data";
import {
  CURRENT_USER_ID,
  FIRM_SETTINGS,
  getTeamMember,
  type FirmScope,
} from "@/lib/firm";
import { daysUntil } from "@/lib/format";
import { STATES } from "@/lib/states";
import { useStore } from "@/lib/store";
import type { Case, CaseAction, DocRequest, Message } from "@/lib/types";
import { CheckIcon, ChevronDown } from "@/components/icons";

/* ------------------------------------------------------------------ */
/* Datos                                                               */
/* ------------------------------------------------------------------ */

export interface Draft {
  action: CaseAction;
  file: Case;
  /** Publicado durante esta demostración. */
  published: boolean;
}

export interface DocToReview {
  request: DocRequest;
  file: Case;
  /** Nombre del archivo que envió el cliente, si lo hay. */
  fileName?: string;
}

export interface OpenThread {
  message: Message;
  file: Case;
  daysWaiting: number;
  /** Supera el plazo de respuesta que el despacho anuncia al cliente. */
  overdue: boolean;
}

export interface OverdueCharge {
  id: string;
  kind: "factura" | "provision";
  concept: { es: string; en: string };
  amount: number;
  dueDate: string;
  file: Case;
}

/** Días transcurridos desde una fecha pasada. */
export function daysSince(iso: string): number {
  return -daysUntil(iso);
}

export function useFirmData() {
  const { allCases, messages, publishedActionIds } = useStore();

  return useMemo(() => {
    /*
     * Borradores del escenario. `sessionDrafts` conserva también los que se
     * han publicado durante la visita: es lo que permite enseñar el antes y el
     * después sin que la fila desaparezca de la pantalla al pulsar Publicar.
     * `drafts` —los que de verdad esperan decisión— es lo que cuentan el menú
     * y la pantalla de Hoy.
     */
    const sessionDrafts: Draft[] = allCases
      .flatMap((file) =>
        file.actions
          .filter((a) => !a.published || publishedActionIds.includes(a.id))
          .map((action) => ({
            action,
            file,
            published: publishedActionIds.includes(action.id),
          })),
      )
      .sort((a, b) => b.action.date.localeCompare(a.action.date));

    const drafts = sessionDrafts.filter((d) => !d.published);

    /* --- Documentos que el cliente ya ha enviado y nadie ha mirado --- */
    const docsToReview: DocToReview[] = allCases
      .flatMap((file) =>
        file.docRequests
          .filter((r) => r.status === "revision" || r.status === "recibido")
          .map((request) => ({
            request,
            file,
            fileName: file.uploadedDocs.find(
              (u) => u.fulfillsRequestId === request.id,
            )?.name.es,
          })),
      )
      .sort((a, b) =>
        (b.request.submittedOn ?? b.request.requestedOn).localeCompare(
          a.request.submittedOn ?? a.request.requestedOn,
        ),
      );

    /* --- Conversaciones cuyo último mensaje lo escribió el cliente --- */
    const openThreads: OpenThread[] = allCases
      .map((file) => {
        const thread = messages
          .filter((m) => m.caseId === file.id)
          .sort((a, b) => a.date.localeCompare(b.date));
        const last = thread.at(-1);
        if (!last || last.from !== "cliente") return null;
        const waiting = daysSince(last.date);
        return {
          message: last,
          file,
          daysWaiting: waiting,
          overdue: waiting > FIRM_SETTINGS.responseDays,
        };
      })
      .filter((x): x is OpenThread => x !== null)
      .sort((a, b) => b.daysWaiting - a.daysWaiting);

    /* --- Expedientes parados --- */
    const staleCases: Case[] = allCases
      .filter((c) => daysSince(c.lastUpdate) > 30)
      .sort((a, b) => a.lastUpdate.localeCompare(b.lastUpdate));

    /* --- Dinero vencido, del despacho y de terceros --- */
    const byId = (id: string) => allCases.find((c) => c.id === id);
    const overdueCharges: OverdueCharge[] = [
      ...INVOICES.filter(
        (i) => i.status === "pendiente" && i.dueDate && daysUntil(i.dueDate) < 0,
      ).map((i) => ({
        id: i.id,
        kind: "factura" as const,
        concept: i.concept,
        amount: i.amount,
        dueDate: i.dueDate as string,
        file: byId(i.caseId),
      })),
      ...PROVISIONS.filter(
        (p) => p.status === "pendiente" && p.dueDate && daysUntil(p.dueDate) < 0,
      ).map((p) => ({
        id: p.id,
        kind: "provision" as const,
        concept: p.concept,
        amount: p.amount,
        dueDate: p.dueDate as string,
        file: byId(p.caseId),
      })),
    ]
      .filter((x): x is OverdueCharge => x.file !== undefined)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

    return {
      drafts,
      sessionDrafts,
      docsToReview,
      openThreads,
      staleCases,
      overdueCharges,
      /** Los que ya han rebasado el plazo que el despacho promete. */
      overdueThreads: openThreads.filter((o) => o.overdue),
    };
  }, [allCases, messages, publishedActionIds]);
}

/* ------------------------------------------------------------------ */
/* Tablero de Hoy                                                      */
/* ------------------------------------------------------------------ */

/**
 * En qué situación está un expediente, en tres escalones. Es la misma
 * clasificación que pinta la barra segmentada y los puntos de cada fila: si
 * se calculara dos veces, la barra podría decir «atrasado» donde la fila no
 * enseña el punto rojo.
 */
export type BoardState = "ok" | "pending" | "late";

export interface BoardRow {
  file: Case;
  drafts: Draft[];
  docs: DocToReview[];
  threads: OpenThread[];
  charges: OverdueCharge[];
  stale: boolean;
  state: BoardState;
}

/**
 * Una línea del panel de pendientes. Es una unión discriminada para que cada
 * clase traiga consigo el dato que necesita pintar —el borrador, el documento,
 * el mensaje— en lugar de aplanarlo todo a texto aquí.
 *
 * `rank` es la urgencia: lo vencido primero, los borradores al final. Un
 * mensaje sube de escalón cuando rebasa el plazo de respuesta que el despacho
 * anuncia al cliente.
 */
export type QueueItem = { id: string; rank: number; file: Case; date: string } & (
  | { kind: "charge"; charge: OverdueCharge }
  | { kind: "thread"; thread: OpenThread }
  | { kind: "stale" }
  | { kind: "doc"; doc: DocToReview }
  | { kind: "draft"; draft: Draft }
);

/**
 * El tablero de Hoy: una fila por expediente, el recuento de los tres estados
 * y la cola de pendientes, todo ya filtrado por el alcance elegido.
 *
 * Sale entero de `useFirmData`, que sigue siendo la única fuente de los
 * contadores: aquí solo se reparte por expediente y se ordena por urgencia.
 */
export function useBoard(scope: FirmScope) {
  const { allCases } = useStore();
  const d = useFirmData();

  return useMemo(() => {
    const cases =
      scope === "mine"
        ? allCases.filter((c) => c.lawyerId === CURRENT_USER_ID)
        : allCases;
    const ids = new Set(cases.map((c) => c.id));

    const rows: BoardRow[] = cases.map((file) => {
      const drafts = d.drafts.filter((x) => x.file.id === file.id);
      const docs = d.docsToReview.filter((x) => x.file.id === file.id);
      const threads = d.openThreads.filter((x) => x.file.id === file.id);
      const charges = d.overdueCharges.filter((x) => x.file.id === file.id);
      const stale = d.staleCases.some((c) => c.id === file.id);

      /* Rojo es haber rebasado algo: dinero vencido, un mensaje fuera del
         plazo prometido o un expediente parado. Ámbar es tener trabajo
         esperando pero dentro de tiempo. */
      const late = charges.length > 0 || threads.some((x) => x.overdue) || stale;
      const state: BoardState = late
        ? "late"
        : drafts.length > 0 || docs.length > 0 || threads.length > 0
          ? "pending"
          : "ok";

      return { file, drafts, docs, threads, charges, stale, state };
    });

    /* Lo urgente arriba. El tablero se lee de arriba abajo y se pagina de ocho
       en ocho, así que el orden decide qué se ve sin desplazarse: un atrasado
       en la segunda página es un atrasado que nadie mira. A igualdad de estado
       manda la antigüedad de la última actuación. */
    const ORDER: Record<BoardState, number> = { late: 0, pending: 1, ok: 2 };
    rows.sort(
      (a, b) =>
        ORDER[a.state] - ORDER[b.state] ||
        a.file.lastUpdate.localeCompare(b.file.lastUpdate),
    );

    const queue: QueueItem[] = [
      ...d.overdueCharges
        .filter((c) => ids.has(c.file.id))
        .map((charge) => ({
          id: `q-${charge.id}`,
          kind: "charge" as const,
          rank: 0,
          file: charge.file,
          date: charge.dueDate,
          charge,
        })),
      ...d.openThreads
        .filter((x) => ids.has(x.file.id))
        .map((thread) => ({
          id: `q-${thread.message.id}`,
          kind: "thread" as const,
          rank: thread.overdue ? 1 : 3,
          file: thread.file,
          date: thread.message.date,
          thread,
        })),
      ...d.staleCases
        .filter((c) => ids.has(c.id))
        .map((file) => ({
          id: `q-stale-${file.id}`,
          kind: "stale" as const,
          rank: 2,
          file,
          date: file.lastUpdate,
        })),
      ...d.docsToReview
        .filter((x) => ids.has(x.file.id))
        .map((doc) => ({
          id: `q-${doc.request.id}`,
          kind: "doc" as const,
          rank: 3,
          file: doc.file,
          date: doc.request.submittedOn ?? doc.request.requestedOn,
          doc,
        })),
      ...d.drafts
        .filter((x) => ids.has(x.file.id))
        .map((draft) => ({
          id: `q-${draft.action.id}`,
          kind: "draft" as const,
          rank: 4,
          file: draft.file,
          date: draft.action.date,
          draft,
        })),
    ].sort((a, b) => a.rank - b.rank || a.date.localeCompare(b.date));

    return {
      rows,
      queue,
      active: cases.length,
      counts: {
        ok: rows.filter((r) => r.state === "ok").length,
        pending: rows.filter((r) => r.state === "pending").length,
        late: rows.filter((r) => r.state === "late").length,
      },
    };
  }, [allCases, d, scope]);
}

/** Quién lleva el expediente, como miembro del equipo. */
export function ownerOf(file: Case) {
  return getTeamMember(file.lawyerId);
}

export function ownerName(file: Case): string {
  return ownerOf(file)?.name ?? "—";
}

/* ------------------------------------------------------------------ */
/* Cabecera de sección                                                 */
/* ------------------------------------------------------------------ */

export function SectionHeader({
  title,
  intro,
  preview = false,
  action,
}: {
  title: string;
  intro?: string;
  /** Marca las secciones que son solo maqueta. */
  preview?: boolean;
  action?: ReactNode;
}) {
  return (
    <header className="mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="ui-display text-xl text-ink">{title}</h1>
          {/* El distintivo se queda; la frase que lo explicaba, no. Es una
              pantalla que se enseña a un despacho, y bastaba con la marca. */}
          {preview && <PreviewTag />}
        </div>
        {action}
      </div>
      <div className="ui-rule mt-3 w-16" />
      {intro && (
        <p className="mt-4 max-w-2xl text-sm text-ink-muted">{intro}</p>
      )}
    </header>
  );
}

/**
 * Distintivo de "vista previa". No usa el ámbar de estado ni un color de área:
 * no habla del asunto, habla del grado de acabado de la pantalla.
 */
export function PreviewTag({
  className = "",
  compact = false,
}: {
  className?: string;
  /** Sin espaciado de letras, para el menú, donde compite por el sitio. */
  compact?: boolean;
}) {
  const { t } = useStore();
  return (
    <span
      className={`inline-flex shrink-0 items-center border border-dashed border-ink-faint/50 px-1.5 py-0.5 text-[0.5625rem] font-medium uppercase text-ink-faint ${
        compact ? "tracking-normal" : "tracking-[0.14em]"
      } ${className}`}
    >
      {t("firm.preview")}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Fila plegable                                                       */
/* ------------------------------------------------------------------ */

/**
 * El patrón que rige toda la vista: una línea compacta que se abre en su
 * sitio. `leading` queda fuera del botón para poder poner ahí una casilla sin
 * anidar controles.
 */
export function Collapsible({
  summary,
  children,
  leading,
  accent,
  defaultOpen = false,
}: {
  summary: ReactNode;
  children: ReactNode;
  leading?: ReactNode;
  /** Color del área, como filo izquierdo. */
  accent?: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className="border-l-2 bg-white transition-colors"
      style={{ borderLeftColor: open ? (accent ?? "#EBB439") : "transparent" }}
    >
      <div className="flex items-center gap-3 pr-3">
        {leading && <div className="pl-3">{leading}</div>}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className={`flex min-w-0 flex-1 items-center gap-3 py-3 text-left transition-colors hover:bg-surface/70 ${
            leading ? "" : "pl-3"
          }`}
        >
          <span className="min-w-0 flex-1">{summary}</span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-ink-faint transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>
      {open && (
        <div className="border-t border-line bg-surface/60 px-4 py-4">
          {children}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Paginación                                                          */
/* ------------------------------------------------------------------ */

const PAGE_SIZE = 8;

/**
 * Nada de scroll infinito: pasadas ocho líneas la lista se pagina. Devuelve
 * también el `Pager` ya montado para no repetirlo en cada sección.
 */
export function usePaged<T>(items: T[], size = PAGE_SIZE) {
  const [page, setPage] = useState(0);
  const pages = Math.max(1, Math.ceil(items.length / size));
  const current = Math.min(page, pages - 1);
  const slice = items.slice(current * size, current * size + size);

  return {
    slice,
    pager:
      pages > 1 ? (
        <Pager page={current} pages={pages} onChange={setPage} />
      ) : null,
  };
}

function Pager({
  page,
  pages,
  onChange,
}: {
  page: number;
  pages: number;
  onChange: (p: number) => void;
}) {
  const { t } = useStore();
  const btn =
    "px-3 py-1.5 text-xs text-ink-muted transition-colors hover:text-ink disabled:cursor-not-allowed disabled:text-line";

  return (
    <div className="mt-3 flex items-center justify-end gap-2">
      <button
        type="button"
        className={btn}
        disabled={page === 0}
        onClick={() => onChange(page - 1)}
      >
        {t("firm.pagePrev")}
      </button>
      <span className="text-xs tabular-nums text-ink-faint">
        {t("firm.pageOf", { a: page + 1, b: pages })}
      </span>
      <button
        type="button"
        className={btn}
        disabled={page >= pages - 1}
        onClick={() => onChange(page + 1)}
      >
        {t("firm.pageNext")}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Controles pequeños                                                  */
/* ------------------------------------------------------------------ */

export function Check({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: ReactNode;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-ink-soft">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-3.5 w-3.5 shrink-0 accent-accent-dark"
      />
      {label}
    </label>
  );
}

/** Interruptor. Un `switch` de verdad, para que se anuncie como tal. */
export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-ink-soft">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
          checked ? "bg-accent" : "bg-line"
        }`}
      >
        {/* `left-0` no es decorativo. Sin él la bolita queda `absolute` sin
            origen horizontal, así que arranca de su posición estática: como
            `button` trae `text-align: center` del navegador, ese punto son los
            18 px del centro de la pista, y el `translate` se suma encima. La
            bolita apagada se iba al borde derecho —el interruptor parecía
            encendido— y la encendida se salía de la pista.
            Con el origen en 0, el recorrido es 36 − 16 − 2·2 = 18 px. */}
        <span
          className={`absolute top-0.5 left-0 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
            checked ? "translate-x-[1.125rem]" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

export function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1">
      <span className="ui-eyebrow text-ink-faint">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-0 border border-line bg-white px-2.5 py-1.5 text-xs text-ink"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/** Botón pequeño de acción directa, el que va al final de cada línea. */
export function MiniButton({
  tone = "neutral",
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: "neutral" | "primary" | "danger";
}) {
  const styles = {
    neutral:
      "border-ink/15 text-ink-muted hover:border-ink hover:text-ink",
    primary: "border-ink bg-ink text-white hover:bg-ink-soft",
    danger: "border-[#A33A3A]/30 text-[#A33A3A] hover:border-[#A33A3A]",
  }[tone];

  return (
    <button
      type="button"
      {...rest}
      className={`inline-flex shrink-0 items-center gap-1.5 border px-2.5 py-1 text-[0.6875rem] font-medium tracking-wide whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${styles} ${className}`}
    />
  );
}

/** Confirmación en línea tras una acción. Desaparece al recargar; es una demo. */
export function Done({ children }: { children: ReactNode }) {
  const s = STATES.done;
  return (
    <p
      className="mt-3 flex items-center gap-2 px-3 py-2 text-xs"
      style={{ backgroundColor: s.bg, color: s.fg }}
    >
      <CheckIcon className="h-3.5 w-3.5 shrink-0" />
      {children}
    </p>
  );
}


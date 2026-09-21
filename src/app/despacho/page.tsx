"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Card, PhaseBarMini } from "@/components/ui";
import { CheckIcon, ChevronDown } from "@/components/icons";
import { AREAS } from "@/config/areas";
import type { FirmScope } from "@/lib/firm";
import type { TKey } from "@/lib/i18n";
import { TODAY, getClientById } from "@/lib/data";
import { formatCurrency, formatDate, formatDateFull } from "@/lib/format";
import { STATES } from "@/lib/states";
import { useL, useStore } from "@/lib/store";
import {
  MiniButton,
  SectionHeader,
  useBoard,
  usePaged,
  type BoardRow,
  type BoardState,
  type QueueItem,
} from "./shared";

/**
 * Pantalla de entrada del despacho.
 *
 * Es un tablero, no una bandeja: sin pulsar nada hay que poder decir cómo va
 * el despacho. La línea de estado da la forma del conjunto, el tablero de la
 * izquierda va expediente por expediente, y la columna de la derecha dice qué
 * hacer ahora. Ninguna de las tres tiene párrafos: el detalle está a un clic,
 * dentro de la fila que lo tiene.
 *
 * Aquí el color significa **una sola cosa: urgencia**. El área no pinta —ni la
 * fila, ni la barra de fases—, porque tres sistemas de color a la vez hacían
 * que el granate de penal se leyera como una alerta cuando el expediente iba
 * perfectamente. El área sigue estando, en texto gris junto al asunto.
 */
export default function TodayPage() {
  const { t, locale, firmScope, setFirmScope } = useStore();
  const { rows, queue, counts, active } = useBoard(firmScope);

  return (
    <>
      {/*
        La hora sale del reloj real —es a quien está delante de la pantalla a
        quien se saluda—; la fecha es la del escenario (`TODAY`), para que no
        discuta con los "hace N días" de las listas.

        Leer el reloj durante el render sería un descuadre de hidratación en
        cualquier otra pantalla, pero `despacho/layout.tsx` no monta a sus
        hijos hasta que el almacén está hidratado, así que esto solo se
        ejecuta en el navegador. Si algún día se quita esa guarda, hay que
        mover este cálculo a un efecto.
      */}
      {/* El recuento de asuntos vivía aquí; ahora lo abre la línea de estado,
          que es donde se compara con los pendientes y los atrasados. Repetirlo
          en las dos líneas seguidas solo hacía ruido. */}
      <p className="mb-3 text-sm">
        <span className="text-ink">{t(greetingKey())}</span>
        <span className="text-ink-faint">
          {" · "}
          {formatDateFull(TODAY, locale)}
        </span>
      </p>

      <SectionHeader
        title={t("firm.todayTitle")}
        action={<ScopeSwitch value={firmScope} onChange={setFirmScope} />}
      />

      <StatusLine counts={counts} active={active} />

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Board rows={rows} queue={queue} />
        <QueuePanel queue={queue} />
      </div>
    </>
  );
}

/** Saludo según la hora real de quien está delante. */
function greetingKey() {
  const h = new Date().getHours();
  if (h < 14) return "firm.greetingMorning" as const;
  if (h < 20) return "firm.greetingAfternoon" as const;
  return "firm.greetingEvening" as const;
}

/* ------------------------------------------------------------------ */
/* Color de estado                                                     */
/* ------------------------------------------------------------------ */

/**
 * El color del tablero, y el único que hay. Dos estados pintan y el tercero
 * no: si «al día» tuviera su verde, las filas volverían a ser un semáforo y el
 * ojo tendría que descartar color para encontrar lo urgente. Al día es la
 * ausencia de color.
 *
 * `edge` es el filo de la fila y `text` el rótulo. No son el mismo tono a
 * propósito: el ámbar de marca (`#EBB439`) sobre blanco no llega al contraste
 * mínimo para texto, así que el rótulo usa la tinta oscura de `STATES`.
 */
const TONE: Record<BoardState, { edge: string; text: string } | null> = {
  late: { edge: STATES.alert.dot, text: STATES.alert.fg },
  pending: { edge: STATES.pending.dot, text: STATES.pending.fg },
  ok: null,
};

/* ------------------------------------------------------------------ */
/* Cabecera                                                            */
/* ------------------------------------------------------------------ */

function ScopeSwitch({
  value,
  onChange,
}: {
  value: FirmScope;
  onChange: (v: FirmScope) => void;
}) {
  const { t } = useStore();
  const options = [
    { id: "all" as const, label: t("firm.scopeAll") },
    { id: "mine" as const, label: t("firm.scopeMine") },
  ];

  return (
    <div className="inline-flex border border-line bg-white">
      {options.map((o) => {
        const on = value === o.id;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            aria-pressed={on}
            className={`px-3 py-1.5 text-[0.6875rem] font-medium tracking-[0.08em] uppercase transition-colors ${
              on
                ? "bg-accent-wash text-ink"
                : "text-ink-faint hover:text-ink"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Línea de estado                                                     */
/* ------------------------------------------------------------------ */

/**
 * La forma del despacho en una frase: «5 asuntos activos · 3 con algo
 * pendiente · 1 atrasado».
 *
 * Sustituye a la barra segmentada de bloques de color. La barra daba la
 * proporción, pero para decir tres números gastaba una franja entera de verde,
 * ámbar y rojo, y ese rojo pesaba más que el de las filas que de verdad iban
 * atrasadas. Aquí el único color es el número de atrasados; los demás son
 * texto. Si no hay nada pendiente ni atrasado, la frase lo dice y se acabó.
 */
function StatusLine({
  counts,
  active,
}: {
  counts: Record<BoardState, number>;
  active: number;
}) {
  const { t } = useStore();

  return (
    <p className="text-sm text-ink-faint">
      <span className="text-ink">
        {active === 1
          ? t("firm.activeCasesOne")
          : t("firm.activeCases", { n: active })}
      </span>

      {counts.pending > 0 && (
        <>
          {" · "}
          <span className="tabular-nums">{counts.pending}</span>{" "}
          {t("firm.statePending")}
        </>
      )}

      {counts.late > 0 && (
        <>
          {" · "}
          <span
            className="font-medium tabular-nums"
            style={{ color: STATES.alert.fg }}
          >
            {counts.late}
          </span>{" "}
          {counts.late === 1 ? t("firm.stateLateOne") : t("firm.stateLate")}
        </>
      )}

      {counts.pending === 0 && counts.late === 0 && (
        <>
          {" · "}
          {t("firm.allClear")}
        </>
      )}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Tablero de expedientes                                              */
/* ------------------------------------------------------------------ */

function Board({ rows, queue }: { rows: BoardRow[]; queue: QueueItem[] }) {
  const { t } = useStore();
  const [open, setOpen] = useState<string | null>(null);
  const { slice, pager } = usePaged(rows);

  /* `min-w-0`: una celda de rejilla no baja por defecto del ancho mínimo de
     su contenido, y aquí dentro hay texto que no parte. Sin esto las dos
     columnas empujan la página a lo ancho en móvil en vez de recortar. */
  return (
    <section className="min-w-0 lg:col-span-2">
      <h2 className="ui-eyebrow mb-2 text-ink-faint">
        {t("firm.boardTitle")}
      </h2>

      <Card>
        {rows.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-ink-faint">
            {t("firm.boardEmpty")}
          </p>
        ) : (
          <ul>
            {slice.map((row, i) => (
              <CaseRow
                key={row.file.id}
                row={row}
                items={queue.filter((q) => q.file.id === row.file.id)}
                /* `useBoard` ya devuelve las filas ordenadas por urgencia, así
                   que los «al día» son siempre la cola de la lista: basta con
                   marcar dónde empiezan para separarlos con una línea. */
                startsQuiet={row.state === "ok" && slice[i - 1]?.state !== "ok"}
                open={open === row.file.id}
                onToggle={() =>
                  setOpen((o) => (o === row.file.id ? null : row.file.id))
                }
              />
            ))}
          </ul>
        )}
      </Card>
      {pager}
    </section>
  );
}

/**
 * Una fila por expediente: filo de estado, asunto con su área en gris,
 * cliente, la barra de fases del portal del cliente en escala de grises y el
 * rótulo de lo que tiene pendiente. Sin una línea de prosa: lo que hay que
 * hacer con este expediente se despliega debajo al pulsar.
 */
function CaseRow({
  row,
  items,
  startsQuiet,
  open,
  onToggle,
}: {
  row: BoardRow;
  items: QueueItem[];
  startsQuiet: boolean;
  open: boolean;
  onToggle: () => void;
}) {
  const l = useL();
  const client = getClientById(row.file.clientId);
  const tone = TONE[row.state];
  const quiet = row.state === "ok";

  return (
    <li
      /* El filo siempre mide 3 px, tenga color o no: si los «al día» no
         reservaran el hueco, su texto quedaría desalineado con el de las filas
         de arriba y la columna se vería rota. */
      className={`border-b border-l-[3px] border-line last:border-b-0 ${
        startsQuiet ? "border-t-2 border-t-line" : ""
      }`}
      style={{ borderLeftColor: tone?.edge ?? "transparent" }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-4 px-4 py-4 text-left transition-colors hover:bg-surface/60"
      >
        <span className="min-w-0 flex-1">
          <span className="flex items-baseline gap-2">
            <span
              className={`truncate text-sm font-medium ${
                quiet ? "text-ink-muted" : "text-ink"
              }`}
            >
              {l(row.file.shortTitle)}
            </span>
            {/* El área ya no pinta la fila; sigue estando, pero como dato. */}
            <span className="hidden shrink-0 text-[0.6875rem] text-ink-faint sm:block">
              {l(AREAS[row.file.area].label)}
            </span>
          </span>
          <span className="mt-0.5 block truncate text-xs text-ink-faint">
            {client?.name}
          </span>
        </span>

        {/* Debajo de `lg` la barra de fases se retira: comprimida no dice
            nada, y lo que no puede leerse es ruido. */}
        <span className="hidden w-60 shrink-0 lg:block">
          <PhaseBarMini
            phases={row.file.phases}
            current={row.file.currentPhase}
            area={row.file.area}
            tone="mute"
          />
        </span>

        <PendingLabel row={row} />

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-ink-faint transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && <CaseDetail row={row} items={items} />}
    </li>
  );
}

/**
 * Qué tiene pendiente la fila, en palabras: «1 borrador · 1 documento».
 *
 * Sustituye a los puntos de color, que obligaban a recordar de memoria qué
 * significaba cada uno —y el `title` solo aparecía al pasar el ratón, así que
 * de un vistazo no decían nada—. Con más de dos tipos la enumeración deja de
 * caber, y entonces se resume en el total: «4 pendientes».
 *
 * El orden es el de urgencia, el mismo de la cola de la derecha: primero el
 * dinero vencido, luego los mensajes, después los documentos del cliente y por
 * último los borradores del despacho.
 */
function PendingLabel({ row }: { row: BoardRow }) {
  const { t } = useStore();

  const parts: string[] = [];
  let total = 0;

  const add = (n: number, one: TKey, many: TKey) => {
    if (n === 0) return;
    total += n;
    parts.push(n === 1 ? t(one) : t(many, { n }));
  };

  add(row.charges.length, "firm.countOverdueOne", "firm.countOverdue");
  add(row.threads.length, "firm.countMessageOne", "firm.countMessage");
  add(row.docs.length, "firm.countDocOne", "firm.countDoc");
  add(row.drafts.length, "firm.countDraftOne", "firm.countDraft");

  /* Un expediente parado puede no tener nada en ninguna lista y aun así estar
     atrasado: lo que le pasa es justamente que no pasa nada. */
  if (parts.length === 0 && row.stale) parts.push(t("firm.countStale"));

  /* Reserva el hueco aunque no haya nada que decir, para que los rótulos de
     todas las filas caigan en la misma columna. */
  if (parts.length === 0) return <span className="w-32 shrink-0 lg:w-44" />;

  const text =
    parts.length > 2 ? t("firm.countPending", { n: total }) : parts.join(" · ");

  return (
    <span
      className="w-32 shrink-0 truncate text-right text-[0.6875rem] font-medium lg:w-44"
      style={{ color: TONE[row.state]?.text }}
      title={text}
    >
      {text}
    </span>
  );
}

/**
 * Lo que se despliega bajo una fila: sus pendientes con la acción de cada uno
 * y el salto al portal, que es el momento que se enseña en la demostración.
 */
function CaseDetail({ row, items }: { row: BoardRow; items: QueueItem[] }) {
  const { t, locale } = useStore();

  return (
    <div className="border-t border-line bg-surface/60 px-4 py-3">
      {items.length > 0 && (
        <ul className="divide-y divide-line/70">
          {items.map((item) => (
            <QueueLine key={item.id} item={item} showClient={false} />
          ))}
        </ul>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-ink-faint">
          {t("firm.lastUpdateWas")}: {formatDate(row.file.lastUpdate, locale)}
        </span>
        <Link
          href={`/asuntos/${row.file.id}`}
          className="inline-flex shrink-0 items-center border border-ink/15 px-2.5 py-1 text-[0.6875rem] font-medium tracking-wide whitespace-nowrap text-ink-muted transition-colors hover:border-ink hover:text-ink"
        >
          {t("firm.viewAsClient")}
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Panel de pendientes                                                 */
/* ------------------------------------------------------------------ */

function QueuePanel({ queue }: { queue: QueueItem[] }) {
  const { t } = useStore();
  const { slice, pager } = usePaged(queue);

  /* `min-w-0` por lo mismo que el tablero: las frases de cada pendiente son
     largas y con `truncate`, y sin esto ensanchan la rejilla en vez de
     recortarse. */
  return (
    <aside className="min-w-0">
      <h2 className="ui-eyebrow mb-2 text-ink-faint">
        {t("firm.queueTitle")}
      </h2>

      <Card>
        {queue.length === 0 ? (
          <QueueEmpty />
        ) : (
          <div className="px-3 py-1">
            {groupQueue(slice).map(([group, items]) => (
              <section key={group} className="py-2">
                <h3 className="ui-eyebrow py-1 text-ink-faint">
                  {t(GROUP_LABEL[group])}
                </h3>
                <ul className="divide-y divide-line">
                  {items.map((item) => (
                    <QueueLine key={item.id} item={item} />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </Card>
      {pager}
    </aside>
  );
}

/** Los cuatro verbos de la cola. El encabezado dice qué se va a hacer. */
type QueueGroup = "collect" | "reply" | "review" | "publish";

const GROUP_LABEL: Record<QueueGroup, TKey> = {
  collect: "firm.actionCollect",
  reply: "firm.actionReply",
  review: "firm.actionReview",
  publish: "firm.publish",
};

/**
 * Un expediente parado va con «Publicar» y no en un grupo propio: lo que le
 * falta es exactamente eso, que el despacho publique algo. Su botón lleva a
 * Actualizaciones en vez de publicar en el sitio, porque no hay borrador
 * hecho que soltar.
 */
function groupOf(item: QueueItem): QueueGroup {
  switch (item.kind) {
    case "charge":
      return "collect";
    case "thread":
      return "reply";
    case "doc":
      return "review";
    case "draft":
    case "stale":
      return "publish";
  }
}

/**
 * Agrupa conservando el orden de urgencia. `slice` ya viene ordenado por
 * `rank`, y un `Map` recuerda el orden de inserción, así que cada grupo acaba
 * colocado donde le puso su miembro más urgente: el grupo que contiene lo más
 * apremiante sale primero, sin necesidad de volver a ordenar.
 */
function groupQueue(items: QueueItem[]): [QueueGroup, QueueItem[]][] {
  const map = new Map<QueueGroup, QueueItem[]>();
  for (const item of items) {
    const g = groupOf(item);
    const bucket = map.get(g);
    if (bucket) bucket.push(item);
    else map.set(g, [item]);
  }
  return [...map.entries()];
}

/**
 * Una línea de pendiente: una frase y la acción que le corresponde. Publicar
 * se hace aquí mismo; lo que exige ver el documento o el hilo entero lleva a
 * su sección.
 *
 * Ya no lleva icono a la izquierda. El icono repetía en color lo que el
 * encabezado del grupo dice en palabras, y cinco iconos distintos apilados
 * convertían la columna en un muestrario. Todos los botones comparten estilo
 * salvo «Publicar», que es la acción que se ejecuta sin salir de la pantalla y
 * la única que va en primario.
 */
function QueueLine({
  item,
  showClient = true,
}: {
  item: QueueItem;
  showClient?: boolean;
}) {
  const { t, locale, publishAction } = useStore();
  const l = useL();

  /* Solo el nombre de pila. Es la pantalla interna y la columna es estrecha:
     el apellido se come el sitio de lo que de verdad distingue la línea. */
  const who = getClientById(item.file.clientId)?.name.split(" ")[0] ?? "";

  let text = "";
  let action: ReactNode = null;

  switch (item.kind) {
    case "charge":
      text = `${l(item.charge.concept)} · ${formatCurrency(item.charge.amount, locale)}`;
      action = <GoTo href="/despacho/economico">{t("firm.actionOpen")}</GoTo>;
      break;
    case "thread":
      text = l(item.thread.message.body);
      action = <GoTo href="/despacho/mensajes">{t("firm.actionReply")}</GoTo>;
      break;
    case "stale":
      text = t("firm.cardStale");
      action = (
        <GoTo href="/despacho/actualizaciones">{t("firm.actionOpen")}</GoTo>
      );
      break;
    case "doc":
      text = l(item.doc.request.name);
      action = <GoTo href="/despacho/documentos">{t("firm.actionReview")}</GoTo>;
      break;
    case "draft": {
      /* El id se saca del `item` antes del cierre: dentro de la función que
         escucha el clic, TypeScript ya no conserva el estrechamiento. */
      const actionId = item.draft.action.id;
      text = l(item.draft.action.title);
      action = (
        <MiniButton tone="primary" onClick={() => publishAction(actionId)}>
          {t("firm.publish")}
        </MiniButton>
      );
      break;
    }
  }

  return (
    <li className="flex items-center gap-2.5 py-2.5">
      <span className="min-w-0 flex-1 truncate text-xs text-ink">
        {showClient && <span className="text-ink-faint">{who} · </span>}
        {text}
      </span>
      {action}
    </li>
  );
}

/** Nada esperando. El tic y dos sitios a los que ir, sin explicaciones. */
function QueueEmpty() {
  const { t } = useStore();
  const s = STATES.done;

  return (
    <div className="px-4 py-10 text-center">
      <span
        className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full"
        style={{ backgroundColor: s.bg, color: s.fg }}
      >
        <CheckIcon className="h-5 w-5" />
      </span>
      <p className="text-sm text-ink">{t("firm.allClear")}</p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <GoTo href="/despacho/actualizaciones">{t("firm.navUpdates")}</GoTo>
        <GoTo href="/despacho/documentos">{t("firm.navDocs")}</GoTo>
      </div>
    </div>
  );
}

/**
 * Acción directa que es navegación, no mutación. El `href` se declara como
 * unión de literales para que las rutas tipadas de Next sigan comprobándolo.
 */
function GoTo({
  href,
  children,
}: {
  href:
    | "/despacho/actualizaciones"
    | "/despacho/documentos"
    | "/despacho/mensajes"
    | "/despacho/economico";
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex shrink-0 items-center border border-ink/15 px-2.5 py-1 text-[0.6875rem] font-medium tracking-wide whitespace-nowrap text-ink-muted transition-colors hover:border-ink hover:text-ink"
    >
      {children}
    </Link>
  );
}

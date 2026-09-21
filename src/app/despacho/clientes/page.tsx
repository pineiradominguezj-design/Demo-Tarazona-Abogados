"use client";

import { useState } from "react";
import { AreaBadge, StatePill } from "@/components/ui";
import { CLIENTS } from "@/lib/data";
import { formatDate, formatDateShort, formatDateTime } from "@/lib/format";
import { getClientAccess, type AccessStatus } from "@/lib/firm";
import type { TKey } from "@/lib/i18n";
import type { StateTone } from "@/lib/states";
import { useL, useStore } from "@/lib/store";
import type { AuthorizedPerson, Case, Client } from "@/lib/types";
import {
  Collapsible,
  Done,
  MiniButton,
  SectionHeader,
  ownerOf,
  usePaged,
} from "../shared";

/**
 * Clientes y accesos.
 *
 * Aquí no se gestionan expedientes: se gestiona *quién entra al portal y qué
 * ve*. Por eso las acciones son de acceso —alta, baja, invitación, contraseña,
 * suspensión de un expediente concreto— y nada más.
 *
 * Ninguna de ellas toca el almacén: en una demostración sin backend, "reenviar
 * invitación" no puede hacer nada de verdad, y fingir lo contrario sería peor
 * que decirlo. Se confirman en línea y se quedan en la pantalla.
 */

const ACCESS_TONE: Record<AccessStatus, StateTone> = {
  activo: "done",
  invitado: "pending",
  suspendido: "alert",
};

const ACCESS_LABEL: Record<AccessStatus, TKey> = {
  activo: "firm.accessActivo",
  invitado: "firm.accessInvitado",
  suspendido: "firm.accessSuspendido",
};

export default function ClientsPage() {
  const { t } = useStore();
  const { slice, pager } = usePaged(CLIENTS);

  return (
    <>
      <SectionHeader title={t("firm.clientsTitle")} />

      {/* Cabecera de tabla solo en pantalla ancha: en móvil cada fila ya se
          explica sola y una rejilla de seis columnas no cabe. */}
      <div className="hidden border-b border-line px-3 pb-2 lg:flex lg:items-center lg:gap-3">
        <span className="ui-eyebrow flex-1 truncate text-ink-faint">
          {t("firm.colClient")}
        </span>
        <span className="ui-eyebrow w-[16rem] truncate text-ink-faint">
          {t("firm.colCases")}
        </span>
        <span className="ui-eyebrow w-32 truncate text-ink-faint">
          {t("firm.colOwner")}
        </span>
        <span className="ui-eyebrow w-24 truncate text-ink-faint">
          {t("firm.colAccess")}
        </span>
        <span className="ui-eyebrow w-36 truncate text-ink-faint">
          {t("firm.colLastAccess")}
        </span>
        {/* Hueco del chevron de cada fila, para que las columnas cuadren. */}
        <span className="w-7" aria-hidden />
      </div>

      <div className="divide-y divide-line border-b border-line">
        {slice.map((client) => (
          <ClientRow key={client.id} client={client} />
        ))}
      </div>
      {pager}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Fila de cliente                                                     */
/* ------------------------------------------------------------------ */

function ClientRow({ client }: { client: Client }) {
  const { t, locale, allCases } = useStore();
  const files = allCases.filter((c) => c.clientId === client.id);
  const access = getClientAccess(client.id);
  const [status, setStatus] = useState<AccessStatus>(access?.status ?? "activo");
  const [done, setDone] = useState<string | null>(null);

  return (
    <Collapsible
      summary={
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5 lg:flex-nowrap">
          <span className="min-w-[10rem] flex-1 truncate text-sm font-medium text-ink">
            {client.name}
          </span>

          <span className="flex w-[16rem] shrink-0 flex-wrap items-center gap-1">
            {files.map((f) => (
              <AreaBadge key={f.id} area={f.area} size="sm" />
            ))}
          </span>

          <span className="w-32 shrink-0 text-xs text-ink-faint">
            {[...new Set(files.map((f) => ownerOf(f)?.initials))]
              .filter(Boolean)
              .join(" · ")}
          </span>

          <span className="w-24 shrink-0">
            <StatePill tone={ACCESS_TONE[status]}>
              {t(ACCESS_LABEL[status])}
            </StatePill>
          </span>

          <span className="w-36 shrink-0 text-xs text-ink-faint">
            {status === "invitado"
              ? t("firm.neverEntered")
              : formatDateShort(client.lastAccess, locale)}
          </span>
        </span>
      }
    >
      <div className="space-y-5">
        {/* --- Acceso al portal --- */}
        <div>
          <p className="mb-3 text-xs text-ink-muted">
            {t("firm.clientCode")}:{" "}
            <span className="font-medium tracking-wide text-ink">
              {access?.code}
            </span>
            {access && (
              <span className="text-ink-faint">
                {" · "}
                {t("firm.colSince")} {formatDate(access.invitedOn, locale)}
              </span>
            )}
          </p>

          <div className="flex flex-wrap gap-2">
            {status === "activo" ? (
              <MiniButton
                tone="danger"
                onClick={() => {
                  setStatus("suspendido");
                  setDone(t("firm.accessRevoke"));
                }}
              >
                {t("firm.accessRevoke")}
              </MiniButton>
            ) : (
              <MiniButton
                onClick={() => {
                  setStatus("activo");
                  setDone(t("firm.accessGrant"));
                }}
              >
                {t("firm.accessGrant")}
              </MiniButton>
            )}
            <MiniButton onClick={() => setDone(t("firm.accessResend"))}>
              {t("firm.accessResend")}
            </MiniButton>
            <MiniButton onClick={() => setDone(t("firm.accessReset"))}>
              {t("firm.accessReset")}
            </MiniButton>
          </div>

          {done && <Done>{done}</Done>}

          <p className="mt-3 text-xs leading-relaxed text-ink-faint">
            {t("firm.colLastAccess")}: {formatDateTime(client.lastAccess, locale)}
          </p>
        </div>

        {/* --- Acceso expediente a expediente --- */}
        <CaseAccess files={files} />

        {/* --- Terceros autorizados --- */}
        <ThirdParties people={client.authorizedPeople} files={files} />
      </div>
    </Collapsible>
  );
}

/* ------------------------------------------------------------------ */
/* Acceso por expediente                                               */
/* ------------------------------------------------------------------ */

/**
 * Suspender un expediente concreto sin quitarle el portal entero: es el caso
 * que el despacho pidió por su nombre. La suspensión vive en el estado de la
 * pantalla —no se proyecta al portal del cliente— porque esta vista solo
 * decide qué ve el cliente, y el cambio real requeriría backend.
 */
function CaseAccess({ files }: { files: Case[] }) {
  const { t } = useStore();
  const l = useL();
  const [suspended, setSuspended] = useState<string[]>([]);

  return (
    <div>
      <p className="ui-eyebrow mb-2 text-ink-faint">
        {t("firm.perCaseAccess")}
      </p>
      <ul className="divide-y divide-line border-y border-line bg-white">
        {files.map((f) => {
          const off = suspended.includes(f.id);
          return (
            <li
              key={f.id}
              className="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-3 py-2"
            >
              <AreaBadge area={f.area} size="sm" />
              <span
                className={`min-w-[10rem] flex-1 truncate text-xs ${
                  off ? "text-ink-faint line-through" : "text-ink"
                }`}
              >
                {l(f.shortTitle)}
                <span className="text-ink-faint"> · {f.ref}</span>
              </span>
              <MiniButton
                tone={off ? "neutral" : "danger"}
                onClick={() =>
                  setSuspended((s) =>
                    off ? s.filter((x) => x !== f.id) : [...s, f.id],
                  )
                }
              >
                {off ? t("firm.restoreCase") : t("firm.suspendCase")}
              </MiniButton>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Terceros autorizados                                                */
/* ------------------------------------------------------------------ */

function ThirdParties({
  people,
  files,
}: {
  people: AuthorizedPerson[];
  files: Case[];
}) {
  const { t, locale } = useStore();
  const l = useL();
  const [revoked, setRevoked] = useState<string[]>([]);

  return (
    <div>
      <p className="ui-eyebrow mb-2 text-ink-faint">
        {t("firm.thirdPartiesTitle")}
      </p>

      {people.length === 0 ? (
        <p className="text-xs text-ink-faint">{t("firm.thirdPartiesEmpty")}</p>
      ) : (
        <ul className="divide-y divide-line border-y border-line bg-white">
          {people.map((p) => {
            const gone = revoked.includes(p.id);
            return (
              <li key={p.id} className="px-3 py-2.5">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span
                    className={`min-w-[8rem] flex-1 text-xs font-medium ${
                      gone ? "text-ink-faint line-through" : "text-ink"
                    }`}
                  >
                    {p.name}
                    <span className="font-normal text-ink-faint">
                      {" · "}
                      {l(p.relationship)}
                    </span>
                  </span>
                  <span className="text-xs text-ink-faint">
                    {t("firm.colSince")} {formatDate(p.addedOn, locale)}
                  </span>
                  <MiniButton
                    tone={gone ? "neutral" : "danger"}
                    disabled={gone}
                    onClick={() => setRevoked((r) => [...r, p.id])}
                  >
                    {t("firm.revoke")}
                  </MiniButton>
                </div>

                {!gone && (
                  <p className="mt-1 text-xs leading-relaxed text-ink-faint">
                    <span className="text-ink-muted">
                      {t("firm.colScope")}:
                    </span>{" "}
                    {p.scopes.map((s) => t(`scope.${s}`)).join(" · ")}
                    {" — "}
                    {p.caseIds
                      .map((id) => {
                        const f = files.find((c) => c.id === id);
                        return f ? l(f.shortTitle) : id;
                      })
                      .join(", ")}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

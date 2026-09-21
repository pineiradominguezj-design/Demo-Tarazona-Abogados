"use client";

import { useState } from "react";
import { AreaBadge } from "@/components/ui";
import {
  DocIcon,
  DownloadIcon,
  FirmActionIcon,
  LockIcon,
  MessageIcon,
  UserIcon,
} from "@/components/icons";
import { formatDateTime } from "@/lib/format";
import { ACTIVITY_LOG, type ActivityKind } from "@/lib/firm";
import { useL, useStore } from "@/lib/store";
import { MiniButton, SectionHeader, usePaged } from "../shared";

/**
 * Actividad — maqueta.
 *
 * Quién publicó qué y cuándo, y qué ha mirado o descargado el cliente. Es el
 * registro que justifica lo que el portal enseña, no un cuadro de mando: no
 * hay métricas, ni gráficas, ni nada que invite a medir a nadie.
 */

const ICONS: Record<ActivityKind, (p: { className?: string }) => React.ReactNode> = {
  publicacion: FirmActionIcon,
  documento: DocIcon,
  acceso: UserIcon,
  descarga: DownloadIcon,
  mensaje: MessageIcon,
  "acceso-alta": LockIcon,
};

type Who = "all" | "firm" | "client";

export default function ActivityPage() {
  const { t, locale, allCases } = useStore();
  const l = useL();
  const [who, setWho] = useState<Who>("all");

  const entries = ACTIVITY_LOG.filter((e) =>
    who === "all" ? true : who === "client" ? e.byClient : !e.byClient,
  );
  const { slice, pager } = usePaged(entries);

  const tabs: { id: Who; label: string }[] = [
    { id: "all", label: t("firm.activityAll") },
    { id: "firm", label: t("firm.activityByFirm") },
    { id: "client", label: t("firm.activityByClient") },
  ];

  return (
    <>
      <SectionHeader
        title={t("firm.activityTitle")}
        intro={t("firm.activityIntro")}
        preview
        action={
          /* El único botón de esta sección que hace algo de verdad: el registro
             se descarga tal cual, sin servidor de por medio. */
          <MiniButton
            onClick={() =>
              exportCsv([
                [
                  t("firm.activityCsvDate"),
                  t("firm.activityCsvActor"),
                  t("firm.activityCsvDetail"),
                ],
                ...entries.map((e) => [e.date, e.actor, l(e.detail)]),
              ])
            }
          >
            {t("firm.activityExport")}
          </MiniButton>
        }
      />

      <div className="mb-4 flex gap-1 border-b border-line">
        {tabs.map((tab) => {
          const active = who === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setWho(tab.id)}
              className={`-mb-px border-b-2 px-3 py-2 text-xs transition-colors ${
                active
                  ? "border-accent font-medium text-ink"
                  : "border-transparent text-ink-muted hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <ul className="divide-y divide-line border-y border-line bg-white">
        {slice.map((e) => {
          const Icon = ICONS[e.kind];
          const file = e.caseId
            ? allCases.find((c) => c.id === e.caseId)
            : undefined;

          return (
            <li
              key={e.id}
              className="flex flex-wrap items-start gap-x-3 gap-y-1 px-3 py-2.5"
            >
              <span className="mt-0.5 shrink-0 text-ink-faint" aria-hidden>
                <Icon className="h-4 w-4" />
              </span>

              <span className="min-w-[12rem] flex-1">
                <span className="block text-xs text-ink">{l(e.detail)}</span>
                <span className="mt-0.5 block text-xs text-ink-faint">
                  {e.actor}
                  {e.byClient && ` · ${t("firm.activityByClient")}`}
                </span>
              </span>

              {file && <AreaBadge area={file.area} size="sm" />}

              <span className="shrink-0 text-xs tabular-nums text-ink-faint">
                {formatDateTime(e.date, locale)}
              </span>
            </li>
          );
        })}
      </ul>
      {pager}
    </>
  );
}

/** Descarga el registro como CSV. Sin backend: se arma en el navegador. */
function exportCsv(rows: string[][]) {
  const csv = rows
    .map((r) => r.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(";"))
    .join("\n");
  const url = URL.createObjectURL(
    new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = "actividad.csv";
  a.click();
  URL.revokeObjectURL(url);
}

"use client";

/**
 * Piezas que comparten las tres pestañas de la ficha de expediente.
 *
 * La ficha se reparte en rutas hijas (`/historial` implícito, `/documentos`,
 * `/fechas`) y el marco común —cabecera, resumen y pestañas— vive en el layout.
 * Aquí quedan solo las utilidades que necesitan varias de esas rutas.
 */

import { useState } from "react";
import { notFound } from "next/navigation";
import { DocIcon, DownloadIcon } from "@/components/icons";
import { useStore } from "@/lib/store";
import type { Case } from "@/lib/types";

/**
 * El expediente de la URL. Solo se llama desde dentro de `PortalShell`, que no
 * pinta a sus hijos hasta que el almacén está hidratado; por eso aquí un
 * expediente que no aparece es de verdad un 404 y no un estado transitorio.
 */
export function useCase(caseId: string): Case {
  const { cases } = useStore();
  const found = cases.find((x) => x.id === caseId);
  if (!found) notFound();
  return found;
}

export function DownloadButton({ label }: { label: string }) {
  const [clicked, setClicked] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        setClicked(true);
        window.setTimeout(() => setClicked(false), 1600);
      }}
      className="inline-flex shrink-0 items-center gap-1.5 border border-line px-2.5 py-1.5 text-xs text-ink-muted transition-colors hover:border-ink hover:text-ink"
    >
      <DownloadIcon className="h-3.5 w-3.5" />
      {clicked ? "…" : label}
    </button>
  );
}

/** Documento adjunto dentro del detalle de una actuación. */
export function DocumentRow({ name, meta }: { name: string; meta: string }) {
  const { t } = useStore();
  return (
    <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border border-line px-3 py-2.5">
      <span className="flex min-w-0 items-center gap-2.5">
        <DocIcon className="h-4 w-4 shrink-0 text-ink-faint" />
        <span className="min-w-0">
          <span className="block text-[0.8125rem] break-words text-ink">
            {name}
          </span>
          <span className="block text-xs text-ink-faint">{meta}</span>
        </span>
      </span>
      <DownloadButton label={t("common.download")} />
    </div>
  );
}

"use client";

import { useState } from "react";
import { AreaBadge, StatePill } from "@/components/ui";
import { AREA_ORDER } from "@/config/areas";
import { TEAM, type TeamPermission } from "@/lib/firm";
import { useL, useStore } from "@/lib/store";
import type { AreaId, LocalizedText } from "@/lib/types";
import { Check, Collapsible, SectionHeader, usePaged } from "../shared";

/**
 * Equipo — maqueta.
 *
 * El único permiso que esta pantalla necesita distinguir es quién puede
 * publicar: publicar es lo que hace visible algo en el portal del cliente. Lo
 * demás —horarios, nóminas, cargas de trabajo— es gestión interna del despacho
 * y no pinta nada aquí.
 */
export default function TeamPage() {
  const { t } = useStore();
  const { slice, pager } = usePaged(TEAM);

  return (
    <>
      <SectionHeader title={t("firm.teamTitle")} preview />

      <div className="divide-y divide-line border-y border-line">
        {slice.map((m) => (
          <MemberRow
            key={m.id}
            initials={m.initials}
            name={m.name}
            role={m.role}
            permission={m.permission}
            areas={m.areas}
          />
        ))}
      </div>
      {pager}
    </>
  );
}

function MemberRow({
  initials,
  name,
  role,
  permission,
  areas,
}: {
  initials: string;
  name: string;
  role: LocalizedText;
  permission: TeamPermission;
  areas: AreaId[];
}) {
  const { t } = useStore();
  const l = useL();
  const [canPublish, setCanPublish] = useState(permission === "publica");
  /* Vacío en los datos significa "todas las áreas": aquí se abre a la lista
     completa para que el interruptor de cada área tenga algo que decir. */
  const [visible, setVisible] = useState<AreaId[]>(
    areas.length > 0 ? areas : [...AREA_ORDER],
  );

  return (
    <Collapsible
      summary={
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center bg-surface text-[0.625rem] font-medium tracking-wide text-ink-muted">
            {initials}
          </span>
          <span className="min-w-[10rem] flex-1">
            <span className="block truncate text-sm font-medium text-ink">
              {name}
            </span>
            <span className="mt-0.5 block truncate text-xs text-ink-faint">
              {l(role)}
            </span>
          </span>
          <StatePill tone={canPublish ? "done" : "ongoing"}>
            {canPublish ? t("firm.permPublica") : t("firm.permRedacta")}
          </StatePill>
        </span>
      }
    >
      <div className="space-y-4">
        <Check
          checked={canPublish}
          onChange={setCanPublish}
          label={t("firm.permPublicaToggle")}
        />

        <div>
          <p className="ui-eyebrow mb-2 text-ink-faint">
            {t("firm.teamAreas")}
            {visible.length === AREA_ORDER.length && (
              <span className="ml-2 normal-case tracking-normal">
                {t("firm.teamAllAreas")}
              </span>
            )}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {AREA_ORDER.map((a) => (
              <Check
                key={a}
                checked={visible.includes(a)}
                onChange={(v) =>
                  setVisible((s) =>
                    v ? [...s, a] : s.filter((x) => x !== a),
                  )
                }
                label={<AreaBadge area={a} size="sm" />}
              />
            ))}
          </div>
        </div>
      </div>
    </Collapsible>
  );
}

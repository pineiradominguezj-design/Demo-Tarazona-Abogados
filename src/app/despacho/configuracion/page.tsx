"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { AreaBadge } from "@/components/ui";
import { ArrowRight, FirmActionIcon, InfoIcon, ProcedureIcon } from "@/components/icons";
import { AREAS, AREA_ORDER } from "@/config/areas";
import {
  ACTION_TEMPLATES,
  AREA_PHASES,
  FIRM_SETTINGS,
} from "@/lib/firm";
import { STATES } from "@/lib/states";
import { useL, useStore } from "@/lib/store";
import type { AreaId } from "@/lib/types";
import { Collapsible, MiniButton, SectionHeader, Toggle } from "../shared";

/**
 * Configuración del despacho.
 *
 * Todo lo que hay aquí cambia lo que ve el cliente: las fases que dibujan su
 * barra de progreso, el lenguaje con que se le cuentan las actuaciones, el
 * plazo de respuesta que se le promete, los idiomas del portal y qué se publica
 * sin que nadie lo apruebe. Nada de gestión interna del despacho.
 *
 * Los cambios viven en el estado de la pantalla. No se persisten porque
 * tocarían los datos inmutables del portal (`data.ts`), y el escenario de la
 * demostración tiene que poder repetirse igual.
 */
export default function SettingsPage() {
  const { t } = useStore();

  return (
    <>
      <SectionHeader title={t("firm.settingsTitle")} />

      <div className="divide-y divide-line border-y border-line">
        <Collapsible summary={<Head>{t("firm.setPhases")}</Head>}>
          <PhasesSection />
        </Collapsible>

        <Collapsible summary={<Head>{t("firm.setTemplates")}</Head>}>
          <TemplatesSection />
        </Collapsible>

        <Collapsible summary={<Head>{t("firm.setResponse")}</Head>}>
          <ResponseSection />
        </Collapsible>

        <Collapsible summary={<Head>{t("firm.setLocales")}</Head>}>
          <LocalesSection />
        </Collapsible>

        <Collapsible summary={<Head>{t("firm.setDefaults")}</Head>}>
          <DefaultsSection />
        </Collapsible>

        <Collapsible summary={<Head>{t("firm.setLegal")}</Head>}>
          <LegalSection />
        </Collapsible>
      </div>
    </>
  );
}

function Head({ children }: { children: ReactNode }) {
  return (
    <span className="text-sm font-medium text-ink">{children}</span>
  );
}

/* ------------------------------------------------------------------ */
/* Fases por tipo de asunto                                            */
/* ------------------------------------------------------------------ */

/**
 * Extranjería viene abierta y editable; las demás se despliegan con sus fases
 * de ejemplo. Es el área con la que arranca la demostración y la única donde
 * merece la pena enseñar el mecanismo entero.
 */
function PhasesSection() {
  const { t, locale } = useStore();
  const [phases, setPhases] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(
      AREA_ORDER.map((a) => [a, AREA_PHASES[a].map((p) => p[locale])]),
    ),
  );

  const update = (area: AreaId, next: string[]) =>
    setPhases((p) => ({ ...p, [area]: next }));

  return (
    <div className="space-y-2">
      {AREA_ORDER.map((area, i) => (
        <div key={area} className="bg-white">
          <Collapsible
            accent={AREAS[area].color}
            /* Abierta la primera, sea cual sea: nombrar un área aquí ataría
               esta pantalla a las de un despacho concreto. */
            defaultOpen={i === 0}
            summary={
              <span className="flex flex-wrap items-center gap-2">
                <AreaBadge area={area} size="sm" />
                <span className="text-xs text-ink-faint">
                  {t("firm.phaseCount", { n: phases[area].length })}
                </span>
              </span>
            }
          >
            <PhaseEditor
              items={phases[area]}
              onChange={(next) => update(area, next)}
            />
          </Collapsible>
        </div>
      ))}
    </div>
  );
}

function PhaseEditor({
  items,
  onChange,
}: {
  items: string[];
  onChange: (next: string[]) => void;
}) {
  const { t } = useStore();

  const move = (i: number, delta: number) => {
    const next = [...items];
    const j = i + delta;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div>
      {/* Cada fila envuelve a propósito. Los tres mandos miden lo mismo
          siempre, así que en móvil se comían el ancho y el campo quedaba en
          70 px: los nombres de fase se cortaban a media palabra
          («Subsanació») justo donde hay que poder leerlos y editarlos. Con
          `flex-wrap` y un mínimo de 12rem para el campo, los botones bajan a
          su propia línea cuando no caben; en escritorio sobra sitio y la fila
          sigue siendo una sola. */}
      <ol className="divide-y divide-line border-y border-line bg-white">
        {items.map((label, i) => (
          <li key={i} className="flex flex-wrap items-center gap-2 px-3 py-2">
            <span className="flex min-w-[12rem] flex-1 items-center gap-2">
              <span className="w-5 shrink-0 text-xs tabular-nums text-ink-faint">
                {i + 1}
              </span>
              <input
                value={label}
                onChange={(e) => {
                  const next = [...items];
                  next[i] = e.target.value;
                  onChange(next);
                }}
                className="min-w-0 flex-1 border border-transparent bg-transparent px-2 py-1 text-xs text-ink transition-colors hover:border-line focus:border-accent focus:outline-none"
              />
            </span>
            <span className="ml-auto flex shrink-0 items-center gap-2">
              <MiniButton
                aria-label={t("firm.phaseUp")}
                title={t("firm.phaseUp")}
                disabled={i === 0}
                onClick={() => move(i, -1)}
              >
                ↑
              </MiniButton>
              <MiniButton
                aria-label={t("firm.phaseDown")}
                title={t("firm.phaseDown")}
                disabled={i === items.length - 1}
                onClick={() => move(i, 1)}
              >
                ↓
              </MiniButton>
              <MiniButton
                tone="danger"
                disabled={items.length <= 2}
                onClick={() => onChange(items.filter((_, k) => k !== i))}
              >
                {t("firm.phaseRemove")}
              </MiniButton>
            </span>
          </li>
        ))}
      </ol>

      <MiniButton
        className="mt-3"
        onClick={() => onChange([...items, t("firm.phaseNew")])}
      >
        {t("firm.phaseAdd")}
      </MiniButton>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Plantillas de actuaciones                                           */
/* ------------------------------------------------------------------ */

function TemplatesSection() {
  const { t, locale } = useStore();
  const l = useL();
  const [texts, setTexts] = useState<Record<string, string>>(() =>
    Object.fromEntries(ACTION_TEMPLATES.map((x) => [x.id, x.title[locale]])),
  );
  const [details, setDetails] = useState<Record<string, string>>(() =>
    Object.fromEntries(ACTION_TEMPLATES.map((x) => [x.id, x.detail[locale]])),
  );

  return (
    <ul className="space-y-2">
      {ACTION_TEMPLATES.map((tpl) => {
        const Icon = tpl.kind === "procedimiento" ? ProcedureIcon : FirmActionIcon;
        return (
          <li key={tpl.id} className="bg-white">
            <Collapsible
              summary={
                <span className="flex flex-wrap items-center gap-2">
                  <Icon className="h-3.5 w-3.5 shrink-0 text-ink-faint" />
                  <span className="text-xs font-medium text-ink">
                    {l(tpl.label)}
                  </span>
                  <span className="text-xs text-ink-faint">
                    {t("firm.templateFor")}{" "}
                    {tpl.area ? l(AREAS[tpl.area].label) : t("firm.templateAnyArea")}
                  </span>
                </span>
              }
            >
              <label className="block">
                <span className="ui-eyebrow text-ink-faint">
                  {t("firm.clientSees")}
                </span>
                <input
                  value={texts[tpl.id]}
                  onChange={(e) =>
                    setTexts((s) => ({ ...s, [tpl.id]: e.target.value }))
                  }
                  className="mt-1 w-full border border-line bg-white px-2.5 py-1.5 text-sm text-ink focus:border-accent focus:outline-none"
                />
              </label>
              <textarea
                value={details[tpl.id]}
                onChange={(e) =>
                  setDetails((s) => ({ ...s, [tpl.id]: e.target.value }))
                }
                rows={3}
                className="mt-2 w-full border border-line bg-white px-2.5 py-1.5 text-xs leading-relaxed text-ink-soft focus:border-accent focus:outline-none"
              />
              <p className="mt-2 text-xs text-ink-faint">
                {t("firm.formalRecord")}: {l(tpl.formalName)}
              </p>
            </Collapsible>
          </li>
        );
      })}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Plazo de respuesta y urgencias                                      */
/* ------------------------------------------------------------------ */

function ResponseSection() {
  const { t } = useStore();
  const l = useL();
  const [days, setDays] = useState<number>(FIRM_SETTINGS.responseDays);
  const [phone, setPhone] = useState<string>(FIRM_SETTINGS.urgencyPhone);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="flex flex-col gap-1">
        <span className="ui-eyebrow text-ink-faint">
          {t("firm.responseDaysLabel")}
        </span>
        <span className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            max={10}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="w-20 border border-line bg-white px-2.5 py-1.5 text-sm tabular-nums text-ink focus:border-accent focus:outline-none"
          />
          <span className="text-xs text-ink-muted">{t("firm.days")}</span>
        </span>
      </label>

      <label className="flex flex-col gap-1">
        <span className="ui-eyebrow text-ink-faint">
          {t("firm.urgencyPhone")}
        </span>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border border-line bg-white px-2.5 py-1.5 text-sm text-ink focus:border-accent focus:outline-none"
        />
        <span className="text-xs text-ink-faint">
          {l(FIRM_SETTINGS.urgencyHours)}
        </span>
      </label>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Idiomas                                                             */
/* ------------------------------------------------------------------ */

function LocalesSection() {
  const { t } = useStore();
  const l = useL();
  const [on, setOn] = useState<string[]>(
    FIRM_SETTINGS.locales.filter((x) => x.enabled).map((x) => x.id),
  );

  return (
    <ul className="divide-y divide-line border-y border-line bg-white">
      {FIRM_SETTINGS.locales.map((loc) => {
        const enabled = on.includes(loc.id);
        return (
          <li key={loc.id} className="px-3 py-2.5">
            <Toggle
              checked={enabled}
              onChange={(v) =>
                setOn((s) => (v ? [...s, loc.id] : s.filter((x) => x !== loc.id)))
              }
              label={
                <span>
                  <span className="text-ink">{l(loc.label)}</span>
                  <span className="text-ink-faint">
                    {" · "}
                    {enabled ? t("firm.localeOn") : t("firm.localeOff")}
                  </span>
                </span>
              }
            />
          </li>
        );
      })}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Qué se publica por defecto                                          */
/* ------------------------------------------------------------------ */

function DefaultsSection() {
  const l = useL();
  const [on, setOn] = useState<string[]>(
    FIRM_SETTINGS.publishDefaults.filter((x) => x.enabled).map((x) => x.id),
  );

  return (
    <ul className="divide-y divide-line border-y border-line bg-white">
      {FIRM_SETTINGS.publishDefaults.map((d) => (
        <li key={d.id} className="px-3 py-2.5">
          <Toggle
            checked={on.includes(d.id)}
            onChange={(v) =>
              setOn((s) => (v ? [...s, d.id] : s.filter((x) => x !== d.id)))
            }
            label={<span className="text-ink">{l(d.label)}</span>}
          />
          <p className="mt-1 max-w-xl text-xs leading-relaxed text-ink-faint">
            {l(d.help)}
          </p>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Textos legales                                                      */
/* ------------------------------------------------------------------ */

function LegalSection() {
  const { t } = useStore();
  const s = STATES.pending;

  return (
    <div>
      <Link
        href="/privacidad"
        className="inline-flex items-center gap-2 text-sm text-ink underline-offset-4 hover:underline"
      >
        {t("firm.legalLink")}
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>

      {/* El despacho todavía no ha revisado estos textos: se dice aquí igual
          que se dice en el portal del cliente. */}
      <p
        className="mt-3 flex items-start gap-2 px-3 py-2 text-xs leading-relaxed"
        style={{ backgroundColor: s.bg, color: s.fg }}
      >
        <InfoIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        {t("firm.legalNote")}
      </p>
    </div>
  );
}

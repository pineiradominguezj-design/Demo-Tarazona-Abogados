"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { BRAND, FIRM } from "@/config/identity";
import { AREAS } from "@/config/areas";
import { useL, useStore } from "@/lib/store";
import { LOCALES } from "@/lib/i18n";
import { DOC_STATUS_TONE, STATES, type StateTone } from "@/lib/states";
import { formatDate, relativeLabel } from "@/lib/format";
import type { AreaId, DocRequestStatus, Locale } from "@/lib/types";
import {
  AlertIcon,
  AreaIcon,
  CheckIcon,
  ChevronDown,
  InfoIcon,
} from "./icons";

/* ------------------------------------------------------------------ */
/* Marca                                                               */
/* ------------------------------------------------------------------ */

/**
 * Logotipo del despacho.
 *
 * Sin imagen (`BRAND.logo === null`, que es lo que trae la plantilla) se
 * compone la marca con el propio nombre en la tipografía de titulares. El
 * texto **hereda** el tamaño de su contenedor a propósito: así el mismo
 * componente sirve en la cabecera del portal y en el panel de acceso, donde
 * `className` solo fija la altura de la caja.
 */
export function Logo({
  className = "h-10",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  if (!BRAND.logo) {
    return (
      <span
        className={`ui-display inline-flex items-center whitespace-nowrap leading-none text-ink ${className}`}
      >
        {FIRM.name}
      </span>
    );
  }

  return (
    <Image
      src={BRAND.logo}
      alt={FIRM.name}
      width={BRAND.logoWidth}
      height={BRAND.logoHeight}
      priority={priority}
      className={`w-auto ${className}`}
    />
  );
}

/**
 * Marca reducida en negativo, para espacios cuadrados.
 *
 * Si el monograma lleva un `&`, la conjunción va en el color de acento y el
 * resto en blanco; si no, todo en blanco.
 */
export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  const [before, ...rest] = BRAND.monogram.split("&");

  return (
    <span
      className={`inline-flex items-center justify-center bg-ink text-[0.8rem] font-light tracking-wider text-white ${className}`}
      aria-hidden
    >
      {before}
      {rest.length > 0 && (
        <>
          <span className="text-accent">&amp;</span>
          {rest.join("&")}
        </>
      )}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Selector de idioma                                                  */
/* ------------------------------------------------------------------ */

export function LanguageSwitcher({
  variant = "light",
}: {
  variant?: "light" | "dark";
}) {
  const { locale, setLocale, t } = useStore();
  const isDark = variant === "dark";

  return (
    <div
      className={`inline-flex items-center gap-1 border p-0.5 ${
        isDark ? "border-white/25" : "border-line"
      }`}
      role="group"
      aria-label={t("common.language")}
    >
      {LOCALES.map((l) => {
        const active = l.id === locale;
        return (
          <button
            key={l.id}
            type="button"
            onClick={() => setLocale(l.id as Locale)}
            aria-pressed={active}
            className={`px-2.5 py-1 text-xs font-medium tracking-wider transition-colors ${
              active
                ? "bg-accent text-ink"
                : isDark
                  ? "text-white/70 hover:text-white"
                  : "text-ink-faint hover:text-ink"
            }`}
          >
            {l.short}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Etiqueta de área                                                    */
/* ------------------------------------------------------------------ */

export function AreaBadge({
  area,
  size = "md",
}: {
  area: AreaId;
  size?: "sm" | "md";
}) {
  const cfg = AREAS[area];
  const l = useL();
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium tracking-wide ${
        size === "sm" ? "px-2 py-0.5 text-[0.6875rem]" : "px-2.5 py-1 text-xs"
      }`}
      style={{ backgroundColor: cfg.tint, color: cfg.color }}
    >
      <AreaIcon area={area} className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
      {l(cfg.label)}
    </span>
  );
}

/** Franja de color del área, para el borde superior de las tarjetas. */
export function AreaStripe({ area }: { area: AreaId }) {
  return (
    <span
      className="block h-[3px] w-full"
      style={{ backgroundColor: AREAS[area].color }}
      aria-hidden
    />
  );
}

/* ------------------------------------------------------------------ */
/* Barra de fases                                                      */
/* ------------------------------------------------------------------ */

export function PhaseBar({
  phases,
  current,
  area,
}: {
  phases: { label: { es: string; en: string } }[];
  current: number;
  area: AreaId;
}) {
  const l = useL();
  const color = AREAS[area].color;

  return (
    <ol className="flex flex-wrap gap-x-1 gap-y-3 sm:flex-nowrap">
      {phases.map((p, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={i} className="min-w-[5.5rem] flex-1">
            <span
              className="block w-full"
              style={{
                backgroundColor: done || active ? color : "#E2E2E2",
                opacity: done ? 0.45 : 1,
                height: active ? 5 : 3,
              }}
              aria-hidden
            />
            <span
              className={`mt-2 block text-[0.6875rem] leading-snug ${
                active
                  ? "font-semibold text-ink"
                  : done
                    ? "text-ink-faint"
                    : "text-ink-faint/70"
              }`}
            >
              {l(p.label)}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * Versión compacta para la tarjeta del listado: solo los segmentos, y debajo
 * el nombre de la fase actual. Ocupa dos líneas en lugar de cinco.
 */
export function PhaseBarMini({
  phases,
  current,
  area,
  tone = "area",
}: {
  phases: { label: { es: string; en: string } }[];
  current: number;
  area: AreaId;
  /**
   * De qué color van los segmentos. `"area"` —el de siempre— usa el color del
   * área y es lo que ve el cliente en su listado de asuntos.
   *
   * `"mute"` los pinta en gris. Lo pide la vista despacho: allí la fila ya
   * lleva un color de estado, y con el del área encima competían dos sistemas
   * de color en la misma línea —el granate de penal se leía como una alerta—.
   * En gris, el color de esa pantalla significa una sola cosa: urgencia.
   */
  tone?: "area" | "mute";
}) {
  const l = useL();
  const { t } = useStore();
  const color = tone === "mute" ? "#4B4F58" : AREAS[area].color;

  return (
    <div>
      <div
        className="flex gap-1"
        role="img"
        aria-label={t("case.phaseProgress", {
          n: current + 1,
          total: phases.length,
        })}
      >
        {phases.map((p, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <span
              key={i}
              className="h-1 flex-1 rounded-full"
              style={{
                backgroundColor: done || active ? color : "#E4E4E1",
                /* En gris no se atenúa lo ya hecho: el degradado de opacidad
                   servía para distinguir fases dentro de un mismo color vivo,
                   pero sobre gris deja el recorrido casi invisible. Completado
                   gris oscuro, pendiente gris claro, y basta. */
                opacity: done && tone === "area" ? 0.4 : 1,
              }}
            />
          );
        })}
      </div>
      <p className="mt-2 flex items-baseline gap-2 text-xs">
        <span className="font-medium text-ink">
          {l(phases[current]?.label ?? phases[0].label)}
        </span>
        <span className="text-ink-faint">
          {t("case.phaseProgress", {
            n: current + 1,
            total: phases.length,
          })}
        </span>
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Estados de documento                                                */
/* ------------------------------------------------------------------ */

/**
 * Pastilla de estado genérica. Todo el portal habla el mismo idioma de color:
 * ámbar pendiente, verde completado, gris en curso, rojo a corregir.
 */
export function StatePill({
  tone,
  children,
  className = "",
}: {
  tone: StateTone;
  children: ReactNode;
  className?: string;
}) {
  const s = STATES[tone];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 px-2 py-0.5 text-[0.6875rem] font-medium tracking-wide ${className}`}
      style={{ backgroundColor: s.bg, color: s.fg }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: s.dot }}
        aria-hidden
      />
      {children}
    </span>
  );
}

export function StatusPill({ status }: { status: DocRequestStatus }) {
  const { t } = useStore();
  return (
    <StatePill tone={DOC_STATUS_TONE[status]}>{t(`status.${status}`)}</StatePill>
  );
}

/* ------------------------------------------------------------------ */
/* Avisos                                                              */
/* ------------------------------------------------------------------ */

export function Notice({
  tone = "info",
  children,
  className = "",
}: {
  tone?: "info" | "warn" | "ok" | "neutral";
  children: ReactNode;
  className?: string;
}) {
  const tones = {
    info: { border: "#BAD4E3", bg: "#F4F9FC", fg: "#35617C" },
    warn: { border: "#ECC773", bg: "#FDF7E9", fg: "#8A5A12" },
    ok: { border: "#A9CBB2", bg: "#EDF5EE", fg: "#2F6340" },
    neutral: { border: "#E2E2E2", bg: "#F7F7F5", fg: "#4B4F58" },
  }[tone];

  const Icon = tone === "ok" ? CheckIcon : tone === "warn" ? AlertIcon : InfoIcon;

  return (
    <div
      className={`flex gap-2.5 border-l-2 px-3 py-2.5 text-[0.8125rem] leading-relaxed ${className}`}
      style={{
        borderLeftColor: tones.border,
        backgroundColor: tones.bg,
        color: tones.fg,
      }}
    >
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <div className="min-w-0">{children}</div>
    </div>
  );
}

/** Nota discreta al pie de una sección, para matices y descargos. */
export function FinePrint({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={`text-xs leading-relaxed text-ink-faint ${className}`}>
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Estructura                                                          */
/* ------------------------------------------------------------------ */

export function SectionTitle({
  children,
  action,
}: {
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-4">
      <h2 className="ui-display text-sm text-ink">{children}</h2>
      {action}
    </div>
  );
}

export function Card({
  children,
  className = "",
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  /** Tarjetas pulsables: filo dorado y leve elevación al pasar el ratón. */
  hover?: boolean;
}) {
  return (
    <div className={`ui-card ${hover ? "ui-card-hover" : ""} ${className}`}>
      {children}
    </div>
  );
}

/**
 * Fecha exacta seguida del tiempo relativo entre paréntesis.
 * Nunca sustituye a la fecha: el despacho quiere que se vea la que comunicó.
 */
export function DateWithRelative({
  iso,
  className = "",
}: {
  iso: string;
  className?: string;
}) {
  const { t, locale } = useStore();
  return (
    <span className={className}>
      {formatDate(iso, locale)}{" "}
      <span className="text-ink-faint">· {relativeLabel(iso, t)}</span>
    </span>
  );
}

/** Solo el tiempo relativo, con la fecha exacta accesible en el `title`. */
export function Relative({
  iso,
  className = "",
}: {
  iso: string;
  className?: string;
}) {
  const { t, locale } = useStore();
  return (
    <span className={className} title={formatDate(iso, locale)}>
      {relativeLabel(iso, t)}
    </span>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <dt className="ui-eyebrow text-ink-faint">{label}</dt>
      <dd className="mt-1 text-sm text-ink-soft">{children}</dd>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Botones                                                             */
/* ------------------------------------------------------------------ */

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  full?: boolean;
};

export function Button({
  variant = "primary",
  full = false,
  className = "",
  ...rest
}: ButtonProps) {
  const styles = {
    primary:
      "bg-ink text-white hover:bg-ink-soft disabled:bg-line disabled:text-ink-faint",
    secondary:
      "border border-ink/20 text-ink hover:border-ink hover:bg-surface",
    ghost: "text-ink-muted hover:text-ink hover:bg-surface",
  }[variant];

  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium tracking-[0.1em] uppercase transition-colors disabled:cursor-not-allowed ${styles} ${
        full ? "w-full" : ""
      } ${className}`}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Desplegable                                                         */
/* ------------------------------------------------------------------ */

export function Disclosure({
  summary,
  children,
  defaultOpen = false,
}: {
  summary: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wide text-ink-muted transition-colors hover:text-ink"
      >
        {summary}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}


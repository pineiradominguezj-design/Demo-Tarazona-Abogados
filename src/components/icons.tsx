import { AREAS } from "@/config/areas";
import type { AreaId } from "@/config/areas";
import type { KeyDateKind } from "@/lib/types";

type IconProps = { className?: string };

const base = "h-4 w-4";

/**
 * Catálogo de iconos de área.
 *
 * Está deliberadamente separado de las áreas: un despacho de laboral y otro de
 * extranjería usan el mismo icono de maletín o de pasaporte, así que el icono
 * es un dibujo con nombre propio y el área solo lo elige desde
 * `src/config/areas.ts`. Añadir un área no obliga a tocar este fichero; añadir
 * un dibujo nuevo, sí.
 *
 * Todos comparten lienzo de 24×24 y trazo, para que se vean de la misma
 * familia al ponerlos juntos en un filtro.
 */
const AREA_ICONS = {
  /** Extranjería */
  passport: (
    <>
      <rect x="4" y="2.5" width="16" height="19" rx="2" />
      <circle cx="12" cy="10" r="3.2" />
      <path d="M8.8 16.5h6.4" />
    </>
  ),
  /** Penal, litigación */
  scales: (
    <path d="M12 3v18M7 21h10M3 8l4-3 4 3M3 8l2 4h-4zM13 8l4-3 4 3M13 8l2 4h-4z" />
  ),
  /** Ecuestre y deportivo */
  horse: (
    <>
      <path d="M5 21c0-5 2.5-7.5 6-9l1.5-3.5L11 6l1-3 3 2.5 4 1.5-1.5 3.5C19 13 19 17 19 21" />
      <path d="M14.5 6.2h.01" />
    </>
  ),
  /** Civil y familia */
  family: (
    <>
      <circle cx="8" cy="8" r="3" />
      <circle cx="16.5" cy="9.5" r="2.2" />
      <path d="M3 20c0-3 2.2-5 5-5s5 2 5 5M14 20c0-2.3 1.4-4 3.2-4s3.2 1.7 3.2 4" />
    </>
  ),
  /** Inmobiliario */
  house: (
    <>
      <path d="M3 10.5 12 4l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
      <circle cx="12" cy="13" r="1.8" />
      <path d="M12 14.8V18" />
    </>
  ),
  /** Laboral */
  briefcase: (
    <>
      <rect x="2.5" y="7" width="19" height="13" rx="2" />
      <path d="M8.5 7V5.5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2V7M2.5 12.5h19" />
    </>
  ),
  /** Mercantil y societario */
  building: (
    <>
      <path d="M4 21V5.5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2V21M15 10h3a2 2 0 0 1 2 2v9M2.5 21h19" />
      <path d="M7.5 8h4M7.5 12h4M7.5 16h4" />
    </>
  ),
  /** Fiscal y tributario */
  receipt: (
    <>
      <path d="M5.5 21V3.5l2.2 1.4 2.1-1.4 2.2 1.4 2.1-1.4 2.2 1.4 2.2-1.4V21l-2.2-1.4-2.2 1.4-2.1-1.4-2.2 1.4-2.1-1.4z" />
      <path d="M14.5 9.5l-5 5M9.8 9.8h.01M14.2 14.2h.01" />
    </>
  ),
  /** Sucesiones y herencias */
  scroll: (
    <>
      <path d="M6 3.5h11a2 2 0 0 1 2 2V18a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 5 18V5.5" />
      <path d="M5 5.5a1.5 1.5 0 0 1 3 0V18" />
      <path d="M10.5 8h5M10.5 12h5" />
    </>
  ),
  /** Concursal y reestructuración */
  chart: (
    <>
      <path d="M3.5 3.5v17h17" />
      <path d="M7 16l3.5-4 3 2.5L20 7" />
    </>
  ),
  /** Seguros y responsabilidad civil */
  shield: (
    <>
      <path d="M12 3l7 2.5v6c0 4.2-2.8 7.6-7 9.5-4.2-1.9-7-5.3-7-9.5v-6z" />
      <path d="M9.2 12l2 2 3.6-3.6" />
    </>
  ),
  /** Propiedad intelectual e industrial */
  bulb: (
    <>
      <path d="M9 17.5a6 6 0 1 1 6 0v1.5a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 19z" />
      <path d="M9.5 17.5h5" />
    </>
  ),
  /** Internacional */
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.2 2.3 3.4 5.3 3.4 8.5s-1.2 6.2-3.4 8.5c-2.2-2.3-3.4-5.3-3.4-8.5S9.8 5.8 12 3.5z" />
    </>
  ),
} as const;

export type AreaIconName = keyof typeof AREA_ICONS;

/** Icono del área. El dibujo lo elige `src/config/areas.ts`, no este componente. */
export function AreaIcon({
  area,
  className = base,
}: IconProps & { area: AreaId }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {AREA_ICONS[AREAS[area].icon]}
    </svg>
  );
}

export function DateIcon({
  kind,
  className = base,
}: IconProps & { kind: KeyDateKind }) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (kind) {
    case "huellas":
      return (
        <svg {...common}>
          <path d="M12 4a6 6 0 0 0-6 6v2M12 4a6 6 0 0 1 6 6v4M9 11a3 3 0 0 1 6 0v5M12 11v7M6.5 17.5c.6-1 .9-2 .9-3.5M17.5 18c.3-1 .5-2 .5-3" />
        </svg>
      );
    case "vista":
      return (
        <svg {...common}>
          <path d="M6 20h12M9 20V9M15 20V9M4 9h16L12 3z" />
        </svg>
      );
    case "notaria":
      return (
        <svg {...common}>
          <path d="M5 21h14M6 17V8l6-4 6 4v9" />
          <path d="M9.5 17v-4h5v4" />
        </svg>
      );
    case "reunion":
      return (
        <svg {...common}>
          <circle cx="9" cy="9" r="3" />
          <circle cx="16" cy="10.5" r="2.2" />
          <path d="M4 19c0-2.8 2.2-5 5-5s5 2.2 5 5M15 19c0-2 1.2-3.6 2.8-3.6S20.5 17 20.5 19" />
        </svg>
      );
    case "entrega":
      return (
        <svg {...common}>
          <path d="M3 8h13v9H3zM16 11h3.2l1.8 2.6V17H16z" />
          <circle cx="7" cy="18.5" r="1.6" />
          <circle cx="17.5" cy="18.5" r="1.6" />
        </svg>
      );
  }
}

export function ChevronDown({ className = base }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function ArrowLeft({ className = base }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </svg>
  );
}

export function ArrowRight({ className = base }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function DownloadIcon({ className = base }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v12M7 11l5 5 5-5M4 20h16" />
    </svg>
  );
}

export function UploadIcon({ className = base }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 17V5M7 9l5-5 5 5M4 20h16" />
    </svg>
  );
}

export function DocIcon({ className = base }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7z" />
      <path d="M14 3v4h4" />
    </svg>
  );
}

/**
 * Actuación del procedimiento: lo que ocurre fuera del despacho (juzgado,
 * Administración, notaría). Edificio institucional con columnas.
 */
export function ProcedureIcon({ className = base }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3 3.5 7.5h17L12 3Z" />
      <path d="M6 10.5v6M10 10.5v6M14 10.5v6M18 10.5v6" />
      <path d="M3.5 20h17" />
    </svg>
  );
}

/**
 * Actuación del despacho: lo que hacemos nosotros. Pluma sobre documento.
 */
export function FirmActionIcon({ className = base }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13.5 3.5H7a1 1 0 0 0-1 1v15a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-5" />
      <path d="M11.5 15.5H9" />
      <path d="M9 11.5h2.5" />
      <path d="M20.2 4.3a1.6 1.6 0 0 0-2.3 0l-4.6 4.6-.6 2.6 2.6-.6 4.9-4.5a1.6 1.6 0 0 0 0-2.1Z" />
    </svg>
  );
}

export function CheckIcon({ className = base }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m4.5 12.5 5 5 10-11" />
    </svg>
  );
}

export function AlertIcon({ className = base }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 8v5M12 16.5h.01" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

export function InfoIcon({ className = base }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 11v5M12 7.5h.01" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

export function MessageIcon({ className = base }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 15a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export function CalendarIcon({ className = base }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3.5" y="5" width="17" height="16" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </svg>
  );
}

export function EuroIcon({ className = base }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 6.5A6.5 6.5 0 0 0 7.5 12a6.5 6.5 0 0 0 9.5 5.5M4.5 10.5h7M4.5 14h7" />
    </svg>
  );
}

export function UserIcon({ className = base }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c0-4 3.4-6.5 7.5-6.5s7.5 2.5 7.5 6.5" />
    </svg>
  );
}

export function ShieldIcon({ className = base }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3 5 6v6c0 4.2 2.9 7.8 7 9 4.1-1.2 7-4.8 7-9V6z" />
    </svg>
  );
}

export function FolderIcon({ className = base }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.5 7a1.5 1.5 0 0 1 1.5-1.5h4l2 2.5h8A1.5 1.5 0 0 1 20.5 9.5v8A1.5 1.5 0 0 1 19 19H5a1.5 1.5 0 0 1-1.5-1.5z" />
    </svg>
  );
}

export function LockIcon({ className = base }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function ClipIcon({ className = base }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 11.5 12.2 19.3a4.5 4.5 0 0 1-6.4-6.4l8-8a3 3 0 0 1 4.3 4.3l-7.9 7.9a1.5 1.5 0 0 1-2.1-2.1l7.2-7.2" />
    </svg>
  );
}

export function SendIcon({ className = base }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 3 10.5 13.5M21 3l-6.8 18-3.7-7.5L3 9.8z" />
    </svg>
  );
}

export function MenuIcon({ className = base }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon({ className = base }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

import type { LocalizedText } from "@/lib/types";
import type { AreaIconName } from "@/components/icons";

/*
 * ÁREAS DE PRÁCTICA
 *
 * Tercero de los tres ficheros que hay que tocar para montar un despacho nuevo
 * (los otros son `identity.ts` y `theme.css`).
 *
 * Esta lista manda: `AreaId` se deriva de ella, así que al añadir o quitar un
 * área el compilador va señalando todo lo que falta por rellenar —las fases de
 * `AREA_PHASES`, las listas de documentos de `DOC_CHECKLISTS`, los expedientes
 * de `data.ts`—. No hay ningún sitio donde las áreas estén escritas otra vez.
 *
 * El `icon` no es libre: tiene que ser uno de los del catálogo de
 * `src/components/icons.tsx`. Si el área que necesitas no tiene icono, añádelo
 * allí y aquí lo verás disponible.
 *
 * `color` y `tint` van juntos: el color es el del texto de la etiqueta y `tint`
 * su fondo, así que el par tiene que dar contraste suficiente. Estos colores no
 * salen de `theme.css` a propósito —son cinco familias distintas, no variantes
 * del acento— pero conviene que convivan con él.
 */

interface AreaDef {
  id: string;
  label: LocalizedText;
  /** Color del texto de la etiqueta y de la barra de fases. */
  color: string;
  /** Fondo de la etiqueta. */
  tint: string;
  icon: AreaIconName;
}

export const AREA_DEFS = [
  {
    id: "extranjeria",
    label: { es: "Extranjería", en: "Immigration" },
    color: "#EBB439",
    tint: "#FDF7E9",
    icon: "passport",
  },
  {
    id: "penal",
    label: { es: "Derecho penal", en: "Criminal law" },
    color: "#8C3B3B",
    tint: "#F9EFEF",
    icon: "scales",
  },
  {
    id: "ecuestre",
    label: { es: "Ecuestre y deportivo", en: "Equestrian & sports" },
    color: "#6B7D52",
    tint: "#F1F4EC",
    icon: "horse",
  },
  {
    id: "civil",
    label: { es: "Civil y familia", en: "Civil & family" },
    color: "#4A7C9B",
    tint: "#EDF3F7",
    icon: "family",
  },
  {
    id: "inmobiliario",
    label: { es: "Inmobiliario", en: "Real estate" },
    color: "#988A81",
    tint: "#F5F3F1",
    icon: "house",
  },
] as const satisfies readonly AreaDef[];

export type AreaId = (typeof AREA_DEFS)[number]["id"];
export type AreaConfig = (typeof AREA_DEFS)[number];

/** Búsqueda por identificador: `AREAS[c.area].color`. */
export const AREAS = Object.fromEntries(
  AREA_DEFS.map((a) => [a.id, a]),
) as Record<AreaId, AreaConfig>;

/**
 * Orden de presentación en filtros y selectores. Es el de `AREA_DEFS`, no una
 * segunda lista: si fueran dos, acabarían discrepando.
 */
export const AREA_ORDER: AreaId[] = AREA_DEFS.map((a) => a.id);

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
 *
 * Las seis de abajo son las de Tarazona Abogados. Sus tonos están repartidos por
 * el círculo cromático para que se distingan entre sí, y ninguno cae en la
 * franja verde del acento: el área tiene que leerse como familia propia y no
 * como una variante de la marca. La excepción buscada es el burdeos de penal,
 * que sí es un color de la casa.
 *
 * Protección de datos no tiene expediente en el escenario —el portal enseña
 * cinco— pero existe aquí, que es lo que hace que aparezca en los filtros y en
 * las áreas de cada persona del equipo.
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
    id: "laboral",
    label: { es: "Derecho laboral", en: "Employment law" },
    color: "#5F7043",
    tint: "#F0F3EC",
    icon: "briefcase",
  },
  {
    id: "inmobiliario",
    label: { es: "Derecho inmobiliario", en: "Real estate law" },
    color: "#8F5F37",
    tint: "#F6F1EB",
    icon: "house",
  },
  {
    id: "sucesiones",
    label: { es: "Derecho de sucesiones", en: "Wills and probate" },
    color: "#6E5689",
    tint: "#F2EFF6",
    icon: "scroll",
  },
  {
    id: "civil",
    label: { es: "Derecho civil", en: "Civil law" },
    color: "#4A5D9B",
    tint: "#EEF0F8",
    icon: "family",
  },
  {
    id: "penal",
    label: { es: "Derecho penal", en: "Criminal law" },
    color: "#5C2D3C",
    tint: "#F5EEF0",
    icon: "scales",
  },
  {
    id: "datos",
    label: { es: "Protección de datos", en: "Data protection" },
    color: "#256B76",
    tint: "#EAF4F6",
    icon: "shield",
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

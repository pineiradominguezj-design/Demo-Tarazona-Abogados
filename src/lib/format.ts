import type { Locale } from "./types";
import type { TKey } from "./i18n";
import { TODAY } from "./data";

type Translate = (key: TKey, vars?: Record<string, string | number>) => string;

const LOCALE_TAG: Record<Locale, string> = { es: "es-ES", en: "en-GB" };

export function formatDate(iso: string, locale: Locale): string {
  const d = new Date(iso);
  return d.toLocaleDateString(LOCALE_TAG[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Con el día de la semana delante. Solo para la línea de saludo de la vista
 * despacho: ahí la fecha se lee de corrido, no se compara con otras, y el día
 * de la semana es lo que sitúa a quien entra por la mañana.
 */
export function formatDateFull(iso: string, locale: Locale): string {
  const d = new Date(iso);
  return d.toLocaleDateString(LOCALE_TAG[locale], {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateShort(iso: string, locale: Locale): string {
  const d = new Date(iso);
  return d.toLocaleDateString(LOCALE_TAG[locale], {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatDateTime(iso: string, locale: Locale): string {
  const d = new Date(iso);
  return d.toLocaleString(LOCALE_TAG[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTime(iso: string, locale: Locale): string {
  const d = new Date(iso);
  return d.toLocaleTimeString(LOCALE_TAG[locale], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatCurrency(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(LOCALE_TAG[locale], {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    /*
     * `always` en lugar del `auto` por defecto. En es-ES, `auto` omite el punto
     * de millar en los números de cuatro cifras ("1200 €"), que es correcto
     * ortográficamente pero descuadra al lado de "25.500 €": en el área
     * económica las dos cifras se leen juntas y a tamaño grande.
     */
    useGrouping: "always",
  }).format(amount);
}

/**
 * Días que faltan hasta una fecha, tomando como "hoy" la fecha de referencia
 * del escenario de demostración para que los avisos sean estables.
 */
export function daysUntil(iso: string): number {
  const target = new Date(iso.slice(0, 10) + "T00:00:00");
  const today = new Date(TODAY + "T00:00:00");
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

export function isUpcoming(iso: string): boolean {
  return daysUntil(iso) >= 0;
}

/**
 * Tiempo relativo en lenguaje corriente ("hace 3 días", "en 2 semanas").
 * Acompaña siempre a la fecha exacta, nunca la sustituye: el cliente pidió que
 * las fechas se vean tal como las comunica el despacho.
 */
export function relativeLabel(iso: string, t: Translate): string {
  const days = daysUntil(iso);

  if (days === 0) return t("time.today");
  if (days === -1) return t("time.yesterday");
  if (days === 1) return t("time.tomorrow");

  const past = days < 0;
  const n = Math.abs(days);

  if (n < 7) {
    return past ? t("time.daysAgo", { n }) : t("time.inDays", { n });
  }
  if (n < 30) {
    const weeks = Math.round(n / 7);
    if (weeks === 1) return past ? t("time.weekAgo") : t("time.inWeek");
    return past
      ? t("time.weeksAgo", { n: weeks })
      : t("time.inWeeks", { n: weeks });
  }
  const months = Math.round(n / 30);
  if (months === 1) return past ? t("time.monthAgo") : t("time.inMonth");
  return past
    ? t("time.monthsAgo", { n: months })
    : t("time.inMonths", { n: months });
}

/**
 * Cuenta en días hasta un vencimiento de pago. A diferencia de `relativeLabel`,
 * no redondea a semanas ni a meses: cuando hay un importe y una fecha de por
 * medio, "en 15 días" sitúa mejor que "en 2 semanas".
 *
 * Solo para vencimientos que fija el despacho (facturas y provisiones). No es
 * un contador de plazos procesales, que el portal no tiene.
 */
export function countdownLabel(iso: string, t: Translate): string {
  const days = daysUntil(iso);

  if (days === 0) return t("time.today");
  if (days === 1) return t("time.tomorrow");
  if (days === -1) return t("time.yesterday");

  return days < 0
    ? t("time.daysAgo", { n: -days })
    : t("time.inDays", { n: days });
}

/**
 * Enmascara un documento de identidad dejando visible solo el final.
 * Los datos de la demo son ficticios, pero la pantalla debe enseñar el criterio
 * que se aplicaría con datos reales.
 */
export function maskIdDocument(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length <= 4) return trimmed;

  const tail = trimmed.slice(-4);
  const head = trimmed.slice(0, -4).replace(/[^\s-]/g, "•");
  return head + tail;
}

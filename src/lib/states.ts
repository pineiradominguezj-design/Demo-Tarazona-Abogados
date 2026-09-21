import type { DocRequestStatus } from "./types";

/**
 * Código de color de estados, común a todo el portal.
 *
 * Ámbar = algo espera al cliente. Verde = cerrado. Gris = en curso, sin acción
 * por su parte. Rojo = requiere corrección (documento rechazado o caducado).
 * No introduce colores nuevos de marca: reutiliza el oro del despacho para el
 * ámbar y mantiene el resto en tonos neutros.
 */
export type StateTone = "pending" | "done" | "ongoing" | "alert";

export interface StateToken {
  /** Texto. */
  fg: string;
  /** Fondo de pastilla. */
  bg: string;
  /** Punto o barra de acento. */
  dot: string;
}

export const STATES: Record<StateTone, StateToken> = {
  pending: { fg: "#8A5A12", bg: "#FDF7E9", dot: "#EBB439" },
  done: { fg: "#2F6340", bg: "#EDF5EE", dot: "#3F7A50" },
  ongoing: { fg: "#5C6169", bg: "#F1F1EF", dot: "#9BA0A8" },
  alert: { fg: "#A33A3A", bg: "#F9EFEF", dot: "#A33A3A" },
};

/** Estado de una petición de documento traducido al código de color. */
export const DOC_STATUS_TONE: Record<DocRequestStatus, StateTone> = {
  pendiente: "pending",
  recibido: "ongoing",
  revision: "ongoing",
  validado: "done",
  rechazado: "alert",
};

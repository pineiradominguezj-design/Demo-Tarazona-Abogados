import { daysUntil, isUpcoming } from "./format";
import type { Case, DocExpiry, KeyDate, Message } from "./types";

/** Documentos que el despacho aún espera del cliente. */
export function pendingDocs(c: Case) {
  return c.docRequests.filter(
    (r) => r.status === "pendiente" || r.status === "rechazado",
  );
}

/** Actuaciones visibles para el cliente, de la más reciente a la más antigua. */
export function visibleActions(c: Case) {
  return c.actions
    .filter((a) => a.published)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function upcomingDates(c: Case): KeyDate[] {
  return c.keyDates
    .filter((d) => isUpcoming(d.date))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** Caducidades dentro de la ventana de aviso (90 días) o ya vencidas. */
export function expiringSoon(c: Case, windowDays = 90): DocExpiry[] {
  return c.expiries
    .filter((e) => daysUntil(e.expiresOn) <= windowDays)
    .sort((a, b) => a.expiresOn.localeCompare(b.expiresOn));
}

export function unreadMessagesForCase(messages: Message[], caseId: string) {
  return messages.filter(
    (m) => m.caseId === caseId && m.from === "despacho" && !m.read,
  );
}

export function messagesForCase(messages: Message[], caseId: string) {
  return messages
    .filter((m) => m.caseId === caseId)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export interface CaseSummary {
  pendingDocCount: number;
  unreadCount: number;
  nextDate?: KeyDate;
  expiries: DocExpiry[];
}

export function summarize(c: Case, messages: Message[]): CaseSummary {
  return {
    pendingDocCount: pendingDocs(c).length,
    unreadCount: unreadMessagesForCase(messages, c.id).length,
    nextDate: upcomingDates(c)[0],
    expiries: expiringSoon(c),
  };
}

/** Semáforo de una caducidad: cuanto queda decide el color del aviso. */
export function expiryLevel(e: DocExpiry): "ok" | "warn" | "alert" {
  const d = daysUntil(e.expiresOn);
  if (d < 0) return "alert";
  if (d <= 30) return "alert";
  if (d <= 90) return "warn";
  return "ok";
}

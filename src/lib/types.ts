/**
 * Modelo de dominio del portal del cliente.
 *
 * Todo el contenido de negocio (títulos de asunto, fases, actuaciones) es bilingüe
 * y viaja dentro del propio dato como `LocalizedText`. Los textos de interfaz
 * (botones, etiquetas, avisos) viven en los diccionarios de `i18n.ts`.
 */

export type Locale = "es" | "en";

export type LocalizedText = { es: string; en: string };

/*
 * Las áreas no se enumeran aquí: se derivan de `src/config/areas.ts`, que es
 * lo que cambia en cada despacho. Se reexporta para que el resto del código
 * siga pidiendo todos los tipos del dominio a este fichero.
 */
import type { AreaId } from "@/config/areas";
export type { AreaId };

/** Estado de un documento que el despacho ha pedido al cliente. */
export type DocRequestStatus =
  | "pendiente"
  | "recibido"
  | "revision"
  | "validado"
  | "rechazado";

/** Naturaleza de una fecha señalada. Solo informativa: no es control de plazos. */
export type KeyDateKind =
  | "huellas"
  | "vista"
  | "notaria"
  | "reunion"
  | "entrega";

export interface Lawyer {
  id: string;
  name: string;
  role: LocalizedText;
  email: string;
  phone: string;
  initials: string;
}

/**
 * De dónde viene una actuación. Solo decide el icono y la etiqueta de la línea
 * temporal: separa lo que hace el despacho de lo que ocurre en el procedimiento
 * (juzgado, Administración, notaría).
 */
export type CaseActionKind = "procedimiento" | "despacho";

/** Una actuación del historial. Solo se muestra al cliente si `published`. */
export interface CaseAction {
  id: string;
  date: string; // ISO
  kind: CaseActionKind;
  /** Título en lenguaje claro, el que ve el cliente. */
  title: LocalizedText;
  /** Denominación formal, dentro del desplegable "Detalle". */
  formalName: LocalizedText;
  detail: LocalizedText;
  attachment?: Attachment;
  published: boolean;
  /** Fase del asunto a la que pertenece la actuación. */
  phaseIndex: number;
}

export interface Attachment {
  name: LocalizedText;
  /** Etiqueta legible, p. ej. "PDF · 240 KB". */
  meta: string;
}

/** Documento emitido por el despacho y puesto a disposición del cliente. */
export interface FirmDoc {
  id: string;
  date: string;
  name: LocalizedText;
  kind: LocalizedText;
  meta: string;
}

/** Documento que el despacho necesita del cliente. */
export interface DocRequest {
  id: string;
  name: LocalizedText;
  help: LocalizedText;
  status: DocRequestStatus;
  requestedOn: string;
  /** Obligatorio cuando el estado es "rechazado". */
  rejectionReason?: LocalizedText;
  /** Fecha en que el cliente lo envió, si ya lo hizo. */
  submittedOn?: string;
}

/** Documento ya subido por el cliente. */
export interface UploadedDoc {
  id: string;
  name: LocalizedText;
  uploadedOn: string;
  meta: string;
  /** Enlaza con la petición que satisface, si venía de una. */
  fulfillsRequestId?: string;
}

export interface KeyDate {
  id: string;
  kind: KeyDateKind;
  date: string; // ISO con hora cuando aplica
  title: LocalizedText;
  place: LocalizedText;
  note?: LocalizedText;
}

/**
 * Caducidad de un documento del cliente (TIE, pasaporte, permiso).
 * Las fechas las introduce el despacho y el aviso es orientativo.
 * Nunca representa un plazo procesal.
 */
export interface DocExpiry {
  id: string;
  document: LocalizedText;
  expiresOn: string;
  /** Qué conviene hacer, en lenguaje claro. */
  advice: LocalizedText;
}

export interface CasePhase {
  label: LocalizedText;
}

export interface Case {
  id: string;
  clientId: string;
  ref: string;
  area: AreaId;
  title: LocalizedText;
  /**
   * Nombre corto para espacios estrechos (pestañas de Mensajes). Dos o tres
   * palabras: el título completo no cabe y truncado no se distingue.
   */
  shortTitle: LocalizedText;
  phases: CasePhase[];
  currentPhase: number;
  openedOn: string;
  lastUpdate: string;
  /**
   * Estado en una sola frase, para la tarjeta del listado. Es el resumen corto
   * de `whatIsHappening`, sin valoraciones ni pronósticos.
   */
  statusLine: LocalizedText;
  /** "Qué está pasando", en lenguaje claro. */
  whatIsHappening: LocalizedText;
  /** "Qué viene ahora". */
  whatComesNext: LocalizedText;
  /**
   * Plazo orientativo. Solo se rellena cuando depende de la Administración,
   * y la interfaz lo presenta siempre como orientativo.
   */
  administrativeEstimate?: LocalizedText;
  lawyerId: string;
  actions: CaseAction[];
  firmDocs: FirmDoc[];
  docRequests: DocRequest[];
  uploadedDocs: UploadedDoc[];
  keyDates: KeyDate[];
  expiries: DocExpiry[];
}

export type AuthorizedPersonScope = "economico" | "lectura" | "documentos";

export interface AuthorizedPerson {
  id: string;
  name: string;
  relationship: LocalizedText;
  scopes: AuthorizedPersonScope[];
  addedOn: string;
  /** Asuntos a los que alcanza el permiso. */
  caseIds: string[];
}

export interface AccessLogEntry {
  id: string;
  date: string;
  device: LocalizedText;
  location: string;
  /** Quién accedió: el propio cliente o una persona autorizada. */
  actor: string;
  /** Marca los accesos de terceros, para etiquetarlos en el idioma del portal. */
  actorIsAuthorized?: boolean;
}

export interface Invoice {
  id: string;
  number: string;
  date: string;
  concept: LocalizedText;
  caseId: string;
  amount: number;
  status: "pagada" | "pendiente";
  dueDate?: string;
}

export interface FundProvision {
  id: string;
  caseId: string;
  concept: LocalizedText;
  /**
   * Quién cobra realmente el dinero (Hacienda, notaría, Registro, perito).
   * Es lo que distingue una provisión de una factura de honorarios: el despacho
   * no ingresa este importe, lo recibe para pagarlo en nombre del cliente.
   */
  payee: LocalizedText;
  amount: number;
  requestedOn: string;
  status: "pagada" | "pendiente";
  paidOn?: string;
  dueDate?: string;
}

export interface Engagement {
  id: string;
  caseId: string;
  acceptedOn: string;
  scope: LocalizedText;
  amount: number;
  /** Cómo se factura: fijo, por fases, etc. */
  terms: LocalizedText;
}

export interface Message {
  id: string;
  caseId: string;
  from: "cliente" | "despacho";
  authorName: string;
  date: string;
  body: LocalizedText;
  attachment?: Attachment;
  read: boolean;
}

export interface Client {
  id: string;
  /** Credenciales de demostración. */
  email: string;
  password: string;
  name: string;
  phone: string;
  address: LocalizedText;
  idDocument: string;
  lastAccess: string;
  notifyByEmail: boolean;
  notifyBySms: boolean;
  authorizedPeople: AuthorizedPerson[];
  accessLog: AccessLogEntry[];
  /** Resumen mostrado en el selector de perfiles de la demo. */
  demoBlurb: LocalizedText;
}

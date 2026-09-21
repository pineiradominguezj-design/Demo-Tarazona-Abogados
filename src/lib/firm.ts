/**
 * DATOS DE LA VISTA INTERNA DEL DESPACHO — TODO FICTICIO.
 *
 * `data.ts` modela lo que ve el cliente. Este fichero modela lo que ve el
 * despacho *sobre* ese mismo material: quién puede publicar, qué plantillas hay,
 * qué documentos se piden en cada tipo de asunto y qué ha pasado en el portal.
 *
 * Los tipos viven aquí y no en `types.ts` porque `types.ts` es el modelo de
 * dominio del portal del cliente: nada de esto llega nunca a su pantalla.
 *
 * Esta vista NO es un gestor de expedientes ni un programa de facturación. Solo
 * decide qué ve el cliente y tramita lo que el cliente envía.
 */

import type { AreaId, CaseActionKind, LocalizedText } from "./types";

/* ------------------------------------------------------------------ */
/* EQUIPO                                                              */
/* ------------------------------------------------------------------ */

/**
 * Qué puede hacer cada persona con un borrador. La distinción es el único
 * permiso que importa en este portal: publicar es lo que hace visible algo al
 * cliente, y por eso no todo el mundo lo tiene.
 */
export type TeamPermission = "publica" | "redacta";

export interface TeamMember {
  /** Coincide con el id de `LAWYERS` cuando la persona es letrada. */
  id: string;
  name: string;
  initials: string;
  role: LocalizedText;
  permission: TeamPermission;
  /** Áreas cuyos expedientes ve. Vacío = todas. */
  areas: AreaId[];
}

export const TEAM: TeamMember[] = [
  {
    id: "l1",
    name: "Lucía Herrero Campos",
    initials: "LH",
    role: { es: "Responsable de Extranjería", en: "Head of Immigration" },
    permission: "publica",
    areas: ["extranjeria"],
  },
  {
    id: "l2",
    name: "Daniel Prieto Rubio",
    initials: "DP",
    role: { es: "Responsable de Derecho Penal", en: "Head of Criminal Law" },
    permission: "publica",
    areas: ["penal"],
  },
  {
    id: "l3",
    name: "Carmen Serrano Molina",
    initials: "CS",
    role: {
      es: "Civil, familia e inmobiliario",
      en: "Civil, family and real estate",
    },
    permission: "publica",
    areas: ["civil", "inmobiliario"],
  },
  {
    id: "l4",
    name: "Pablo Cano Ibáñez",
    initials: "PC",
    role: { es: "Responsable de Laboral", en: "Head of Employment Law" },
    permission: "publica",
    areas: ["laboral"],
  },
  {
    id: "t5",
    name: "Nerea Duarte Salas",
    initials: "ND",
    role: { es: "Tramitación procesal", en: "Case handler" },
    permission: "redacta",
    areas: ["extranjeria", "civil", "inmobiliario"],
  },
  {
    id: "t6",
    name: "Iván Nieto Cuesta",
    initials: "IN",
    role: { es: "Administración y recepción", en: "Office and front desk" },
    permission: "redacta",
    areas: [],
  },
];

/**
 * Quién se supone que está mirando la pantalla. No hay sesión de despacho —la
 * demostración entra directa—, pero el filtro «Solo lo mío» necesita un «yo».
 *
 * Es Carmen a propósito: lleva dos expedientes, uno con un borrador esperando
 * y otro sin nada pendiente. Así el filtro se nota (el tablero pasa de cinco
 * filas a dos) y, sobre todo, su panel de pendientes queda en un solo asunto:
 * al publicarlo se vacía y sale el estado «Todo al día», que de otro modo no
 * habría manera de enseñar sin ir tachando el trabajo de todo el despacho.
 */
export const CURRENT_USER_ID = "l3";

/** Qué mira la pantalla de Hoy: todo el despacho o solo los asuntos propios. */
export type FirmScope = "all" | "mine";

export function getTeamMember(id: string): TeamMember | undefined {
  return TEAM.find((m) => m.id === id);
}

/* ------------------------------------------------------------------ */
/* ACCESOS DE CLIENTE                                                  */
/* ------------------------------------------------------------------ */

export type AccessStatus = "activo" | "invitado" | "suspendido";

export interface ClientAccess {
  clientId: string;
  status: AccessStatus;
  /** Código interno con el que el despacho identifica al cliente. */
  code: string;
  invitedOn: string;
}

/*
 * Los tres tienen el acceso activo porque los tres entran en la demostración y
 * los tres tienen registro de accesos: marcar a uno como "invitado" diría que
 * no ha entrado nunca, y su propio historial lo desmentiría. Los estados
 * "invitado" y "suspendido" se enseñan en vivo desde los botones de la ficha.
 */
export const CLIENT_ACCESS: ClientAccess[] = [
  { clientId: "cli-1", status: "activo", code: "EXP-0148", invitedOn: "2026-05-04" },
  { clientId: "cli-2", status: "activo", code: "EXP-0231", invitedOn: "2026-04-15" },
  { clientId: "cli-3", status: "activo", code: "EXP-0034", invitedOn: "2026-09-02" },
];

export function getClientAccess(clientId: string): ClientAccess | undefined {
  return CLIENT_ACCESS.find((a) => a.clientId === clientId);
}

/* ------------------------------------------------------------------ */
/* PLANTILLAS DE ACTUACIONES                                           */
/* ------------------------------------------------------------------ */

/**
 * Textos base en lenguaje claro. El despacho los elige al redactar un borrador
 * y luego los ajusta: la plantilla es un punto de partida, no un automatismo.
 */
export interface ActionTemplate {
  id: string;
  /** `null` = sirve para cualquier área. */
  area: AreaId | null;
  label: LocalizedText;
  kind: CaseActionKind;
  title: LocalizedText;
  detail: LocalizedText;
  formalName: LocalizedText;
}

export const ACTION_TEMPLATES: ActionTemplate[] = [
  {
    id: "tpl-1",
    area: null,
    label: { es: "Escrito presentado", en: "Document filed" },
    kind: "procedimiento",
    title: {
      es: "Hemos presentado el escrito",
      en: "We have filed the document",
    },
    detail: {
      es: "Ya está presentado y tenemos el justificante. A partir de ahora toca esperar a que nos contesten; te avisamos en cuanto haya respuesta.",
      en: "It has been filed and we have the receipt. From now on we wait for a reply; we will let you know as soon as there is one.",
    },
    formalName: {
      es: "Presentación telemática de escrito con acuse de recibo",
      en: "Electronic filing with acknowledgement of receipt",
    },
  },
  {
    id: "tpl-2",
    area: null,
    label: { es: "Documentación recibida", en: "Documents received" },
    kind: "despacho",
    title: {
      es: "Hemos recibido tu documentación",
      en: "We have received your documents",
    },
    detail: {
      es: "Lo hemos revisado y está correcto. No necesitas hacer nada más por ahora.",
      en: "We have reviewed it and it is in order. There is nothing else you need to do for now.",
    },
    formalName: {
      es: "Incorporación de documentación aportada por el cliente",
      en: "Filing of documents provided by the client",
    },
  },
  {
    id: "tpl-3",
    area: "extranjeria",
    label: { es: "Cita de huellas", en: "Fingerprint appointment" },
    kind: "procedimiento",
    title: { es: "Ya tienes cita para las huellas", en: "Your fingerprint appointment is booked" },
    detail: {
      es: "Te hemos conseguido cita para la toma de huellas. Apunta la fecha y el lugar en el apartado de fechas señaladas; lleva el pasaporte y el justificante de la tasa.",
      en: "We have booked your fingerprint appointment. The date and place are in the key dates section; bring your passport and the fee receipt.",
    },
    formalName: {
      es: "Cita previa para toma de reseña decadactilar",
      en: "Appointment for fingerprint registration",
    },
  },
  {
    id: "tpl-4",
    area: null,
    label: { es: "Señalamiento de vista", en: "Hearing date set" },
    kind: "procedimiento",
    title: { es: "Ya hay fecha de juicio", en: "The hearing date is set" },
    detail: {
      es: "El juzgado ha señalado la fecha. La tienes en el apartado de fechas señaladas. Nos veremos antes para preparar la vista con calma.",
      en: "The court has set the date. You will find it in the key dates section. We will meet beforehand to prepare the hearing.",
    },
    formalName: {
      es: "Diligencia de señalamiento de juicio oral",
      en: "Order setting the trial date",
    },
  },
  {
    id: "tpl-5",
    area: null,
    label: { es: "Reunión con el cliente", en: "Meeting with the client" },
    kind: "despacho",
    title: { es: "Hemos tenido una reunión", en: "We have met" },
    detail: {
      es: "Repasamos juntos cómo va el asunto y los siguientes pasos. Si se te ocurre algo después, escríbenos por el portal.",
      en: "We went over how the matter is progressing and the next steps. If anything comes to mind afterwards, write to us through the portal.",
    },
    formalName: {
      es: "Reunión de seguimiento con el cliente",
      en: "Client progress meeting",
    },
  },
];

/* ------------------------------------------------------------------ */
/* FASES POR TIPO DE ASUNTO                                            */
/* ------------------------------------------------------------------ */

/**
 * Las fases que el despacho usa por defecto al abrir un expediente de cada
 * área. Son las mismas que el cliente ve en la barra de fases del portal.
 */
export const AREA_PHASES: Record<AreaId, LocalizedText[]> = {
  extranjeria: [
    { es: "Consulta y encargo", en: "Consultation and engagement" },
    { es: "Reunión de documentación", en: "Gathering documents" },
    { es: "Solicitud presentada", en: "Application filed" },
    { es: "Subsanación", en: "Additional information" },
    { es: "Resolución", en: "Decision" },
    { es: "Huellas y tarjeta", en: "Fingerprints and card" },
  ],
  penal: [
    { es: "Consulta y encargo", en: "Consultation and engagement" },
    { es: "Instrucción", en: "Investigation" },
    { es: "Escrito de defensa", en: "Defence statement" },
    { es: "Juicio oral", en: "Trial" },
    { es: "Sentencia", en: "Judgment" },
  ],
  civil: [
    { es: "Consulta y encargo", en: "Consultation and engagement" },
    { es: "Negociación", en: "Negotiation" },
    { es: "Convenio redactado", en: "Agreement drafted" },
    { es: "Ratificación", en: "Court ratification" },
    { es: "Resolución", en: "Decision" },
  ],
  laboral: [
    { es: "Consulta y encargo", en: "Consultation and engagement" },
    { es: "Conciliación previa", en: "Pre-court conciliation" },
    { es: "Demanda", en: "Claim filed" },
    { es: "Juicio", en: "Hearing" },
    { es: "Sentencia", en: "Judgment" },
  ],
  inmobiliario: [
    { es: "Consulta y encargo", en: "Consultation and engagement" },
    { es: "Comprobaciones previas", en: "Preliminary checks" },
    { es: "Arras", en: "Deposit agreement" },
    { es: "Escritura", en: "Deed of sale" },
    { es: "Impuestos y registro", en: "Taxes and registration" },
  ],
};

/* ------------------------------------------------------------------ */
/* LISTAS DE COMPROBACIÓN DE DOCUMENTOS                                */
/* ------------------------------------------------------------------ */

export interface ChecklistItem {
  id: string;
  name: LocalizedText;
  /** Explicación en lenguaje claro: es la que verá el cliente. */
  help: LocalizedText;
}

/**
 * Lo que se suele pedir en cada tipo de asunto. Extranjería viene desarrollada
 * porque es el área con la que arranca la demostración.
 */
export const DOC_CHECKLISTS: Record<AreaId, ChecklistItem[]> = {
  extranjeria: [
    {
      id: "chk-ext-1",
      name: { es: "Pasaporte completo", en: "Full passport" },
      help: {
        es: "Todas las páginas escritas, incluidas las de sellos. Sirve una foto legible con el móvil.",
        en: "Every page with writing on it, stamps included. A readable phone photo is fine.",
      },
    },
    {
      id: "chk-ext-2",
      name: { es: "Certificado de empadronamiento", en: "Certificate of residence registration" },
      help: {
        es: "Lo expide tu ayuntamiento. Tiene que estar emitido en los últimos tres meses.",
        en: "Issued by your town hall. It must be no more than three months old.",
      },
    },
    {
      id: "chk-ext-3",
      name: { es: "Certificado bancario", en: "Bank certificate" },
      help: {
        es: "Lo emite tu banco y acredita que la inversión sigue a tu nombre. No vale un extracto corriente.",
        en: "Issued by your bank, confirming the investment is still in your name. A regular statement is not enough.",
      },
    },
    {
      id: "chk-ext-4",
      name: { es: "Seguro médico", en: "Health insurance" },
      help: {
        es: "Certificado de la aseguradora con la cobertura y las fechas de vigencia.",
        en: "Certificate from your insurer showing the cover and the dates it runs.",
      },
    },
    {
      id: "chk-ext-5",
      name: { es: "Certificado de antecedentes penales", en: "Criminal record certificate" },
      help: {
        es: "Del país de origen y de los países donde hayas residido los últimos cinco años, traducido y legalizado.",
        en: "From your home country and any country you have lived in for the last five years, translated and legalised.",
      },
    },
  ],
  penal: [
    {
      id: "chk-pen-1",
      name: { es: "Documento de identidad", en: "Identity document" },
      help: { es: "DNI, NIE o pasaporte en vigor.", en: "Valid national ID, NIE or passport." },
    },
    {
      id: "chk-pen-2",
      name: { es: "Notificaciones recibidas", en: "Notices received" },
      help: {
        es: "Cualquier papel que te hayan entregado el juzgado o la policía.",
        en: "Any document handed to you by the court or the police.",
      },
    },
  ],
  civil: [
    {
      id: "chk-civ-1",
      name: { es: "Libro de familia o certificado de matrimonio", en: "Family book or marriage certificate" },
      help: { es: "Copia completa.", en: "Full copy." },
    },
    {
      id: "chk-civ-2",
      name: { es: "Últimas tres nóminas", en: "Last three payslips" },
      help: {
        es: "De ambas partes, si las hay.",
        en: "From both parties, where applicable.",
      },
    },
  ],
  laboral: [
    {
      id: "chk-lab-1",
      name: { es: "Contrato de trabajo y carta de despido", en: "Employment contract and dismissal letter" },
      help: {
        es: "El contrato con todos sus anexos y la carta tal y como te la entregaron, sin recortar.",
        en: "The contract with all its annexes and the letter exactly as it was handed to you, uncropped.",
      },
    },
    {
      id: "chk-lab-2",
      name: { es: "Nóminas de los doce últimos meses", en: "Payslips for the last twelve months" },
      help: {
        es: "Sirven para calcular el salario regulador. Si falta alguna, dínoslo y la pedimos a la empresa.",
        en: "We use them to calculate the reference salary. If any is missing, tell us and we will request it from the company.",
      },
    },
  ],
  inmobiliario: [
    {
      id: "chk-inm-1",
      name: { es: "Documento de identidad", en: "Identity document" },
      help: { es: "De todos los compradores.", en: "For every buyer." },
    },
    {
      id: "chk-inm-2",
      name: { es: "Justificante de la señal", en: "Proof of the deposit payment" },
      help: {
        es: "La transferencia de las arras, con fecha y concepto.",
        en: "The deposit transfer, showing date and reference.",
      },
    },
  ],
};

/* ------------------------------------------------------------------ */
/* MOTIVOS DE RECHAZO                                                  */
/* ------------------------------------------------------------------ */

/** Los motivos más frecuentes, redactados para que el cliente los entienda. */
export const REJECTION_REASONS: { id: string; text: LocalizedText }[] = [
  {
    id: "rej-1",
    text: {
      es: "La imagen está cortada: falta parte del documento.",
      en: "The image is cropped: part of the document is missing.",
    },
  },
  {
    id: "rej-2",
    text: {
      es: "No se lee bien. Necesitamos una copia más nítida.",
      en: "It is not legible. We need a clearer copy.",
    },
  },
  {
    id: "rej-3",
    text: {
      es: "El documento está caducado. Necesitamos uno en vigor.",
      en: "The document has expired. We need a current one.",
    },
  },
  {
    id: "rej-4",
    text: {
      es: "Falta la traducción jurada o la legalización.",
      en: "The sworn translation or legalisation is missing.",
    },
  },
];

/* ------------------------------------------------------------------ */
/* CONFIGURACIÓN DEL DESPACHO                                          */
/* ------------------------------------------------------------------ */

/**
 * Lo que el despacho puede ajustar sobre el portal. No incluye nada de gestión
 * interna: solo lo que cambia la experiencia del cliente.
 */
export const FIRM_SETTINGS = {
  /** Compromiso de respuesta en mensajería, en días laborables. */
  responseDays: 2,
  urgencyPhone: "+34 600 10 20 31",
  urgencyHours: {
    es: "Fuera de horario, solo para detenciones y citaciones urgentes",
    en: "Out of hours, for arrests and urgent summonses only",
  } as LocalizedText,
  locales: [
    { id: "es", label: { es: "Español", en: "Spanish" } as LocalizedText, enabled: true },
    { id: "en", label: { es: "Inglés", en: "English" } as LocalizedText, enabled: true },
    { id: "uk", label: { es: "Ucraniano", en: "Ukrainian" } as LocalizedText, enabled: false },
    { id: "ar", label: { es: "Árabe", en: "Arabic" } as LocalizedText, enabled: false },
  ],
  /** Qué se publica solo con que alguien lo redacte, y qué exige aprobación. */
  publishDefaults: [
    {
      id: "pd-1",
      label: { es: "Actuaciones del procedimiento", en: "Procedural steps" } as LocalizedText,
      help: {
        es: "Lo que ocurre ante juzgado, Administración o notaría.",
        en: "What happens before a court, a public authority or a notary.",
      } as LocalizedText,
      enabled: true,
    },
    {
      id: "pd-2",
      label: { es: "Actuaciones del despacho", en: "Firm actions" } as LocalizedText,
      help: {
        es: "Reuniones, llamadas y trabajo interno. Se publica solo si aporta algo al cliente.",
        en: "Meetings, calls and internal work. Published only when it tells the client something.",
      } as LocalizedText,
      enabled: false,
    },
    {
      id: "pd-3",
      label: { es: "Documentos adjuntos a la actuación", en: "Documents attached to the update" } as LocalizedText,
      help: {
        es: "El cliente puede descargarlos desde el expediente.",
        en: "The client can download them from the file.",
      } as LocalizedText,
      enabled: true,
    },
    {
      id: "pd-4",
      label: { es: "Facturas y provisiones", en: "Invoices and payments on account" } as LocalizedText,
      help: {
        es: "Nunca se publican automáticamente: las revisa siempre una persona.",
        en: "Never published automatically: a person always reviews them first.",
      } as LocalizedText,
      enabled: false,
    },
  ],
} as const;

/* ------------------------------------------------------------------ */
/* MENSAJERÍA — RESPUESTAS RÁPIDAS (maqueta)                           */
/* ------------------------------------------------------------------ */

export const QUICK_REPLIES: { id: string; text: LocalizedText }[] = [
  {
    id: "qr-1",
    text: {
      es: "Recibido, gracias. Lo revisamos y te decimos algo esta semana.",
      en: "Received, thank you. We will review it and get back to you this week.",
    },
  },
  {
    id: "qr-2",
    text: {
      es: "Ya está presentado. Te he subido el justificante al expediente.",
      en: "It has been filed. I have uploaded the receipt to your file.",
    },
  },
  {
    id: "qr-3",
    text: {
      es: "Te llamo esta tarde para explicártelo con calma.",
      en: "I will call you this afternoon to talk it through.",
    },
  },
];

/* ------------------------------------------------------------------ */
/* ACTIVIDAD                                                           */
/* ------------------------------------------------------------------ */

export type ActivityKind =
  | "publicacion"
  | "documento"
  | "acceso"
  | "descarga"
  | "mensaje"
  | "acceso-alta";

export interface ActivityEntry {
  id: string;
  date: string;
  kind: ActivityKind;
  actor: string;
  /** Marca los registros generados por el cliente, no por el despacho. */
  byClient?: boolean;
  detail: LocalizedText;
  caseId?: string;
}

export const ACTIVITY_LOG: ActivityEntry[] = [
  {
    id: "act-1",
    date: "2026-09-16T18:42:00",
    kind: "acceso",
    actor: "Olena Kovalenko",
    byClient: true,
    detail: { es: "Entró en el portal desde iPhone · Safari", en: "Signed in from iPhone · Safari" },
  },
  {
    id: "act-2",
    date: "2026-09-16T18:45:00",
    kind: "descarga",
    actor: "Olena Kovalenko",
    byClient: true,
    caseId: "c-ext",
    detail: {
      es: "Descargó «Justificante de presentación»",
      en: "Downloaded “Filing receipt”",
    },
  },
  {
    id: "act-3",
    date: "2026-09-16T09:05:00",
    kind: "mensaje",
    actor: "Olena Kovalenko",
    byClient: true,
    caseId: "c-ext",
    detail: { es: "Escribió un mensaje", en: "Wrote a message" },
  },
  {
    id: "act-4",
    date: "2026-09-15T12:10:00",
    kind: "publicacion",
    actor: "Lucía Herrero Campos",
    caseId: "c-ext",
    detail: {
      es: "Publicó «La Administración nos pide dos documentos más»",
      en: "Published “The authority has asked us for two more documents”",
    },
  },
  {
    id: "act-5",
    date: "2026-09-15T11:58:00",
    kind: "documento",
    actor: "Nerea Duarte Salas",
    caseId: "c-ext",
    detail: {
      es: "Pidió al cliente el certificado bancario y el seguro médico",
      en: "Requested the bank certificate and health insurance from the client",
    },
  },
  {
    id: "act-6",
    date: "2026-09-15T20:05:00",
    kind: "acceso",
    actor: "Javier Molina Ruiz",
    byClient: true,
    detail: { es: "Entró en el portal desde Android · Chrome", en: "Signed in from Android · Chrome" },
  },
  {
    id: "act-7",
    date: "2026-09-14T17:20:00",
    kind: "publicacion",
    actor: "Daniel Prieto Rubio",
    caseId: "c-pen",
    detail: {
      es: "Publicó «Ya hay fecha de juicio»",
      en: "Published “The trial date is set”",
    },
  },
  {
    id: "act-8",
    date: "2026-09-12T11:30:00",
    kind: "acceso",
    actor: "Andrii Kovalenko",
    byClient: true,
    detail: {
      es: "Entró como tercero autorizado desde Android · Chrome",
      en: "Signed in as an authorised third party from Android · Chrome",
    },
  },
  {
    id: "act-9",
    date: "2026-09-10T10:02:00",
    kind: "documento",
    actor: "Carmen Serrano Molina",
    caseId: "c-inm",
    detail: {
      es: "Rechazó «Nómina julio» — no se leía bien",
      en: "Rejected “July payslip” — not legible",
    },
  },
  {
    id: "act-10",
    date: "2026-09-02T09:30:00",
    kind: "acceso-alta",
    actor: "Iván Nieto Cuesta",
    detail: {
      es: "Envió la invitación de acceso a Marta Ibáñez Cortés",
      en: "Sent the access invitation to Marta Ibáñez Cortés",
    },
  },
  {
    id: "act-11",
    date: "2026-08-28T16:12:00",
    kind: "publicacion",
    actor: "Pablo Cano Ibáñez",
    caseId: "c-lab",
    detail: {
      es: "Publicó «Presentamos la papeleta de conciliación»",
      en: "Published “We filed the conciliation claim”",
    },
  },
  {
    id: "act-12",
    date: "2026-08-20T13:44:00",
    kind: "descarga",
    actor: "Gestoría Alcores S.L.",
    byClient: true,
    caseId: "c-inm",
    detail: {
      es: "Descargó «Contrato de arras» como tercero autorizado",
      en: "Downloaded “Deposit agreement” as an authorised third party",
    },
  },
];

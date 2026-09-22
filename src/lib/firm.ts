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
    name: "Álvaro Benlloch Esteve",
    initials: "AB",
    role: {
      es: "Responsable de Derecho laboral",
      en: "Head of Employment Law",
    },
    permission: "publica",
    areas: ["laboral"],
  },
  {
    id: "l2",
    name: "Marta Ferrandis Gil",
    initials: "MF",
    role: {
      es: "Responsable de Inmobiliario y Sucesiones",
      en: "Head of Real Estate and Probate",
    },
    permission: "publica",
    areas: ["inmobiliario", "sucesiones"],
  },
  {
    id: "l3",
    name: "Ignacio Peris Almela",
    initials: "IP",
    role: { es: "Derecho civil y penal", en: "Civil and criminal law" },
    permission: "publica",
    areas: ["civil", "penal"],
  },
  {
    id: "l4",
    name: "Celia Bonet Ramos",
    initials: "CB",
    role: {
      es: "Protección de datos y compliance",
      en: "Data protection and compliance",
    },
    permission: "publica",
    areas: ["datos"],
  },
  {
    id: "t5",
    name: "Vicent Ortells Sanchis",
    initials: "VO",
    role: { es: "Tramitación procesal", en: "Case handler" },
    permission: "redacta",
    areas: ["laboral", "civil", "penal"],
  },
  {
    id: "t6",
    name: "Lucía Navarro Ripoll",
    initials: "LN",
    role: { es: "Administración y recepción", en: "Office and front desk" },
    permission: "redacta",
    areas: [],
  },
];

/**
 * Quién se supone que está mirando la pantalla. No hay sesión de despacho —la
 * demostración entra directa—, pero el filtro «Solo lo mío» necesita un «yo».
 *
 * Es Marta a propósito: lleva dos expedientes, uno con un borrador esperando
 * y otro sin nada pendiente. Así el filtro se nota (el tablero pasa de cinco
 * filas a dos) y, sobre todo, su panel de pendientes queda en un solo asunto:
 * al publicarlo se vacía y sale el estado «Todo al día», que de otro modo no
 * habría manera de enseñar sin ir tachando el trabajo de todo el despacho.
 */
export const CURRENT_USER_ID = "l2";

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
  { clientId: "cli-1", status: "activo", code: "EXP-0061", invitedOn: "2026-05-18" },
  { clientId: "cli-2", status: "activo", code: "EXP-0198", invitedOn: "2026-04-27" },
  { clientId: "cli-3", status: "activo", code: "EXP-0087", invitedOn: "2026-07-06" },
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
    area: "inmobiliario",
    label: { es: "Cita en notaría", en: "Notary appointment" },
    kind: "procedimiento",
    title: {
      es: "Ya tenemos día y hora en la notaría",
      en: "The notary appointment is booked",
    },
    detail: {
      es: "La notaría ha confirmado la firma. Tienes la fecha y la dirección en el apartado de fechas señaladas; lleva tu documento de identidad y el medio de pago acordado. Te acompañamos a la firma.",
      en: "The notary has confirmed the signing. The date and address are in the key dates section; bring your identity document and the agreed means of payment. We will be with you at the signing.",
    },
    formalName: {
      es: "Señalamiento para el otorgamiento de escritura pública",
      en: "Appointment for the execution of the public deed",
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
    { es: "Contrato de arras", en: "Deposit agreement" },
    { es: "Escritura pública", en: "Signing before the notary" },
    { es: "Impuestos y registro", en: "Taxes and registration" },
  ],
  sucesiones: [
    { es: "Consulta y encargo", en: "Consultation and engagement" },
    { es: "Documentación y últimas voluntades", en: "Documents and will search" },
    { es: "Escritura de aceptación", en: "Deed of acceptance" },
    { es: "Impuestos", en: "Taxes" },
    { es: "Inscripción registral", en: "Land Registry entry" },
  ],
  civil: [
    { es: "Consulta y encargo", en: "Consultation and engagement" },
    { es: "Informe pericial", en: "Expert report" },
    { es: "Reclamación extrajudicial", en: "Out-of-court claim" },
    { es: "Demanda", en: "Claim filed" },
    { es: "Juicio", en: "Hearing" },
  ],
  penal: [
    { es: "Consulta y encargo", en: "Consultation and engagement" },
    { es: "Instrucción", en: "Investigation" },
    { es: "Preparación del juicio", en: "Trial preparation" },
    { es: "Juicio oral", en: "Trial" },
    { es: "Sentencia", en: "Judgment" },
  ],
  datos: [
    { es: "Consulta y encargo", en: "Consultation and engagement" },
    { es: "Auditoría de tratamientos", en: "Data processing audit" },
    { es: "Plan de adecuación", en: "Compliance plan" },
    { es: "Implantación", en: "Implementation" },
    { es: "Seguimiento", en: "Ongoing review" },
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
 * Lo que se suele pedir en cada tipo de asunto. Inmobiliario viene desarrollada
 * porque es el área con la que arranca la demostración.
 */
export const DOC_CHECKLISTS: Record<AreaId, ChecklistItem[]> = {
  inmobiliario: [
    {
      id: "chk-inm-1",
      name: { es: "Documento de identidad", en: "Identity document" },
      help: {
        es: "DNI, NIE o pasaporte en vigor, de todas las personas que compran. Es con lo que te identificará la notaría el día de la firma.",
        en: "Valid national ID, NIE or passport for everyone buying. It is what the notary will identify you with on the day of the signing.",
      },
    },
    {
      id: "chk-inm-2",
      name: {
        es: "Documentación sobre el origen de los fondos",
        en: "Documents on the source of funds",
      },
      help: {
        es: "La ley de prevención del blanqueo de capitales obliga al despacho y a la notaría a acreditar de dónde procede el dinero. Sirven los extractos de la cuenta de los últimos seis meses y el justificante de la venta o el ahorro con que se paga.",
        en: "Anti-money-laundering law requires the firm and the notary to evidence where the money comes from. Bank statements for the last six months and proof of the sale or savings used to pay are enough.",
      },
    },
    {
      id: "chk-inm-3",
      name: { es: "Justificante de la señal", en: "Proof of the deposit payment" },
      help: {
        es: "La transferencia de las arras, con fecha y concepto. La notaría tiene que reflejar en la escritura qué se pagó y cuándo.",
        en: "The deposit transfer, showing date and reference. The notary has to record in the deed what was paid and when.",
      },
    },
    {
      id: "chk-inm-4",
      name: {
        es: "Certificado de eficiencia energética",
        en: "Energy performance certificate",
      },
      help: {
        es: "Lo aporta la parte vendedora y hay que entregarlo en la firma. Si no lo tienen, dínoslo con tiempo: conseguirlo lleva unos días.",
        en: "The seller provides it and it has to be handed over at the signing. If they do not have it, tell us in good time: obtaining one takes a few days.",
      },
    },
    {
      id: "chk-inm-5",
      name: {
        es: "Oferta vinculante de la hipoteca, si la hay",
        en: "Binding mortgage offer, if there is one",
      },
      help: {
        es: "La ficha europea de información normalizada que te entrega el banco. La necesitamos para cuadrar el calendario con la notaría, que tiene que informarte antes de la firma.",
        en: "The standardised European information sheet your bank gives you. We need it to line up the timetable with the notary, who must brief you before the signing.",
      },
    },
  ],
  sucesiones: [
    {
      id: "chk-suc-1",
      name: { es: "Certificado de defunción", en: "Death certificate" },
      help: {
        es: "El original que entrega la funeraria o el que expide el Registro Civil. Con una foto legible nos vale para empezar.",
        en: "The original given by the funeral home, or the one issued by the Civil Registry. A legible photo is enough to start with.",
      },
    },
    {
      id: "chk-suc-2",
      name: {
        es: "Certificados de saldo de las cuentas bancarias",
        en: "Bank account balance certificates",
      },
      help: {
        es: "Pídelos en cada entidad indicando que son para una herencia: deben reflejar el saldo el día del fallecimiento, no el de hoy.",
        en: "Ask each bank stating they are for an estate: they must show the balance on the date of death, not today's.",
      },
    },
    {
      id: "chk-suc-3",
      name: {
        es: "Escrituras de los inmuebles y último recibo del IBI",
        en: "Property deeds and latest council tax receipt",
      },
      help: {
        es: "De la escritura necesitamos el precio de compra y del recibo el valor catastral. Son los dos datos con los que se calculan los impuestos de la herencia.",
        en: "From the deed we need the purchase price, and from the receipt the cadastral value. Those are the two figures used to calculate the estate's taxes.",
      },
    },
  ],
  laboral: [
    {
      id: "chk-lab-1",
      name: {
        es: "Contrato de trabajo y carta de despido",
        en: "Employment contract and dismissal letter",
      },
      help: {
        es: "El contrato con todos sus anexos y la carta tal y como te la entregaron, sin recortar.",
        en: "The contract with all its annexes and the letter exactly as it was handed to you, uncropped.",
      },
    },
    {
      id: "chk-lab-2",
      name: {
        es: "Nóminas de los doce últimos meses",
        en: "Payslips for the last twelve months",
      },
      help: {
        es: "Sirven para calcular el salario regulador. Si falta alguna, dínoslo y la pedimos a la empresa.",
        en: "We use them to calculate the reference salary. If any is missing, tell us and we will request it from the company.",
      },
    },
    {
      id: "chk-lab-3",
      name: {
        es: "Certificado de la prestación por desempleo",
        en: "Unemployment benefit certificate",
      },
      help: {
        es: "Se descarga de la sede electrónica del SEPE. Lo que cobres de paro se descuenta de lo que en su caso se reclame, así que hace falta el importe exacto.",
        en: "You can download it from the SEPE online office. Unemployment benefit is offset against anything claimed, so we need the exact amount.",
      },
    },
  ],
  civil: [
    {
      id: "chk-civ-1",
      name: {
        es: "Contrato o escritura del que nace la reclamación",
        en: "Contract or deed the claim arises from",
      },
      help: {
        es: "Con todos sus anexos y, si los hay, los documentos de entrega.",
        en: "With all its annexes and, where applicable, the handover documents.",
      },
    },
    {
      id: "chk-civ-2",
      name: {
        es: "Fotografías o vídeos de los daños",
        en: "Photos or videos of the damage",
      },
      help: {
        es: "Desde que aparecieron, aunque sean del móvil. Si conservan la fecha original, mejor.",
        en: "From when they first appeared, phone pictures are fine. Better still if they keep their original date.",
      },
    },
    {
      id: "chk-civ-3",
      name: {
        es: "Comunicaciones con la otra parte",
        en: "Correspondence with the other party",
      },
      help: {
        es: "Correos, mensajes o partes de incidencia. Interesan especialmente los que reconozcan el problema.",
        en: "Emails, messages or incident reports. Those acknowledging the problem are especially useful.",
      },
    },
  ],
  penal: [
    {
      id: "chk-pen-1",
      name: { es: "Documento de identidad", en: "Identity document" },
      help: {
        es: "DNI, NIE o pasaporte en vigor.",
        en: "Valid national ID, NIE or passport.",
      },
    },
    {
      id: "chk-pen-2",
      name: { es: "Notificaciones recibidas", en: "Notices received" },
      help: {
        es: "Cualquier papel que te hayan entregado el juzgado o la policía, incluida la copia del atestado si te la dieron.",
        en: "Any document handed to you by the court or the police, including a copy of the police report if you were given one.",
      },
    },
  ],
  datos: [
    {
      id: "chk-dat-1",
      name: {
        es: "Registro de actividades de tratamiento",
        en: "Record of processing activities",
      },
      help: {
        es: "Si ya lo tenéis, la versión vigente; si no, lo elaboramos nosotros a partir de la auditoría.",
        en: "The current version if you already have one; if not, we will draw it up from the audit.",
      },
    },
    {
      id: "chk-dat-2",
      name: {
        es: "Contratos con proveedores que traten datos",
        en: "Contracts with suppliers who process data",
      },
      help: {
        es: "Nóminas, informática, hosting, marketing. Son los que hay que revisar como encargados del tratamiento.",
        en: "Payroll, IT, hosting, marketing. These are the ones to review as data processors.",
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
  urgencyPhone: "+34 678 70 07 11",
  urgencyHours: {
    es: "Fuera de horario, solo para detenciones y citaciones urgentes",
    en: "Out of hours, for arrests and urgent summonses only",
  } as LocalizedText,
  locales: [
    { id: "es", label: { es: "Español", en: "Spanish" } as LocalizedText, enabled: true },
    { id: "en", label: { es: "Inglés", en: "English" } as LocalizedText, enabled: true },
    { id: "va", label: { es: "Valenciano", en: "Valencian" } as LocalizedText, enabled: false },
    { id: "de", label: { es: "Alemán", en: "German" } as LocalizedText, enabled: false },
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
    date: "2026-09-21T20:35:00",
    kind: "mensaje",
    actor: "Sergio Almenar Ballester",
    byClient: true,
    caseId: "c-civ",
    detail: { es: "Escribió un mensaje", en: "Wrote a message" },
  },
  {
    id: "act-2",
    date: "2026-09-21T20:31:00",
    kind: "documento",
    actor: "Sergio Almenar Ballester",
    byClient: true,
    caseId: "c-civ",
    detail: {
      es: "Subió «Fotos humedades dormitorio»",
      en: "Uploaded “Bedroom damp photos”",
    },
  },
  {
    id: "act-3",
    date: "2026-09-21T19:20:00",
    kind: "acceso",
    actor: "Helen Whitmore Clarke",
    byClient: true,
    detail: {
      es: "Entró en el portal desde iPhone · Safari",
      en: "Signed in from iPhone · Safari",
    },
  },
  {
    id: "act-4",
    date: "2026-09-19T09:50:00",
    kind: "documento",
    actor: "Marta Ferrandis Gil",
    caseId: "c-suc",
    detail: {
      es: "Rechazó «Nota simple Alboraia» — no acredita el precio de compra",
      en: "Rejected “Alboraia registry extract” — it does not show the purchase price",
    },
  },
  {
    id: "act-5",
    date: "2026-09-18T14:02:00",
    kind: "documento",
    actor: "Rubén Escrivá Tormo",
    byClient: true,
    caseId: "c-lab",
    detail: {
      es: "Subió «Certificado SEPE»",
      en: "Uploaded “SEPE certificate”",
    },
  },
  {
    id: "act-6",
    date: "2026-09-18T13:20:00",
    kind: "publicacion",
    actor: "Marta Ferrandis Gil",
    caseId: "c-inm",
    detail: {
      es: "Publicó «Ya tenemos día y hora en la notaría»",
      en: "Published “The notary appointment is booked”",
    },
  },
  {
    id: "act-7",
    date: "2026-09-18T13:05:00",
    kind: "documento",
    actor: "Vicent Ortells Sanchis",
    caseId: "c-inm",
    detail: {
      es: "Pidió al cliente el justificante de la transferencia del precio",
      en: "Requested the proof of payment of the price from the client",
    },
  },
  {
    id: "act-8",
    date: "2026-09-16T16:10:00",
    kind: "publicacion",
    actor: "Ignacio Peris Almela",
    caseId: "c-civ",
    detail: {
      es: "Publicó «Reclamamos por escrito a la promotora y a su aseguradora»",
      en: "Published “We claimed in writing from the developer and its insurer”",
    },
  },
  {
    id: "act-9",
    date: "2026-09-15T17:44:00",
    kind: "acceso",
    actor: "Peter Whitmore Clarke",
    byClient: true,
    detail: {
      es: "Entró como tercero autorizado desde Windows · Edge",
      en: "Signed in as an authorised third party from Windows · Edge",
    },
  },
  {
    id: "act-10",
    date: "2026-09-14T12:25:00",
    kind: "publicacion",
    actor: "Ignacio Peris Almela",
    caseId: "c-pen",
    detail: {
      es: "Publicó «Ya hay fecha de juicio»",
      en: "Published “The trial date is set”",
    },
  },
  {
    id: "act-11",
    date: "2026-09-10T12:34:00",
    kind: "descarga",
    actor: "Amparo Ballester Sanz",
    byClient: true,
    caseId: "c-pen",
    detail: {
      es: "Descargó «Factura 2026/0637» como tercero autorizado",
      en: "Downloaded “Invoice 2026/0637” as an authorised third party",
    },
  },
  {
    id: "act-12",
    date: "2026-07-06T09:30:00",
    kind: "acceso-alta",
    actor: "Lucía Navarro Ripoll",
    detail: {
      es: "Envió la invitación de acceso a Rubén Escrivá Tormo",
      en: "Sent the access invitation to Rubén Escrivá Tormo",
    },
  },
];

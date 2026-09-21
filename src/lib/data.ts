/**
 * DATOS DE DEMOSTRACIÓN — TODO FICTICIO.
 *
 * Ni los clientes, ni los profesionales, ni los expedientes, ni los importes
 * corresponden a personas o asuntos reales. Las referencias, fechas y organismos
 * son verosímiles a efectos de demostración únicamente.
 *
 * Fecha de referencia del escenario: 17 de septiembre de 2026.
 */

import type {
  Case,
  Client,
  Engagement,
  FundProvision,
  Invoice,
  Lawyer,
  Message,
} from "./types";

export const TODAY = "2026-09-17";

/*
 * La identidad del despacho NO vive aquí, sino en `src/config/identity.ts`.
 * Este fichero es solo el escenario de demostración.
 */

export const LAWYERS: Record<string, Lawyer> = {
  l1: {
    id: "l1",
    name: "Lucía Marco Herrero",
    role: { es: "Responsable de Extranjería", en: "Head of Immigration" },
    email: "l.marco@demo.despacho.es",
    phone: "+34 605 98 20 38",
    initials: "LM",
  },
  l2: {
    id: "l2",
    name: "Daniel Ortí Sanchis",
    role: { es: "Responsable de Derecho Penal", en: "Head of Criminal Law" },
    email: "d.orti@demo.despacho.es",
    phone: "+34 655 55 14 92",
    initials: "DO",
  },
  l3: {
    id: "l3",
    name: "Carmen Lloret Vidal",
    role: {
      es: "Civil, familia e inmobiliario",
      en: "Civil, family and real estate",
    },
    email: "c.lloret@demo.despacho.es",
    phone: "+34 605 98 20 38",
    initials: "CL",
  },
  l4: {
    id: "l4",
    name: "Pablo Escrivá Gil",
    role: {
      es: "Derecho ecuestre y deportivo",
      en: "Equestrian and sports law",
    },
    email: "p.escriva@demo.despacho.es",
    phone: "+34 655 55 14 92",
    initials: "PE",
  },
};

/* ------------------------------------------------------------------ */
/* EXPEDIENTES                                                         */
/* ------------------------------------------------------------------ */

const caseExtranjeria: Case = {
  id: "c-ext",
  clientId: "cli-1",
  ref: "EXT-2026-0148",
  area: "extranjeria",
  /*
   * Residencia de inversor por CAPITAL (Ley 14/2013), no por inmueble: la vía
   * inmobiliaria quedó derogada por la LO 1/2025, en vigor desde el 3/4/2025.
   * Por eso lo que se acredita es un certificado bancario, no una nota simple.
   */
  title: {
    es: "Renovación de residencia por inversión de capital",
    en: "Renewal of investor residence permit (capital investment)",
  },
  shortTitle: {
    es: "Residencia de inversor",
    en: "Investor residence",
  },
  phases: [
    { label: { es: "Consulta y encargo", en: "Consultation and engagement" } },
    { label: { es: "Reunión de documentación", en: "Gathering documents" } },
    { label: { es: "Solicitud presentada", en: "Application filed" } },
    { label: { es: "Subsanación", en: "Additional information" } },
    { label: { es: "Resolución", en: "Decision" } },
    { label: { es: "Huellas y tarjeta", en: "Fingerprints and card" } },
  ],
  currentPhase: 3,
  openedOn: "2026-05-04",
  lastUpdate: "2026-09-15",
  statusLine: {
    es: "La Administración nos ha pedido dos documentos más antes de resolver.",
    en: "The authority has asked us for two more documents before deciding.",
  },
  whatIsHappening: {
    es: "La Unidad de Grandes Empresas y Colectivos Estratégicos ha revisado tu solicitud y nos ha pedido documentación adicional para acreditar que la inversión se mantiene. Es un trámite habitual en las renovaciones y no implica que la solicitud vaya a denegarse.",
    en: "The Large Companies and Strategic Groups Unit has reviewed your application and asked us for additional documents proving the investment is still in place. This is a routine step in renewals and does not mean the application will be refused.",
  },
  whatComesNext: {
    es: "Tenemos que contestar al requerimiento en los próximos días, así que en cuanto nos hagas llegar los dos documentos que te pedimos más abajo preparamos el escrito y lo presentamos telemáticamente. Del plazo nos ocupamos nosotros: te avisaremos el mismo día en que quede presentado. Cuando resuelvan te citaremos para la toma de huellas y te pediremos la tasa de expedición de la tarjeta (modelo 790-012).",
    en: "We have to reply to the request within the next few days, so as soon as you send us the two documents listed below we will prepare the response and file it electronically. The deadline is ours to manage: we will let you know the same day it is filed. Once a decision is issued we will book your fingerprint appointment and ask you for the card issuing fee (form 790-012).",
  },
  /* Solo la parte que de verdad es una estimación de la Administración. El
   * plazo para contestar al requerimiento (art. 68 LPAC) es preclusivo y no
   * puede presentarse bajo el disclaimer de "orientativo": va en whatComesNext
   * como tarea del despacho, no como cuenta atrás para el cliente. */
  administrativeEstimate: {
    es: "Una vez presentada la subsanación, la Administración suele resolver en unos 20 días hábiles.",
    en: "Once the response is filed, the authority usually issues a decision within around 20 working days.",
  },
  lawyerId: "l1",
  actions: [
    {
      id: "a-ext-1",
      date: "2026-05-04",
      kind: "despacho",
      phaseIndex: 0,
      published: true,
      title: {
        es: "Abrimos tu expediente de renovación",
        en: "We opened your renewal file",
      },
      formalName: {
        es: "Apertura de expediente y aceptación de hoja de encargo",
        en: "File opening and acceptance of engagement letter",
      },
      detail: {
        es: "Registramos el encargo de renovación de tu autorización de residencia para inversores y te asignamos a Lucía Marco como letrada responsable.",
        en: "We registered the engagement for the renewal of your investor residence permit and assigned Lucía Marco as your lead lawyer.",
      },
      attachment: {
        name: { es: "Hoja de encargo firmada.pdf", en: "Signed engagement letter.pdf" },
        meta: "PDF · 186 KB",
      },
    },
    {
      id: "a-ext-2",
      date: "2026-06-18",
      kind: "despacho",
      phaseIndex: 1,
      published: true,
      title: {
        es: "Reunimos y revisamos tu documentación",
        en: "We gathered and reviewed your documents",
      },
      formalName: {
        es: "Cotejo documental previo a la solicitud",
        en: "Document review prior to filing",
      },
      detail: {
        es: "Revisamos el certificado de titularidad y posición de la inversión emitido por tu entidad financiera, el pasaporte y la póliza de seguro médico, y solicitamos los certificados de estar al corriente con Hacienda y la Seguridad Social.",
        en: "We reviewed the ownership and balance certificate issued by your bank, your passport and your private health insurance policy, and requested the tax and social security compliance certificates.",
      },
    },
    {
      id: "a-ext-3",
      date: "2026-07-02",
      kind: "procedimiento",
      phaseIndex: 2,
      published: true,
      title: {
        es: "Presentamos la solicitud de renovación",
        en: "We filed the renewal application",
      },
      formalName: {
        es: "Presentación telemática de solicitud de renovación de autorización de residencia para inversores por inversión de capital (Ley 14/2013)",
        en: "Electronic filing of investor residence permit renewal — capital investment (Act 14/2013)",
      },
      detail: {
        es: "La solicitud quedó presentada con número de registro 2026/UGE/0148873. A partir de aquí la tramitación corresponde a la Administración.",
        en: "The application was filed under registry number 2026/UGE/0148873. From this point the process is in the hands of the authorities.",
      },
      attachment: {
        name: {
          es: "Justificante de presentación.pdf",
          en: "Filing receipt.pdf",
        },
        meta: "PDF · 94 KB",
      },
    },
    {
      id: "a-ext-4",
      date: "2026-09-15",
      kind: "procedimiento",
      phaseIndex: 3,
      published: true,
      title: {
        es: "La Administración nos pide dos documentos más",
        en: "The authority has asked for two more documents",
      },
      formalName: {
        es: "Requerimiento de subsanación y mejora de la solicitud",
        en: "Request to complete the application",
      },
      detail: {
        es: "Nos piden acreditar el mantenimiento de la inversión a fecha actual y aportar el certificado de cobertura del seguro médico vigente. Te los hemos pedido en el apartado de documentos.",
        en: "They require proof that the investment is still held as of today and a certificate showing current health insurance cover. We have requested both in the documents section.",
      },
      attachment: {
        name: { es: "Requerimiento UGE.pdf", en: "Authority request.pdf" },
        meta: "PDF · 121 KB",
      },
    },
    /* Borrador pendiente de aprobación por el despacho */
    {
      id: "a-ext-5",
      date: "2026-09-17",
      kind: "despacho",
      phaseIndex: 3,
      published: false,
      title: {
        es: "Hemos recibido tu certificado bancario",
        en: "We have received your bank certificate",
      },
      formalName: {
        es: "Recepción y cotejo de documentación aportada por el cliente",
        en: "Receipt and review of client-provided documentation",
      },
      detail: {
        es: "Tu certificado bancario ha llegado correctamente y lo hemos dado por válido. Seguimos a la espera del certificado del seguro médico para poder presentar la subsanación completa.",
        en: "Your bank certificate arrived correctly and we have accepted it. We are still waiting for the health insurance certificate in order to file a complete response.",
      },
    },
  ],
  firmDocs: [
    {
      id: "fd-ext-1",
      date: "2026-09-15",
      name: { es: "Requerimiento de la UGE", en: "Authority request letter" },
      kind: { es: "Resolución administrativa", en: "Administrative decision" },
      meta: "PDF · 121 KB",
    },
    {
      id: "fd-ext-2",
      date: "2026-07-02",
      name: {
        es: "Justificante de presentación de la solicitud",
        en: "Application filing receipt",
      },
      kind: { es: "Justificante", en: "Receipt" },
      meta: "PDF · 94 KB",
    },
    {
      id: "fd-ext-3",
      date: "2026-05-04",
      name: { es: "Hoja de encargo firmada", en: "Signed engagement letter" },
      kind: { es: "Contrato", en: "Contract" },
      meta: "PDF · 186 KB",
    },
  ],
  docRequests: [
    {
      id: "dr-ext-1",
      name: {
        es: "Certificado bancario de mantenimiento de la inversión",
        en: "Bank certificate confirming the investment is maintained",
      },
      help: {
        es: "Pídelo en tu banco indicando que debe reflejar la titularidad y el saldo a fecha actual. Sirve el PDF que te envíen por banca electrónica.",
        en: "Ask your bank for a certificate showing ownership and the current balance. The PDF they send through online banking is fine.",
      },
      status: "revision",
      requestedOn: "2026-09-15",
      submittedOn: "2026-09-16",
    },
    {
      id: "dr-ext-2",
      name: {
        es: "Certificado de cobertura del seguro médico",
        en: "Health insurance cover certificate",
      },
      help: {
        es: "Debe indicar que la póliza está vigente, sin copagos y con cobertura en toda España. No sirve el recibo del pago.",
        en: "It must state that the policy is active, with no co-payments and valid throughout Spain. A payment receipt is not enough.",
      },
      status: "rechazado",
      requestedOn: "2026-09-15",
      submittedOn: "2026-09-16",
      rejectionReason: {
        es: "Lo que nos enviaste es el recibo del pago de la póliza, no el certificado de cobertura. Pídele a la aseguradora un certificado que diga expresamente que la póliza está en vigor, sin copagos y con cobertura en toda España.",
        en: "What you sent is the premium payment receipt, not the cover certificate. Ask your insurer for a certificate expressly stating that the policy is in force, with no co-payments and cover throughout Spain.",
      },
    },
    {
      id: "dr-ext-3",
      name: {
        es: "Pasaporte completo escaneado",
        en: "Full scanned passport",
      },
      help: {
        es: "Todas las páginas, incluidas las que están en blanco.",
        en: "All pages, including blank ones.",
      },
      status: "validado",
      requestedOn: "2026-06-02",
      submittedOn: "2026-06-05",
    },
    {
      id: "dr-ext-4",
      name: {
        es: "Certificados de estar al corriente con Hacienda y la Seguridad Social",
        en: "Tax and social security compliance certificates",
      },
      help: {
        es: "Se descargan en la sede electrónica de la AEAT y de la Seguridad Social con tu certificado digital o Cl@ve. Si no puedes obtenerlos, dínoslo y los pedimos nosotros con tu autorización.",
        en: "You can download them from the tax office and social security online portals with your digital certificate or Cl@ve. If you cannot get them, tell us and we will request them with your authorisation.",
      },
      status: "pendiente",
      requestedOn: "2026-09-15",
    },
  ],
  uploadedDocs: [
    {
      id: "ud-ext-1",
      name: {
        es: "Certificado bancario septiembre 2026.pdf",
        en: "Bank certificate September 2026.pdf",
      },
      uploadedOn: "2026-09-16",
      meta: "PDF · 210 KB",
      fulfillsRequestId: "dr-ext-1",
    },
    {
      id: "ud-ext-2",
      name: { es: "Pasaporte completo.pdf", en: "Full passport.pdf" },
      uploadedOn: "2026-06-05",
      meta: "PDF · 3,4 MB",
      fulfillsRequestId: "dr-ext-3",
    },
    {
      id: "ud-ext-3",
      name: {
        es: "Recibo del seguro médico.pdf",
        en: "Health insurance payment receipt.pdf",
      },
      uploadedOn: "2026-09-16",
      meta: "PDF · 480 KB",
      fulfillsRequestId: "dr-ext-2",
    },
  ],
  keyDates: [
    {
      id: "kd-ext-1",
      kind: "reunion",
      date: "2026-09-24T10:30:00",
      title: {
        es: "Videollamada de seguimiento con Lucía Marco",
        en: "Follow-up video call with Lucía Marco",
      },
      place: { es: "Videollamada", en: "Video call" },
      note: {
        es: "Repasamos el estado de la subsanación. Te enviaremos el enlace por correo.",
        en: "We will go over the status of the response. We will email you the link.",
      },
    },
  ],
  expiries: [
    {
      id: "ex-ext-1",
      document: {
        es: "Tarjeta de identidad de extranjero (TIE)",
        en: "Foreigner identity card (TIE)",
      },
      expiresOn: "2026-11-30",
      advice: {
        es: "Tu renovación ya está en trámite, así que para permanecer en España no tienes que hacer nada: conserva el justificante de presentación junto a la tarjeta. Si necesitas salir de España antes de que te entreguen la nueva tarjeta, avísanos con tiempo: habrá que solicitar una autorización de regreso para que puedas volver sin problemas.",
        en: "Your renewal is already in progress, so there is nothing you need to do in order to stay in Spain: keep the filing receipt together with your card. If you need to travel outside Spain before the new card is issued, let us know in advance: we will need to apply for a return authorisation so you can re-enter without problems.",
      },
    },
    {
      id: "ex-ext-2",
      document: { es: "Pasaporte", en: "Passport" },
      expiresOn: "2027-03-14",
      advice: {
        es: "Conviene renovarlo con al menos tres meses de antelación en tu consulado. Si lo renuevas, avísanos para actualizar el expediente.",
        en: "It is best to renew it at your consulate at least three months in advance. Let us know if you do, so we can update your file.",
      },
    },
  ],
};

const caseInmobiliario: Case = {
  id: "c-inm",
  clientId: "cli-1",
  ref: "INM-2026-0092",
  area: "inmobiliario",
  title: {
    es: "Compra de vivienda en Valencia (Ruzafa)",
    en: "Purchase of a home in Valencia (Ruzafa)",
  },
  shortTitle: {
    es: "Compra en Ruzafa",
    en: "Ruzafa purchase",
  },
  phases: [
    { label: { es: "Encargo", en: "Engagement" } },
    { label: { es: "Comprobaciones previas", en: "Due diligence" } },
    { label: { es: "Contrato de arras", en: "Deposit agreement" } },
    { label: { es: "Escritura pública", en: "Public deed" } },
    { label: { es: "Trámites posteriores", en: "Post-completion" } },
  ],
  currentPhase: 2,
  openedOn: "2026-07-21",
  lastUpdate: "2026-09-10",
  statusLine: {
    es: "Arras firmadas y vivienda comprobada. Queda la firma en notaría.",
    en: "Deposit signed and property checked. The notary signing is next.",
  },
  whatIsHappening: {
    es: "El contrato de arras está firmado y tu señal de 18.000 € quedó entregada. Hemos comprobado que la vivienda está libre de cargas, al corriente de gastos de comunidad y libre de ocupantes. Son arras penitenciales: si finalmente no compras, pierdes los 18.000 €; si quien se echa atrás es la parte vendedora, tiene que devolverte el doble, 36.000 €.",
    en: "The deposit agreement is signed and your 18,000 € deposit has been paid. We have confirmed the property is free of charges, up to date with community fees and free of occupants. This is an earnest-money deposit: if you decide not to buy, you lose the 18,000 €; if the seller pulls out, they must return double, 36,000 €.",
  },
  whatComesNext: {
    es: "La firma en notaría está señalada para el 6 de octubre. Antes de esa fecha necesitamos el justificante de la transferencia del resto del precio y que nos confirmes cómo quieres que figure la titularidad: al comprar estando casada hay que declarar en la escritura tu régimen económico matrimonial, que se rige por tu ley nacional, y por eso te pedimos el certificado de matrimonio. Como la escritura se otorga en castellano, hemos pedido a la notaría que intervenga un intérprete para que firmes con la traducción delante. Después de la firma hay que liquidar el impuesto de transmisiones patrimoniales: nos encargamos nosotros y ya te hemos pedido la provisión en el área económica.",
    en: "Completion at the notary is set for 6 October. Before then we need proof of the transfer for the remaining balance and confirmation of how you want the title to be held: when buying while married, the deed must state your matrimonial property regime, which is governed by the law of your nationality, and that is why we asked for your marriage certificate. Since the deed is executed in Spanish, we have asked the notary to arrange an interpreter so that you sign with the translation in front of you. After signing, the transfer tax must be paid: we take care of it and have already requested the funds in the billing section.",
  },
  lawyerId: "l3",
  actions: [
    {
      id: "a-inm-1",
      date: "2026-07-21",
      kind: "despacho",
      phaseIndex: 0,
      published: true,
      title: { es: "Abrimos el expediente de compra", en: "We opened your purchase file" },
      formalName: {
        es: "Apertura de expediente y aceptación de hoja de encargo",
        en: "File opening and acceptance of engagement letter",
      },
      detail: {
        es: "Asumimos el asesoramiento integral de la compraventa, incluida la revisión registral, la liquidación de impuestos y la asistencia a la firma en notaría. Como en toda compraventa, estamos obligados a identificarte y a comprobar el origen de los fondos antes de la firma.",
        en: "We took on full advisory work for the purchase, including Land Registry checks, tax filings and attendance at the notary signing. As in any property purchase, we are required to verify your identity and the source of funds before completion.",
      },
    },
    {
      id: "a-inm-2",
      date: "2026-08-12",
      kind: "despacho",
      phaseIndex: 1,
      published: true,
      title: {
        es: "Comprobamos que la vivienda está libre de cargas",
        en: "We confirmed the property is free of charges",
      },
      formalName: {
        es: "Comprobaciones registrales, urbanísticas y de estado de la vivienda previas a la compraventa",
        en: "Land Registry, planning and property condition checks prior to the purchase",
      },
      detail: {
        es: "La nota simple confirma que no hay hipotecas ni embargos inscritos y que la descripción registral coincide con la catastral. El administrador certifica que la vivienda está al corriente de gastos y que no hay derramas aprobadas pendientes. Hemos comprobado además que la vivienda se entrega libre de ocupantes y de arrendatarios, y hemos pedido a la parte vendedora el certificado de eficiencia energética y la licencia de segunda ocupación.",
        en: "The Land Registry extract confirms there are no registered mortgages or seizures and that the registry description matches the cadastral one. The administrator certifies the property is up to date with fees and there are no approved pending levies. We have also confirmed the property will be handed over free of occupants and tenants, and asked the seller for the energy performance certificate and the second-occupancy licence.",
      },
      attachment: {
        name: { es: "Nota simple registral.pdf", en: "Land Registry extract.pdf" },
        meta: "PDF · 150 KB",
      },
    },
    {
      id: "a-inm-3",
      date: "2026-09-10",
      /* Contrato privado entre particulares: no es un trámite ante juzgado,
       * Administración ni notaría, así que no es "procedimiento". */
      kind: "despacho",
      phaseIndex: 2,
      published: true,
      title: { es: "Firmaste el contrato de arras", en: "You signed the deposit agreement" },
      formalName: {
        es: "Contrato de arras penitenciales (art. 1.454 Código Civil)",
        en: "Earnest money contract (art. 1454 Spanish Civil Code)",
      },
      detail: {
        es: "Se entregaron 18.000 € en concepto de arras. El contrato fija la firma de la escritura antes del 31 de octubre de 2026.",
        en: "18,000 € was paid as a deposit. The contract sets completion before 31 October 2026.",
      },
      attachment: {
        name: { es: "Contrato de arras firmado.pdf", en: "Signed deposit agreement.pdf" },
        meta: "PDF · 260 KB",
      },
    },
    /* Borrador pendiente de aprobación por el despacho */
    {
      id: "a-inm-4",
      date: "2026-09-17",
      kind: "despacho",
      phaseIndex: 3,
      published: false,
      title: {
        es: "Preparamos la firma en notaría",
        en: "We are preparing the notary signing",
      },
      formalName: {
        es: "Solicitud de nota simple actualizada y de intérprete para el otorgamiento",
        en: "Request for an updated Land Registry extract and an interpreter for the signing",
      },
      detail: {
        es: "Hemos pedido una nota simple actualizada para comprobar el día antes de la firma que la vivienda sigue libre de cargas, y hemos solicitado a la notaría que intervenga un intérprete, porque la escritura se otorga en castellano y tienes que entender exactamente lo que firmas.",
        en: "We have requested an updated Land Registry extract so we can check the day before completion that the property is still free of charges, and we have asked the notary to arrange an interpreter, since the deed is executed in Spanish and you must understand exactly what you are signing.",
      },
    },
  ],
  firmDocs: [
    {
      id: "fd-inm-1",
      date: "2026-09-10",
      name: { es: "Contrato de arras firmado", en: "Signed deposit agreement" },
      kind: { es: "Contrato", en: "Contract" },
      meta: "PDF · 260 KB",
    },
    {
      id: "fd-inm-2",
      date: "2026-08-12",
      name: { es: "Nota simple registral", en: "Land Registry extract" },
      kind: { es: "Certificación", en: "Certificate" },
      meta: "PDF · 150 KB",
    },
    {
      id: "fd-inm-3",
      date: "2026-08-12",
      name: {
        es: "Certificado de la comunidad de propietarios",
        en: "Community of owners certificate",
      },
      kind: { es: "Certificación", en: "Certificate" },
      meta: "PDF · 88 KB",
    },
    {
      id: "fd-inm-4",
      date: "2026-08-28",
      name: {
        es: "Certificado de eficiencia energética y licencia de segunda ocupación",
        en: "Energy performance certificate and second-occupancy licence",
      },
      kind: { es: "Certificación", en: "Certificate" },
      meta: "PDF · 640 KB",
    },
  ],
  docRequests: [
    {
      id: "dr-inm-1",
      name: {
        es: "Justificante de transferencia del resto del precio",
        en: "Proof of transfer for the remaining balance",
      },
      help: {
        es: "El notario necesita el justificante con fecha anterior a la firma para reflejar el medio de pago en la escritura.",
        en: "The notary needs the receipt dated before signing in order to record the means of payment in the deed.",
      },
      status: "pendiente",
      requestedOn: "2026-09-12",
    },
    {
      id: "dr-inm-2",
      name: {
        es: "Certificado de matrimonio apostillado y traducido",
        en: "Apostilled and translated marriage certificate",
      },
      help: {
        es: "Lo necesitamos para declarar en la escritura tu régimen económico matrimonial. Debe venir con la Apostilla de La Haya y traducción jurada al castellano, hecha por un traductor nombrado por el Ministerio de Asuntos Exteriores.",
        en: "We need it to state your matrimonial property regime in the deed. It must include the Hague Apostille and a sworn Spanish translation by a translator appointed by the Spanish Ministry of Foreign Affairs.",
      },
      status: "pendiente",
      requestedOn: "2026-09-12",
    },
    {
      id: "dr-inm-3",
      name: {
        es: "Justificación del origen de los fondos",
        en: "Evidence of the source of funds",
      },
      help: {
        es: "Extractos o certificados que muestren de dónde procede el dinero de la compra. Es una comprobación que la ley nos obliga a hacer en todas las compraventas, no una desconfianza hacia ti.",
        en: "Statements or certificates showing where the purchase money comes from. This is a check the law requires us to carry out in every property purchase, not a matter of distrust.",
      },
      status: "validado",
      requestedOn: "2026-07-22",
      submittedOn: "2026-07-28",
    },
  ],
  uploadedDocs: [
    {
      id: "ud-inm-1",
      name: {
        es: "Justificante señal 18.000 EUR.pdf",
        en: "Deposit receipt 18,000 EUR.pdf",
      },
      uploadedOn: "2026-09-10",
      meta: "PDF · 98 KB",
    },
    {
      id: "ud-inm-2",
      name: {
        es: "Origen de fondos - extractos bancarios.pdf",
        en: "Source of funds - bank statements.pdf",
      },
      uploadedOn: "2026-07-28",
      meta: "PDF · 1,2 MB",
      fulfillsRequestId: "dr-inm-3",
    },
  ],
  keyDates: [
    {
      id: "kd-inm-1",
      kind: "notaria",
      date: "2026-10-06T12:00:00",
      title: { es: "Firma de la escritura de compraventa", en: "Signing of the purchase deed" },
      place: {
        es: "Notaría de D. Enrique Vidal · C/ Colón, 42, Valencia",
        en: "Notary office of Enrique Vidal · C/ Colón, 42, Valencia",
      },
      note: {
        es: "Trae tu pasaporte y tu TIE en vigor. Carmen Lloret te acompañará y habrá intérprete: la escritura se otorga en castellano y tienes derecho a que te la traduzcan antes de firmar.",
        en: "Bring your valid passport and TIE. Carmen Lloret will attend with you and an interpreter will be present: the deed is executed in Spanish and you are entitled to have it translated before signing.",
      },
    },
  ],
  expiries: [],
};

const casePenal: Case = {
  id: "c-pen",
  clientId: "cli-2",
  ref: "PEN-2026-0231",
  area: "penal",
  title: {
    es: "Procedimiento por delito contra la seguridad vial",
    en: "Proceedings for a road safety offence",
  },
  shortTitle: {
    es: "Seguridad vial",
    en: "Road safety",
  },
  phases: [
    { label: { es: "Diligencias previas", en: "Preliminary proceedings" } },
    { label: { es: "Escrito de defensa", en: "Defence statement" } },
    { label: { es: "Apertura de juicio oral", en: "Trial opening" } },
    { label: { es: "Vista", en: "Hearing" } },
    { label: { es: "Sentencia", en: "Judgment" } },
  ],
  currentPhase: 2,
  openedOn: "2026-04-15",
  lastUpdate: "2026-09-08",
  statusLine: {
    es: "El juzgado ha señalado el juicio. Preparamos la vista contigo.",
    en: "The court has set the trial date. We are preparing the hearing with you.",
  },
  whatIsHappening: {
    es: "El juzgado ha acordado la apertura de juicio oral y ha señalado la vista. Ya hemos presentado nuestro escrito de defensa y propuesto la prueba que consideramos necesaria.",
    en: "The court has ordered the case to go to trial and has set the hearing date. We have already filed our defence statement and proposed the evidence we consider necessary.",
  },
  whatComesNext: {
    es: "Nos reuniremos contigo unos días antes de la vista para preparar tu declaración y explicarte cómo se desarrolla la sesión. Daniel Ortí te acompañará en la sala.",
    en: "We will meet you a few days before the hearing to prepare your statement and explain how the session works. Daniel Ortí will be with you in the courtroom.",
  },
  lawyerId: "l2",
  actions: [
    {
      id: "a-pen-1",
      date: "2026-04-15",
      kind: "procedimiento",
      phaseIndex: 0,
      published: true,
      title: { es: "Asumimos tu defensa", en: "We took on your defence" },
      formalName: {
        es: "Designación de letrado y personación en las diligencias previas",
        en: "Appointment of counsel and appearance in the preliminary proceedings",
      },
      detail: {
        es: "Nos personamos en el procedimiento y solicitamos copia íntegra de las actuaciones, incluido el atestado.",
        en: "We entered an appearance in the proceedings and requested a full copy of the case file, including the police report.",
      },
    },
    {
      id: "a-pen-2",
      date: "2026-06-30",
      kind: "procedimiento",
      phaseIndex: 1,
      published: true,
      title: { es: "Presentamos tu escrito de defensa", en: "We filed your defence statement" },
      formalName: {
        es: "Escrito de defensa y proposición de prueba",
        en: "Defence statement and proposal of evidence",
      },
      detail: {
        es: "Además de tu declaración, propusimos la testifical de dos testigos presenciales y la pericial sobre el procedimiento de calibración del etilómetro.",
        en: "Alongside your statement, we proposed testimony from two eyewitnesses and an expert report on the breathalyser calibration procedure.",
      },
      attachment: {
        name: { es: "Escrito de defensa.pdf", en: "Defence statement.pdf" },
        meta: "PDF · 320 KB",
      },
    },
    {
      id: "a-pen-3",
      date: "2026-09-08",
      kind: "procedimiento",
      phaseIndex: 2,
      published: true,
      title: {
        es: "El juzgado ha señalado la fecha del juicio",
        en: "The court has set the trial date",
      },
      formalName: {
        es: "Auto de apertura de juicio oral y señalamiento de vista",
        en: "Order opening the trial and setting the hearing",
      },
      detail: {
        es: "La vista se celebrará el 14 de octubre de 2026 a las 10:00 en el Juzgado de lo Penal nº 4 de Valencia. Se admitió toda la prueba que propusimos.",
        en: "The hearing will take place on 14 October 2026 at 10:00 at Criminal Court no. 4 of Valencia. All the evidence we proposed was admitted.",
      },
      attachment: {
        name: { es: "Auto de apertura.pdf", en: "Trial opening order.pdf" },
        meta: "PDF · 140 KB",
      },
    },
    /* Borrador pendiente de aprobación */
    {
      id: "a-pen-4",
      date: "2026-09-17",
      kind: "despacho",
      phaseIndex: 2,
      published: false,
      title: {
        es: "Preparamos la reunión previa al juicio",
        en: "We are arranging the pre-trial meeting",
      },
      formalName: {
        es: "Convocatoria de reunión de preparación de vista oral",
        en: "Notice of hearing preparation meeting",
      },
      detail: {
        es: "Hemos reservado el 7 de octubre a las 17:00 en el despacho para repasar contigo el desarrollo de la vista y tu declaración. Si no te viene bien, dínoslo por mensaje.",
        en: "We have booked 7 October at 17:00 at the office to go through the hearing and your statement with you. If that does not suit you, let us know by message.",
      },
    },
  ],
  firmDocs: [
    {
      id: "fd-pen-1",
      date: "2026-09-08",
      name: { es: "Auto de apertura de juicio oral", en: "Trial opening order" },
      kind: { es: "Resolución judicial", en: "Court order" },
      meta: "PDF · 140 KB",
    },
    {
      id: "fd-pen-2",
      date: "2026-06-30",
      name: { es: "Escrito de defensa", en: "Defence statement" },
      kind: { es: "Escrito procesal", en: "Court filing" },
      meta: "PDF · 320 KB",
    },
  ],
  docRequests: [
    {
      id: "dr-pen-1",
      name: {
        es: "Justificante de asistencia al curso de seguridad vial",
        en: "Certificate of attendance at the road safety course",
      },
      help: {
        es: "El certificado que te entregaron al terminar el curso. Lo aportaremos como documental antes de la vista.",
        en: "The certificate you were given when you completed the course. We will submit it as evidence before the hearing.",
      },
      status: "recibido",
      requestedOn: "2026-09-09",
      submittedOn: "2026-09-14",
    },
  ],
  uploadedDocs: [
    {
      id: "ud-pen-1",
      name: {
        es: "Certificado curso seguridad vial.pdf",
        en: "Road safety course certificate.pdf",
      },
      uploadedOn: "2026-09-14",
      meta: "PDF · 74 KB",
      fulfillsRequestId: "dr-pen-1",
    },
  ],
  keyDates: [
    {
      id: "kd-pen-1",
      kind: "reunion",
      date: "2026-10-07T17:00:00",
      title: { es: "Reunión de preparación de la vista", en: "Hearing preparation meeting" },
      place: {
        es: "Despacho · C/ Moratín, 14, 5º C, Valencia",
        en: "Office · C/ Moratín, 14, 5º C, Valencia",
      },
    },
    {
      id: "kd-pen-2",
      kind: "vista",
      date: "2026-10-14T10:00:00",
      title: { es: "Vista oral", en: "Trial hearing" },
      place: {
        es: "Juzgado de lo Penal nº 4 de Valencia · Avda. del Saler, 14",
        en: "Criminal Court no. 4 of Valencia · Avda. del Saler, 14",
      },
      note: {
        es: "Preséntate 30 minutos antes en la puerta principal. Daniel Ortí te estará esperando.",
        en: "Arrive 30 minutes early at the main entrance. Daniel Ortí will be waiting for you.",
      },
    },
  ],
  expiries: [],
};

const caseCivil: Case = {
  id: "c-civ",
  clientId: "cli-2",
  ref: "CIV-2026-0177",
  area: "civil",
  title: {
    es: "Divorcio de mutuo acuerdo",
    en: "Divorce by mutual agreement",
  },
  shortTitle: {
    es: "Divorcio",
    en: "Divorce",
  },
  phases: [
    { label: { es: "Consulta y encargo", en: "Consultation and engagement" } },
    { label: { es: "Negociación del convenio", en: "Negotiating the agreement" } },
    { label: { es: "Firma del convenio", en: "Signing the agreement" } },
    { label: { es: "Demanda presentada", en: "Petition filed" } },
    { label: { es: "Ratificación", en: "Court ratification" } },
    { label: { es: "Sentencia", en: "Judgment" } },
  ],
  currentPhase: 1,
  openedOn: "2026-08-05",
  lastUpdate: "2026-09-12",
  statusLine: {
    es: "Negociando el convenio con la otra parte. Falta cerrar los gastos de los menores.",
    en: "Negotiating the agreement with the other party. The children's expenses are still open.",
  },
  whatIsHappening: {
    es: "Estamos negociando el convenio regulador con la abogada de la otra parte. Hay acuerdo sobre la custodia compartida y el uso de la vivienda; queda cerrar el reparto de los gastos extraordinarios de los menores.",
    en: "We are negotiating the settlement agreement with the other party's lawyer. There is agreement on shared custody and use of the family home; what remains is how to split the children's extraordinary expenses.",
  },
  whatComesNext: {
    es: "Te enviaremos el borrador del convenio para que lo leas con calma antes de firmarlo. Cuando esté firmado por ambas partes, presentaremos la demanda de mutuo acuerdo.",
    en: "We will send you the draft agreement so you can read it carefully before signing. Once both parties have signed, we will file the joint petition.",
  },
  lawyerId: "l3",
  actions: [
    {
      id: "a-civ-1",
      date: "2026-08-05",
      kind: "despacho",
      phaseIndex: 0,
      published: true,
      title: { es: "Abrimos tu expediente de divorcio", en: "We opened your divorce file" },
      formalName: {
        es: "Apertura de expediente y aceptación de hoja de encargo",
        en: "File opening and acceptance of engagement letter",
      },
      detail: {
        es: "Recogimos tus objetivos respecto a la custodia, la vivienda y la pensión de alimentos, y te asignamos a Carmen Lloret.",
        en: "We recorded your goals regarding custody, the family home and child support, and assigned Carmen Lloret to your case.",
      },
    },
    {
      id: "a-civ-2",
      date: "2026-09-12",
      kind: "despacho",
      phaseIndex: 1,
      published: true,
      title: {
        es: "Primera propuesta de convenio enviada a la otra parte",
        en: "First draft agreement sent to the other party",
      },
      formalName: {
        es: "Remisión de propuesta de convenio regulador",
        en: "Submission of proposed settlement agreement",
      },
      detail: {
        es: "La propuesta recoge custodia compartida por semanas alternas, atribución del uso de la vivienda hasta la mayoría de edad del menor y pensión de alimentos de 350 € mensuales.",
        en: "The proposal sets out shared custody on alternate weeks, use of the family home until the child comes of age, and child support of 350 € per month.",
      },
    },
  ],
  firmDocs: [
    {
      id: "fd-civ-1",
      date: "2026-08-05",
      name: { es: "Hoja de encargo firmada", en: "Signed engagement letter" },
      kind: { es: "Contrato", en: "Contract" },
      meta: "PDF · 178 KB",
    },
  ],
  docRequests: [
    {
      id: "dr-civ-1",
      name: {
        es: "Últimas tres nóminas",
        en: "Last three payslips",
      },
      help: {
        es: "Necesarias para justificar tu capacidad económica en el convenio.",
        en: "Needed to evidence your financial capacity in the agreement.",
      },
      status: "validado",
      requestedOn: "2026-08-07",
      submittedOn: "2026-08-10",
    },
    {
      id: "dr-civ-2",
      name: {
        es: "Libro de familia",
        en: "Family record book",
      },
      help: {
        es: "Escanea las páginas del matrimonio y de los hijos.",
        en: "Scan the marriage page and the children's pages.",
      },
      status: "validado",
      requestedOn: "2026-08-07",
      submittedOn: "2026-08-10",
    },
  ],
  uploadedDocs: [
    {
      id: "ud-civ-1",
      name: { es: "Nóminas mayo-julio.pdf", en: "Payslips May-July.pdf" },
      uploadedOn: "2026-08-10",
      meta: "PDF · 310 KB",
      fulfillsRequestId: "dr-civ-1",
    },
    {
      id: "ud-civ-2",
      name: { es: "Libro de familia.pdf", en: "Family record book.pdf" },
      uploadedOn: "2026-08-10",
      meta: "PDF · 1,2 MB",
      fulfillsRequestId: "dr-civ-2",
    },
  ],
  keyDates: [],
  expiries: [],
};

const caseEcuestre: Case = {
  id: "c-equ",
  clientId: "cli-3",
  ref: "EQU-2026-0034",
  area: "ecuestre",
  title: {
    es: "Reclamación por vicios ocultos en compraventa de caballo de salto",
    en: "Claim for hidden defects in the sale of a show jumping horse",
  },
  shortTitle: {
    es: "Reclamación equina",
    en: "Equine claim",
  },
  phases: [
    { label: { es: "Encargo y análisis", en: "Engagement and analysis" } },
    { label: { es: "Requerimiento extrajudicial", en: "Formal demand" } },
    { label: { es: "Demanda", en: "Court claim" } },
    { label: { es: "Contestación y prueba", en: "Defence and evidence" } },
    { label: { es: "Vista", en: "Hearing" } },
    { label: { es: "Sentencia", en: "Judgment" } },
  ],
  currentPhase: 1,
  openedOn: "2026-06-22",
  lastUpdate: "2026-09-11",
  statusLine: {
    es: "Requerimiento enviado al vendedor. Esperamos su respuesta hasta el 30 de septiembre.",
    en: "Formal demand sent to the seller. We await their reply until 30 September.",
  },
  whatIsHappening: {
    es: "Hemos enviado un requerimiento formal al vendedor reclamando la resolución de la compraventa. El informe veterinario que encargamos concluye que la lesión del corvejón era anterior a la entrega del animal.",
    en: "We have sent a formal demand to the seller seeking rescission of the sale. The veterinary report we commissioned concludes that the hock injury predated delivery of the horse.",
  },
  whatComesNext: {
    es: "El vendedor tiene hasta el 30 de septiembre para responder. Si no acepta la resolución o no contesta, prepararemos la demanda y te la enviaremos para que la revises antes de presentarla.",
    en: "The seller has until 30 September to reply. If they do not accept the rescission or do not respond, we will prepare the court claim and send it to you for review before filing.",
  },
  lawyerId: "l4",
  actions: [
    {
      id: "a-equ-1",
      date: "2026-06-22",
      kind: "despacho",
      phaseIndex: 0,
      published: true,
      title: { es: "Abrimos el expediente", en: "We opened the file" },
      formalName: {
        es: "Apertura de expediente y aceptación de hoja de encargo",
        en: "File opening and acceptance of engagement letter",
      },
      detail: {
        es: "Analizamos el contrato de compraventa, el protocolo de revisión veterinaria previa y el historial deportivo del animal.",
        en: "We analysed the sale contract, the pre-purchase veterinary examination protocol and the horse's competition record.",
      },
    },
    {
      id: "a-equ-2",
      date: "2026-08-28",
      kind: "despacho",
      phaseIndex: 0,
      published: true,
      title: {
        es: "Recibimos el informe veterinario pericial",
        en: "We received the expert veterinary report",
      },
      formalName: {
        es: "Informe pericial veterinario sobre estado del animal en el momento de la entrega",
        en: "Expert veterinary report on the animal's condition at the time of delivery",
      },
      detail: {
        es: "El perito concluye que las alteraciones radiológicas del corvejón derecho son compatibles con un proceso de al menos ocho meses de evolución, anterior por tanto a la compraventa.",
        en: "The expert concludes that the radiological changes in the right hock are consistent with a process of at least eight months' development, therefore predating the sale.",
      },
      attachment: {
        name: { es: "Informe pericial veterinario.pdf", en: "Expert veterinary report.pdf" },
        meta: "PDF · 2,1 MB",
      },
    },
    {
      id: "a-equ-3",
      date: "2026-09-11",
      kind: "procedimiento",
      phaseIndex: 1,
      published: true,
      title: {
        es: "Enviamos el requerimiento al vendedor",
        en: "We sent the formal demand to the seller",
      },
      formalName: {
        es: "Requerimiento extrajudicial de resolución contractual por vicios ocultos (arts. 1.484 y ss. Código Civil)",
        en: "Out-of-court demand for rescission for hidden defects (arts. 1484 et seq. Spanish Civil Code)",
      },
      detail: {
        es: "Se remitió por burofax con acuse de recibo y certificación de contenido. Reclamamos la devolución del precio y los gastos de manutención del animal.",
        en: "Sent by registered fax with acknowledgment of receipt and certified content. We claim repayment of the price and the horse's upkeep costs.",
      },
      attachment: {
        name: { es: "Burofax de requerimiento.pdf", en: "Formal demand notice.pdf" },
        meta: "PDF · 410 KB",
      },
    },
    /* Borrador pendiente de aprobación */
    {
      id: "a-equ-4",
      date: "2026-09-16",
      kind: "procedimiento",
      phaseIndex: 1,
      published: false,
      title: {
        es: "El vendedor ha acusado recibo del requerimiento",
        en: "The seller has acknowledged receipt of the demand",
      },
      formalName: {
        es: "Acuse de recibo de burofax y cómputo del plazo de respuesta",
        en: "Acknowledgment of receipt and start of the response period",
      },
      detail: {
        es: "Correos confirma la entrega el 15 de septiembre. A partir de esa fecha corre el plazo de quince días que le dimos para responder.",
        en: "The postal service confirms delivery on 15 September. The fifteen-day period we gave the seller to reply runs from that date.",
      },
    },
  ],
  firmDocs: [
    {
      id: "fd-equ-1",
      date: "2026-09-11",
      name: { es: "Burofax de requerimiento", en: "Formal demand notice" },
      kind: { es: "Comunicación fehaciente", en: "Certified notice" },
      meta: "PDF · 410 KB",
    },
    {
      id: "fd-equ-2",
      date: "2026-08-28",
      name: { es: "Informe pericial veterinario", en: "Expert veterinary report" },
      kind: { es: "Informe pericial", en: "Expert report" },
      meta: "PDF · 2,1 MB",
    },
    {
      id: "fd-equ-3",
      date: "2026-06-22",
      name: { es: "Hoja de encargo firmada", en: "Signed engagement letter" },
      kind: { es: "Contrato", en: "Contract" },
      meta: "PDF · 190 KB",
    },
  ],
  docRequests: [
    {
      id: "dr-equ-1",
      name: {
        es: "Facturas de manutención y veterinario desde la compra",
        en: "Upkeep and veterinary invoices since the purchase",
      },
      help: {
        es: "Todas las facturas de cuadra, herrador y veterinario desde marzo. Las reclamamos como daños junto al precio.",
        en: "All stabling, farrier and veterinary invoices since March. We claim these as damages alongside the purchase price.",
      },
      status: "revision",
      requestedOn: "2026-09-12",
      submittedOn: "2026-09-15",
    },
    {
      id: "dr-equ-2",
      name: {
        es: "Pasaporte deportivo del caballo (FEI)",
        en: "Horse's sport passport (FEI)",
      },
      help: {
        es: "Escanea las páginas de identificación y el historial de competiciones.",
        en: "Scan the identification pages and the competition record.",
      },
      status: "validado",
      requestedOn: "2026-06-25",
      submittedOn: "2026-06-27",
    },
  ],
  uploadedDocs: [
    {
      id: "ud-equ-1",
      name: {
        es: "Facturas cuadra marzo-agosto.pdf",
        en: "Stabling invoices March-August.pdf",
      },
      uploadedOn: "2026-09-15",
      meta: "PDF · 1,6 MB",
      fulfillsRequestId: "dr-equ-1",
    },
    {
      id: "ud-equ-2",
      name: { es: "Pasaporte FEI.pdf", en: "FEI passport.pdf" },
      uploadedOn: "2026-06-27",
      meta: "PDF · 890 KB",
      fulfillsRequestId: "dr-equ-2",
    },
  ],
  keyDates: [
    {
      id: "kd-equ-1",
      kind: "reunion",
      date: "2026-10-02T11:00:00",
      title: {
        es: "Reunión para decidir si presentamos demanda",
        en: "Meeting to decide whether to file the claim",
      },
      place: {
        es: "Despacho · C/ Moratín, 14, 5º C, Valencia",
        en: "Office · C/ Moratín, 14, 5º C, Valencia",
      },
      note: {
        es: "La fijamos después de que venza el plazo de respuesta del vendedor.",
        en: "Scheduled for after the seller's response deadline expires.",
      },
    },
  ],
  expiries: [],
};

export const CASES: Case[] = [
  caseExtranjeria,
  caseInmobiliario,
  casePenal,
  caseCivil,
  caseEcuestre,
];

/* ------------------------------------------------------------------ */
/* CLIENTES                                                            */
/* ------------------------------------------------------------------ */

export const CLIENTS: Client[] = [
  {
    id: "cli-1",
    email: "olena@demo.es",
    password: "demo1234",
    name: "Olena Kovalenko",
    phone: "+34 622 11 44 87",
    address: {
      es: "C/ Cuba, 31, 46006 Valencia",
      en: "C/ Cuba, 31, 46006 Valencia",
    },
    idDocument: "TIE Y1234567H",
    lastAccess: "2026-09-16T18:42:00",
    notifyByEmail: true,
    notifyBySms: true,
    demoBlurb: {
      es: "Dos asuntos abiertos: residencia de inversor e inmobiliario. Tiene documentos pendientes y un documento rechazado.",
      en: "Two open matters: investor residence permit and real estate. Has pending documents and one rejected document.",
    },
    authorizedPeople: [
      {
        id: "ap-1",
        name: "Andrii Kovalenko",
        relationship: { es: "Cónyuge", en: "Spouse" },
        scopes: ["lectura", "documentos"],
        addedOn: "2026-05-04",
        caseIds: ["c-ext"],
      },
      {
        id: "ap-2",
        name: "Gestoría Ribalta S.L.",
        relationship: { es: "Asesoría fiscal", en: "Tax adviser" },
        scopes: ["economico"],
        addedOn: "2026-07-22",
        caseIds: ["c-inm"],
      },
    ],
    accessLog: [
      {
        id: "al-1-1",
        date: "2026-09-16T18:42:00",
        device: { es: "iPhone · Safari", en: "iPhone · Safari" },
        location: "Valencia, ES",
        actor: "Olena Kovalenko",
      },
      {
        id: "al-1-2",
        date: "2026-09-16T09:15:00",
        device: { es: "Windows · Chrome", en: "Windows · Chrome" },
        location: "Valencia, ES",
        actor: "Olena Kovalenko",
      },
      {
        id: "al-1-3",
        date: "2026-09-12T11:30:00",
        device: { es: "Android · Chrome", en: "Android · Chrome" },
        location: "Valencia, ES",
        actor: "Andrii Kovalenko",
        actorIsAuthorized: true,
      },
    ],
  },
  {
    id: "cli-2",
    email: "javier@demo.es",
    password: "demo1234",
    name: "Javier Soler Marín",
    phone: "+34 654 90 22 10",
    address: {
      es: "Avda. del Puerto, 108, 46022 Valencia",
      en: "Avda. del Puerto, 108, 46022 Valencia",
    },
    idDocument: "DNI 24 887 331-K",
    lastAccess: "2026-09-15T20:05:00",
    notifyByEmail: true,
    notifyBySms: false,
    demoBlurb: {
      es: "Dos asuntos: penal con juicio señalado y divorcio en negociación. Tiene fechas próximas.",
      en: "Two matters: a criminal case with a trial date and a divorce under negotiation. Has upcoming dates.",
    },
    authorizedPeople: [
      {
        id: "ap-3",
        name: "Rosa Marín Peris",
        relationship: { es: "Madre · asume los honorarios", en: "Mother · pays the fees" },
        scopes: ["economico"],
        addedOn: "2026-04-15",
        caseIds: ["c-pen"],
      },
    ],
    accessLog: [
      {
        id: "al-2-1",
        date: "2026-09-15T20:05:00",
        device: { es: "Android · Chrome", en: "Android · Chrome" },
        location: "Valencia, ES",
        actor: "Javier Soler Marín",
      },
      {
        id: "al-2-2",
        date: "2026-09-09T13:20:00",
        device: { es: "macOS · Safari", en: "macOS · Safari" },
        location: "Valencia, ES",
        actor: "Javier Soler Marín",
      },
    ],
  },
  {
    id: "cli-3",
    email: "marta@demo.es",
    password: "demo1234",
    name: "Marta Ferrer Bellver",
    phone: "+34 610 77 65 03",
    address: {
      es: "Partida de la Coma, s/n, 46500 Sagunto (Valencia)",
      en: "Partida de la Coma, s/n, 46500 Sagunto (Valencia)",
    },
    idDocument: "DNI 44 210 556-B",
    lastAccess: "2026-09-16T08:12:00",
    notifyByEmail: true,
    notifyBySms: true,
    demoBlurb: {
      es: "Un único asunto (ecuestre): el portal la lleva directamente a su ficha sin pasar por el listado.",
      en: "A single matter (equestrian): the portal takes her straight to the file, skipping the list.",
    },
    authorizedPeople: [],
    accessLog: [
      {
        id: "al-3-1",
        date: "2026-09-16T08:12:00",
        device: { es: "iPad · Safari", en: "iPad · Safari" },
        location: "Sagunto, ES",
        actor: "Marta Ferrer Bellver",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* MENSAJERÍA                                                          */
/* ------------------------------------------------------------------ */

export const MESSAGES: Message[] = [
  {
    id: "m-1",
    caseId: "c-ext",
    from: "despacho",
    authorName: "Lucía Marco Herrero",
    date: "2026-09-15T12:10:00",
    read: true,
    body: {
      es: "Buenos días, Olena. Nos ha llegado un requerimiento de la Administración. No es motivo de alarma: piden acreditar que la inversión se mantiene. Te he pedido dos documentos en el apartado de documentos del expediente.",
      en: "Good morning, Olena. We have received a request from the authorities. It is not a cause for concern: they want proof that the investment is still in place. I have requested two documents in the documents section of your file.",
    },
  },
  {
    id: "m-2",
    caseId: "c-ext",
    from: "cliente",
    authorName: "Olena Kovalenko",
    date: "2026-09-16T09:05:00",
    read: true,
    body: {
      es: "Gracias, Lucía. Te subo ya el certificado del banco y lo que me ha enviado la aseguradora.",
      en: "Thanks, Lucía. I am uploading the bank certificate now, along with what my insurer sent me.",
    },
    attachment: {
      name: { es: "Certificado bancario septiembre 2026.pdf", en: "Bank certificate September 2026.pdf" },
      meta: "PDF · 210 KB",
    },
  },
  {
    id: "m-3",
    caseId: "c-ext",
    from: "despacho",
    authorName: "Lucía Marco Herrero",
    date: "2026-09-16T16:30:00",
    read: false,
    body: {
      es: "Recibido. El certificado del banco lo estamos revisando. El de la aseguradora no nos sirve: es el recibo del pago, no el certificado de cobertura. Te he dejado explicado en el expediente qué tienes que pedirles exactamente.",
      en: "Received. We are reviewing the bank certificate. The insurer's document is not valid: it is the payment receipt, not the cover certificate. I have explained in your file exactly what you need to ask them for.",
    },
  },
  {
    id: "m-4",
    caseId: "c-inm",
    from: "despacho",
    authorName: "Carmen Lloret Vidal",
    date: "2026-09-12T10:00:00",
    read: false,
    body: {
      es: "Olena, ya tenemos fecha de notaría: 6 de octubre a las 12:00. Necesitamos el justificante de la transferencia del resto del precio antes de ese día y que nos confirmes si la compra será a tu nombre exclusivamente: al estar casada, el notario tiene que hacer constar vuestro régimen económico matrimonial, y para eso nos hace falta el certificado de matrimonio apostillado. Te he pedido los dos documentos en el expediente.",
      en: "Olena, we have the notary date: 6 October at 12:00. We need proof of the transfer for the remaining balance before then, and confirmation of whether the purchase will be in your name only: as you are married, the notary must record your matrimonial property regime, and for that we need the apostilled marriage certificate. I have requested both documents in your file.",
    },
  },
  {
    id: "m-5",
    caseId: "c-pen",
    from: "despacho",
    authorName: "Daniel Ortí Sanchis",
    date: "2026-09-08T17:45:00",
    read: true,
    body: {
      es: "Javier, ya tenemos fecha de juicio: 14 de octubre a las 10:00. Se admitió toda la prueba que propusimos. Te llamo esta semana para concretar la reunión de preparación.",
      en: "Javier, we have a trial date: 14 October at 10:00. All the evidence we proposed was admitted. I will call you this week to arrange the preparation meeting.",
    },
  },
  {
    id: "m-6",
    caseId: "c-pen",
    from: "cliente",
    authorName: "Javier Soler Marín",
    date: "2026-09-14T19:20:00",
    read: true,
    body: {
      es: "Perfecto, Daniel. Te adjunto el certificado del curso que hice.",
      en: "Great, Daniel. I am attaching the certificate for the course I completed.",
    },
    attachment: {
      name: { es: "Certificado curso seguridad vial.pdf", en: "Road safety course certificate.pdf" },
      meta: "PDF · 74 KB",
    },
  },
  {
    id: "m-7",
    caseId: "c-civ",
    from: "despacho",
    authorName: "Carmen Lloret Vidal",
    date: "2026-09-12T13:15:00",
    read: false,
    body: {
      es: "Javier, ya hemos enviado la propuesta de convenio. En cuanto nos contesten te paso el borrador para que lo leas con calma antes de firmar nada.",
      en: "Javier, we have sent the proposed agreement. As soon as they reply I will send you the draft so you can read it carefully before signing anything.",
    },
  },
  {
    id: "m-8",
    caseId: "c-equ",
    from: "despacho",
    authorName: "Pablo Escrivá Gil",
    date: "2026-09-11T11:00:00",
    read: true,
    body: {
      es: "Marta, el burofax salió esta mañana. El vendedor tiene quince días para contestar. Mientras tanto, si te llegan más facturas de la cuadra, súbelas al expediente.",
      en: "Marta, the formal notice went out this morning. The seller has fifteen days to reply. In the meantime, if you receive more stabling invoices, upload them to the file.",
    },
  },
  {
    id: "m-9",
    caseId: "c-equ",
    from: "cliente",
    authorName: "Marta Ferrer Bellver",
    date: "2026-09-15T08:40:00",
    read: true,
    body: {
      es: "Subidas las facturas de marzo a agosto. ¿Hace falta que pida también las del herrador?",
      en: "I have uploaded the invoices from March to August. Do you also need the farrier's ones?",
    },
    attachment: {
      name: { es: "Facturas cuadra marzo-agosto.pdf", en: "Stabling invoices March-August.pdf" },
      meta: "PDF · 1,6 MB",
    },
  },
];

/* ------------------------------------------------------------------ */
/* ÁREA ECONÓMICA                                                      */
/* ------------------------------------------------------------------ */

export const ENGAGEMENTS: Engagement[] = [
  {
    id: "eng-1",
    caseId: "c-ext",
    acceptedOn: "2026-05-04",
    scope: {
      es: "Renovación de autorización de residencia para inversores, incluida subsanación y cita de huellas.",
      en: "Renewal of investor residence permit, including responses to requests and the fingerprint appointment.",
    },
    amount: 1800,
    terms: {
      es: "Honorarios fijos, IVA incluido. 50 % a la aceptación y 50 % a la resolución. No incluye tasas ni gastos de tramitación, que se piden aparte como provisión de fondos.",
      en: "Fixed fee, VAT included. 50% on acceptance and 50% on the decision. Government fees and processing costs are not included and are requested separately as a payment on account.",
    },
  },
  {
    id: "eng-2",
    caseId: "c-inm",
    acceptedOn: "2026-07-21",
    scope: {
      es: "Asesoramiento integral en la compraventa, comprobaciones registrales y asistencia a notaría.",
      en: "Full advisory on the purchase, Land Registry checks and attendance at the notary.",
    },
    amount: 2400,
    terms: {
      es: "1 % del precio de compra, con mínimo de 2.400 €, IVA incluido. No incluye impuestos de la compraventa (ITP), notaría ni registro, que se piden aparte como provisión de fondos.",
      en: "1% of the purchase price, with a minimum of 2,400 €, VAT included. Purchase taxes (transfer tax), notary and registry fees are not included and are requested separately as a payment on account.",
    },
  },
  {
    id: "eng-3",
    caseId: "c-pen",
    acceptedOn: "2026-04-15",
    scope: {
      es: "Defensa penal en procedimiento abreviado hasta sentencia en primera instancia.",
      en: "Criminal defence in summary proceedings up to first-instance judgment.",
    },
    amount: 3200,
    terms: {
      es: "Honorarios por fases, IVA incluido: instrucción, juicio oral y sentencia.",
      en: "Fees by stage, VAT included: investigation, trial and judgment.",
    },
  },
  {
    id: "eng-4",
    caseId: "c-civ",
    acceptedOn: "2026-08-05",
    scope: {
      es: "Divorcio de mutuo acuerdo, incluida la negociación del convenio regulador y la ratificación.",
      en: "Divorce by mutual agreement, including negotiation of the settlement and ratification.",
    },
    amount: 1500,
    terms: {
      es: "Honorarios fijos, IVA incluido. Si el procedimiento pasa a contencioso, se presupuesta aparte.",
      en: "Fixed fee, VAT included. If the case becomes contested, a separate quote will be issued.",
    },
  },
  {
    id: "eng-5",
    caseId: "c-equ",
    acceptedOn: "2026-06-22",
    scope: {
      es: "Reclamación por vicios ocultos: fase extrajudicial y, en su caso, demanda en primera instancia.",
      en: "Hidden defects claim: out-of-court phase and, if needed, first-instance court claim.",
    },
    amount: 2900,
    terms: {
      es: "Honorarios por fases, IVA incluido, más 8 % de cuota litis sobre lo efectivamente recuperado.",
      en: "Fees by stage, VAT included, plus an 8% success fee on amounts actually recovered.",
    },
  },
];

export const INVOICES: Invoice[] = [
  {
    id: "inv-1",
    number: "2026/0412",
    date: "2026-05-06",
    concept: {
      es: "Honorarios primera fase · residencia de inversor",
      en: "First stage fees · investor residence permit",
    },
    caseId: "c-ext",
    amount: 900,
    status: "pagada",
  },
  {
    id: "inv-2",
    number: "2026/0588",
    date: "2026-07-23",
    concept: {
      es: "Primera fase · compraventa Ruzafa",
      en: "First stage · Ruzafa purchase",
    },
    caseId: "c-inm",
    amount: 1200,
    status: "pagada",
  },
  {
    id: "inv-3",
    number: "2026/0711",
    date: "2026-09-12",
    concept: {
      es: "Segunda fase · compraventa Ruzafa",
      en: "Second stage · Ruzafa purchase",
    },
    caseId: "c-inm",
    amount: 1200,
    status: "pendiente",
    dueDate: "2026-10-02",
  },
  {
    id: "inv-4",
    number: "2026/0361",
    date: "2026-04-17",
    concept: { es: "Fase de instrucción", en: "Investigation stage" },
    caseId: "c-pen",
    amount: 1600,
    status: "pagada",
  },
  {
    id: "inv-5",
    number: "2026/0699",
    /*
     * Vencida a propósito. El escenario necesita un impagado real: es lo que
     * hace visible en la vista despacho el aviso de "facturas vencidas", y de
     * paso obliga al área económica del cliente a decirlo con sus palabras en
     * vez de anunciar un vencimiento que ya pasó.
     */
    date: "2026-08-07",
    concept: { es: "Fase de juicio oral", en: "Trial stage" },
    caseId: "c-pen",
    amount: 1100,
    status: "pendiente",
    dueDate: "2026-09-07",
  },
  {
    id: "inv-6",
    number: "2026/0640",
    date: "2026-08-07",
    concept: { es: "Divorcio de mutuo acuerdo", en: "Divorce by mutual agreement" },
    caseId: "c-civ",
    amount: 750,
    status: "pagada",
  },
  {
    id: "inv-7",
    number: "2026/0505",
    date: "2026-06-24",
    concept: {
      es: "Fase extrajudicial · reclamación equina",
      en: "Out-of-court stage · equine claim",
    },
    caseId: "c-equ",
    amount: 1450,
    status: "pagada",
  },
];

export const PROVISIONS: FundProvision[] = [
  {
    id: "pv-1",
    caseId: "c-ext",
    concept: {
      es: "Tasa de solicitud (modelo 790-052) y gastos de tramitación",
      en: "Application fee (form 790-052) and processing costs",
    },
    payee: { es: "Administración", en: "Public authority" },
    amount: 84,
    requestedOn: "2026-06-25",
    status: "pagada",
    paidOn: "2026-06-28",
  },
  {
    id: "pv-2",
    caseId: "c-inm",
    concept: {
      es: "Nota simple registral y certificado de comunidad",
      en: "Land Registry extract and community certificate",
    },
    payee: {
      es: "Registro de la Propiedad y administrador de fincas",
      en: "Land Registry and building manager",
    },
    amount: 120,
    requestedOn: "2026-08-05",
    status: "pagada",
    paidOn: "2026-08-06",
  },
  {
    id: "pv-3",
    caseId: "c-inm",
    concept: {
      es: "Provisión para aranceles de notaría y registro",
      en: "Provision for notary and registry fees",
    },
    payee: {
      es: "Notaría y Registro de la Propiedad",
      en: "Notary and Land Registry",
    },
    amount: 1500,
    requestedOn: "2026-09-12",
    status: "pendiente",
    dueDate: "2026-10-01",
  },
  {
    id: "pv-6",
    caseId: "c-inm",
    concept: {
      es: "Impuesto de transmisiones patrimoniales (10 %) · modelo 600",
      en: "Property transfer tax (10%) · form 600",
    },
    payee: {
      es: "Hacienda autonómica (Generalitat Valenciana)",
      en: "Regional tax authority (Generalitat Valenciana)",
    },
    amount: 24000,
    requestedOn: "2026-09-12",
    status: "pendiente",
    dueDate: "2026-10-30",
  },
  {
    id: "pv-4",
    caseId: "c-equ",
    concept: {
      es: "Honorarios del perito veterinario",
      en: "Veterinary expert's fees",
    },
    payee: {
      es: "Perito veterinario independiente",
      en: "Independent veterinary expert",
    },
    amount: 1100,
    requestedOn: "2026-07-10",
    status: "pagada",
    paidOn: "2026-07-14",
  },
  {
    id: "pv-5",
    caseId: "c-equ",
    concept: { es: "Burofax certificado", en: "Certified formal notice" },
    payee: { es: "Correos", en: "Correos (postal service)" },
    amount: 45,
    requestedOn: "2026-09-08",
    status: "pagada",
    paidOn: "2026-09-09",
  },
];

/* ------------------------------------------------------------------ */
/* CONSULTAS                                                           */
/* ------------------------------------------------------------------ */

export function getClientById(id: string): Client | undefined {
  return CLIENTS.find((c) => c.id === id);
}

export function getCasesByClient(clientId: string): Case[] {
  return CASES.filter((c) => c.clientId === clientId);
}

export function getCaseById(id: string): Case | undefined {
  return CASES.find((c) => c.id === id);
}

export function authenticate(email: string, password: string): Client | undefined {
  const normalized = email.trim().toLowerCase();
  return CLIENTS.find(
    (c) => c.email.toLowerCase() === normalized && c.password === password,
  );
}

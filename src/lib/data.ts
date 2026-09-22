/**
 * DATOS DE DEMOSTRACIÓN — TODO FICTICIO.
 *
 * Ni los clientes, ni los profesionales, ni los expedientes, ni los importes
 * corresponden a personas o asuntos reales. Las referencias, fechas y organismos
 * son verosímiles a efectos de demostración únicamente.
 *
 * Fecha de referencia del escenario: 22 de septiembre de 2026.
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

export const TODAY = "2026-09-22";

/*
 * La identidad del despacho NO vive aquí, sino en `src/config/identity.ts`.
 * Este fichero es solo el escenario de demostración.
 */

export const LAWYERS: Record<string, Lawyer> = {
  l1: {
    id: "l1",
    name: "Álvaro Benlloch Esteve",
    role: {
      es: "Responsable de Derecho laboral",
      en: "Head of Employment Law",
    },
    email: "a.benlloch@demo.despacho.es",
    phone: "+34 600 40 10 01",
    initials: "AB",
  },
  l2: {
    id: "l2",
    name: "Marta Ferrandis Gil",
    role: {
      es: "Responsable de Inmobiliario y Sucesiones",
      en: "Head of Real Estate and Probate",
    },
    email: "m.ferrandis@demo.despacho.es",
    phone: "+34 600 40 10 02",
    initials: "MF",
  },
  l3: {
    id: "l3",
    name: "Ignacio Peris Almela",
    role: { es: "Derecho civil y penal", en: "Civil and criminal law" },
    email: "i.peris@demo.despacho.es",
    phone: "+34 600 40 10 03",
    initials: "IP",
  },
  l4: {
    id: "l4",
    name: "Celia Bonet Ramos",
    role: {
      es: "Protección de datos y compliance",
      en: "Data protection and compliance",
    },
    email: "c.bonet@demo.despacho.es",
    phone: "+34 600 40 10 04",
    initials: "CB",
  },
};

/* ------------------------------------------------------------------ */
/* EXPEDIENTES                                                         */
/* ------------------------------------------------------------------ */

/*
 * Compraventa con todo al día: ni borradores, ni documentos por revisar, ni
 * cobros vencidos. Es el expediente que en la vista despacho sale sin color,
 * y por eso conviene no darle trabajo pendiente al tocar el escenario.
 */
const caseInmobiliario: Case = {
  id: "c-inm",
  clientId: "cli-1",
  ref: "INM-2026-0214",
  area: "inmobiliario",
  title: {
    es: "Compra de vivienda en València",
    en: "Purchase of a home in València",
  },
  shortTitle: { es: "Compra de vivienda", en: "Home purchase" },
  phases: [
    { label: { es: "Consulta y encargo", en: "Consultation and engagement" } },
    { label: { es: "Comprobaciones previas", en: "Preliminary checks" } },
    { label: { es: "Contrato de arras", en: "Deposit agreement" } },
    { label: { es: "Escritura pública", en: "Signing before the notary" } },
    { label: { es: "Impuestos y registro", en: "Taxes and registration" } },
  ],
  currentPhase: 3,
  openedOn: "2026-06-30",
  lastUpdate: "2026-09-18",
  statusLine: {
    es: "Firma en notaría el 8 de octubre. La documentación previa está completa.",
    en: "Signing at the notary on 8 October. The preliminary paperwork is complete.",
  },
  whatIsHappening: {
    es: "Hemos terminado las comprobaciones sobre la vivienda: la nota simple registral no arroja cargas distintas de la hipoteca que la parte vendedora cancelará en el mismo acto de la firma, la comunidad de propietarios certifica que no hay cuotas pendientes y el edificio tiene en regla el informe de evaluación. Con el contrato de arras firmado, la notaría ya tiene el borrador de escritura.",
    en: "We have finished the checks on the property: the Land Registry extract shows no charges other than the mortgage the seller will cancel at the signing itself, the residents' association certifies that no service charges are outstanding, and the building's condition report is in order. With the deposit agreement signed, the notary already has the draft deed.",
  },
  whatComesNext: {
    es: "El 8 de octubre firmamos la escritura de compraventa ante notario y te acompañamos a la firma. Después nos ocupamos nosotros de liquidar el impuesto de transmisiones patrimoniales con el modelo 600 y de presentar la escritura en el Registro de la Propiedad. Antes de la firma necesitamos que hagas la transferencia del resto del precio, que te pedimos más abajo.",
    en: "On 8 October we will sign the purchase deed before the notary and we will be there with you. Afterwards we will take care of filing the transfer tax return (form 600) and lodging the deed at the Land Registry. Before the signing we need you to transfer the balance of the price, which we request below.",
  },
  administrativeEstimate: {
    es: "Una vez presentada la escritura, el Registro de la Propiedad suele practicar la inscripción en unas 4 a 6 semanas.",
    en: "Once the deed is lodged, the Land Registry usually completes registration in around 4 to 6 weeks.",
  },
  lawyerId: "l2",
  actions: [
    {
      id: "a-inm-1",
      date: "2026-06-30",
      kind: "despacho",
      phaseIndex: 0,
      published: true,
      title: {
        es: "Abrimos tu expediente de compraventa",
        en: "We opened your purchase file",
      },
      formalName: {
        es: "Apertura de expediente y aceptación de hoja de encargo",
        en: "File opening and acceptance of engagement letter",
      },
      detail: {
        es: "Registramos el encargo de asesoramiento en la compra de la vivienda y te asignamos a Marta Ferrandis como letrada responsable.",
        en: "We registered the engagement for advice on the purchase of the property and assigned Marta Ferrandis as your lead lawyer.",
      },
    },
    {
      id: "a-inm-2",
      date: "2026-07-17",
      kind: "procedimiento",
      phaseIndex: 1,
      published: true,
      title: {
        es: "Comprobamos la situación registral de la vivienda",
        en: "We checked the property's registry status",
      },
      formalName: {
        es: "Solicitud de nota simple informativa y certificado de la comunidad de propietarios",
        en: "Request for Land Registry extract and residents' association certificate",
      },
      detail: {
        es: "Pedimos la nota simple al Registro de la Propiedad y el certificado del administrador de fincas. La vivienda figura a nombre de la parte vendedora, con una hipoteca que se cancelará en la propia firma, y no hay cuotas de comunidad pendientes.",
        en: "We requested the extract from the Land Registry and the certificate from the building manager. The property is registered in the seller's name, with a mortgage that will be cancelled at the signing itself, and there are no outstanding service charges.",
      },
      attachment: {
        name: {
          es: "Nota simple registral.pdf",
          en: "Land Registry extract.pdf",
        },
        meta: "PDF · 190 KB",
      },
    },
    {
      id: "a-inm-3",
      date: "2026-08-28",
      /*
       * Las arras son un contrato privado entre las partes: no interviene
       * juzgado, Administración ni notaría, así que es "despacho".
       */
      kind: "despacho",
      phaseIndex: 2,
      published: true,
      title: {
        es: "Firmaste el contrato de arras",
        en: "You signed the deposit agreement",
      },
      formalName: {
        es: "Contrato de arras penitenciales (art. 1454 del Código Civil)",
        en: "Deposit agreement under art. 1454 of the Civil Code",
      },
      detail: {
        es: "Redactamos y revisamos contigo el contrato de arras por 12.000 €, con el precio de compra fijado en 245.000 € y la firma de la escritura prevista para octubre. Las arras son penitenciales: si la compra no llega a buen puerto, el contrato regula qué ocurre con esa cantidad.",
        en: "We drafted and went through with you the deposit agreement for 12,000 €, with the purchase price set at 245,000 € and the deed signing scheduled for October. The deposit is a penitential one: if the purchase does not go ahead, the agreement governs what happens to that amount.",
      },
      attachment: {
        name: {
          es: "Contrato de arras firmado.pdf",
          en: "Signed deposit agreement.pdf",
        },
        meta: "PDF · 420 KB",
      },
    },
    {
      id: "a-inm-4",
      date: "2026-09-18",
      kind: "procedimiento",
      phaseIndex: 3,
      published: true,
      title: {
        es: "Ya tenemos día y hora en la notaría",
        en: "The notary appointment is booked",
      },
      formalName: {
        es: "Señalamiento para el otorgamiento de escritura pública de compraventa",
        en: "Appointment for the execution of the public purchase deed",
      },
      detail: {
        es: "La notaría ha señalado la firma para el 8 de octubre a las 11:30. Hemos enviado el borrador de escritura para su revisión y nos han confirmado que la entidad de la parte vendedora acudirá a cancelar la hipoteca en el mismo acto.",
        en: "The notary has scheduled the signing for 8 October at 11:30. We sent the draft deed for review and they have confirmed that the seller's bank will attend to cancel the mortgage at the same appointment.",
      },
    },
  ],
  firmDocs: [
    {
      id: "fd-inm-1",
      date: "2026-06-30",
      name: { es: "Hoja de encargo profesional", en: "Engagement letter" },
      kind: { es: "Encargo", en: "Engagement" },
      meta: "PDF · 160 KB",
    },
    {
      id: "fd-inm-2",
      date: "2026-07-17",
      name: {
        es: "Informe de comprobaciones previas",
        en: "Preliminary checks report",
      },
      kind: { es: "Informe", en: "Report" },
      meta: "PDF · 320 KB",
    },
    {
      id: "fd-inm-3",
      date: "2026-08-28",
      name: {
        es: "Contrato de arras firmado",
        en: "Signed deposit agreement",
      },
      kind: { es: "Contrato", en: "Contract" },
      meta: "PDF · 420 KB",
    },
    {
      id: "fd-inm-4",
      date: "2026-09-18",
      name: {
        es: "Borrador de escritura de compraventa",
        en: "Draft purchase deed",
      },
      kind: { es: "Escritura", en: "Deed" },
      meta: "PDF · 510 KB",
    },
  ],
  docRequests: [
    {
      id: "dr-inm-1",
      name: {
        es: "Justificante de la transferencia del resto del precio",
        en: "Proof of transfer of the balance of the price",
      },
      help: {
        es: "La notaría necesita saber cómo se paga el precio. Lo más sencillo es un cheque bancario a nombre de la parte vendedora; si prefieres transferencia, súbenos el justificante con fecha anterior a la firma.",
        en: "The notary needs to know how the price is paid. The simplest option is a banker's draft made out to the seller; if you prefer a transfer, upload the receipt dated before the signing.",
      },
      status: "pendiente",
      requestedOn: "2026-09-18",
    },
    {
      id: "dr-inm-2",
      name: { es: "Pasaporte en vigor", en: "Valid passport" },
      help: {
        es: "La notaría te identificará con el pasaporte el día de la firma. Necesitamos el escaneo de la página de datos.",
        en: "The notary will identify you with your passport on the day of the signing. We need a scan of the data page.",
      },
      status: "validado",
      requestedOn: "2026-07-02",
      submittedOn: "2026-07-03",
    },
    {
      id: "dr-inm-3",
      name: {
        es: "Documentación sobre el origen de los fondos",
        en: "Documents on the source of funds",
      },
      help: {
        es: "La ley de prevención del blanqueo de capitales (Ley 10/2010) obliga tanto al despacho como a la notaría a acreditar de dónde procede el dinero. Con los extractos de la cuenta de los últimos seis meses y el justificante de la venta de tu anterior vivienda es suficiente.",
        en: "Anti-money-laundering legislation (Law 10/2010) requires both the firm and the notary to evidence where the money comes from. Bank statements for the last six months and proof of the sale of your previous home are enough.",
      },
      status: "validado",
      requestedOn: "2026-07-02",
      submittedOn: "2026-07-09",
    },
  ],
  uploadedDocs: [
    {
      id: "ud-inm-1",
      name: { es: "Pasaporte.pdf", en: "Passport.pdf" },
      uploadedOn: "2026-07-03",
      meta: "PDF · 1,2 MB",
      fulfillsRequestId: "dr-inm-2",
    },
    {
      id: "ud-inm-2",
      name: {
        es: "Extractos bancarios y venta anterior.pdf",
        en: "Bank statements and previous sale.pdf",
      },
      uploadedOn: "2026-07-09",
      meta: "PDF · 2,8 MB",
      fulfillsRequestId: "dr-inm-3",
    },
  ],
  keyDates: [
    {
      id: "kd-inm-1",
      kind: "notaria",
      date: "2026-10-08T11:30:00",
      title: {
        es: "Firma de la escritura de compraventa",
        en: "Signing of the purchase deed",
      },
      place: {
        es: "Notaría · C/ Colón 22, València",
        en: "Notary's office · C/ Colón 22, València",
      },
      note: {
        es: "Lleva el pasaporte en vigor y el medio de pago acordado. Marta te acompañará; quedamos diez minutos antes en la puerta.",
        en: "Bring your valid passport and the agreed means of payment. Marta will be with you; we will meet ten minutes early at the entrance.",
      },
    },
  ],
  expiries: [
    {
      id: "ex-inm-1",
      document: { es: "Pasaporte", en: "Passport" },
      expiresOn: "2027-01-20",
      advice: {
        es: "La notaría te identificará con este pasaporte el día de la firma, así que para octubre sigue siendo válido. Aun así conviene renovarlo con tiempo: la tramitación desde el consulado puede tardar varias semanas y lo necesitarás para cualquier gestión posterior sobre la vivienda.",
        en: "The notary will identify you with this passport on the day of the signing, so it is still valid in October. Even so, it is worth renewing it in good time: processing through the consulate can take several weeks and you will need it for any later dealings concerning the property.",
      },
    },
  ],
};

/*
 * Herencia. Trae el documento RECHAZADO del escenario y el borrador sin
 * publicar del área de Marta Ferrandis (`CURRENT_USER_ID`), que es el único
 * pendiente que le queda al filtrar «Solo lo mío» en la vista despacho.
 */
const caseSucesiones: Case = {
  id: "c-suc",
  clientId: "cli-1",
  ref: "SUC-2026-0061",
  area: "sucesiones",
  title: {
    es: "Tramitación de herencia y adjudicación de vivienda",
    en: "Probate and allocation of the inherited home",
  },
  shortTitle: { es: "Herencia materna", en: "Mother's estate" },
  phases: [
    { label: { es: "Consulta y encargo", en: "Consultation and engagement" } },
    {
      label: {
        es: "Documentación y últimas voluntades",
        en: "Documents and will search",
      },
    },
    {
      label: {
        es: "Escritura de aceptación",
        en: "Deed of acceptance",
      },
    },
    { label: { es: "Impuestos", en: "Taxes" } },
    { label: { es: "Inscripción registral", en: "Land Registry entry" } },
  ],
  currentPhase: 3,
  openedOn: "2026-05-18",
  lastUpdate: "2026-09-19",
  statusLine: {
    es: "La herencia ya está aceptada en escritura. Quedan los impuestos.",
    en: "The estate has been accepted by deed. The taxes are what remain.",
  },
  whatIsHappening: {
    es: "La escritura de aceptación y adjudicación de herencia se firmó en julio y la vivienda de Alboraia figura ya adjudicada a tu nombre en ella. Hemos presentado y pagado el impuesto de sucesiones, y ahora estamos preparando la liquidación de la plusvalía municipal ante el Ajuntament de València.",
    en: "The deed accepting and allocating the estate was signed in July, and the home in Alboraia is already allocated to you in it. We have filed and paid the inheritance tax, and we are now preparing the municipal capital gains return for València City Council.",
  },
  whatComesNext: {
    es: "En cuanto tengamos la escritura de compra con la que tu madre adquirió la vivienda podremos calcular la plusvalía municipal por los dos métodos que permite la ley y liquidar por el que salga menor. Del plazo de presentación nos ocupamos nosotros. Después presentaremos la escritura en el Registro de la Propiedad para que la vivienda quede inscrita a tu nombre.",
    en: "As soon as we have the deed by which your mother acquired the property we will be able to calculate the municipal capital gains tax under both methods allowed by law and file under whichever is lower. The filing deadline is ours to manage. Afterwards we will lodge the deed at the Land Registry so the property is registered in your name.",
  },
  lawyerId: "l2",
  actions: [
    {
      id: "a-suc-1",
      date: "2026-05-18",
      kind: "despacho",
      phaseIndex: 0,
      published: true,
      title: {
        es: "Abrimos el expediente de herencia",
        en: "We opened the probate file",
      },
      formalName: {
        es: "Apertura de expediente y aceptación de hoja de encargo",
        en: "File opening and acceptance of engagement letter",
      },
      detail: {
        es: "Registramos el encargo de tramitación de la herencia y te asignamos a Marta Ferrandis como letrada responsable.",
        en: "We registered the engagement for handling the estate and assigned Marta Ferrandis as your lead lawyer.",
      },
    },
    {
      id: "a-suc-2",
      date: "2026-06-04",
      kind: "procedimiento",
      phaseIndex: 1,
      published: true,
      title: {
        es: "Obtuvimos el certificado de últimas voluntades",
        en: "We obtained the will search certificate",
      },
      formalName: {
        es: "Certificado de defunción y certificado de actos de última voluntad (modelo 790)",
        en: "Death certificate and will search certificate (form 790)",
      },
      detail: {
        es: "Solicitamos al Registro Civil el certificado de defunción y al Registro General de Actos de Última Voluntad el certificado correspondiente. Confirma el testamento otorgado en 2019, del que ya hemos pedido copia autorizada a la notaría que lo custodia.",
        en: "We requested the death certificate from the Civil Registry and the corresponding certificate from the Central Registry of Wills. It confirms the will made in 2019, of which we have already requested an authorised copy from the notary who holds it.",
      },
      attachment: {
        name: {
          es: "Certificado de últimas voluntades.pdf",
          en: "Will search certificate.pdf",
        },
        meta: "PDF · 140 KB",
      },
    },
    {
      id: "a-suc-3",
      date: "2026-07-14",
      kind: "procedimiento",
      phaseIndex: 2,
      published: true,
      title: {
        es: "Firmaste la escritura de aceptación de la herencia",
        en: "You signed the deed accepting the estate",
      },
      formalName: {
        es: "Escritura pública de aceptación y adjudicación de herencia",
        en: "Public deed of acceptance and allocation of the estate",
      },
      detail: {
        es: "Ante notario se inventariaron los bienes —la vivienda de Alboraia y dos cuentas bancarias—, se valoraron y se te adjudicaron como heredera única. La vivienda se ha declarado por su valor de referencia catastral, que es el que la ley toma como base del impuesto.",
        en: "Before the notary the assets were inventoried — the home in Alboraia and two bank accounts — valued, and allocated to you as sole heir. The property was declared at its cadastral reference value, which is the figure the law takes as the tax base.",
      },
      attachment: {
        name: {
          es: "Escritura de aceptación de herencia.pdf",
          en: "Deed of acceptance of the estate.pdf",
        },
        meta: "PDF · 780 KB",
      },
    },
    {
      id: "a-suc-4",
      date: "2026-08-26",
      kind: "procedimiento",
      phaseIndex: 3,
      published: true,
      title: {
        es: "Presentamos y pagamos el impuesto de sucesiones",
        en: "We filed and paid the inheritance tax",
      },
      formalName: {
        es: "Autoliquidación del Impuesto sobre Sucesiones y Donaciones (modelo 650)",
        en: "Inheritance and gift tax self-assessment (form 650)",
      },
      detail: {
        es: "Presentamos el modelo 650 ante la Agència Tributària Valenciana. Al ser hija de la causante entras en el grupo II de parentesco, al que la normativa valenciana aplica una bonificación del 99 % en la cuota, de modo que el importe final a ingresar ha sido de 1.180 €.",
        en: "We filed form 650 with the Valencian tax authority. As the deceased's daughter you fall within kinship group II, to which Valencian law applies a 99% reduction on the tax due, so the final amount payable was 1,180 €.",
      },
      attachment: {
        name: {
          es: "Modelo 650 presentado.pdf",
          en: "Filed form 650.pdf",
        },
        meta: "PDF · 260 KB",
      },
    },
    {
      id: "a-suc-5",
      date: "2026-09-21",
      kind: "despacho",
      phaseIndex: 3,
      /*
       * Borrador sin publicar: es el momento clave de la demostración
       * (/despacho → Publicar → «Ver como lo ve el cliente»).
       */
      published: false,
      title: {
        es: "Tenemos lista la liquidación de la plusvalía municipal",
        en: "The municipal capital gains calculation is ready",
      },
      formalName: {
        es: "Cálculo del Impuesto sobre el Incremento de Valor de los Terrenos de Naturaleza Urbana (IIVTNU)",
        en: "Calculation of the tax on the increase in urban land value (IIVTNU)",
      },
      detail: {
        es: "La plusvalía municipal se puede calcular por dos caminos y la ley permite elegir el que resulte menor. El primero parte del valor catastral del suelo y aplica un coeficiente según los años transcurridos; el segundo toma la diferencia real entre lo que costó la vivienda cuando la compró tu madre y el valor por el que se ha declarado ahora en la herencia. Con las cifras del primer método nos sale una cuota de 860 €. Para poder comparar con el segundo necesitamos la escritura de compra original, que es el documento que te hemos vuelto a pedir.",
        en: "The municipal capital gains tax can be calculated in two ways and the law lets you choose whichever is lower. The first starts from the cadastral value of the land and applies a coefficient based on the years elapsed; the second takes the actual difference between what the property cost when your mother bought it and the value now declared in the estate. Using the first method we arrive at 860 €. To compare it with the second we need the original purchase deed, which is the document we have asked you for again.",
      },
    },
  ],
  firmDocs: [
    {
      id: "fd-suc-1",
      date: "2026-05-18",
      name: { es: "Hoja de encargo profesional", en: "Engagement letter" },
      kind: { es: "Encargo", en: "Engagement" },
      meta: "PDF · 160 KB",
    },
    {
      id: "fd-suc-2",
      date: "2026-06-04",
      name: {
        es: "Certificado de últimas voluntades",
        en: "Will search certificate",
      },
      kind: { es: "Certificado", en: "Certificate" },
      meta: "PDF · 140 KB",
    },
    {
      id: "fd-suc-3",
      date: "2026-07-14",
      name: {
        es: "Escritura de aceptación de herencia",
        en: "Deed of acceptance of the estate",
      },
      kind: { es: "Escritura", en: "Deed" },
      meta: "PDF · 780 KB",
    },
    {
      id: "fd-suc-4",
      date: "2026-08-26",
      name: { es: "Modelo 650 presentado", en: "Filed form 650" },
      kind: { es: "Impuestos", en: "Taxes" },
      meta: "PDF · 260 KB",
    },
  ],
  docRequests: [
    {
      id: "dr-suc-1",
      name: {
        es: "Certificado de defunción",
        en: "Death certificate",
      },
      help: {
        es: "El original que os entregaron en la funeraria o el que expide el Registro Civil. Con una foto legible nos vale para empezar.",
        en: "The original given to you by the funeral home, or the one issued by the Civil Registry. A legible photo is enough to start with.",
      },
      status: "validado",
      requestedOn: "2026-05-19",
      submittedOn: "2026-05-21",
    },
    {
      id: "dr-suc-2",
      name: {
        es: "Certificados de saldo de las cuentas bancarias",
        en: "Bank account balance certificates",
      },
      help: {
        es: "Pídelos en cada entidad indicando que son para una herencia: deben reflejar el saldo el día del fallecimiento, no el de hoy.",
        en: "Ask each bank for them stating they are for an estate: they must show the balance on the date of death, not today's.",
      },
      status: "validado",
      requestedOn: "2026-06-08",
      submittedOn: "2026-06-16",
    },
    {
      id: "dr-suc-3",
      name: {
        es: "Escritura de compra de la vivienda por tu madre",
        en: "Deed by which your mother bought the property",
      },
      help: {
        es: "Es la escritura con la que ella adquirió el piso de Alboraia. Lo que necesitamos de ella es el precio de compra: sin ese dato no podemos calcular la plusvalía por el método de la ganancia real. Si no la encuentras, dínoslo y pedimos copia a la notaría que la autorizó.",
        en: "It is the deed by which she acquired the flat in Alboraia. What we need from it is the purchase price: without that figure we cannot calculate the capital gains tax under the real-gain method. If you cannot find it, tell us and we will request a copy from the notary who executed it.",
      },
      status: "rechazado",
      requestedOn: "2026-09-08",
      submittedOn: "2026-09-15",
      rejectionReason: {
        es: "Lo que nos has enviado es una nota simple del Registro de la Propiedad. Acredita que la vivienda estaba a nombre de tu madre, pero no dice por cuánto la compró, que es justo el dato que necesitamos para comparar los dos métodos de la plusvalía. Hace falta la escritura de compraventa completa.",
        en: "What you sent is a Land Registry extract. It proves the property was in your mother's name, but it does not state what she paid for it, which is precisely the figure we need in order to compare the two capital gains methods. We need the complete purchase deed.",
      },
    },
    {
      id: "dr-suc-4",
      name: {
        es: "Último recibo del IBI de la vivienda",
        en: "Latest council tax receipt for the property",
      },
      help: {
        es: "Nos hace falta el valor catastral del suelo que figura en él, que es la base del primer método de cálculo de la plusvalía.",
        en: "We need the cadastral land value shown on it, which is the basis of the first capital gains calculation method.",
      },
      status: "pendiente",
      requestedOn: "2026-09-08",
    },
  ],
  uploadedDocs: [
    {
      id: "ud-suc-1",
      name: { es: "Certificado de defunción.pdf", en: "Death certificate.pdf" },
      uploadedOn: "2026-05-21",
      meta: "PDF · 320 KB",
      fulfillsRequestId: "dr-suc-1",
    },
    {
      id: "ud-suc-2",
      name: {
        es: "Certificados de saldo.pdf",
        en: "Balance certificates.pdf",
      },
      uploadedOn: "2026-06-16",
      meta: "PDF · 540 KB",
      fulfillsRequestId: "dr-suc-2",
    },
    {
      id: "ud-suc-3",
      name: { es: "Nota simple Alboraia.pdf", en: "Alboraia registry extract.pdf" },
      uploadedOn: "2026-09-15",
      meta: "PDF · 180 KB",
      fulfillsRequestId: "dr-suc-3",
    },
  ],
  keyDates: [],
  expiries: [],
};

/*
 * Despido. Es el expediente del cliente de un solo asunto y el que trae el
 * mensaje fuera del plazo de respuesta prometido: por eso sale en rojo en la
 * vista despacho sin depender de la factura vencida, que está en otro.
 */
const caseLaboral: Case = {
  id: "c-lab",
  clientId: "cli-3",
  ref: "LAB-2026-0087",
  area: "laboral",
  title: {
    es: "Impugnación de despido disciplinario",
    en: "Challenge to a disciplinary dismissal",
  },
  shortTitle: { es: "Despido disciplinario", en: "Disciplinary dismissal" },
  phases: [
    { label: { es: "Consulta y encargo", en: "Consultation and engagement" } },
    { label: { es: "Conciliación previa", en: "Pre-court conciliation" } },
    { label: { es: "Demanda", en: "Claim filed" } },
    { label: { es: "Juicio", en: "Hearing" } },
    { label: { es: "Sentencia", en: "Judgment" } },
  ],
  currentPhase: 1,
  openedOn: "2026-07-06",
  lastUpdate: "2026-09-11",
  statusLine: {
    es: "Acto de conciliación señalado para el 6 de octubre.",
    en: "Conciliation hearing scheduled for 6 October.",
  },
  whatIsHappening: {
    es: "Presentamos la papeleta de conciliación dentro de plazo y ya tenemos señalamiento. Antes de eso reclamamos por escrito a la empresa el registro de jornada de los últimos doce meses, que es el documento que permite contrastar las horas que figuran en la carta de despido.",
    en: "We filed the conciliation request within the time limit and the hearing is now scheduled. Before that we formally asked the company for the working-time records of the last twelve months, the document that allows the hours stated in the dismissal letter to be checked.",
  },
  whatComesNext: {
    es: "El 6 de octubre acudimos al acto de conciliación ante el servicio de mediación. Si la empresa no comparece o no hay acuerdo, presentaremos la demanda ante los juzgados de lo social de València; del cómputo de plazos nos encargamos nosotros. Mientras tanto necesitamos el certificado de la prestación por desempleo que nos estás enviando, porque los importes cobrados se descuentan de lo que en su caso reclamemos.",
    en: "On 6 October we will attend the conciliation hearing before the mediation service. If the company does not appear or no agreement is reached, we will file the claim with the employment courts in València; keeping track of the time limits is our job. Meanwhile we need the unemployment benefit certificate you are sending us, because amounts received are offset against anything we may claim.",
  },
  lawyerId: "l1",
  actions: [
    {
      id: "a-lab-1",
      date: "2026-07-06",
      kind: "despacho",
      phaseIndex: 0,
      published: true,
      title: {
        es: "Abrimos tu expediente y revisamos la carta de despido",
        en: "We opened your file and reviewed the dismissal letter",
      },
      formalName: {
        es: "Apertura de expediente y análisis de la comunicación extintiva",
        en: "File opening and analysis of the termination notice",
      },
      detail: {
        es: "Repasamos contigo la carta que te entregó la empresa. El artículo 55.1 del Estatuto de los Trabajadores exige que la carta exprese los hechos que motivan el despido y la fecha en que surte efectos; la tuya imputa faltas de puntualidad reiteradas pero no concreta los días. Lo hemos hecho constar en el expediente.",
        en: "We went through the letter the company gave you. Article 55.1 of the Workers' Statute requires the letter to state the facts behind the dismissal and the date it takes effect; yours alleges repeated lateness but does not specify the days. We have recorded this in the file.",
      },
    },
    {
      id: "a-lab-2",
      date: "2026-07-21",
      /*
       * Burofax a la empresa: comunicación privada entre partes, no hay
       * juzgado ni Administración de por medio.
       */
      kind: "despacho",
      phaseIndex: 0,
      published: true,
      title: {
        es: "Reclamamos a la empresa tu registro de jornada",
        en: "We asked the company for your working-time records",
      },
      formalName: {
        es: "Requerimiento del registro diario de jornada (art. 34.9 del Estatuto de los Trabajadores)",
        en: "Request for daily working-time records (art. 34.9 of the Workers' Statute)",
      },
      detail: {
        es: "Enviamos burofax con acuse de recibo pidiendo el registro diario de jornada de los últimos doce meses. La empresa está obligada a llevarlo y a conservarlo cuatro años, y es el documento que permite comprobar si los retrasos que te imputan quedaron efectivamente anotados.",
        en: "We sent a recorded-delivery letter requesting the daily working-time records for the last twelve months. The company is required to keep them for four years, and they are the document that shows whether the alleged lateness was in fact recorded.",
      },
      attachment: {
        name: {
          es: "Burofax a la empresa.pdf",
          en: "Recorded-delivery letter to the company.pdf",
        },
        meta: "PDF · 210 KB",
      },
    },
    {
      id: "a-lab-3",
      date: "2026-09-11",
      kind: "procedimiento",
      phaseIndex: 1,
      published: true,
      title: {
        es: "Presentamos la papeleta de conciliación",
        en: "We filed the conciliation request",
      },
      formalName: {
        es: "Papeleta de conciliación por despido ante el servicio de mediación, arbitraje y conciliación",
        en: "Dismissal conciliation request before the mediation, arbitration and conciliation service",
      },
      detail: {
        es: "Presentamos la papeleta dentro del plazo legal y nos han señalado el acto para el 6 de octubre a las 10:00. La conciliación es un trámite obligatorio previo a la demanda: si la empresa no comparece o no se alcanza acuerdo, queda expedita la vía judicial.",
        en: "We filed the request within the legal time limit and the hearing has been set for 6 October at 10:00. Conciliation is a compulsory step before filing a claim: if the company does not appear or no agreement is reached, the court route opens up.",
      },
      attachment: {
        name: {
          es: "Papeleta de conciliación sellada.pdf",
          en: "Stamped conciliation request.pdf",
        },
        meta: "PDF · 180 KB",
      },
    },
    {
      id: "a-lab-4",
      date: "2026-09-21",
      kind: "despacho",
      phaseIndex: 1,
      published: false,
      title: {
        es: "Preparamos contigo el acto de conciliación",
        en: "We are preparing the conciliation hearing with you",
      },
      formalName: {
        es: "Nota de preparación del acto de conciliación",
        en: "Conciliation hearing preparation note",
      },
      detail: {
        es: "En el acto de conciliación comparecemos ambas partes ante un mediador. No se practican pruebas ni se declara: solo se comprueba si hay acuerdo y se levanta acta del resultado. Iremos contigo; tú no tienes que intervenir salvo para confirmar tu identidad. Si la empresa propone una cantidad, te la trasladaremos con su cálculo desglosado para que decidas, y nada se acepta sin tu conformidad expresa.",
        en: "At the conciliation hearing both parties appear before a mediator. No evidence is taken and no statements are made: it is simply checked whether an agreement exists, and the outcome is recorded. We will go with you; you do not need to speak other than to confirm your identity. If the company offers a figure, we will pass it on with a full breakdown so you can decide, and nothing is accepted without your express agreement.",
      },
    },
  ],
  firmDocs: [
    {
      id: "fd-lab-1",
      date: "2026-07-06",
      name: { es: "Hoja de encargo profesional", en: "Engagement letter" },
      kind: { es: "Encargo", en: "Engagement" },
      meta: "PDF · 160 KB",
    },
    {
      id: "fd-lab-2",
      date: "2026-07-21",
      name: {
        es: "Burofax a la empresa con acuse de recibo",
        en: "Recorded-delivery letter to the company",
      },
      kind: { es: "Comunicación", en: "Communication" },
      meta: "PDF · 210 KB",
    },
    {
      id: "fd-lab-3",
      date: "2026-09-11",
      name: {
        es: "Papeleta de conciliación sellada",
        en: "Stamped conciliation request",
      },
      kind: { es: "Escrito", en: "Filing" },
      meta: "PDF · 180 KB",
    },
  ],
  docRequests: [
    {
      id: "dr-lab-1",
      name: {
        es: "Certificado de la prestación por desempleo",
        en: "Unemployment benefit certificate",
      },
      help: {
        es: "Se descarga de la sede electrónica del SEPE con tu certificado digital o Cl@ve. Debe indicar la fecha de inicio y el importe mensual que cobras.",
        en: "You can download it from the SEPE online office with your digital certificate or Cl@ve. It must show the start date and the monthly amount you receive.",
      },
      status: "revision",
      requestedOn: "2026-09-11",
      submittedOn: "2026-09-18",
    },
    {
      id: "dr-lab-2",
      name: {
        es: "Nóminas de los últimos doce meses",
        en: "Payslips for the last twelve months",
      },
      help: {
        es: "Nos sirven para calcular el salario regulador, que es la cifra sobre la que se calcula todo lo demás.",
        en: "We use them to work out the reference salary, which is the figure everything else is calculated from.",
      },
      status: "validado",
      requestedOn: "2026-07-07",
      submittedOn: "2026-07-13",
    },
  ],
  uploadedDocs: [
    {
      id: "ud-lab-1",
      name: { es: "Nóminas 2025-2026.pdf", en: "Payslips 2025-2026.pdf" },
      uploadedOn: "2026-07-13",
      meta: "PDF · 1,9 MB",
      fulfillsRequestId: "dr-lab-2",
    },
    {
      id: "ud-lab-2",
      name: {
        es: "Certificado SEPE.pdf",
        en: "SEPE certificate.pdf",
      },
      uploadedOn: "2026-09-18",
      meta: "PDF · 240 KB",
      fulfillsRequestId: "dr-lab-1",
    },
  ],
  keyDates: [
    {
      id: "kd-lab-1",
      kind: "vista",
      date: "2026-10-06T10:00:00",
      title: {
        es: "Acto de conciliación",
        en: "Conciliation hearing",
      },
      place: {
        es: "Servicio de mediación, arbitraje y conciliación · València",
        en: "Mediation, arbitration and conciliation service · València",
      },
      note: {
        es: "Lleva el DNI. Quedamos con Álvaro quince minutos antes en la entrada del edificio.",
        en: "Bring your ID card. We will meet Álvaro fifteen minutes early at the building entrance.",
      },
    },
  ],
  expiries: [],
};

/*
 * Defectos constructivos. Sin borrador: lo que lo mantiene en ámbar es un
 * documento recibido a la espera de revisión y un mensaje del cliente que
 * todavía está dentro del plazo de respuesta.
 */
const caseCivil: Case = {
  id: "c-civ",
  clientId: "cli-2",
  ref: "CIV-2026-0143",
  area: "civil",
  title: {
    es: "Reclamación por defectos constructivos en la vivienda",
    en: "Claim for construction defects in the home",
  },
  shortTitle: { es: "Defectos constructivos", en: "Construction defects" },
  phases: [
    { label: { es: "Consulta y encargo", en: "Consultation and engagement" } },
    { label: { es: "Informe pericial", en: "Expert report" } },
    {
      label: {
        es: "Reclamación extrajudicial",
        en: "Out-of-court claim",
      },
    },
    { label: { es: "Demanda", en: "Claim filed" } },
    { label: { es: "Juicio", en: "Hearing" } },
  ],
  currentPhase: 2,
  openedOn: "2026-06-09",
  lastUpdate: "2026-09-16",
  statusLine: {
    es: "Visita del perito con la aseguradora el 2 de octubre.",
    en: "Surveyor's visit with the insurer on 2 October.",
  },
  whatIsHappening: {
    es: "El arquitecto técnico que contratamos ha emitido su informe: las humedades del dormitorio proceden de una filtración por la fachada, no de la ventilación de la vivienda. Con ese informe hemos reclamado por escrito a la promotora y a su compañía de seguros, y la aseguradora ha aceptado enviar a su propio perito para verlo sobre el terreno.",
    en: "The building surveyor we engaged has issued his report: the damp in the bedroom comes from water seeping through the façade, not from the way the home is ventilated. With that report we have made a written claim to the developer and its insurance company, and the insurer has agreed to send its own loss adjuster to inspect the property.",
  },
  whatComesNext: {
    es: "El 2 de octubre los dos peritos visitan la vivienda juntos. Si de esa visita sale una propuesta de reparación por escrito, te la trasladaremos con nuestro criterio para que decidas; si no hay respuesta, prepararemos la demanda. Del cómputo del plazo para reclamar nos ocupamos nosotros y lo tenemos anotado en el expediente.",
    en: "On 2 October both experts will visit the property together. If a written repair proposal comes out of that visit, we will pass it on with our view so you can decide; if there is no response, we will prepare the court claim. Keeping track of the time limit for claiming is our job and we have it noted in the file.",
  },
  lawyerId: "l3",
  actions: [
    {
      id: "a-civ-1",
      date: "2026-06-09",
      kind: "despacho",
      phaseIndex: 0,
      published: true,
      title: {
        es: "Abrimos tu expediente y estudiamos la garantía aplicable",
        en: "We opened your file and studied the applicable guarantee",
      },
      formalName: {
        es: "Apertura de expediente y calificación de los daños conforme a la Ley de Ordenación de la Edificación",
        en: "File opening and classification of the damage under the Building Act",
      },
      detail: {
        es: "La vivienda se entregó en 2024. Las humedades por filtración afectan a la habitabilidad, y el artículo 17 de la Ley 38/1999 de Ordenación de la Edificación cubre ese tipo de daños durante tres años desde la recepción de la obra, respondiendo tanto la promotora como los agentes que intervinieron en la construcción.",
        en: "The home was handed over in 2024. Damp caused by water seepage affects habitability, and article 17 of Building Act 38/1999 covers that kind of damage for three years from completion, with both the developer and the parties involved in the construction being liable.",
      },
    },
    {
      id: "a-civ-2",
      date: "2026-08-20",
      kind: "despacho",
      phaseIndex: 1,
      published: true,
      title: {
        es: "Recibimos el informe del arquitecto técnico",
        en: "We received the building surveyor's report",
      },
      formalName: {
        es: "Dictamen pericial sobre el origen de las humedades",
        en: "Expert report on the origin of the damp",
      },
      detail: {
        es: "El perito inspeccionó la vivienda con cámara termográfica y medidor de humedad. Concluye que el agua entra por una junta mal sellada del cerramiento de fachada y cifra la reparación en 9.400 €, incluida la restitución del acabado interior.",
        en: "The surveyor inspected the property with a thermal camera and a moisture meter. He concludes that water enters through a poorly sealed joint in the façade cladding and puts the repair cost at 9,400 €, including restoring the internal finish.",
      },
      attachment: {
        name: {
          es: "Informe pericial arquitecto técnico.pdf",
          en: "Building surveyor's expert report.pdf",
        },
        meta: "PDF · 4,1 MB",
      },
    },
    {
      id: "a-civ-3",
      date: "2026-09-16",
      /*
       * Burofax a promotora y aseguradora: reclamación extrajudicial entre
       * particulares, sin intervención de juzgado ni Administración.
       */
      kind: "despacho",
      phaseIndex: 2,
      published: true,
      title: {
        es: "Reclamamos por escrito a la promotora y a su aseguradora",
        en: "We claimed in writing from the developer and its insurer",
      },
      formalName: {
        es: "Reclamación extrajudicial mediante burofax con acuse de recibo y certificación de contenido",
        en: "Out-of-court claim by recorded-delivery letter with certified content",
      },
      detail: {
        es: "Remitimos el informe pericial junto con la reclamación de reparación a la promotora y, en paralelo, a la compañía que asegura la obra. La aseguradora ha contestado proponiendo una visita conjunta de peritos, que hemos aceptado y que queda fijada para el 2 de octubre.",
        en: "We sent the expert report together with the repair claim to the developer and, in parallel, to the company insuring the works. The insurer has replied proposing a joint inspection by both experts, which we have accepted and which is set for 2 October.",
      },
      attachment: {
        name: {
          es: "Reclamación a promotora y aseguradora.pdf",
          en: "Claim to developer and insurer.pdf",
        },
        meta: "PDF · 320 KB",
      },
    },
  ],
  firmDocs: [
    {
      id: "fd-civ-1",
      date: "2026-06-09",
      name: { es: "Hoja de encargo profesional", en: "Engagement letter" },
      kind: { es: "Encargo", en: "Engagement" },
      meta: "PDF · 160 KB",
    },
    {
      id: "fd-civ-2",
      date: "2026-08-20",
      name: {
        es: "Informe pericial del arquitecto técnico",
        en: "Building surveyor's expert report",
      },
      kind: { es: "Pericial", en: "Expert report" },
      meta: "PDF · 4,1 MB",
    },
    {
      id: "fd-civ-3",
      date: "2026-09-16",
      name: {
        es: "Reclamación a promotora y aseguradora",
        en: "Claim to developer and insurer",
      },
      kind: { es: "Comunicación", en: "Communication" },
      meta: "PDF · 320 KB",
    },
  ],
  docRequests: [
    {
      id: "dr-civ-1",
      name: {
        es: "Fotografías y vídeos de la evolución de las humedades",
        en: "Photos and videos showing how the damp has progressed",
      },
      help: {
        es: "Lo que tengas desde que aparecieron, aunque sea del móvil. Si las fotos conservan la fecha original, mejor: ayuda a situar cuándo empezó el daño.",
        en: "Whatever you have from when they first appeared, phone pictures are fine. If the photos keep their original date, so much the better: it helps establish when the damage started.",
      },
      status: "recibido",
      requestedOn: "2026-09-16",
      submittedOn: "2026-09-21",
    },
    {
      id: "dr-civ-2",
      name: {
        es: "Escritura de compraventa y acta de entrega de la vivienda",
        en: "Purchase deed and handover record for the property",
      },
      help: {
        es: "El acta de entrega fija la fecha desde la que corren las garantías de la ley. Suele ir con la documentación que te dio la promotora al recoger las llaves.",
        en: "The handover record sets the date from which the statutory guarantees run. It usually comes with the paperwork the developer gave you when you collected the keys.",
      },
      status: "validado",
      requestedOn: "2026-06-10",
      submittedOn: "2026-06-12",
    },
    {
      id: "dr-civ-3",
      name: {
        es: "Comunicaciones que hayas tenido con la promotora",
        en: "Any correspondence you have had with the developer",
      },
      help: {
        es: "Correos, mensajes o partes de incidencia del servicio posventa. Nos interesa especialmente cualquiera en el que reconozcan el problema.",
        en: "Emails, messages or after-sales incident reports. We are particularly interested in any in which they acknowledge the problem.",
      },
      status: "pendiente",
      requestedOn: "2026-09-16",
    },
  ],
  uploadedDocs: [
    {
      id: "ud-civ-1",
      name: {
        es: "Escritura y acta de entrega.pdf",
        en: "Deed and handover record.pdf",
      },
      uploadedOn: "2026-06-12",
      meta: "PDF · 2,2 MB",
      fulfillsRequestId: "dr-civ-2",
    },
    {
      id: "ud-civ-2",
      name: {
        es: "Fotos humedades dormitorio.zip",
        en: "Bedroom damp photos.zip",
      },
      uploadedOn: "2026-09-21",
      meta: "ZIP · 38 MB",
      fulfillsRequestId: "dr-civ-1",
    },
  ],
  keyDates: [
    {
      id: "kd-civ-1",
      kind: "reunion",
      date: "2026-10-02T09:30:00",
      title: {
        es: "Visita conjunta del arquitecto técnico y el perito de la aseguradora",
        en: "Joint visit by the building surveyor and the insurer's loss adjuster",
      },
      place: {
        es: "En tu vivienda",
        en: "At your home",
      },
      note: {
        es: "Conviene que estés presente. No firmes ningún documento durante la visita sin consultarnos: Ignacio estará localizable por teléfono.",
        en: "It is best if you are there. Do not sign anything during the visit without checking with us: Ignacio will be reachable by phone.",
      },
    },
  ],
  expiries: [],
};

/*
 * Penal. Aquí vive la factura vencida del escenario (inv-5), que es lo que
 * encabeza el panel de pendientes de la pantalla de Hoy.
 */
const casePenal: Case = {
  id: "c-pen",
  clientId: "cli-2",
  ref: "PEN-2026-0198",
  area: "penal",
  title: {
    es: "Procedimiento por delito contra la seguridad vial",
    en: "Proceedings for a road safety offence",
  },
  shortTitle: { es: "Seguridad vial", en: "Road safety" },
  phases: [
    { label: { es: "Consulta y encargo", en: "Consultation and engagement" } },
    { label: { es: "Instrucción", en: "Investigation" } },
    { label: { es: "Preparación del juicio", en: "Trial preparation" } },
    { label: { es: "Juicio oral", en: "Trial" } },
    { label: { es: "Sentencia", en: "Judgment" } },
  ],
  currentPhase: 2,
  openedOn: "2026-04-27",
  lastUpdate: "2026-09-14",
  statusLine: {
    es: "Juicio señalado para el 20 de octubre en el Juzgado de lo Penal.",
    en: "Trial listed for 20 October at the Criminal Court.",
  },
  whatIsHappening: {
    es: "El juzgado ha señalado el juicio oral para el 20 de octubre. Ya hemos presentado nuestro escrito de defensa y propuesto la prueba que queremos que se practique, incluida la declaración del agente que realizó las pruebas de alcoholemia y la documentación de calibración del etilómetro.",
    en: "The court has listed the trial for 20 October. We have already filed our defence statement and proposed the evidence we want to be heard, including the testimony of the officer who carried out the breath tests and the calibration records of the breathalyser.",
  },
  whatComesNext: {
    es: "Antes del juicio nos reunimos contigo el 13 de octubre para repasar cómo se desarrolla la vista, qué se te va a preguntar y qué opciones hay sobre la mesa. El día del juicio hay que comparecer personalmente: Ignacio estará contigo en la sala.",
    en: "Before the trial we will meet you on 13 October to go over how the hearing works, what you will be asked and what options are on the table. You must attend the trial in person: Ignacio will be with you in the courtroom.",
  },
  lawyerId: "l3",
  actions: [
    {
      id: "a-pen-1",
      date: "2026-04-27",
      kind: "despacho",
      phaseIndex: 0,
      published: true,
      title: {
        es: "Asumimos tu defensa",
        en: "We took on your defence",
      },
      formalName: {
        es: "Apertura de expediente y designación de letrado",
        en: "File opening and appointment of counsel",
      },
      detail: {
        es: "Registramos el encargo de defensa y nos personamos en las diligencias incoadas por el Juzgado de Instrucción. Te asignamos a Ignacio Peris como letrado responsable.",
        en: "We registered the defence engagement and entered an appearance in the proceedings opened by the Investigating Court. We assigned Ignacio Peris as your lead lawyer.",
      },
    },
    {
      id: "a-pen-2",
      date: "2026-06-18",
      kind: "procedimiento",
      phaseIndex: 1,
      published: true,
      title: {
        es: "Pedimos al juzgado la documentación del etilómetro",
        en: "We asked the court for the breathalyser records",
      },
      formalName: {
        es: "Escrito solicitando la incorporación de los certificados de verificación y calibración del etilómetro",
        en: "Application for the breathalyser's verification and calibration certificates to be added to the file",
      },
      detail: {
        es: "La acusación se apoya en una tasa de 0,68 miligramos de alcohol por litro de aire espirado, por encima del umbral de 0,60 que el artículo 379.2 del Código Penal fija como delito. Hemos pedido que se incorporen los certificados de verificación periódica del aparato y el registro de la segunda medición, porque la fiabilidad del resultado depende de que el aparato estuviera en regla.",
        en: "The prosecution relies on a reading of 0.68 milligrams of alcohol per litre of exhaled air, above the 0.60 threshold that article 379.2 of the Criminal Code sets as an offence. We have asked for the device's periodic verification certificates and the record of the second measurement to be added to the file, because the reliability of the result depends on the device being properly certified.",
      },
    },
    {
      id: "a-pen-3",
      date: "2026-09-14",
      kind: "procedimiento",
      phaseIndex: 2,
      published: true,
      title: {
        es: "Ya hay fecha de juicio",
        en: "The trial date is set",
      },
      formalName: {
        es: "Auto de señalamiento de juicio oral · Juzgado de lo Penal nº 6 de València",
        en: "Order listing the trial · Criminal Court no. 6 of València",
      },
      detail: {
        es: "El Juzgado de lo Penal nº 6 de València ha señalado la vista para el 20 de octubre a las 10:00 y ha admitido la prueba que propusimos, incluida la declaración del agente instructor del atestado.",
        en: "Criminal Court no. 6 of València has listed the hearing for 20 October at 10:00 and has admitted the evidence we proposed, including the testimony of the officer who drew up the police report.",
      },
      attachment: {
        name: {
          es: "Auto de señalamiento.pdf",
          en: "Listing order.pdf",
        },
        meta: "PDF · 150 KB",
      },
    },
    {
      id: "a-pen-4",
      date: "2026-09-21",
      kind: "despacho",
      phaseIndex: 2,
      published: false,
      title: {
        es: "Reunión de preparación antes del juicio",
        en: "Preparation meeting before the trial",
      },
      formalName: {
        es: "Convocatoria de reunión de preparación del juicio oral",
        en: "Notice of trial preparation meeting",
      },
      detail: {
        es: "Te citamos el 13 de octubre a las 17:00 en el despacho. Repasaremos el atestado y el escrito de defensa, veremos el orden en que se practica la prueba y qué se te puede preguntar. Ven con el DNI y con cualquier documento que quieras comentar. La reunión dura aproximadamente una hora.",
        en: "We are asking you to come in on 13 October at 17:00. We will go through the police report and the defence statement, look at the order in which evidence is heard and what you may be asked. Bring your ID card and any document you want to discuss. The meeting lasts about an hour.",
      },
    },
  ],
  firmDocs: [
    {
      id: "fd-pen-1",
      date: "2026-04-27",
      name: { es: "Hoja de encargo profesional", en: "Engagement letter" },
      kind: { es: "Encargo", en: "Engagement" },
      meta: "PDF · 160 KB",
    },
    {
      id: "fd-pen-2",
      date: "2026-08-03",
      name: { es: "Escrito de defensa", en: "Defence statement" },
      kind: { es: "Escrito", en: "Filing" },
      meta: "PDF · 340 KB",
    },
    {
      id: "fd-pen-3",
      date: "2026-09-14",
      name: { es: "Auto de señalamiento", en: "Listing order" },
      kind: { es: "Resolución judicial", en: "Court order" },
      meta: "PDF · 150 KB",
    },
  ],
  docRequests: [
    {
      id: "dr-pen-1",
      name: {
        es: "Permiso de conducir por las dos caras",
        en: "Driving licence, both sides",
      },
      help: {
        es: "Lo necesitamos para el escrito de defensa, donde hay que hacer constar la antigüedad del permiso y sus prórrogas.",
        en: "We need it for the defence statement, which has to record how long you have held the licence and its renewals.",
      },
      status: "validado",
      requestedOn: "2026-05-05",
      submittedOn: "2026-05-07",
    },
  ],
  uploadedDocs: [
    {
      id: "ud-pen-1",
      name: { es: "Permiso de conducir.pdf", en: "Driving licence.pdf" },
      uploadedOn: "2026-05-07",
      meta: "PDF · 620 KB",
      fulfillsRequestId: "dr-pen-1",
    },
  ],
  keyDates: [
    {
      id: "kd-pen-1",
      kind: "reunion",
      date: "2026-10-13T17:00:00",
      title: {
        es: "Reunión de preparación del juicio",
        en: "Trial preparation meeting",
      },
      place: {
        es: "En el despacho",
        en: "At our office",
      },
      note: {
        es: "Dura alrededor de una hora. Trae el DNI y cualquier documento que quieras comentar.",
        en: "It lasts about an hour. Bring your ID card and any document you want to discuss.",
      },
    },
    {
      id: "kd-pen-2",
      kind: "vista",
      date: "2026-10-20T10:00:00",
      title: { es: "Juicio oral", en: "Trial" },
      place: {
        es: "Juzgado de lo Penal nº 6 de València · Ciutat de la Justícia",
        en: "Criminal Court no. 6 of València · Ciutat de la Justícia",
      },
      note: {
        es: "La comparecencia es personal y obligatoria. Quedamos con Ignacio media hora antes en la entrada principal; conviene contar con el tiempo del control de acceso.",
        en: "Attendance in person is compulsory. We will meet Ignacio half an hour early at the main entrance; allow time for the security check.",
      },
    },
  ],
  expiries: [
    {
      id: "ex-pen-1",
      document: {
        es: "Permiso de conducir",
        en: "Driving licence",
      },
      expiresOn: "2027-02-28",
      advice: {
        es: "Es la caducidad administrativa del permiso, que se renueva en la Jefatura de Tráfico o en un centro de reconocimiento de conductores y no tiene relación con este procedimiento. Conviene pedir cita con un par de meses de antelación. Si lo renuevas, súbenos el nuevo documento para tener el expediente al día.",
        en: "This is the administrative expiry of the licence, renewed at the traffic authority or an approved medical centre, and it is unrelated to these proceedings. It is worth booking an appointment a couple of months in advance. If you renew it, upload the new document so we can keep your file up to date.",
      },
    },
  ],
};

export const CASES: Case[] = [
  caseInmobiliario,
  caseSucesiones,
  caseLaboral,
  caseCivil,
  casePenal,
];

/* ------------------------------------------------------------------ */
/* CLIENTES                                                            */
/* ------------------------------------------------------------------ */

export const CLIENTS: Client[] = [
  {
    id: "cli-1",
    email: "helen@demo.es",
    password: "demo1234",
    name: "Helen Whitmore Clarke",
    phone: "+34 600 50 10 01",
    address: {
      es: "C/ del Mar, 18, 46003 València",
      en: "C/ del Mar, 18, 46003 València",
    },
    idDocument: "NIE Y 4512 338-P",
    lastAccess: "2026-09-21T19:20:00",
    notifyByEmail: true,
    notifyBySms: true,
    demoBlurb: {
      es: "Dos asuntos abiertos: compraventa de vivienda y herencia. Tiene documentos pendientes y un documento rechazado, y consulta el portal en inglés.",
      en: "Two open matters: a home purchase and an estate. Has pending documents and one rejected document, and uses the portal in English.",
    },
    authorizedPeople: [
      {
        id: "ap-1",
        name: "Peter Whitmore Clarke",
        relationship: { es: "Hermano", en: "Brother" },
        scopes: ["lectura", "documentos"],
        addedOn: "2026-05-20",
        caseIds: ["c-suc"],
      },
      {
        id: "ap-2",
        name: "Assessors Túria S.L.",
        relationship: { es: "Asesoría fiscal", en: "Tax adviser" },
        scopes: ["economico"],
        addedOn: "2026-07-08",
        caseIds: ["c-inm", "c-suc"],
      },
    ],
    accessLog: [
      {
        id: "al-1-1",
        date: "2026-09-21T19:20:00",
        device: { es: "iPhone · Safari", en: "iPhone · Safari" },
        location: "València, ES",
        actor: "Helen Whitmore Clarke",
      },
      {
        id: "al-1-2",
        date: "2026-09-19T10:05:00",
        device: { es: "macOS · Safari", en: "macOS · Safari" },
        location: "València, ES",
        actor: "Helen Whitmore Clarke",
      },
      {
        id: "al-1-3",
        date: "2026-09-15T17:44:00",
        device: { es: "Windows · Edge", en: "Windows · Edge" },
        location: "Bristol, UK",
        actor: "Peter Whitmore Clarke",
        actorIsAuthorized: true,
      },
    ],
  },
  {
    id: "cli-2",
    email: "sergio@demo.es",
    password: "demo1234",
    name: "Sergio Almenar Ballester",
    phone: "+34 600 50 10 02",
    address: {
      es: "Avinguda del Port, 122, 46022 València",
      en: "Avinguda del Port, 122, 46022 València",
    },
    idDocument: "DNI 26 774 190-G",
    lastAccess: "2026-09-21T08:40:00",
    notifyByEmail: true,
    notifyBySms: false,
    demoBlurb: {
      es: "Dos asuntos: reclamación por defectos constructivos y un procedimiento penal con juicio señalado. Tiene fechas próximas y una factura vencida.",
      en: "Two matters: a construction defects claim and criminal proceedings with a trial date. Has upcoming dates and an overdue invoice.",
    },
    authorizedPeople: [
      {
        id: "ap-3",
        name: "Amparo Ballester Sanz",
        relationship: {
          es: "Madre · asume los honorarios",
          en: "Mother · pays the fees",
        },
        scopes: ["economico"],
        addedOn: "2026-04-28",
        caseIds: ["c-pen"],
      },
    ],
    accessLog: [
      {
        id: "al-2-1",
        date: "2026-09-21T08:40:00",
        device: { es: "Android · Chrome", en: "Android · Chrome" },
        location: "València, ES",
        actor: "Sergio Almenar Ballester",
      },
      {
        id: "al-2-2",
        date: "2026-09-16T21:12:00",
        device: { es: "Windows · Chrome", en: "Windows · Chrome" },
        location: "València, ES",
        actor: "Sergio Almenar Ballester",
      },
      {
        id: "al-2-3",
        date: "2026-09-10T12:30:00",
        device: { es: "iPad · Safari", en: "iPad · Safari" },
        location: "València, ES",
        actor: "Amparo Ballester Sanz",
        actorIsAuthorized: true,
      },
    ],
  },
  {
    id: "cli-3",
    email: "ruben@demo.es",
    password: "demo1234",
    name: "Rubén Escrivá Tormo",
    phone: "+34 600 50 10 03",
    address: {
      es: "C/ Sant Vicent Màrtir, 84, 46007 València",
      en: "C/ Sant Vicent Màrtir, 84, 46007 València",
    },
    idDocument: "DNI 53 118 042-M",
    lastAccess: "2026-09-18T14:02:00",
    notifyByEmail: true,
    notifyBySms: true,
    demoBlurb: {
      es: "Un único asunto (laboral): el portal le abre la ficha directamente, sin pasar por el listado.",
      en: "A single matter (employment): the portal opens the file directly, skipping the list.",
    },
    authorizedPeople: [],
    accessLog: [
      {
        id: "al-3-1",
        date: "2026-09-18T14:02:00",
        device: { es: "Android · Chrome", en: "Android · Chrome" },
        location: "València, ES",
        actor: "Rubén Escrivá Tormo",
      },
      {
        id: "al-3-2",
        date: "2026-09-17T09:26:00",
        device: { es: "Android · Chrome", en: "Android · Chrome" },
        location: "València, ES",
        actor: "Rubén Escrivá Tormo",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* MENSAJERÍA                                                          */
/* ------------------------------------------------------------------ */

/*
 * El último mensaje de cada expediente es lo que decide si la vista despacho
 * lo cuenta como conversación abierta, y si lleva más días que los prometidos
 * en `FIRM_SETTINGS.responseDays` pasa a rojo. Aquí el de c-lab está fuera de
 * plazo y el de c-civ todavía dentro: ese contraste es lo que hace legible la
 * diferencia entre «atrasado» y «pendiente».
 */
export const MESSAGES: Message[] = [
  {
    id: "m-1",
    caseId: "c-inm",
    from: "despacho",
    authorName: "Marta Ferrandis Gil",
    date: "2026-09-12T11:30:00",
    read: true,
    body: {
      es: "Buenos días, Helen. Ya tenemos el borrador de escritura de la notaría y lo estamos revisando. En cuanto confirmen día y hora te lo digo por aquí.",
      en: "Good morning, Helen. We now have the draft deed from the notary and we are reviewing it. As soon as they confirm a date and time I will let you know here.",
    },
  },
  {
    id: "m-2",
    caseId: "c-inm",
    from: "cliente",
    authorName: "Helen Whitmore Clarke",
    date: "2026-09-14T18:05:00",
    read: true,
    body: {
      es: "Gracias, Marta. ¿El dinero lo llevo en cheque bancario o hago transferencia? Mi banco me dice que el cheque tarda dos días en emitirse.",
      en: "Thanks, Marta. Should I bring a banker's draft or make a transfer? My bank tells me the draft takes two days to issue.",
    },
  },
  {
    id: "m-3",
    caseId: "c-inm",
    from: "despacho",
    authorName: "Marta Ferrandis Gil",
    date: "2026-09-18T13:15:00",
    read: false,
    body: {
      es: "Ya está confirmada la firma: 8 de octubre a las 11:30. Con el cheque bancario todo va más rodado en la notaría, así que pídelo con una semana de margen. Te he dejado la petición del justificante en el apartado de documentos del expediente.",
      en: "The signing is confirmed: 8 October at 11:30. A banker's draft makes everything smoother at the notary's, so order it a week in advance. I have left the request for the receipt in the documents section of your file.",
    },
  },
  {
    id: "m-4",
    caseId: "c-suc",
    from: "cliente",
    authorName: "Helen Whitmore Clarke",
    date: "2026-09-15T12:40:00",
    read: true,
    body: {
      es: "Os he subido lo que he encontrado del piso de mi madre. Creo que es lo que me pedíais, pero no estoy segura.",
      en: "I have uploaded what I found about my mother's flat. I think it is what you asked for, but I am not sure.",
    },
    attachment: {
      name: { es: "Nota simple Alboraia.pdf", en: "Alboraia registry extract.pdf" },
      meta: "PDF · 180 KB",
    },
  },
  {
    id: "m-5",
    caseId: "c-suc",
    from: "despacho",
    authorName: "Marta Ferrandis Gil",
    date: "2026-09-19T09:50:00",
    read: false,
    body: {
      es: "Gracias, Helen. Ese documento acredita que el piso estaba a nombre de tu madre, pero no dice por cuánto lo compró, que es el dato que nos hace falta. Te lo he marcado como rechazado en el expediente con la explicación. Si no aparece la escritura por casa, dímelo y pedimos copia a la notaría.",
      en: "Thank you, Helen. That document proves the flat was in your mother's name, but it does not say what she paid for it, which is the figure we need. I have marked it as rejected in the file with an explanation. If the deed does not turn up at home, tell me and we will request a copy from the notary.",
    },
  },
  {
    id: "m-6",
    caseId: "c-lab",
    from: "despacho",
    authorName: "Álvaro Benlloch Esteve",
    date: "2026-09-11T17:20:00",
    read: true,
    body: {
      es: "Rubén, ya está presentada la papeleta de conciliación. Nos han dado fecha: 6 de octubre a las 10:00. Te he pedido en el expediente el certificado del SEPE con lo que estás cobrando de paro.",
      en: "Rubén, the conciliation request has been filed. We have a date: 6 October at 10:00. I have requested in your file the SEPE certificate showing what you are receiving in unemployment benefit.",
    },
  },
  {
    id: "m-7",
    caseId: "c-lab",
    from: "cliente",
    authorName: "Rubén Escrivá Tormo",
    date: "2026-09-17T08:55:00",
    read: true,
    body: {
      es: "Álvaro, una duda: ese día tengo una entrevista de trabajo por la tarde. ¿Cuánto suele durar la conciliación? ¿Y si la empresa no aparece, qué pasa?",
      en: "Álvaro, one question: I have a job interview that afternoon. How long does conciliation usually take? And what happens if the company does not turn up?",
    },
  },
  {
    id: "m-8",
    caseId: "c-civ",
    from: "despacho",
    authorName: "Ignacio Peris Almela",
    date: "2026-09-16T16:10:00",
    read: true,
    body: {
      es: "Sergio, la aseguradora ha contestado y propone que su perito y el nuestro vean la vivienda juntos. He aceptado y queda para el 2 de octubre a las 9:30. Te he pedido en el expediente las fotos de cómo han ido evolucionando las humedades.",
      en: "Sergio, the insurer has replied and proposes that their loss adjuster and ours inspect the property together. I have accepted and it is set for 2 October at 9:30. I have requested in your file the photos showing how the damp has developed.",
    },
  },
  {
    id: "m-9",
    caseId: "c-civ",
    from: "cliente",
    authorName: "Sergio Almenar Ballester",
    date: "2026-09-21T20:35:00",
    read: true,
    body: {
      es: "Subidas las fotos, están ordenadas por fecha. Ese día trabajo por la mañana, ¿es imprescindible que esté yo o puede abrir mi madre?",
      en: "Photos uploaded, sorted by date. I am at work that morning — do I have to be there myself, or can my mother let them in?",
    },
    attachment: {
      name: {
        es: "Fotos humedades dormitorio.zip",
        en: "Bedroom damp photos.zip",
      },
      meta: "ZIP · 38 MB",
    },
  },
  {
    id: "m-10",
    caseId: "c-pen",
    from: "cliente",
    authorName: "Sergio Almenar Ballester",
    date: "2026-09-12T10:00:00",
    read: true,
    body: {
      es: "Ignacio, ¿se sabe ya algo de la fecha del juicio? Necesito avisar en el trabajo con antelación.",
      en: "Ignacio, is there any news on the trial date? I need to give notice at work in advance.",
    },
  },
  {
    id: "m-11",
    caseId: "c-pen",
    from: "despacho",
    authorName: "Ignacio Peris Almela",
    date: "2026-09-14T12:25:00",
    read: true,
    body: {
      es: "Ya hay señalamiento: 20 de octubre a las 10:00, Juzgado de lo Penal nº 6. Reserva la mañana entera, porque los señalamientos se acumulan y la espera puede ser larga. Nos vemos antes, el 13, para prepararlo con calma.",
      en: "The date is set: 20 October at 10:00, Criminal Court no. 6. Keep the whole morning free, as hearings are listed back to back and the wait can be long. We will meet beforehand, on the 13th, to prepare properly.",
    },
  },
];

/* ------------------------------------------------------------------ */
/* ÁREA ECONÓMICA                                                      */
/* ------------------------------------------------------------------ */

/*
 * Los honorarios van con IVA incluido (arts. 20 y 60 del RDL 1/2007), así que
 * todos los importes de `ENGAGEMENTS` e `INVOICES` son la base por 1,21. Los
 * impuestos del asunto y el dinero de terceros no se mezclan aquí: viven en
 * `PROVISIONS`, cada una con su `payee`.
 */

export const ENGAGEMENTS: Engagement[] = [
  {
    id: "eng-1",
    caseId: "c-inm",
    acceptedOn: "2026-06-30",
    scope: {
      es: "Asesoramiento integral en la compraventa: comprobaciones registrales y urbanísticas, redacción del contrato de arras, revisión de la escritura y asistencia a notaría.",
      en: "Full advisory on the purchase: registry and planning checks, drafting of the deposit agreement, review of the deed and attendance at the notary.",
    },
    amount: 2904,
    terms: {
      es: "Honorarios fijos, IVA incluido, en dos fases iguales: encargo y firma. No incluye el impuesto de transmisiones patrimoniales ni los aranceles de notaría y registro, que se piden aparte como provisión de fondos.",
      en: "Fixed fee, VAT included, in two equal stages: engagement and signing. It does not include transfer tax or notary and registry fees, which are requested separately as payments on account.",
    },
  },
  {
    id: "eng-2",
    caseId: "c-suc",
    acceptedOn: "2026-05-18",
    scope: {
      es: "Tramitación completa de la herencia: obtención de certificados, escritura de aceptación y adjudicación, liquidación de impuestos e inscripción registral.",
      en: "Complete handling of the estate: obtaining certificates, deed of acceptance and allocation, tax filings and Land Registry entry.",
    },
    amount: 3025,
    terms: {
      es: "Honorarios fijos, IVA incluido. No incluyen el impuesto de sucesiones, la plusvalía municipal ni los aranceles notariales y registrales, que se piden aparte como provisión de fondos.",
      en: "Fixed fee, VAT included. It does not include inheritance tax, municipal capital gains tax or notary and registry fees, which are requested separately as payments on account.",
    },
  },
  {
    id: "eng-3",
    caseId: "c-lab",
    acceptedOn: "2026-07-06",
    scope: {
      es: "Impugnación del despido: conciliación previa y, en su caso, demanda y juicio ante el juzgado de lo social.",
      en: "Challenge to the dismissal: pre-court conciliation and, where applicable, claim and hearing before the employment court.",
    },
    amount: 2420,
    terms: {
      es: "Honorarios por fases, IVA incluido: fase previa a la aceptación del encargo y fase judicial al presentar la demanda.",
      en: "Fees by stage, VAT included: pre-court stage on accepting the engagement and court stage on filing the claim.",
    },
  },
  {
    id: "eng-4",
    caseId: "c-civ",
    acceptedOn: "2026-06-09",
    scope: {
      es: "Reclamación por defectos constructivos: dirección letrada de la reclamación extrajudicial frente a promotora y aseguradora y, si no prospera, demanda ante el juzgado de primera instancia.",
      en: "Construction defects claim: legal conduct of the out-of-court claim against the developer and its insurer and, if unsuccessful, a claim before the court of first instance.",
    },
    amount: 2178,
    terms: {
      es: "Honorarios fijos para la fase extrajudicial, IVA incluido. La fase judicial se presupuesta aparte en función de la cuantía reclamada. Los honorarios del perito se piden como provisión de fondos.",
      en: "Fixed fee for the out-of-court stage, VAT included. The court stage is quoted separately depending on the amount claimed. The expert's fees are requested as a payment on account.",
    },
  },
  {
    id: "eng-5",
    caseId: "c-pen",
    acceptedOn: "2026-04-27",
    scope: {
      es: "Defensa penal en procedimiento abreviado hasta sentencia en primera instancia, incluida la asistencia al juicio oral.",
      en: "Criminal defence in summary proceedings up to first-instance judgment, including attendance at trial.",
    },
    amount: 3872,
    terms: {
      es: "Honorarios por fases, IVA incluido: instrucción, preparación del juicio y juicio oral. Un eventual recurso de apelación se presupuesta aparte.",
      en: "Fees by stage, VAT included: investigation, trial preparation and trial. Any appeal is quoted separately.",
    },
  },
];

export const INVOICES: Invoice[] = [
  {
    id: "inv-1",
    number: "2026/0318",
    date: "2026-05-04",
    concept: {
      es: "Fase de instrucción · defensa penal",
      en: "Investigation stage · criminal defence",
    },
    caseId: "c-pen",
    amount: 1936,
    status: "pagada",
  },
  {
    id: "inv-2",
    number: "2026/0402",
    date: "2026-05-22",
    concept: {
      es: "Primera fase · tramitación de herencia",
      en: "First stage · probate",
    },
    caseId: "c-suc",
    amount: 1210,
    status: "pagada",
  },
  {
    id: "inv-3",
    number: "2026/0466",
    date: "2026-06-15",
    concept: {
      es: "Fase extrajudicial · defectos constructivos",
      en: "Out-of-court stage · construction defects",
    },
    caseId: "c-civ",
    amount: 968,
    status: "pagada",
  },
  {
    id: "inv-4",
    number: "2026/0521",
    date: "2026-07-02",
    concept: {
      es: "Primera fase · compraventa de vivienda",
      en: "First stage · home purchase",
    },
    caseId: "c-inm",
    amount: 1452,
    status: "pagada",
  },
  {
    id: "inv-5",
    number: "2026/0637",
    /*
     * Vencida a propósito. El escenario necesita un impagado real: es lo que
     * encabeza el panel de pendientes de la pantalla de Hoy y lo que obliga al
     * área económica del cliente a decirlo con sus palabras en vez de anunciar
     * un vencimiento que ya pasó.
     */
    date: "2026-08-10",
    concept: {
      es: "Fase de preparación del juicio · defensa penal",
      en: "Trial preparation stage · criminal defence",
    },
    caseId: "c-pen",
    amount: 1331,
    status: "pendiente",
    dueDate: "2026-09-09",
  },
  {
    id: "inv-6",
    number: "2026/0558",
    date: "2026-07-08",
    concept: {
      es: "Fase previa · impugnación de despido",
      en: "Pre-court stage · dismissal claim",
    },
    caseId: "c-lab",
    amount: 1210,
    status: "pagada",
  },
  {
    id: "inv-7",
    number: "2026/0724",
    date: "2026-09-16",
    concept: {
      es: "Segunda fase · compraventa de vivienda",
      en: "Second stage · home purchase",
    },
    caseId: "c-inm",
    amount: 1452,
    status: "pendiente",
    dueDate: "2026-10-06",
  },
];

export const PROVISIONS: FundProvision[] = [
  {
    id: "pv-1",
    caseId: "c-inm",
    concept: {
      es: "Nota simple registral y certificado de la comunidad de propietarios",
      en: "Land Registry extract and residents' association certificate",
    },
    payee: {
      es: "Registro de la Propiedad y administrador de fincas",
      en: "Land Registry and building manager",
    },
    amount: 140,
    requestedOn: "2026-07-13",
    status: "pagada",
    paidOn: "2026-07-15",
  },
  {
    id: "pv-2",
    caseId: "c-inm",
    concept: {
      es: "Provisión para aranceles de notaría y Registro de la Propiedad",
      en: "Provision for notary and Land Registry fees",
    },
    payee: {
      es: "Notaría y Registro de la Propiedad",
      en: "Notary and Land Registry",
    },
    amount: 1400,
    requestedOn: "2026-09-18",
    status: "pendiente",
    dueDate: "2026-10-15",
  },
  {
    id: "pv-3",
    caseId: "c-inm",
    concept: {
      es: "Impuesto de transmisiones patrimoniales (10 %) · modelo 600",
      en: "Property transfer tax (10%) · form 600",
    },
    payee: {
      es: "Agència Tributària Valenciana",
      en: "Valencian tax authority",
    },
    amount: 24500,
    requestedOn: "2026-09-18",
    status: "pendiente",
    dueDate: "2026-11-10",
  },
  {
    id: "pv-4",
    caseId: "c-suc",
    concept: {
      es: "Impuesto sobre sucesiones · modelo 650",
      en: "Inheritance tax · form 650",
    },
    payee: {
      es: "Agència Tributària Valenciana",
      en: "Valencian tax authority",
    },
    amount: 1180,
    requestedOn: "2026-08-18",
    status: "pagada",
    paidOn: "2026-08-24",
  },
  {
    id: "pv-5",
    caseId: "c-suc",
    concept: {
      es: "Plusvalía municipal (IIVTNU) de la vivienda heredada",
      en: "Municipal capital gains tax (IIVTNU) on the inherited home",
    },
    payee: {
      es: "Ajuntament de València",
      en: "València City Council",
    },
    amount: 860,
    requestedOn: "2026-09-08",
    status: "pendiente",
    dueDate: "2026-10-20",
  },
  {
    id: "pv-6",
    caseId: "c-suc",
    concept: {
      es: "Aranceles de notaría por la escritura de aceptación de herencia",
      en: "Notary fees for the deed of acceptance of the estate",
    },
    payee: { es: "Notaría", en: "Notary's office" },
    amount: 780,
    requestedOn: "2026-07-02",
    status: "pagada",
    paidOn: "2026-07-10",
  },
  {
    id: "pv-7",
    caseId: "c-civ",
    concept: {
      es: "Honorarios del arquitecto técnico que emitió el informe pericial",
      en: "Fees of the building surveyor who issued the expert report",
    },
    payee: {
      es: "Arquitecto técnico independiente",
      en: "Independent building surveyor",
    },
    amount: 1100,
    requestedOn: "2026-07-01",
    status: "pagada",
    paidOn: "2026-07-06",
  },
  {
    id: "pv-8",
    caseId: "c-lab",
    concept: {
      es: "Burofax con acuse de recibo y certificación de contenido",
      en: "Recorded-delivery letter with certified content",
    },
    payee: { es: "Correos", en: "Postal service" },
    amount: 42,
    requestedOn: "2026-07-20",
    status: "pagada",
    paidOn: "2026-07-21",
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

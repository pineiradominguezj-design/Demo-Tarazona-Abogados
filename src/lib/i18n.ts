/**
 * Diccionarios de interfaz.
 *
 * El castellano es la fuente de verdad: `TKey` se deriva de él, así que si se
 * añade una clave en `es` TypeScript obliga a traducirla en `en`.
 * El contenido de los expedientes no vive aquí, sino en los propios datos.
 */

import type { Locale } from "./types";

const es = {
  /* --- Común --- */
  /*
   * El nombre del despacho NO es una cadena de interfaz: es el mismo en los dos
   * idiomas y sale de `src/config/identity.ts`. Si vuelve a aparecer aquí, hay
   * que traducirlo dos veces para nada.
   */
  "common.portal": "Portal del cliente",
  "common.language": "Idioma",
  "common.back": "Volver",
  "common.close": "Cerrar",
  "common.cancel": "Cancelar",
  "common.continue": "Continuar",
  "common.yes": "Sí",
  "common.no": "No",
  "common.download": "Descargar",
  "common.of": "de",
  "common.loading": "Cargando…",

  /* --- Acceso --- */
  "login.title": "Acceso para clientes",
  "login.subtitle":
    "Consulta el estado de tus asuntos, tus documentos y tus comunicaciones con el despacho.",
  "login.email": "Correo electrónico",
  "login.password": "Contraseña",
  "login.submit": "Entrar",
  "login.forgot": "He olvidado mi contraseña",
  "login.error": "El correo o la contraseña no son correctos.",
  "login.demoTitle": "Perfiles de demostración",
  "login.demoHint": "Pulsa sobre un perfil para rellenar el formulario.",
  "login.securityNote":
    "Conexión cifrada. El acceso queda registrado con fecha, hora y dispositivo.",

  /* --- Doble verificación --- */
  "twofa.title": "Verificación en dos pasos",
  "twofa.intro":
    "Para proteger tu información, necesitamos confirmar que eres tú. Elige cómo quieres recibir el código de seis dígitos.",
  "twofa.bySms": "Por SMS",
  "twofa.byEmail": "Por correo electrónico",
  "twofa.sentBySms": "Hemos enviado un código al teléfono acabado en",
  "twofa.sentByEmail": "Hemos enviado un código al correo",
  "twofa.code": "Código de verificación",
  "twofa.verify": "Verificar",
  "twofa.resend": "Reenviar el código",
  "twofa.resent": "Código reenviado.",
  "twofa.changeMethod": "Elegir otro método",
  "twofa.demoNote":
    "En esta demostración no se envía ningún código: introduce seis dígitos cualesquiera o pulsa directamente en Verificar.",
  "twofa.invalid": "El código debe tener seis dígitos.",

  /* --- Recuperar contraseña --- */
  "recover.title": "Recuperar contraseña",
  "recover.intro":
    "Escribe el correo electrónico con el que accedes al portal y te enviaremos un enlace para crear una contraseña nueva.",
  "recover.submit": "Enviar enlace",
  "recover.sentTitle": "Revisa tu correo",
  "recover.sentBody":
    "Si ese correo corresponde a un cliente del despacho, recibirás un enlace en unos minutos. El enlace caduca en una hora.",
  "recover.backToLogin": "Volver al acceso",
  "recover.demoNote":
    "En esta demostración no se envía ningún correo real.",

  /* --- Navegación --- */
  "nav.cases": "Mis asuntos",
  "nav.messages": "Mensajes",
  "nav.billing": "Área económica",
  "nav.profile": "Mi perfil",
  "nav.firmView": "Vista despacho",
  "nav.logout": "Salir",
  "nav.lastAccess": "Último acceso",
  "nav.menu": "Menú",

  /* --- Mis asuntos --- */
  "cases.title": "Mis asuntos",
  "cases.intro": "Estado actual de los expedientes que llevamos para ti.",
  "cases.noticesTitle": "Avisos",
  "cases.noticesEmpty": "No tienes avisos pendientes.",
  "cases.noticeDocs": "Nos faltan documentos tuyos",
  "cases.noticeDocsOne": "Necesitamos 1 documento",
  "cases.noticeDocsMany": "Necesitamos {n} documentos",
  "cases.noticeMessages": "Tienes mensajes nuevos del despacho",
  "cases.noticeMessagesOne": "1 mensaje nuevo",
  "cases.noticeMessagesMany": "{n} mensajes nuevos",
  "cases.noticeDates": "Próximas fechas",
  "cases.noticeExpiry": "Documento próximo a caducar",
  "cases.currentPhase": "Fase actual",
  "cases.lastUpdate": "Última actualización",
  "cases.nothingPending": "No necesitamos nada de ti",
  "cases.openFile": "Ver expediente",
  "cases.ref": "Referencia",
  "cases.updated": "Actualizado",
  "cases.pendingBadge": "{n} pendiente",
  "cases.pendingBadgeMany": "{n} pendientes",
  "cases.uploadCta": "Subir documentos",
  "cases.seeDates": "Ver fechas",
  "cases.seeMessages": "Ver mensajes",
  "cases.renewCta": "Ver caducidad",
  "cases.allClear": "Sin avisos pendientes",

  /* --- Tiempos relativos --- */
  "time.today": "hoy",
  "time.yesterday": "ayer",
  "time.tomorrow": "mañana",
  "time.daysAgo": "hace {n} días",
  "time.weekAgo": "hace 1 semana",
  "time.weeksAgo": "hace {n} semanas",
  "time.monthAgo": "hace 1 mes",
  "time.monthsAgo": "hace {n} meses",
  "time.inDays": "en {n} días",
  "time.inWeek": "en 1 semana",
  "time.inWeeks": "en {n} semanas",
  "time.inMonth": "en 1 mes",
  "time.inMonths": "en {n} meses",

  /* --- Ficha del expediente --- */
  "case.backToCases": "Volver a mis asuntos",
  "case.summary": "Resumen",
  "case.phaseProgress": "Fase {n} de {total}",
  "case.whatIsHappening": "Qué está pasando",
  "case.whatComesNext": "Qué viene ahora",
  "case.estimateLabel": "Plazo orientativo de la Administración",
  "case.estimateDisclaimer":
    "Es una estimación orientativa basada en la práctica habitual del organismo. No es un compromiso del despacho ni un plazo garantizado.",
  "case.needFromYou": "¿Necesitamos algo de ti?",
  "case.needNothing": "No, ahora mismo no necesitamos nada de ti.",
  "case.needSomething": "Sí. Nos faltan {n} documentos.",
  "case.needSomethingOne": "Sí. Nos falta 1 documento.",
  "case.goToPending": "Ver qué nos falta",
  "case.contactPerson": "Tu persona de contacto",
  "case.openedOn": "Expediente abierto el",

  /* Pestañas de la ficha. Más cortas que el título de cada sección: tienen que
     caber las tres en una línea en móvil. */
  "case.sectionsNav": "Secciones del expediente",
  "case.tabHistory": "Historial",
  "case.tabDocuments": "Documentos",
  "case.tabDates": "Fechas",

  "case.historyTitle": "Historial de actuaciones",
  "case.historyIntro":
    "Actuaciones que el despacho ha publicado en tu expediente, de la más reciente a la más antigua.",
  "case.historyReadOnly": "Solo lectura",
  "case.historyEmpty": "Todavía no hay actuaciones publicadas.",
  "case.detail": "Detalle",
  "case.actionProcedure": "Procedimiento",
  "case.actionFirm": "Despacho",
  "case.formalName": "Denominación formal",
  "case.attachedDoc": "Documento adjunto",

  "case.documentsTitle": "Documentos",
  "case.firmDocs": "Documentos del despacho",
  "case.firmDocsIntro": "Resoluciones, escritos y contratos de tu expediente.",
  "case.firmDocsEmpty": "Todavía no hay documentos.",
  "case.requestedDocs": "Documentos que necesitamos de ti",
  "case.requestedDocsEmpty": "No te hemos pedido ningún documento.",
  "case.uploadedDocs": "Documentos que has enviado",
  "case.uploadedDocsEmpty": "Todavía no has enviado documentos.",
  "case.upload": "Subir documento",
  "case.uploadAgain": "Volver a subirlo",
  "case.requestedOn": "Solicitado el",
  "case.submittedOn": "Enviado el",
  "case.uploadedOn": "Subido el",
  "case.whyRejected": "Por qué lo hemos rechazado",

  "status.pendiente": "Pendiente",
  "status.recibido": "Recibido",
  "status.revision": "En revisión",
  "status.validado": "Validado",
  "status.rechazado": "Rechazado",

  "case.datesTitle": "Próximas fechas",
  "case.datesEmpty": "No hay fechas señaladas por ahora.",
  "case.datesDisclaimer":
    "Estas son las fechas que el despacho te ha comunicado (citas, vistas, firmas y reuniones). El portal no lleva el control de los plazos procesales de tu asunto: de eso se encarga el despacho.",
  "date.huellas": "Cita de huellas",
  "date.vista": "Vista",
  "date.notaria": "Firma en notaría",
  "date.reunion": "Reunión",
  "date.entrega": "Entrega",

  "case.expiriesTitle": "Caducidad de tus documentos",
  "case.expiriesDisclaimer":
    "Fechas de caducidad de documentos tuyos (tarjeta, pasaporte, permisos) introducidas por el despacho. Son un recordatorio orientativo y no sustituyen a la comprobación en tus documentos originales. No tienen relación con plazos procesales.",
  "case.expiresOn": "Caduca el",
  "case.expiryDaysLeft": "Quedan {n} días",
  "case.expiryExpired": "Caducado",
  "case.expiryToday": "Caduca hoy",

  /* --- Mensajes --- */
  "messages.title": "Mensajes",
  "messages.selectCase": "Elige un expediente",
  "messages.empty": "Todavía no hay mensajes en este expediente.",
  "messages.placeholder": "Escribe tu mensaje…",
  "messages.send": "Enviar",
  "messages.attach": "Adjuntar archivo",
  "messages.attached": "Archivo adjunto",
  "messages.unread": "Nuevo",
  "messages.you": "Tú",
  "messages.sentDemo":
    "En la demostración el mensaje se muestra en la conversación pero no se envía a nadie.",

  /* --- Área económica --- */
  "billing.title": "Área económica",
  "billing.engagementScope": "Alcance del encargo",
  "billing.engagementTerms": "Forma de pago",
  "billing.acceptedOn": "Aceptada el",
  "billing.invoiceSingular": "Factura",
  "billing.pendingEmpty": "No tienes pagos pendientes.",

  /* Honorarios y provisiones se presentan por separado: mezclarlos hace parecer
     que el cliente debe al despacho el dinero de los impuestos. */
  "billing.feesPendingTitle": "Honorarios del despacho",
  "billing.feesPendingTotal": "Pendiente de pago",
  /* Sin el paréntesis «(impuestos y gastos de terceros)»: eso lo dice ya, y
     mejor, la línea de `billing.provisionsShort` justo debajo de la cifra. */
  "billing.provisionsPendingTitle": "Provisiones de fondos",
  "billing.provisionsPendingTotal": "Pendiente de provisionar",
  "billing.provisionsPendingEmpty": "No tienes provisiones pendientes.",
  "billing.provisionsPendingIntro":
    "Estos importes no son honorarios del despacho. Se reciben para pagarlos en tu nombre y se justifica cada pago.",
  "billing.payee": "Se paga a",
  "billing.grandTotal": "Total a desembolsar",

  /* Resumen de cabecera: dos cifras y poco más. El detalle vive en las
     pestañas, así que aquí solo se dice cuánto, de cuántas cosas y si corre
     prisa. */
  "billing.summaryNav": "Secciones del área económica",
  "billing.tabInvoices": "Facturas",
  "billing.tabProvisions": "Provisiones",
  "billing.tabEngagement": "Hoja de encargo",
  "billing.provisionsShort":
    "Impuestos y gastos de terceros. El despacho no los ingresa: los paga en tu nombre.",
  "billing.feesUpToDate": "Sin honorarios pendientes",
  "billing.provisionsUpToDate": "Sin provisiones pendientes",
  "billing.countInvoicesOne": "1 factura",
  "billing.countInvoicesMany": "{n} facturas",
  "billing.countProvisionsOne": "1 provisión",
  "billing.countProvisionsMany": "{n} provisiones",
  "billing.nextDue": "la próxima, {when}",
  "billing.onlyDue": "vence {when}",
  /* Cuando la fecha de vencimiento ya pasó, se dice en pasado. */
  "billing.overdueSince": "vencida {when}",
  "billing.dueOnPast": "Venció el",
  "billing.engagementDetail": "Ver alcance y forma de pago",

  "billing.paid": "Pagada",
  "billing.pending": "Pendiente",
  "billing.dueOn": "Vence el",
  "billing.paidOn": "Pagada el",
  "billing.requestedOn": "Solicitada el",
  "billing.noPaymentNotice":
    "El pago no se realiza desde el portal. El despacho te indicará la forma de pago en cada caso.",

  /* --- Perfil --- */
  "profile.title": "Mi perfil",
  "profile.contactTitle": "Datos de contacto",
  "profile.name": "Nombre",
  "profile.email": "Correo electrónico",
  "profile.phone": "Teléfono",
  "profile.address": "Dirección",
  "profile.idDocument": "Documento de identidad",
  "profile.idMaskedHint":
    "Lo mostramos parcialmente oculto. El despacho conserva el número completo.",


  "profile.authorizedTitle": "Personas autorizadas",
  "profile.authorizedIntro":
    "Terceros con acceso a alguno de tus asuntos. Cada alta queda respaldada por tu autorización escrita; el alta y la baja las hace el despacho, así que si quieres cambiar algo, dínoslo.",
  "profile.authorizedEmpty": "No hay ninguna persona autorizada en tus asuntos.",
  "profile.authorizedSince": "Autorizada desde el",
  "profile.authorizedScope": "Puede ver",
  "profile.authorizedCases": "En los asuntos",
  "scope.lectura": "Estado del asunto y actuaciones",
  "scope.documentos": "Documentos",
  "scope.economico": "Facturas y pagos",

  "profile.passwordTitle": "Contraseña",
  "profile.passwordIntro":
    "Te recomendamos cambiarla cada cierto tiempo y no reutilizarla en otros servicios.",
  "profile.changePassword": "Cambiar contraseña",
  "profile.passwordDemo":
    "En la demostración el cambio de contraseña no está activo.",

  "profile.accessTitle": "Tus últimos accesos",
  "profile.accessIntro":
    "Si no reconoces alguno de estos accesos, avísanos cuanto antes.",
  "profile.accessDevice": "Dispositivo",
  "profile.accessLocation": "Lugar",
  "profile.accessWho": "Quién",
  "profile.accessWhen": "Cuándo",
  "profile.accessAuthorized": "persona autorizada",

  /* --- Privacidad --- */
  "privacy.title": "Privacidad y protección de datos",
  "privacy.draftNotice":
    "Texto ilustrativo para la demostración. Pendiente de revisión y aprobación por el despacho antes de su publicación.",
  "privacy.controllerTitle": "Quién trata tus datos",
  "privacy.controllerBody":
    "{firm} es el responsable del tratamiento de tus datos personales. Los trata para prestarte los servicios jurídicos que le has encargado y para cumplir sus obligaciones legales y deontológicas como despacho de abogados.",
  "privacy.processorTitle": "Quién presta el servicio del portal",
  "privacy.processorBody":
    "Iuristech actúa como encargado del tratamiento: pone a disposición del despacho la plataforma del portal y trata los datos únicamente siguiendo sus instrucciones, con un contrato de encargo firmado entre ambas partes. Iuristech no utiliza tus datos para ninguna finalidad propia.",
  "privacy.securityTitle": "Medidas de seguridad",
  "privacy.securityBody":
    "El acceso al portal requiere contraseña y verificación en dos pasos. Las comunicaciones viajan cifradas, los documentos se almacenan cifrados y cada acceso queda registrado. El personal con acceso está sujeto a deber de secreto.",
  "privacy.rightsTitle": "Tus derechos",
  "privacy.rightsBody":
    "Puedes solicitar el acceso a tus datos, su rectificación o su supresión, así como la limitación u oposición a determinados tratamientos y la portabilidad de tus datos. Ten en cuenta que la normativa aplicable a la abogacía obliga al despacho a conservar determinada documentación durante un tiempo, aunque solicites su supresión.",
  "privacy.contactTitle": "A quién dirigirte",
  "privacy.contactBody":
    "Para ejercer tus derechos o resolver cualquier duda sobre el tratamiento de tus datos, escribe al despacho a {email} o acude a sus oficinas en {address}. También puedes presentar una reclamación ante la Agencia Española de Protección de Datos.",
  "privacy.policyLink": "Política de privacidad del despacho",
  "privacy.policyPending":
    "Enlace pendiente de que el despacho facilite la URL definitiva.",

  /* --- Onboarding --- */
  "onb.skip": "Saltar",
  "onb.next": "Siguiente",
  "onb.start": "Entrar al portal",
  "onb.step": "Paso {n} de {total}",
  "onb.1.title": "Bienvenido a tu portal",
  "onb.1.body":
    "Aquí puedes consultar en cualquier momento el estado de tus asuntos, descargar tus documentos y enviarnos lo que te pidamos. Lo que ves está publicado por tu abogado.",
  "onb.2.title": "Qué no es este portal",
  "onb.2.body":
    "No es un chat en tiempo real ni un canal de consultas urgentes, no da asesoramiento automático ni valora cómo va tu asunto, y no lleva el control de los plazos procesales. De todo eso se encarga tu abogado.",
  "onb.3.title": "Si necesitas hablar con nosotros",
  "onb.3.body":
    "Por mensajes respondemos en un plazo de 2 días laborables. Para algo urgente, llámanos al {phone}. Y si quieres consultar una cuestión nueva, pide cita con tu abogado.",

  /* --- Vista despacho --- */
  "firm.title": "Actualizaciones pendientes de aprobar",
  "firm.publish": "Publicar",
  "firm.published": "Publicada",
  "firm.publishedToast":
    "Publicada. Ya es visible en el expediente del cliente.",
  "firm.reset": "Restablecer la demostración",
  "firm.clientSees": "El cliente verá",
  "firm.formalRecord": "Constará en el expediente como",
  "firm.viewAsClient": "Ver como lo ve el cliente",
  "firm.publishHint":
    "Al publicar, la actuación aparece al instante en el expediente del cliente.",

  /* Navegación lateral */
  "firm.nav": "Secciones del despacho",
  "firm.navToday": "Hoy",
  "firm.navUpdates": "Actualizaciones",
  "firm.navDocs": "Documentos",
  "firm.navMessages": "Mensajes",
  "firm.navClients": "Clientes y accesos",
  "firm.navBilling": "Económico",
  "firm.navSettings": "Configuración",
  "firm.navTeam": "Equipo",
  "firm.navActivity": "Actividad",
  "firm.preview": "Vista previa",

  /* Hoy */
  "firm.todayTitle": "Hoy",
  /* El saludo se elige por la hora real de quien enseña la demostración; la
     fecha que lo acompaña es la del escenario (`TODAY`), para que cuadre con
     los "hace N días" de las listas. */
  "firm.greetingMorning": "Buenos días",
  "firm.greetingAfternoon": "Buenas tardes",
  "firm.greetingEvening": "Buenas noches",
  "firm.activeCases": "{n} asuntos activos",
  "firm.activeCasesOne": "1 asunto activo",
  "firm.scopeAll": "Todo el despacho",
  "firm.scopeMine": "Solo lo mío",
  /* Los escalones del estado del despacho. En minúscula porque se leen detrás
     de su número, como una frase: "3 con algo pendiente". */
  "firm.statePending": "con algo pendiente",
  "firm.stateLate": "atrasados",
  "firm.stateLateOne": "atrasado",
  /* Qué tiene pendiente cada fila del tablero, contado por tipo. Sustituyen a
     los puntos de color: un punto obliga a recordar qué significa cada color,
     y el rótulo lo dice. Se encadenan con " · " — "1 borrador · 1 documento"—
     y cuando hay más de dos tipos se resumen en `countPending`, que da solo el
     total: a partir de ahí la lista no cabe y deja de leerse de un vistazo. */
  "firm.countDraftOne": "1 borrador",
  "firm.countDraft": "{n} borradores",
  "firm.countDocOne": "1 documento",
  "firm.countDoc": "{n} documentos",
  "firm.countMessageOne": "1 mensaje",
  "firm.countMessage": "{n} mensajes",
  "firm.countOverdueOne": "1 vencido",
  "firm.countOverdue": "{n} vencidos",
  "firm.countPending": "{n} pendientes",
  "firm.countStale": "Sin movimiento",
  "firm.boardTitle": "Expedientes",
  "firm.boardEmpty": "Sin expedientes en esta vista.",
  "firm.queueTitle": "Pendiente",
  "firm.cardStale": "Sin movimiento desde hace más de 30 días",
  "firm.allClear": "Todo al día",
  "firm.daysElapsed": "{n} d",
  "firm.actionReview": "Revisar",
  "firm.actionReply": "Responder",
  "firm.actionOpen": "Abrir",
  "firm.actionCollect": "Cobrar",
  "firm.lastUpdateWas": "Última actuación",

  /* Actualizaciones */
  "firm.filterArea": "Área",
  "firm.filterOwner": "Responsable",
  "firm.filterAge": "Antigüedad",
  "firm.filterAll": "Todas las áreas",
  "firm.filterAllOwners": "Todo el equipo",
  "firm.ageAny": "Cualquiera",
  "firm.age3": "Más de 3 días",
  "firm.age7": "Más de 7 días",
  "firm.age15": "Más de 15 días",
  "firm.selectAll": "Seleccionar todo",
  "firm.publishSelected": "Publicar seleccionadas ({n})",
  "firm.edit": "Editar",
  "firm.editSave": "Guardar cambios",
  "firm.editCancel": "Cancelar",
  "firm.template": "Plantilla de actuación",
  "firm.templateNone": "Sin plantilla",
  "firm.channels": "Avisar al cliente por",
  "firm.channelEmail": "Correo",
  "firm.channelSms": "SMS",
  "firm.channelWhatsapp": "WhatsApp",
  "firm.thirdParties": "Visible también para terceros autorizados",
  "firm.discard": "Descartar",
  "firm.discarded": "Borrador descartado.",
  "firm.noDrafts": "No hay borradores que coincidan con el filtro.",

  /* Documentos */
  "firm.docsTitle": "Documentos",
  "firm.tabToReview": "Por revisar",
  "firm.tabRequested": "Solicitados",
  "firm.validate": "Validar",
  "firm.reject": "Rechazar",
  "firm.rejectReason": "Motivo, en lenguaje claro",
  "firm.rejectOther": "Escribir otro motivo",
  "firm.rejectSend": "Rechazar y avisar",
  "firm.validatedToast": "Validado. El cliente lo verá como correcto.",
  "firm.rejectedToast": "Rechazado. El cliente verá el motivo y podrá volver a enviarlo.",
  "firm.noneToReview": "No hay documentos esperando revisión.",
  "firm.requestDocs": "Solicitar documentos",
  "firm.requestPanelIntro":
    "Marca lo que hay que pedir. El cliente lo recibe con su explicación en lenguaje claro.",
  "firm.requestFor": "Para el expediente",
  "firm.requestSend": "Pedir {n} documentos",
  "firm.requestSendOne": "Pedir 1 documento",
  "firm.requestDone": "Pedidos. Ya aparecen en el expediente del cliente.",
  "firm.remind": "Recordar al cliente",
  "firm.remindedToast": "Recordatorio enviado.",
  "firm.sentOn": "Enviado el",
  "firm.noRequests": "No hay documentos solicitados.",
  "firm.uploadedFile": "Archivo recibido",

  /* Clientes y accesos */
  "firm.clientsTitle": "Clientes y accesos",
  "firm.colClient": "Cliente",
  "firm.colCases": "Expedientes",
  "firm.colOwner": "Responsable",
  "firm.colAccess": "Acceso",
  "firm.colLastAccess": "Último acceso",
  "firm.accessActivo": "Activo",
  "firm.accessInvitado": "Invitado",
  "firm.accessSuspendido": "Suspendido",
  "firm.clientCode": "Código de cliente",
  "firm.accessGrant": "Dar de alta",
  "firm.accessRevoke": "Dar de baja",
  "firm.accessResend": "Reenviar invitación",
  "firm.accessReset": "Reiniciar contraseña",
  "firm.perCaseAccess": "Acceso por expediente",
  "firm.suspendCase": "Suspender",
  "firm.restoreCase": "Restablecer",
  "firm.thirdPartiesTitle": "Terceros autorizados",
  "firm.thirdPartiesEmpty": "Sin terceros autorizados.",
  "firm.colScope": "Puede ver",
  "firm.colSince": "Alta",
  "firm.revoke": "Revocar",
  "firm.neverEntered": "No ha entrado todavía",

  /* Configuración */
  "firm.settingsTitle": "Configuración del despacho",
  "firm.setPhases": "Fases por tipo de asunto",
  "firm.setTemplates": "Plantillas de actuaciones",
  "firm.setResponse": "Plazo de respuesta y urgencias",
  "firm.setLocales": "Idiomas disponibles",
  "firm.setDefaults": "Qué se publica por defecto",
  "firm.setLegal": "Textos legales del despacho",
  "firm.phaseUp": "Subir",
  "firm.phaseDown": "Bajar",
  "firm.phaseAdd": "Añadir fase",
  "firm.phaseRemove": "Quitar",
  "firm.phaseNew": "Fase nueva",
  "firm.phaseCount": "{n} fases",
  "firm.responseDaysLabel": "Respondemos en",
  "firm.days": "días laborables",
  "firm.urgencyPhone": "Teléfono de urgencias",
  "firm.localeOn": "Disponible",
  "firm.localeOff": "No disponible",
  "firm.legalLink": "Ver los textos de privacidad del portal",
  "firm.legalNote":
    "Los textos actuales son ilustrativos y están pendientes de revisión por el despacho.",
  "firm.templateFor": "Para",
  /* Va siempre detrás de "Para", nunca suelta: en minúscula. */
  "firm.templateAnyArea": "cualquier área",

  /* Equipo */
  "firm.teamTitle": "Equipo",
  "firm.permPublica": "Puede publicar",
  "firm.permRedacta": "Solo redacta borradores",
  /* La casilla del desplegable va justo debajo del distintivo de estado, que
     ya dice "Puede publicar". Repetir la misma frase dejaba la fila diciendo
     dos veces lo mismo sin que se viera cuál de las dos era el mando. */
  "firm.permPublicaToggle": "Puede publicar en el portal del cliente",
  "firm.teamAreas": "Ve los expedientes de",
  "firm.teamAllAreas": "Todas las áreas",

  /* Actividad */
  "firm.activityTitle": "Actividad",
  "firm.activityIntro":
    "Quién publicó qué y cuándo, y qué ha consultado o descargado el cliente.",
  "firm.activityExport": "Exportar",
  /* Cabecera del CSV: sin ella la hoja se abre con la primera entrada del
     registro en la fila de títulos y no se sabe qué es cada columna. */
  "firm.activityCsvDate": "Fecha",
  "firm.activityCsvActor": "Quién",
  "firm.activityCsvDetail": "Qué",
  "firm.activityByFirm": "Despacho",
  "firm.activityByClient": "Cliente",
  "firm.activityAll": "Todo",

  /* Mensajes (maqueta) */
  "firm.messagesTitle": "Mensajes",
  "firm.assignTo": "Asignar a",
  "firm.assignNobody": "Sin asignar",
  "firm.quickReplies": "Respuestas rápidas",
  "firm.awayMode": "Modo ausencia",
  "firm.awayOn": "El cliente ve que estás fuera y cuándo vuelves.",
  "firm.inboxEmpty": "No hay mensajes con este filtro.",
  "firm.waitingDays": "esperando {n} días",

  /* Económico (maqueta) */
  "firm.billingTitle": "Económico",
  "firm.markRequested": "Marcar como solicitada",
  "firm.markPaid": "Marcar como pagada",
  "firm.uploadReceipt": "Subir justificante",
  "firm.publishInvoice": "Publicar",
  "firm.unpublishInvoice": "Despublicar",
  "firm.visibleToClient": "Visible para el cliente",

  /* Paginación */
  "firm.pagePrev": "Anterior",
  "firm.pageNext": "Siguiente",
  "firm.pageOf": "{a} de {b}",
} as const;

export type TKey = keyof typeof es;

const en: Record<TKey, string> = {
  /* --- Common --- */
  "common.portal": "Client portal",
  "common.language": "Language",
  "common.back": "Back",
  "common.close": "Close",
  "common.cancel": "Cancel",
  "common.continue": "Continue",
  "common.yes": "Yes",
  "common.no": "No",
  "common.download": "Download",
  "common.of": "of",
  "common.loading": "Loading…",

  /* --- Access --- */
  "login.title": "Client login",
  "login.subtitle":
    "Check the status of your matters, your documents and your communications with the firm.",
  "login.email": "Email address",
  "login.password": "Password",
  "login.submit": "Sign in",
  "login.forgot": "I forgot my password",
  "login.error": "That email or password is not correct.",
  "login.demoTitle": "Demo profiles",
  "login.demoHint": "Click a profile to fill in the form.",
  "login.securityNote":
    "Encrypted connection. Every sign-in is logged with date, time and device.",

  /* --- Two-factor --- */
  "twofa.title": "Two-step verification",
  "twofa.intro":
    "To protect your information we need to confirm it is you. Choose how you would like to receive the six-digit code.",
  "twofa.bySms": "By SMS",
  "twofa.byEmail": "By email",
  "twofa.sentBySms": "We have sent a code to the phone ending in",
  "twofa.sentByEmail": "We have sent a code to",
  "twofa.code": "Verification code",
  "twofa.verify": "Verify",
  "twofa.resend": "Resend the code",
  "twofa.resent": "Code resent.",
  "twofa.changeMethod": "Choose another method",
  "twofa.demoNote":
    "No code is sent in this demonstration: enter any six digits, or simply press Verify.",
  "twofa.invalid": "The code must be six digits long.",

  /* --- Password recovery --- */
  "recover.title": "Reset your password",
  "recover.intro":
    "Enter the email address you use for the portal and we will send you a link to create a new password.",
  "recover.submit": "Send link",
  "recover.sentTitle": "Check your email",
  "recover.sentBody":
    "If that address belongs to a client of the firm, you will receive a link within a few minutes. The link expires in one hour.",
  "recover.backToLogin": "Back to sign in",
  "recover.demoNote": "No real email is sent in this demonstration.",

  /* --- Navigation --- */
  "nav.cases": "My matters",
  "nav.messages": "Messages",
  "nav.billing": "Fees and invoices",
  "nav.profile": "My profile",
  "nav.firmView": "Firm view",
  "nav.logout": "Sign out",
  "nav.lastAccess": "Last sign-in",
  "nav.menu": "Menu",

  /* --- My matters --- */
  "cases.title": "My matters",
  "cases.intro": "Current status of the files we are handling for you.",
  "cases.noticesTitle": "Notices",
  "cases.noticesEmpty": "You have no outstanding notices.",
  "cases.noticeDocs": "We are missing documents from you",
  "cases.noticeDocsOne": "We need 1 document",
  "cases.noticeDocsMany": "We need {n} documents",
  "cases.noticeMessages": "You have new messages from the firm",
  "cases.noticeMessagesOne": "1 new message",
  "cases.noticeMessagesMany": "{n} new messages",
  "cases.noticeDates": "Upcoming dates",
  "cases.noticeExpiry": "Document expiring soon",
  "cases.currentPhase": "Current stage",
  "cases.lastUpdate": "Last update",
  "cases.nothingPending": "We need nothing from you",
  "cases.openFile": "Open file",
  "cases.ref": "Reference",
  "cases.updated": "Updated",
  "cases.pendingBadge": "{n} pending",
  "cases.pendingBadgeMany": "{n} pending",
  "cases.uploadCta": "Upload documents",
  "cases.seeDates": "See dates",
  "cases.seeMessages": "See messages",
  "cases.renewCta": "See expiry",
  "cases.allClear": "Nothing outstanding",

  /* --- Tiempos relativos --- */
  "time.today": "today",
  "time.yesterday": "yesterday",
  "time.tomorrow": "tomorrow",
  "time.daysAgo": "{n} days ago",
  "time.weekAgo": "1 week ago",
  "time.weeksAgo": "{n} weeks ago",
  "time.monthAgo": "1 month ago",
  "time.monthsAgo": "{n} months ago",
  "time.inDays": "in {n} days",
  "time.inWeek": "in 1 week",
  "time.inWeeks": "in {n} weeks",
  "time.inMonth": "in 1 month",
  "time.inMonths": "in {n} months",

  /* --- Case file --- */
  "case.backToCases": "Back to my matters",
  "case.summary": "Summary",
  "case.phaseProgress": "Stage {n} of {total}",
  "case.whatIsHappening": "What is happening",
  "case.whatComesNext": "What comes next",
  "case.estimateLabel": "Indicative timescale from the authorities",
  "case.estimateDisclaimer":
    "This is an indicative estimate based on how the authority usually works. It is not a commitment by the firm nor a guaranteed deadline.",
  "case.needFromYou": "Do we need anything from you?",
  "case.needNothing": "No, we do not need anything from you right now.",
  "case.needSomething": "Yes. We are missing {n} documents.",
  "case.needSomethingOne": "Yes. We are missing 1 document.",
  "case.goToPending": "See what we need",
  "case.contactPerson": "Your point of contact",
  "case.openedOn": "File opened on",

  "case.sectionsNav": "File sections",
  "case.tabHistory": "History",
  "case.tabDocuments": "Documents",
  "case.tabDates": "Dates",

  "case.historyTitle": "Record of steps taken",
  "case.historyIntro":
    "Steps the firm has published in your file, most recent first.",
  "case.historyReadOnly": "Read only",
  "case.historyEmpty": "No steps have been published yet.",
  "case.detail": "Details",
  "case.actionProcedure": "Proceedings",
  "case.actionFirm": "Our firm",
  "case.formalName": "Formal name",
  "case.attachedDoc": "Attached document",

  "case.documentsTitle": "Documents",
  "case.firmDocs": "Documents from the firm",
  "case.firmDocsIntro": "Decisions, filings and contracts in your file.",
  "case.firmDocsEmpty": "There are no documents yet.",
  "case.requestedDocs": "Documents we need from you",
  "case.requestedDocsEmpty": "We have not asked you for any documents.",
  "case.uploadedDocs": "Documents you have sent",
  "case.uploadedDocsEmpty": "You have not sent any documents yet.",
  "case.upload": "Upload document",
  "case.uploadAgain": "Upload it again",
  "case.requestedOn": "Requested on",
  "case.submittedOn": "Sent on",
  "case.uploadedOn": "Uploaded on",
  "case.whyRejected": "Why we rejected it",

  "status.pendiente": "Pending",
  "status.recibido": "Received",
  "status.revision": "Under review",
  "status.validado": "Accepted",
  "status.rechazado": "Rejected",

  "case.datesTitle": "Upcoming dates",
  "case.datesEmpty": "There are no scheduled dates at the moment.",
  "case.datesDisclaimer":
    "These are the dates the firm has notified you of (appointments, hearings, signings and meetings). The portal does not track the procedural deadlines in your matter: the firm takes care of that.",
  "date.huellas": "Fingerprint appointment",
  "date.vista": "Hearing",
  "date.notaria": "Notary signing",
  "date.reunion": "Meeting",
  "date.entrega": "Handover",

  "case.expiriesTitle": "Expiry of your documents",
  "case.expiriesDisclaimer":
    "Expiry dates for your own documents (card, passport, permits) entered by the firm. They are an indicative reminder and do not replace checking your original documents. They are unrelated to procedural deadlines.",
  "case.expiresOn": "Expires on",
  "case.expiryDaysLeft": "{n} days left",
  "case.expiryExpired": "Expired",
  "case.expiryToday": "Expires today",

  /* --- Messages --- */
  "messages.title": "Messages",
  "messages.selectCase": "Choose a matter",
  "messages.empty": "There are no messages in this matter yet.",
  "messages.placeholder": "Write your message…",
  "messages.send": "Send",
  "messages.attach": "Attach a file",
  "messages.attached": "Attached file",
  "messages.unread": "New",
  "messages.you": "You",
  "messages.sentDemo":
    "In this demonstration the message appears in the conversation but is not sent to anyone.",

  /* --- Fees and invoices --- */
  "billing.title": "Fees and invoices",
  "billing.engagementScope": "Scope of work",
  "billing.engagementTerms": "Payment terms",
  "billing.acceptedOn": "Accepted on",
  "billing.invoiceSingular": "Invoice",
  "billing.pendingEmpty": "You have no outstanding payments.",

  "billing.feesPendingTitle": "Firm fees",
  "billing.feesPendingTotal": "Outstanding",
  "billing.provisionsPendingTitle": "Payments on account",
  "billing.provisionsPendingTotal": "Still to be provided",
  "billing.provisionsPendingEmpty":
    "You have no outstanding payments on account.",
  "billing.provisionsPendingIntro":
    "These amounts are not firm fees. They are received so that we can pay them on your behalf, and every payment is accounted for.",
  "billing.payee": "Paid to",
  "billing.grandTotal": "Total to pay out",

  "billing.summaryNav": "Fees and invoices sections",
  "billing.tabInvoices": "Invoices",
  "billing.tabProvisions": "On account",
  "billing.tabEngagement": "Engagement letter",
  "billing.provisionsShort":
    "Taxes and third-party costs. The firm does not keep this money: it pays it on your behalf.",
  "billing.feesUpToDate": "No outstanding fees",
  "billing.provisionsUpToDate": "Nothing to provide",
  "billing.countInvoicesOne": "1 invoice",
  "billing.countInvoicesMany": "{n} invoices",
  "billing.countProvisionsOne": "1 payment on account",
  "billing.countProvisionsMany": "{n} payments on account",
  "billing.nextDue": "next one {when}",
  "billing.onlyDue": "due {when}",
  "billing.overdueSince": "was due {when}",
  "billing.dueOnPast": "Was due on",
  "billing.engagementDetail": "See scope and payment terms",

  "billing.paid": "Paid",
  "billing.pending": "Outstanding",
  "billing.dueOn": "Due on",
  "billing.paidOn": "Paid on",
  "billing.requestedOn": "Requested on",
  "billing.noPaymentNotice":
    "Payment is not made through the portal. The firm will tell you how to pay in each case.",

  /* --- Profile --- */
  "profile.title": "My profile",
  "profile.contactTitle": "Contact details",
  "profile.name": "Name",
  "profile.email": "Email address",
  "profile.phone": "Phone",
  "profile.address": "Address",
  "profile.idDocument": "Identity document",
  "profile.idMaskedHint":
    "Shown partially hidden. The firm keeps the full number on file.",


  "profile.authorizedTitle": "Authorised people",
  "profile.authorizedIntro":
    "Third parties with access to one of your matters. Every authorisation is backed by your written consent; the firm grants and removes this access, so if you want to change something, let us know.",
  "profile.authorizedEmpty": "Nobody else has access to your matters.",
  "profile.authorizedSince": "Authorised since",
  "profile.authorizedScope": "Can see",
  "profile.authorizedCases": "In these matters",
  "scope.lectura": "Matter status and steps taken",
  "scope.documentos": "Documents",
  "scope.economico": "Invoices and payments",

  "profile.passwordTitle": "Password",
  "profile.passwordIntro":
    "We recommend changing it from time to time and not reusing it on other services.",
  "profile.changePassword": "Change password",
  "profile.passwordDemo":
    "Changing your password is not enabled in this demonstration.",

  "profile.accessTitle": "Your recent sign-ins",
  "profile.accessIntro":
    "If you do not recognise one of these sign-ins, please tell us as soon as possible.",
  "profile.accessDevice": "Device",
  "profile.accessLocation": "Place",
  "profile.accessWho": "Who",
  "profile.accessWhen": "When",
  "profile.accessAuthorized": "authorised person",

  /* --- Privacy --- */
  "privacy.title": "Privacy and data protection",
  "privacy.draftNotice":
    "Illustrative text for the demonstration. Subject to review and approval by the firm before publication.",
  "privacy.controllerTitle": "Who processes your data",
  "privacy.controllerBody":
    "{firm} is the controller of your personal data. It processes that data to provide the legal services you have engaged it for and to meet its legal and professional obligations as a law firm.",
  "privacy.processorTitle": "Who runs the portal",
  "privacy.processorBody":
    "Iuristech acts as data processor: it provides the firm with the portal platform and processes data solely on the firm's instructions, under a signed processing agreement between the two. Iuristech does not use your data for any purpose of its own.",
  "privacy.securityTitle": "Security measures",
  "privacy.securityBody":
    "Access to the portal requires a password and two-step verification. Communications travel encrypted, documents are stored encrypted, and every sign-in is logged. Staff with access are bound by a duty of confidentiality.",
  "privacy.rightsTitle": "Your rights",
  "privacy.rightsBody":
    "You may request access to your data, its correction or its erasure, as well as restriction of or objection to certain processing, and portability of your data. Please note that the rules governing the legal profession require the firm to retain certain documentation for a period of time, even if you request erasure.",
  "privacy.contactTitle": "Who to contact",
  "privacy.contactBody":
    "To exercise your rights or resolve any question about how your data is handled, write to the firm at {email} or visit its offices at {address}. You may also lodge a complaint with the Spanish Data Protection Agency.",
  "privacy.policyLink": "The firm's privacy policy",
  "privacy.policyPending":
    "Link pending the firm providing the final URL.",

  /* --- Onboarding --- */
  "onb.skip": "Skip",
  "onb.next": "Next",
  "onb.start": "Enter the portal",
  "onb.step": "Step {n} of {total}",
  "onb.1.title": "Welcome to your portal",
  "onb.1.body":
    "Here you can check the status of your matters at any time, download your documents and send us whatever we ask for. Everything you see has been published by your lawyer.",
  "onb.2.title": "What this portal is not",
  "onb.2.body":
    "It is not a real-time chat or a channel for urgent queries, it does not give automatic advice or assess how your matter is going, and it does not track procedural deadlines. Your lawyer takes care of all of that.",
  "onb.3.title": "If you need to talk to us",
  "onb.3.body":
    "We reply to messages within 2 working days. For anything urgent, call us on {phone}. And if you want to raise a new question, book an appointment with your lawyer.",

  /* --- Firm view --- */
  "firm.title": "Updates awaiting approval",
  "firm.publish": "Publish",
  "firm.published": "Published",
  "firm.publishedToast": "Published. It is now visible in the client's file.",
  "firm.reset": "Reset the demonstration",
  "firm.clientSees": "The client will see",
  "firm.formalRecord": "Recorded in the file as",
  "firm.viewAsClient": "View as the client sees it",
  "firm.publishHint":
    "Once published, the update appears in the client's file straight away.",

  /* Sidebar */
  "firm.nav": "Firm sections",
  "firm.navToday": "Today",
  "firm.navUpdates": "Updates",
  "firm.navDocs": "Documents",
  "firm.navMessages": "Messages",
  "firm.navClients": "Clients and access",
  "firm.navBilling": "Fees",
  "firm.navSettings": "Settings",
  "firm.navTeam": "Team",
  "firm.navActivity": "Activity",
  "firm.preview": "Preview",

  /* Today */
  "firm.todayTitle": "Today",
  "firm.greetingMorning": "Good morning",
  "firm.greetingAfternoon": "Good afternoon",
  "firm.greetingEvening": "Good evening",
  "firm.activeCases": "{n} active matters",
  "firm.activeCasesOne": "1 active matter",
  "firm.scopeAll": "Whole firm",
  "firm.scopeMine": "Only mine",
  "firm.statePending": "with something pending",
  "firm.stateLate": "behind",
  "firm.stateLateOne": "behind",
  "firm.countDraftOne": "1 draft",
  "firm.countDraft": "{n} drafts",
  "firm.countDocOne": "1 document",
  "firm.countDoc": "{n} documents",
  "firm.countMessageOne": "1 message",
  "firm.countMessage": "{n} messages",
  "firm.countOverdueOne": "1 overdue",
  "firm.countOverdue": "{n} overdue",
  "firm.countPending": "{n} pending",
  "firm.countStale": "No movement",
  "firm.boardTitle": "Matters",
  "firm.boardEmpty": "No matters in this view.",
  "firm.queueTitle": "Outstanding",
  "firm.cardStale": "Untouched for more than 30 days",
  "firm.allClear": "All clear",
  "firm.daysElapsed": "{n} d",
  "firm.actionReview": "Review",
  "firm.actionReply": "Reply",
  "firm.actionOpen": "Open",
  "firm.actionCollect": "Collect",
  "firm.lastUpdateWas": "Last update",

  /* Updates */
  "firm.filterArea": "Area",
  "firm.filterOwner": "Owner",
  "firm.filterAge": "Age",
  "firm.filterAll": "All areas",
  "firm.filterAllOwners": "Whole team",
  "firm.ageAny": "Any",
  "firm.age3": "More than 3 days",
  "firm.age7": "More than 7 days",
  "firm.age15": "More than 15 days",
  "firm.selectAll": "Select all",
  "firm.publishSelected": "Publish selected ({n})",
  "firm.edit": "Edit",
  "firm.editSave": "Save changes",
  "firm.editCancel": "Cancel",
  "firm.template": "Update template",
  "firm.templateNone": "No template",
  "firm.channels": "Notify the client by",
  "firm.channelEmail": "Email",
  "firm.channelSms": "SMS",
  "firm.channelWhatsapp": "WhatsApp",
  "firm.thirdParties": "Also visible to authorised third parties",
  "firm.discard": "Discard",
  "firm.discarded": "Draft discarded.",
  "firm.noDrafts": "No drafts match the filter.",

  /* Documents */
  "firm.docsTitle": "Documents",
  "firm.tabToReview": "To review",
  "firm.tabRequested": "Requested",
  "firm.validate": "Approve",
  "firm.reject": "Reject",
  "firm.rejectReason": "Reason, in plain language",
  "firm.rejectOther": "Write a different reason",
  "firm.rejectSend": "Reject and notify",
  "firm.validatedToast": "Approved. The client will see it as correct.",
  "firm.rejectedToast":
    "Rejected. The client will see the reason and can send it again.",
  "firm.noneToReview": "No documents are waiting for review.",
  "firm.requestDocs": "Request documents",
  "firm.requestPanelIntro":
    "Tick what needs requesting. The client receives each one with its plain-language explanation.",
  "firm.requestFor": "For the matter",
  "firm.requestSend": "Request {n} documents",
  "firm.requestSendOne": "Request 1 document",
  "firm.requestDone": "Requested. They already appear in the client's file.",
  "firm.remind": "Remind the client",
  "firm.remindedToast": "Reminder sent.",
  "firm.sentOn": "Sent on",
  "firm.noRequests": "No documents have been requested.",
  "firm.uploadedFile": "File received",

  /* Clients and access */
  "firm.clientsTitle": "Clients and access",
  "firm.colClient": "Client",
  "firm.colCases": "Matters",
  "firm.colOwner": "Owner",
  "firm.colAccess": "Access",
  "firm.colLastAccess": "Last sign-in",
  "firm.accessActivo": "Active",
  "firm.accessInvitado": "Invited",
  "firm.accessSuspendido": "Suspended",
  "firm.clientCode": "Client code",
  "firm.accessGrant": "Enable access",
  "firm.accessRevoke": "Disable access",
  "firm.accessResend": "Resend invitation",
  "firm.accessReset": "Reset password",
  "firm.perCaseAccess": "Access per matter",
  "firm.suspendCase": "Suspend",
  "firm.restoreCase": "Restore",
  "firm.thirdPartiesTitle": "Authorised third parties",
  "firm.thirdPartiesEmpty": "No authorised third parties.",
  "firm.colScope": "Can see",
  "firm.colSince": "Added",
  "firm.revoke": "Revoke",
  "firm.neverEntered": "Has not signed in yet",

  /* Settings */
  "firm.settingsTitle": "Firm settings",
  "firm.setPhases": "Stages by type of matter",
  "firm.setTemplates": "Update templates",
  "firm.setResponse": "Reply time and out-of-hours line",
  "firm.setLocales": "Available languages",
  "firm.setDefaults": "What gets published by default",
  "firm.setLegal": "The firm's legal texts",
  "firm.phaseUp": "Move up",
  "firm.phaseDown": "Move down",
  "firm.phaseAdd": "Add stage",
  "firm.phaseRemove": "Remove",
  "firm.phaseNew": "New stage",
  "firm.phaseCount": "{n} stages",
  "firm.responseDaysLabel": "We reply within",
  "firm.days": "working days",
  "firm.urgencyPhone": "Out-of-hours number",
  "firm.localeOn": "Available",
  "firm.localeOff": "Not available",
  "firm.legalLink": "View the portal's privacy texts",
  "firm.legalNote":
    "The current texts are illustrative and await review by the firm.",
  "firm.templateFor": "For",
  "firm.templateAnyArea": "any area",

  /* Team */
  "firm.teamTitle": "Team",
  "firm.permPublica": "Can publish",
  "firm.permRedacta": "Drafts only",
  "firm.permPublicaToggle": "Can publish to the client portal",
  "firm.teamAreas": "Sees matters in",
  "firm.teamAllAreas": "All areas",

  /* Activity */
  "firm.activityTitle": "Activity",
  "firm.activityIntro":
    "Who published what and when, and what the client has viewed or downloaded.",
  "firm.activityExport": "Export",
  "firm.activityCsvDate": "Date",
  "firm.activityCsvActor": "Who",
  "firm.activityCsvDetail": "What",
  "firm.activityByFirm": "Firm",
  "firm.activityByClient": "Client",
  "firm.activityAll": "All",

  /* Messages (mock-up) */
  "firm.messagesTitle": "Messages",
  "firm.assignTo": "Assign to",
  "firm.assignNobody": "Unassigned",
  "firm.quickReplies": "Quick replies",
  "firm.awayMode": "Away mode",
  "firm.awayOn": "The client sees that you are away and when you are back.",
  "firm.inboxEmpty": "No messages match this filter.",
  "firm.waitingDays": "waiting {n} days",

  /* Fees (mock-up) */
  "firm.billingTitle": "Fees and payments",
  "firm.markRequested": "Mark as requested",
  "firm.markPaid": "Mark as paid",
  "firm.uploadReceipt": "Upload receipt",
  "firm.publishInvoice": "Publish",
  "firm.unpublishInvoice": "Unpublish",
  "firm.visibleToClient": "Visible to the client",

  /* Pagination */
  "firm.pagePrev": "Previous",
  "firm.pageNext": "Next",
  "firm.pageOf": "{a} of {b}",
};

const DICTS: Record<Locale, Record<TKey, string>> = { es, en };

/** Traduce una clave, sustituyendo marcadores `{x}` por los valores dados. */
export function translate(
  locale: Locale,
  key: TKey,
  vars?: Record<string, string | number>,
): string {
  let out: string = DICTS[locale][key] ?? DICTS.es[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      out = out.replaceAll(`{${k}}`, String(v));
    }
  }
  return out;
}

export const LOCALES: { id: Locale; label: string; short: string }[] = [
  { id: "es", label: "Castellano", short: "ES" },
  { id: "en", label: "English", short: "EN" },
];

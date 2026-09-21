"use client";

/**
 * Estado de la demostración.
 *
 * Mantiene la sesión, el idioma y las mutaciones que el visitante provoca
 * durante la demo (publicar una actualización desde la vista despacho, subir un
 * documento, enviar un mensaje). Todo vive en localStorage, de modo que la demo
 * sobrevive a un refresco sin necesidad de backend.
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { APP } from "@/config/identity";
import { CASES, MESSAGES, authenticate, getClientById } from "./data";
import type { FirmScope } from "./firm";
import { translate, type TKey } from "./i18n";
import type {
  Case,
  Client,
  DocRequest,
  Locale,
  LocalizedText,
  Message,
  UploadedDoc,
} from "./types";

const STORAGE_KEY = APP.storageKey;

/** Petición de documento creada desde la vista despacho durante la demo. */
interface LiveDocRequest {
  id: string;
  caseId: string;
  name: LocalizedText;
  help: LocalizedText;
  requestedOn: string;
}

interface PersistedState {
  locale: Locale;
  clientId: string | null;
  /** Ids de actuaciones que el despacho ha publicado durante la demo. */
  publishedActionIds: string[];
  /** Clientes que ya han visto el onboarding. */
  onboardedClientIds: string[];
  /** Mensajes escritos durante la demo. */
  extraMessages: Message[];
  /** Documentos subidos durante la demo, por id de petición. */
  uploads: Record<string, { name: string; date: string }>;

  /* --- Mutaciones que solo nacen en la vista despacho --- */

  /** Borradores descartados: dejan de existir también para el despacho. */
  discardedActionIds: string[];
  /**
   * Borradores reescritos en línea antes de publicarse. El texto se guarda en
   * los dos idiomas porque quien edita escribe uno solo; es el mismo criterio
   * que se sigue con los mensajes que redacta el cliente.
   */
  draftEdits: Record<string, { title: string; detail: string }>;
  /** Qué ha decidido el despacho sobre cada documento enviado por el cliente. */
  docDecisions: Record<
    string,
    { status: "validado" | "rechazado"; reason?: string; date: string }
  >;
  /** Documentos pedidos al cliente desde la vista despacho. */
  requestedDocs: LiveDocRequest[];
  /**
   * Qué alcance enseña la pantalla de Hoy. Vive aquí y no en la página para
   * que «Restablecer la demostración» lo devuelva a su sitio: si se quedara
   * como estado local, la siguiente demostración arrancaría filtrada.
   */
  firmScope: FirmScope;
}

const EMPTY: PersistedState = {
  locale: "es",
  clientId: null,
  publishedActionIds: [],
  onboardedClientIds: [],
  extraMessages: [],
  uploads: {},
  discardedActionIds: [],
  draftEdits: {},
  docDecisions: {},
  requestedDocs: [],
  firmScope: "all",
};

interface StoreValue extends PersistedState {
  hydrated: boolean;
  client: Client | null;
  /** Expedientes del cliente en sesión, con las publicaciones ya aplicadas. */
  cases: Case[];
  allCases: Case[];
  messages: Message[];
  t: (key: TKey, vars?: Record<string, string | number>) => string;
  setLocale: (l: Locale) => void;
  setFirmScope: (s: FirmScope) => void;
  login: (email: string, password: string) => Client | null;
  completeLogin: (clientId: string) => void;
  logout: () => void;
  publishAction: (actionId: string) => void;
  sendMessage: (caseId: string, body: string, attachmentName?: string) => void;
  uploadDocument: (requestId: string, fileName: string) => void;
  markOnboarded: (clientId: string) => void;
  resetDemo: () => void;

  /* --- Acciones de la vista despacho --- */
  discardAction: (actionId: string) => void;
  editAction: (actionId: string, title: string, detail: string) => void;
  decideDoc: (requestId: string, approve: boolean, reason?: string) => void;
  requestDocuments: (
    caseId: string,
    items: { name: LocalizedText; help: LocalizedText }[],
  ) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

function load(): PersistedState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    return { ...EMPTY, ...(JSON.parse(raw) as Partial<PersistedState>) };
  } catch {
    return EMPTY;
  }
}

/**
 * Almacén externo (fuera de React) con suscripción.
 *
 * El servidor siempre ve el estado vacío, y en cuanto el navegador toma el
 * control se lee localStorage. Así la hidratación nunca descuadra y no hace
 * falta actualizar estado dentro de un efecto.
 */
let memory: PersistedState = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function readSnapshot(): PersistedState {
  if (!loaded) {
    memory = load();
    loaded = true;
  }
  return memory;
}

function readServerSnapshot(): PersistedState {
  return EMPTY;
}

/** Aplica un cambio, lo persiste y avisa a los componentes suscritos. */
function setState(update: (s: PersistedState) => PersistedState) {
  const next = update(readSnapshot());
  if (next === memory) return;
  memory = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Modo privado o almacenamiento lleno: la demo sigue funcionando en memoria.
  }
  listeners.forEach((l) => l());
}

// La hidratación es simplemente "ya estamos en el navegador".
const noSubscribe = () => () => {};
const onClient = () => true;
const onServer = () => false;

/**
 * Aplica sobre los datos base las mutaciones de la demo: actuaciones
 * publicadas o descartadas, borradores reescritos, documentos subidos por el
 * cliente y lo que el despacho ha decidido sobre ellos.
 *
 * Es el punto donde las dos vistas se encuentran: todo lo que el despacho hace
 * en `/despacho` entra aquí, y de aquí sale ya al expediente del cliente.
 */
function projectCases(state: PersistedState): Case[] {
  return CASES.map((c) => {
    const actions = c.actions
      .filter((a) => !state.discardedActionIds.includes(a.id))
      .map((a) => {
        const edit = state.draftEdits[a.id];
        const base = edit
          ? {
              ...a,
              title: { es: edit.title, en: edit.title },
              detail: { es: edit.detail, en: edit.detail },
            }
          : a;
        return !base.published && state.publishedActionIds.includes(a.id)
          ? { ...base, published: true }
          : base;
      });

    // Las peticiones nuevas van primero: son las últimas que el cliente ha
    // recibido y lo que se espera de él ahora mismo.
    const requests: DocRequest[] = [
      ...state.requestedDocs
        .filter((r) => r.caseId === c.id)
        .map((r) => ({
          id: r.id,
          name: r.name,
          help: r.help,
          status: "pendiente" as const,
          requestedOn: r.requestedOn,
        })),
      ...c.docRequests,
    ];

    const extraUploads: UploadedDoc[] = [];
    const docRequests: DocRequest[] = requests.map((r) => {
      let next = r;

      const upload = state.uploads[r.id];
      if (upload) {
        extraUploads.push({
          id: `ud-live-${r.id}`,
          name: { es: upload.name, en: upload.name },
          uploadedOn: upload.date,
          meta: "PDF",
          fulfillsRequestId: r.id,
        });
        // Al subirlo, la petición pasa a estar en revisión por el despacho.
        next = { ...next, status: "revision", submittedOn: upload.date };
      }

      // La decisión del despacho manda sobre cualquier estado anterior.
      const decision = state.docDecisions[r.id];
      if (decision) {
        next = {
          ...next,
          status: decision.status,
          ...(decision.status === "rechazado" && decision.reason
            ? { rejectionReason: { es: decision.reason, en: decision.reason } }
            : {}),
        };
      }

      return next;
    });

    // Una actuación recién publicada mueve la fecha de última actualización.
    const newestPublished = actions
      .filter((a) => a.published)
      .map((a) => a.date)
      .sort()
      .at(-1);

    return {
      ...c,
      actions,
      docRequests,
      uploadedDocs: [...extraUploads, ...c.uploadedDocs],
      lastUpdate: newestPublished ?? c.lastUpdate,
    };
  });
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(
    subscribe,
    readSnapshot,
    readServerSnapshot,
  );
  const hydrated = useSyncExternalStore(noSubscribe, onClient, onServer);

  const allCases = useMemo(() => projectCases(state), [state]);

  const client = state.clientId ? getClientById(state.clientId) ?? null : null;

  const cases = useMemo(
    () => (client ? allCases.filter((c) => c.clientId === client.id) : []),
    [allCases, client],
  );

  const messages = useMemo(
    () =>
      [...MESSAGES, ...state.extraMessages].sort((a, b) =>
        a.date.localeCompare(b.date),
      ),
    [state.extraMessages],
  );

  const t = useCallback(
    (key: TKey, vars?: Record<string, string | number>) =>
      translate(state.locale, key, vars),
    [state.locale],
  );

  const setLocale = useCallback((locale: Locale) => {
    setState((s) => ({ ...s, locale }));
  }, []);

  const setFirmScope = useCallback((firmScope: FirmScope) => {
    setState((s) => ({ ...s, firmScope }));
  }, []);

  const login = useCallback((email: string, password: string) => {
    return authenticate(email, password) ?? null;
  }, []);

  /**
   * Entrar no toca el idioma. El portal arranca en español —el valor de
   * `EMPTY`— y a partir de ahí manda lo que elija quien lo esté usando: si ha
   * puesto inglés, sigue en inglés al volver a entrar. Antes cada cliente
   * traía un idioma preferido que se imponía al iniciar sesión, y entrar como
   * Olena dejaba la demostración en inglés sin haberlo pedido.
   */
  const completeLogin = useCallback((clientId: string) => {
    setState((s) => ({ ...s, clientId }));
  }, []);

  const logout = useCallback(() => {
    setState((s) => ({ ...s, clientId: null }));
  }, []);

  const publishAction = useCallback((actionId: string) => {
    setState((s) =>
      s.publishedActionIds.includes(actionId)
        ? s
        : { ...s, publishedActionIds: [...s.publishedActionIds, actionId] },
    );
  }, []);

  const sendMessage = useCallback(
    (caseId: string, body: string, attachmentName?: string) => {
      setState((s) => {
        const author = s.clientId ? getClientById(s.clientId) : null;
        const msg: Message = {
          id: `m-live-${Date.now()}`,
          caseId,
          from: "cliente",
          authorName: author?.name ?? "Cliente",
          date: new Date().toISOString(),
          body: { es: body, en: body },
          read: true,
          ...(attachmentName
            ? {
                attachment: {
                  name: { es: attachmentName, en: attachmentName },
                  meta: "PDF",
                },
              }
            : {}),
        };
        return { ...s, extraMessages: [...s.extraMessages, msg] };
      });
    },
    [],
  );

  const uploadDocument = useCallback((requestId: string, fileName: string) => {
    setState((s) => ({
      ...s,
      uploads: {
        ...s.uploads,
        [requestId]: { name: fileName, date: new Date().toISOString() },
      },
    }));
  }, []);

  const markOnboarded = useCallback((clientId: string) => {
    setState((s) =>
      s.onboardedClientIds.includes(clientId)
        ? s
        : { ...s, onboardedClientIds: [...s.onboardedClientIds, clientId] },
    );
  }, []);

  /**
   * Vuelve al estado de fábrica, idioma incluido. Antes conservaba el idioma
   * en curso, y un portátil que se hubiera quedado en inglés no tenía manera
   * de volver al punto de partida antes de la siguiente demostración.
   */
  const resetDemo = useCallback(() => {
    setState(() => ({ ...EMPTY }));
  }, []);

  const discardAction = useCallback((actionId: string) => {
    setState((s) =>
      s.discardedActionIds.includes(actionId)
        ? s
        : { ...s, discardedActionIds: [...s.discardedActionIds, actionId] },
    );
  }, []);

  const editAction = useCallback(
    (actionId: string, title: string, detail: string) => {
      setState((s) => ({
        ...s,
        draftEdits: { ...s.draftEdits, [actionId]: { title, detail } },
      }));
    },
    [],
  );

  const decideDoc = useCallback(
    (requestId: string, approve: boolean, reason?: string) => {
      setState((s) => ({
        ...s,
        docDecisions: {
          ...s.docDecisions,
          [requestId]: {
            status: approve ? "validado" : "rechazado",
            date: new Date().toISOString(),
            ...(reason ? { reason } : {}),
          },
        },
      }));
    },
    [],
  );

  const requestDocuments = useCallback(
    (caseId: string, items: { name: LocalizedText; help: LocalizedText }[]) => {
      if (items.length === 0) return;
      setState((s) => ({
        ...s,
        requestedDocs: [
          ...s.requestedDocs,
          ...items.map((item, i) => ({
            id: `dr-live-${Date.now()}-${i}`,
            caseId,
            name: item.name,
            help: item.help,
            requestedOn: new Date().toISOString().slice(0, 10),
          })),
        ],
      }));
    },
    [],
  );

  const value: StoreValue = {
    ...state,
    hydrated,
    client,
    cases,
    allCases,
    messages,
    t,
    setLocale,
    setFirmScope,
    login,
    completeLogin,
    logout,
    publishAction,
    sendMessage,
    uploadDocument,
    markOnboarded,
    resetDemo,
    discardAction,
    editAction,
    decideDoc,
    requestDocuments,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore debe usarse dentro de StoreProvider");
  return ctx;
}

/** Texto localizado a partir de un `LocalizedText`. */
export function useL() {
  const { locale } = useStore();
  return useCallback(
    (text: { es: string; en: string }) => text[locale] ?? text.es,
    [locale],
  );
}

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Portal del cliente — plantilla

Base de las demostraciones comerciales de Iuristech para despachos de abogados.
No es el portal de ningún despacho concreto: cada demostración se monta
partiendo de aquí. El portal es la primera de tres piezas del proyecto (portal
del cliente, agente conversacional, actualizaciones proactivas); aquí solo vive
el portal.

No hay backend: todo el estado es cliente y se guarda en `localStorage`.

## Comandos

```bash
npm run dev     # http://localhost:3000
npm run lint    # eslint (debe salir limpio)
npm run build   # comprueba tipos y prerender
```

## Qué es configuración y qué es escenario

Esta es la distinción que sostiene la plantilla; si se borra, la siguiente demo
vuelve a ser un buscar-y-reemplazar.

- **`src/config/` es lo que define al despacho**, y son tres ficheros:
  `identity.ts` (nombre, dirección, teléfonos, logotipo, clave de
  `localStorage`), `theme.css` (la paleta entera y la tipografía) y `areas.ts`
  (las áreas de práctica, con su color y su icono). **Fuera de ahí el código no
  sabe de qué despacho se trata.** Si aparece el nombre de un despacho en un
  componente, en un diccionario de `i18n.ts` o en una clase de CSS, está en el
  sitio equivocado: se trae a `config/`.
- **`src/lib/data.ts` y `src/lib/firm.ts` son el escenario**: la historia que se
  enseña —clientes, expedientes, actuaciones, facturas, equipo, accesos—. Se
  sustituye entero en cada despacho. Lo que trae la plantilla está completo y
  funcionando a propósito, para que sirva de referencia de hasta dónde llega
  cada pantalla.
- **`AreaId` se deriva de `config/areas.ts`**, no se escribe a mano: al añadir o
  quitar un área el compilador va señalando lo que falta (`AREA_PHASES`,
  `DOC_CHECKLISTS`, los expedientes). Por lo mismo, **ninguna pantalla puede
  nombrar un área literal**: el `defaultOpen` de las fases en
  `despacho/configuracion` abre la primera por índice, no «extranjería».
- **Cambiar el juego de áreas arrastra cuatro sitios, y el compilador los canta
  todos**: `AREA_PHASES` y `DOC_CHECKLISTS` en `lib/firm.ts` (son
  `Record<AreaId, …>`, así que falta una clave y es error), el `areas:` de cada
  persona de `TEAM`, y el `area:` de cada expediente de `lib/data.ts`. Lo único
  que el compilador no ve es si el escenario sigue teniendo sentido: cuando
  desaparece el área de un expediente hay que **reescribir el expediente**, no
  reetiquetarlo —sus fases, sus documentos y sus provisiones eran de ese
  derecho—. Por eso las áreas se cambian **antes** que el escenario.
- **El icono de un área es un dibujo con nombre propio** (`passport`, `scales`,
  `briefcase`…) en el catálogo de `components/icons.tsx`, elegido desde
  `config/areas.ts`. Añadir un área no obliga a tocar los iconos; añadir un
  dibujo nuevo, sí. El catálogo trae más dibujos que áreas usa el escenario, a
  propósito.
- **La clave de `localStorage` (`APP.storageKey`) tiene que ser distinta en cada
  despacho.** En producción cada demo vive en su dominio, pero en desarrollo
  todas corren en `localhost:3000`, que es el mismo origen: con la clave
  repetida, dos demostraciones se pisan la sesión y las publicaciones.

## Credenciales de la demo

Contraseña común: `demo1234`. La verificación en dos pasos no envía nada:
cualquier código vale. Los perfiles concretos los pone el escenario y se listan
en la pantalla de acceso; lo que cada escenario **debe** conservar son los tres
casos que ejercitan el producto:

- un cliente con **dos o más asuntos**, con documentos pendientes y al menos uno
  **rechazado** con su motivo, que además entre en inglés (`preferredLocale`);
- un cliente con **fechas próximas** señaladas;
- un cliente con **un solo asunto**, para que el portal salte el listado y abra
  su ficha directamente.

El momento clave de la demo: `/despacho` → **Publicar** → *Ver como lo ve el
cliente*. La actuación aparece al instante en el expediente y mueve su fecha de
última actualización.

## Arquitectura

- **Contenido bilingüe**: los datos de negocio llevan su propia traducción
  (`LocalizedText { es, en }`) y se leen con el hook `useL()`. El texto de
  interfaz vive en `src/lib/i18n.ts` como diccionarios planos de claves con
  punto; `TKey = keyof typeof es` obliga a que `en` esté completo, así que una
  clave sin traducir es un error de compilación.
- **Estado** (`src/lib/store.tsx`): almacén externo con `useSyncExternalStore`.
  El servidor siempre ve el estado vacío y el navegador lee `localStorage` en el
  primer `getSnapshot`, de modo que la hidratación nunca descuadra. `setState`
  persiste y notifica; no hay `setState` dentro de efectos.
- **Proyección** (`projectCases`): los datos de `src/lib/data.ts` son
  inmutables. Las mutaciones de la demo (actuaciones publicadas, documentos
  subidos) se superponen encima al calcular los expedientes. Por eso publicar
  desde la vista despacho se ve de inmediato en la del cliente.
- **Diseño**: Tailwind v4 con `@theme`, sin `tailwind.config.js`. La paleta vive
  en `src/config/theme.css` —que es lo que cambia por despacho— y
  `src/app/globals.css` se queda con lo que no cambia: los utilitarios `ui-*`,
  escritos siempre contra los tokens y nunca contra un color literal. Los
  nombres son neutros (`accent`, `ink`, `line`, `surface`, `info`) por lo mismo
  que el resto: un prefijo de marca en cada `className` es marca filtrándose en
  el producto. El color de cada área no está en el tema sino en
  `src/config/areas.ts`, porque son familias distintas y no variantes del
  acento.
  - Dos restricciones que el diseño da por supuestas al cambiar la paleta:
    `--color-accent` se usa **de fondo con texto negro encima**, así que tiene
    que ser claro; y por eso mismo **no vale para texto sobre blanco**, donde no
    llega al contraste mínimo (para rotular estados está la tinta oscura de
    `src/lib/states.ts`).
  - La tipografía es la única pieza del tema que **no** puede vivir en
    `theme.css`: `next/font/google` necesita un import estático. Cambiarla son
    dos ediciones que van juntas, el import de `src/app/layout.tsx` y
    `--font-sans`.
- `PortalShell` hace de guardia de sesión, cabecera, navegación y onboarding.
  Las páginas del portal se envuelven en él; `/acceso`, `/verificacion`,
  `/recuperar` y `/despacho` no.
- **La ficha del expediente tiene dos niveles.** `asuntos/[caseId]/layout.tsx`
  es el marco —volver, cabecera, **Resumen** y las pestañas— y cada pestaña es
  una ruta de verdad: `page.tsx` (Historial), `documentos/` y `fechas/`. El
  Resumen queda **fuera** de las pestañas a propósito: es lo que el cliente
  viene a ver y nunca debe costar un clic. Las pestañas son `<Link>`, no
  `role="tab"`, para que cada sección tenga URL y sitio en el historial del
  navegador; el subrayado toma el color del área para no confundirse con la
  navegación principal, que es dorada. Historial es la pestaña por defecto
  porque es donde aterriza *Ver como lo ve el cliente*. Los helpers comunes
  (`useCase`, `DownloadButton`, `DocumentRow`) viven en `shared.tsx`.
  Consecuencia: **no enlazar con anclas** (`#documentos`, `#fechas`) desde
  ningún sitio; se enlaza a la ruta.

## La vista despacho (`/despacho`)

Pantalla interna: decide **qué ve el cliente** y gestiona **lo que el cliente
envía**. No es un gestor de expedientes ni un programa de facturación, y no
debe convertirse en uno.

- **Nueve secciones, una ruta cada una**, con `layout.tsx` de marco: `page.tsx`
  (Hoy), `actualizaciones/`, `documentos/`, `mensajes/`, `clientes/`,
  `economico/`, `configuracion/`, `equipo/`, `actividad/`. El menú lateral es
  fijo en `lg`; por debajo se convierte en una **tira horizontal con scroll**
  (`nav` con `overflow-x-auto`), no en un desplegable. Los elementos son
  `shrink-0`, así que la tira mide más que la ventana **a propósito**: al medir
  desbordes, lo que tiene que dar 375 es `documentElement.scrollWidth`.
- **El menú es solo icono y nombre**, por decisión del despacho: ni contadores
  ni distintivo de vista previa. No volver a añadirlos. Las cifras de trabajo
  pendiente viven donde se decide —la pantalla de Hoy—, que es la única que las
  necesita. El ancho (`lg:w-[15rem]`) lo fija la entrada más larga, «Clientes y
  accesos», que tiene que caber en una línea.
- **`useFirmData()` (`despacho/shared.tsx`) es la única fuente de los
  contadores.** La barra y el panel de Hoy —vía `useBoard`— y las listas de
  cada sección salen todos de ahí, para que no puedan desincronizarse. Si haces
  que una sección cuente algo, cuéntalo en `useFirmData`, no en la página.
- **Cuatro mutaciones son exclusivas del despacho** y viven en el store junto a
  las del cliente: `discardAction`, `editAction`, `decideDoc` y
  `requestDocuments`. Se superponen sobre los datos inmutables igual que
  `publishAction`, de modo que publicar o pedir un documento se ve al instante
  en el portal del cliente.
- **`src/lib/firm.ts`** guarda lo que solo existe en esta vista: `TEAM`,
  `CLIENT_ACCESS`, `ACTION_TEMPLATES`, `AREA_PHASES`, `DOC_CHECKLISTS`
  (al menos un área debe traer su lista precargada), `REJECTION_REASONS`,
  `FIRM_SETTINGS`, `QUICK_REPLIES` y `ACTIVITY_LOG`. Ojo: `FIRM_SETTINGS` es
  `as const`, así que `useState(FIRM_SETTINGS.responseDays)` infiere el tipo
  literal — hay que escribir `useState<number>(...)`.
- **El escenario tiene que traer una factura vencida** (`inv-5` en el que viene
  de fábrica). Es el impagado que **encabeza** el panel de pendientes de Hoy,
  por delante de todo lo demás: sin él, la pantalla clave de la vista despacho
  se enseña vacía de urgencia. Conviene además que el rojo no dependa solo de
  esa factura —en el escenario de fábrica hay también un mensaje fuera de plazo
  en otro expediente—, para que el escalón «atrasados» sobreviva a que se toque
  una fecha.
- **Mensajes, Económico, Equipo y Actividad son maquetas** y lo dicen con el
  distintivo `PreviewTag` en su cabecera —solo ahí; ni en el menú, ni con la
  frase que lo explicaba, retirada a petición del cliente—. Nada de lo que se
  toca ahí sale de la pantalla. En particular Mensajes **no** es un chat: la
  restricción de «nada de chat en tiempo real» sigue en pie.
- **Paginar a partir de 8**, nunca scroll infinito: `usePaged` en `shared.tsx`.
- El botón **Restablecer la demostración**, la advertencia de que esto es una
  pantalla interna y el enlace de vuelta al portal del cliente son requisitos
  del encargo y están siempre visibles en `despacho/layout.tsx`. Lo que
  advierte ahora es el rótulo **«Vista despacho»** (`nav.firmView`) de la
  cabecera fija: el párrafo que lo explicaba al pie del menú se retiró a
  petición del cliente, igual que pasó con la frase de `PreviewTag`. El
  requisito se mantiene; lo que cambió es que se cumple con un rótulo en vez
  de con un párrafo. No volver a añadir el párrafo.
- **La pantalla de Hoy abre con una línea de saludo**: saludo y fecha. El
  saludo se elige por la hora **real** de quien enseña la demostración
  (`greetingKey()`), pero la fecha es la del escenario (`TODAY`), para que no
  discuta con los «hace N días» de las listas. Leer el reloj durante el render
  solo es seguro porque `despacho/layout.tsx` no monta a sus hijos hasta que el
  almacén está hidratado; si algún día se quita esa guarda, el cálculo tiene
  que irse a un efecto. El número de asuntos activos **no** va aquí: lo abre la
  línea de estado, que es donde se compara con los pendientes.
- **Hoy es un tablero, no un resumen.** Debajo del saludo van el selector de
  alcance, la **línea de estado** y dos columnas: el tablero de expedientes a
  la izquierda (`lg:col-span-2`) y el panel **Pendiente** a la derecha.
  Sustituyó a las cinco tarjetas de cifras, que decían *cuánto* trabajo había
  pero no *cuál*; el encargo pedía una pantalla llena de información y corta de
  texto, así que **no hay párrafos explicativos** en ella. Las cuatro claves de
  i18n de aquellas tarjetas (`firm.cardDrafts`, `cardDocs`, `cardMessages`,
  `cardOverdue`) se borraron de los dos diccionarios.
- **En esta pantalla el color significa una sola cosa: urgencia.** Es la regla
  que manda sobre las demás. Llegó a haber tres sistemas de color a la vez —el
  área en el filo de la fila, el área otra vez en la barra de fases y los
  puntos de estado—, y el resultado es que el granate de penal se leía como una
  alerta en un expediente que iba perfectamente. Por eso:
  - El **área no pinta** nada. Va en texto gris junto al asunto, y su barra de
    fases usa `PhaseBarMini` con `tone="mute"` (gris oscuro lo completado, gris
    claro lo pendiente). El `tone` es un añadido opcional: el listado del
    **cliente** sigue en color de área y no debe tocarse.
  - Solo pintan **dos** estados, en el filo de la fila y en su rótulo: rojo
    (algo vencido o fuera de plazo) y ámbar (trabajo esperando). «Al día» es la
    **ausencia** de color, no un verde; con verde las filas volvían a ser un
    semáforo y había que descartar color para encontrar lo urgente.
  - El filo mide 3 px **siempre**, también en las filas sin color, o el texto
    de unas y otras no alinearía.
  - El rótulo no usa el acento de marca sino la tinta oscura de `STATES`:
    el acento es claro por obligación —se usa de fondo con texto negro— y sobre
    blanco no llega al contraste mínimo para texto.
- **La barra segmentada de bloques de color se sustituyó por una línea de
  texto** («5 asuntos activos · 3 con algo pendiente · 1 atrasado»), con el
  número de atrasados en rojo y nada más en color. La barra daba la proporción,
  pero gastaba una franja entera de verde, ámbar y rojo para decir tres
  números, y ese rojo pesaba más que el de las filas realmente atrasadas. Si no
  hay nada pendiente ni atrasado, la frase termina en «Todo al día».
- **Las filas dicen en palabras lo que tienen pendiente** —«1 borrador · 1
  documento»—, no con puntos de color. Un punto obliga a recordar qué significa
  cada color y su `title` solo aparece al pasar el ratón, así que de un vistazo
  no decía nada. Con más de dos tipos la enumeración no cabe y se resume en el
  total («4 pendientes»). Se borraron las claves `firm.dotPending`, `dotDoc` y
  `dotLate`, y también `firm.stateOk`, que se quedó sin uso al caer la barra.
- **`useBoard(scope)` (`despacho/shared.tsx`) deriva el tablero entero de una
  sola clasificación.** De ahí salen las filas, la cola de pendientes y los
  tres contadores, así que la línea de estado y los rótulos de cada fila no
  pueden contradecirse. Rojo (`late`) es **haber rebasado** algo —dinero
  vencido, un mensaje fuera del plazo prometido o un expediente parado—; ámbar
  (`pending`) es tener trabajo esperando pero dentro de tiempo. Cuenta sobre
  `useFirmData`, cumpliendo la regla de que los contadores no viven en la
  página. Devuelve las filas **ya ordenadas** por urgencia (atrasados,
  pendientes, al día; a igualdad, la actuación más antigua primero): el tablero
  pagina de ocho en ocho, y un atrasado en la segunda página es un atrasado que
  nadie mira. La página solo marca dónde empieza el bloque «al día» para
  separarlo con una línea fina.
- **El panel Pendiente se agrupa por verbo**: Cobrar, Responder, Revisar y
  Publicar, sin iconos y con un único estilo de botón salvo «Publicar», que es
  la única acción que se ejecuta sin salir de la pantalla. El orden de los
  grupos **no** está codificado: `groupQueue` recorre la cola —que ya viene
  ordenada por `rank`— y se apoya en que un `Map` conserva el orden de
  inserción, así que cada grupo cae donde lo puso su miembro más urgente. Un
  expediente parado va en «Publicar», porque lo que le falta es justamente que
  el despacho publique algo.
- **`CURRENT_USER_ID` se elige por lo que hace, no por azar.** El filtro «Solo
  lo mío» tiene que poder enseñar el estado vacío del panel derecho, así que
  tiene que apuntar a la persona cuyo tablero filtrado deja **un solo
  pendiente**: se publica y el panel pasa a «Todo al día» con sus dos accesos
  rápidos. Con cualquier otra haría falta ir tachando trabajo de todo el
  despacho para llegar ahí. Al cambiar de escenario hay que volver a elegirlo.
- **`firmScope` vive en el store, no en la página.** Si fuera `useState`
  local, «Restablecer la demostración» devolvería los datos pero dejaría la
  pantalla filtrada, y la siguiente demostración arrancaría torcida.
- **Las dos columnas necesitan `min-w-0`.** Una celda de rejilla no baja por
  defecto del ancho mínimo de su contenido, y aquí dentro hay texto con
  `truncate`. Sin eso, las frases largas de la cola empujan la página a lo
  ancho en móvil en vez de recortarse: `documentElement.scrollWidth` se iba a
  725 sobre un viewport de 375.
- **El botón del interruptor (`Toggle`) necesita `left-0`.** La bolita es
  `absolute`; sin origen horizontal arranca de su posición estática, que en un
  `button` (con `text-align: center` del navegador) son los 18 px del centro de
  la pista, y el `translate` se suma encima: el interruptor apagado parecía
  encendido. No quitar ese `left-0`.

## Restricciones del producto (no romper)

Esta lista salió de lo que el primer despacho pidió de forma explícita que el
portal **no** hiciera, y se ha quedado como criterio del producto: son las
decisiones que lo distinguen de un gestor de expedientes. La mayoría siguen
enunciadas en pantalla; donde el texto se retiró a petición del cliente, la
restricción se mantiene igualmente en el producto. Repásala con cada despacho
nuevo antes de aceptar una petición que la rompa:

- La puerta de entrada son los **expedientes**, nunca las áreas de práctica.
- Nada de chat en tiempo real, consultas jurídicas automáticas, valoraciones
  del tipo «vamos bien» ni predicciones de resultado. Los avisos que lo decían
  en Mensajes se retiraron a petición del cliente; la funcionalidad sigue sin
  existir y **no debe añadirse**.
- **Ningún control de plazos procesales.** Las fechas son las que comunica el
  despacho, y así se dice en pantalla (`case.datesDisclaimer`).
- Las estimaciones solo aparecen cuando vienen de la Administración y siempre
  etiquetadas como orientativas (`case.estimateDisclaimer`).
- Las **caducidades** son documentos del cliente (TIE, pasaporte, permisos),
  las introduce el despacho y el aviso es orientativo
  (`case.expiriesDisclaimer`). Nunca plazos procesales. La subida con cámara
  queda para la versión móvil.
- Sin firma de poderes ni apud acta, sin buscador de jurisprudencia, sin botón
  de pago real y sin nada que parezca un gestor de expedientes.
- Sin sellos ni certificaciones que el despacho no tiene («100 % RGPD», ISO).
- **Ningún nombre real de cliente.** Todos los datos son ficticios. La banda
  negra que lo advertía en todas las pantallas se retiró a petición del
  cliente; el aviso vive ahora solo en los perfiles de demostración de
  `/acceso` y en la vista despacho. Los datos deben seguir siendo inventados.
- Los textos de privacidad se presentan como ilustrativos y pendientes de
  revisión del despacho. Privacidad no está en la navegación: se llega desde
  el pie y el texto aparece plegado.

## Rigor jurídico del contenido de demostración

Los datos son ficticios, pero el derecho que citan tiene que ser correcto:
quien ve la demo es un despacho, y un error de bulto se detecta en el primer
minuto. Esto vale para cualquier escenario que se escriba, no solo para el que
viene de fábrica. Puntos ya revisados que no conviene deshacer:

- **Comprobar la vigencia de lo que se cite antes de escribirlo.** El escenario
  de fábrica lleva una residencia de inversor **por capital** (Ley 14/2013)
  justamente porque la vía inmobiliaria —la «Golden Visa» coloquial— quedó
  **derogada por la LO 1/2025**, en vigor desde el 3 de abril de 2025. No
  titular ese asunto como Golden Visa ni acreditar la inversión con una nota
  simple.
- `administrativeEstimate` solo admite plazos **estimados** de resolución. Los
  plazos preclusivos (art. 68 LPAC y similares) no van ahí: se cuentan como
  tarea del despacho en `whatComesNext`, nunca como cuenta atrás para el
  cliente. Es la misma restricción de «ningún control de plazos procesales».
- `kind: "procedimiento"` es solo para lo que ocurre ante juzgado,
  Administración o notaría. Un contrato privado (p. ej. las arras) es
  `"despacho"`.
- Los honorarios se muestran **con IVA incluido** (arts. 20 y 60 RDL 1/2007) y
  los impuestos del asunto (ITP, tasas) viven en provisiones de fondos, no
  mezclados con las facturas de honorarios.
- En «Área económica», honorarios y provisiones son **dos bloques con dos
  totales distintos**. No volver a sumarlos en un único «total pendiente»:
  hacía parecer que el cliente debe al despacho también el dinero de impuestos
  y de terceros. El total conjunto solo vive al pie, en secundario. Cada
  provisión declara su `payee` —quién cobra de verdad—, que es justo lo que la
  distingue de una factura de honorarios.
- **El área económica tiene dos niveles**, igual que la ficha del expediente.
  `economico/layout.tsx` es el marco: las **dos cifras** —honorarios y
  provisiones, en verde cuando no hay nada— y las pestañas. El detalle son
  rutas: `page.tsx` (Facturas), `provisiones/` y `encargo/`. Antes la pantalla
  decía las cosas dos veces —los pendientes arriba y otra vez en las listas de
  abajo—; ahora el resumen solo da cifras y el detalle vive una sola vez, en su
  pestaña. Todo sale de `useBilling()` en `economico/shared.tsx`, para que el
  total de arriba y la lista de abajo no puedan desincronizarse. Las facturas
  **ya no son una tabla**: la de siete columnas obligaba a arrastrar en
  horizontal. Alcance y forma de pago van plegados en un `Disclosure`.
- `formatCurrency` usa `useGrouping: "always"`. En `es-ES` el `auto` por defecto
  escribe «1200 €» sin punto de millar —correcto ortográficamente— pero
  descuadraba al lado de «25.500 €» en las dos cifras grandes del resumen.

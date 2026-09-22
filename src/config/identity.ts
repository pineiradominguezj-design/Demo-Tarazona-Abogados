/**
 * IDENTIDAD DEL DESPACHO
 *
 * Este es el primero de los tres ficheros que hay que tocar para montar un
 * despacho nuevo. Los otros dos son `src/config/areas.ts` (las áreas de
 * práctica) y `src/config/theme.css` (la paleta y la tipografía).
 *
 * Fuera de estos tres, el código no sabe de qué despacho se trata. Si algún
 * día tienes que buscar y reemplazar un nombre por el árbol, es que algo se
 * ha escrito donde no debía: tráelo aquí.
 *
 * El escenario de demostración —clientes, expedientes, facturas— vive aparte,
 * en `src/lib/data.ts` y `src/lib/firm.ts`.
 */

export const FIRM = {
  name: "Tarazona Abogados",
  address: "Avenida del Oeste 35, 8ª · 46001 València",
  phone: "+34 654 98 97 73",
  altPhone: "+34 678 70 07 11",
  email: "tarazonabogados@gmail.com",
  website: "tarazonaabogadoslegal.com",
} as const;
/*
 * Lo que el despacho promete y cómo trabaja —días de respuesta, teléfono de
 * urgencias, idiomas, qué se publica sin aprobación— no está aquí sino en
 * `FIRM_SETTINGS` (`src/lib/firm.ts`), junto al resto de lo que solo existe en
 * la vista despacho. Aquí solo va la tarjeta de visita.
 */

export const BRAND = {
  /**
   * Ruta del logotipo dentro de `public/`, o `null`.
   *
   * Con `null` la marca se compone con el propio nombre del despacho en la
   * tipografía de titulares, que es lo que trae la plantilla: así no arrastra
   * el logotipo de nadie y sigue viéndose presentable mientras no haya uno.
   * Al poner un PNG hay que declarar sus medidas reales o `next/image`
   * deformará la imagen.
   */
  logo: "/logo.png" as string | null,
  logoWidth: 800,
  logoHeight: 209,

  /**
   * Marca reducida para espacios cuadrados. Si lleva un `&`, se pinta en el
   * color de acento y el resto en blanco; si no, va todo en blanco.
   */
  monogram: "TA",
} as const;

export const APP = {
  /**
   * Clave de `localStorage`.
   *
   * TIENE QUE SER DISTINTA EN CADA DESPACHO. En producción cada demostración
   * vive en su dominio y no habría problema, pero en desarrollo todas corren
   * en `localhost:3000`, que es el mismo origen: con la clave repetida, dos
   * demostraciones se pisan la sesión y las publicaciones.
   */
  storageKey: "portal-demo-tarazona-v1",

  metaTitle: `Portal del cliente · ${FIRM.name}`,
  metaDescription:
    "Demostración del portal del cliente: estado de tus asuntos, documentos y comunicaciones con el despacho.",
} as const;

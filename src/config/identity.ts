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
  name: "Despacho Modelo",
  address: "Calle de Ejemplo, 1 · 00000 Ciudad",
  phone: "+34 000 00 00 00",
  altPhone: "+34 000 00 00 01",
  email: "contacto@ejemplo.es",
  website: "ejemplo.es",
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
  logo: null as string | null,
  logoWidth: 847,
  logoHeight: 312,

  /**
   * Marca reducida para espacios cuadrados. Si lleva un `&`, se pinta en el
   * color de acento y el resto en blanco; si no, va todo en blanco.
   */
  monogram: "DM",
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
  storageKey: "portal-demo-modelo-v1",

  metaTitle: `Portal del cliente · ${FIRM.name}`,
  metaDescription:
    "Demostración del portal del cliente: estado de tus asuntos, documentos y comunicaciones con el despacho.",
} as const;

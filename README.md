# Portal del cliente — plantilla

Base de las demostraciones comerciales de Iuristech: un portal del cliente para
despachos de abogados. No es el portal de ningún despacho en concreto; cada
demostración se monta partiendo de aquí y cambiando la configuración.

Todos los datos son ficticios y no hay backend: el estado vive en el navegador
(`localStorage`) y se reinicia desde la vista del despacho.

## Arrancar

```bash
npm install
npm run dev     # http://localhost:3000
```

## Montar un despacho nuevo

Son tres ficheros de configuración, y ninguno más:

| Fichero | Qué contiene |
| --- | --- |
| `src/config/identity.ts` | Nombre, dirección, teléfonos, logotipo y la clave de `localStorage` |
| `src/config/theme.css` | La paleta entera y la variable de tipografía |
| `src/config/areas.ts` | Las áreas de práctica, con su color y su icono |

Fuera de esos tres, el código no sabe de qué despacho se trata. Si te ves
buscando y reemplazando un nombre por el árbol, es que algo se ha escrito donde
no debía.

Dos avisos que ahorran un rato:

- **La clave de `localStorage` tiene que ser distinta en cada despacho.** En
  producción cada demo vive en su dominio, pero en desarrollo todas corren en
  `localhost:3000`, que es el mismo origen: con la clave repetida, dos
  demostraciones se pisan la sesión.
- **La tipografía se cambia en dos sitios a la vez**, porque
  `next/font/google` necesita un import estático: el import de
  `src/app/layout.tsx` y `--font-sans` en `src/config/theme.css`.

Añadir o quitar un área en `config/areas.ts` es seguro: `AreaId` se deriva de
esa lista, así que el compilador va señalando todo lo que queda por rellenar
(las fases, las listas de documentos, los expedientes del escenario).

## El escenario de demostración

Aparte de la configuración, cada demo tiene su historia: clientes, expedientes,
actuaciones y facturas en `src/lib/data.ts`, y lo que solo existe en la vista
despacho (equipo, accesos, plantillas, ajustes) en `src/lib/firm.ts`.

La plantilla viene con un escenario completo y funcionando, que sirve de
referencia de hasta dónde llega cada pantalla. Está pensado para sustituirse,
no para conservarse.

Las credenciales son las mismas en cualquier escenario: contraseña `demo1234`
para todos los perfiles, y la verificación en dos pasos no envía ningún código
—vale cualquiera—. Los perfiles se listan en la propia pantalla de acceso.

## Guion de demostración (10 minutos)

1. **Acceso** — `/acceso`. Marca del despacho, selector de idioma ya en la
   pantalla de entrada, contraseña y verificación en dos pasos. Dentro, la
   cabecera muestra el último acceso.
2. **Mis asuntos** — la puerta de entrada son los expedientes, nunca las áreas.
   Cada tarjeta lleva su área en color, la fase actual, la fecha de última
   actualización y el aviso de si hay algo pendiente. Arriba, el bloque de
   avisos: documentos que faltan, mensajes nuevos y próximas fechas.
3. **Ficha del expediente** — barra de fases, «qué está pasando» y «qué viene
   ahora» en lenguaje claro, «¿Necesitamos algo de ti?», historial de
   actuaciones de solo lectura con el detalle formal desplegable, documentos
   (del despacho, pedidos al cliente con su estado, y ya enviados) y próximas
   fechas con el aviso de que las comunica el despacho.
4. **El momento clave** — abre `/despacho` en otra pestaña, pulsa **Publicar**
   en un borrador y luego *Ver como lo ve el cliente*. La actuación aparece al
   instante en el expediente y mueve su fecha de última actualización.
5. **Mensajes, económico, perfil y privacidad** — mensajería por expediente (no
   es un chat), hoja de encargo aceptada, facturas y provisiones sin botón de
   pago real, personas autorizadas con su alcance e historial de accesos.
6. **Bilingüe** — cambia a inglés en cualquier pantalla: traduce la interfaz y
   también el contenido de los expedientes.

## Qué queda fuera, a propósito

El portal **no** hace ciertas cosas, y no es un descuido. Están resueltas con
avisos visibles en pantalla, no con omisiones silenciosas: nada de control de
plazos procesales, valoraciones del tipo «vamos bien» o predicciones de
resultado, chat en tiempo real, consultas jurídicas automáticas, firma de
poderes, buscador de jurisprudencia, sellos o certificaciones que el despacho
no tiene, ni nombres reales de clientes. Las caducidades que se muestran son
documentos del cliente (TIE, pasaporte, permisos), las introduce el despacho y
el aviso es orientativo.

Esta lista sale de lo que pidió el primer despacho, pero se ha quedado como
criterio del producto: son las decisiones que hacen que el portal se distinga
de un gestor de expedientes. Conviene repasarla con cada despacho nuevo antes
de aceptar una petición que la rompa.

El detalle técnico y las restricciones completas están en `AGENTS.md`.

# NICO Automotores — sitio web

Concesionaria de autos usados y 0 km en Santo Tomé, Santa Fe.
Next.js 15 (App Router) + Tailwind. **Funciona sin base de datos**: el stock vive
en un archivo local, así que arranca sin configurar nada.

## Puesta en marcha

```bash
npm install
npm run dev
```

Abrí http://localhost:3000. No hace falta ninguna variable de entorno.

## Cargar / editar autos

Todo el stock está en un solo archivo:

- `lib/data/vehicles.ts` — agregá, editá o sacá autos del array `SEEDS`.
  Cada auto tiene marca, modelo, versión, año, km, combustible, transmisión,
  precio, moneda, equipamiento, etc.

Las **fotos** son de referencia (SVG en `public/vehiculos/`). Para poner las reales:

1. Subí las fotos del auto a `public/vehiculos/` (o usá una URL).
2. En `lib/data/vehicles.ts`, cambiá las rutas de `images` del auto a tus fotos.
3. Si usás fotos reales y querés optimización, en `next.config.mjs` sacá
   `images.unoptimized` y agregá el `remotePatterns` del host de tus imágenes.

## Branding

- Logo: `public/logo-nico.svg` (fondo claro) y `public/logo-nico-cream.svg`
  (fondo oscuro). Reemplazalos por el logo oficial manteniendo esos nombres.
- Colores: paleta azul/oscuro en `tailwind.config.ts` (`primary`) y en
  `app/globals.css`.
- WhatsApp y datos de contacto: `lib/whatsapp.ts` (número por defecto) y los
  textos en `components/layout/SiteFooter.tsx` / `ContactSection.tsx`.

## Mapa del sitio

| Ruta | Qué hace |
|---|---|
| `/` | Home con buscador, destacados y CTA de "vendé tu auto" |
| `/vehiculos` | Listado con filtros por URL (marca, carrocería, precio, año, km…) |
| `/vehiculos/[slug]` | Ficha con galería, ficha técnica, precio y WhatsApp |
| `/vende-tu-auto` | Compra / permuta / consignación |
| `/nosotros`, `/contacto`, `/favoritos`, `/politica-de-privacidad` | Institucionales |

## Formulario de contacto

`lib/contact-actions.ts` valida la consulta y la registra en el log del servidor.
Para que los leads lleguen a algún lado, conectá ahí tu CRM, un Google Sheet,
un email o una base de datos.

## Tracking (opcional)

El Pixel de Meta y Google Analytics están listos pero apagados. Se activan
cargando `NEXT_PUBLIC_META_PIXEL_ID` / `NEXT_PUBLIC_GA_ID` (y, para el CAPI,
un endpoint propio en `/api/meta-capi`).

## Deploy en Vercel

1. Importar el repo, framework Next.js. No requiere variables de entorno.
2. (Opcional) cargar `NEXT_PUBLIC_SITE_URL` con el dominio final para el sitemap
   y los metadatos, y las de tracking si las vas a usar.

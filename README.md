# Axis IA — Landing de Auditoría

Landing page para la auditoría gratuita de Axis IA. Sitio estático de una
sola página, sin build step ni dependencias — se despliega tal cual en
Vercel.

## Estructura

- `index.html` — la landing (auditoría general, ruta `/`)
- Próxima landing (inmobiliarias) irá en `/inmobiliarias/index.html`

## Antes de desplegar

Reemplazar el número de WhatsApp placeholder `584120000000` en `index.html`
(aparece 2 veces) por el número real con código de país, sin `+` ni espacios.

## Deploy

```bash
vercel --prod
```

## Dominio

Pensado para conectarse a `axisai.space` en Vercel (Settings → Domains).

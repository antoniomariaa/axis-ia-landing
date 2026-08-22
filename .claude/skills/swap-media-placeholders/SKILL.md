---
name: swap-media-placeholders
description: Reemplaza el mockup CSS del video (.video-placeholder) por el video real, y/o los mockups .report-card de "Cómo se ve en la práctica" por capturas reales, en inmobiliarias/index.html. Úsala cuando el usuario diga "ya tengo el demo.mp4", "sube las capturas reales", "reemplaza el placeholder del video", o equivalente.
---

# Swap media placeholders

## When to use

Cuando llegan los archivos reales que `inmobiliarias/assets/README.md` documenta como pendientes:
`demo.mp4`, `poster.jpg`, o cualquiera de las 4 capturas de "Cómo se ve en la práctica"
(`screenshot-calificacion.jpg`, `screenshot-busqueda.jpg`, `screenshot-reparto.jpg`,
`screenshot-panel.jpg`).

## Steps

1. Confirma que el archivo nuevo ya está en `inmobiliarias/assets/` con **exactamente** el nombre
   que documenta `inmobiliarias/assets/README.md` — no lo renombres tú, ni renombres el README para
   que calce con el archivo.
2. **Si es el video/poster:** en `inmobiliarias/index.html`, dentro de `.video-frame`, borra el
   `<div class="video-placeholder">` completo (el bloque marcado con el comentario `<!--
   PLACEHOLDER: eliminar este bloque completo... -->`) y su regla CSS `.video-placeholder` (y las
   reglas `.vp-*` que dependen de ella, si no se usan en ningún otro lado del archivo). Deja el
   `<video>` tal cual — ya apunta a `assets/demo.mp4` y `assets/poster.jpg`, así que no necesita
   ningún cambio de atributos.
3. **Si es una captura de "Cómo se ve en la práctica":** dentro del `.practica-item`
   correspondiente (identificado por el `rc-title` que documenta la tabla del README), reemplaza el
   `<div class="report-card">...</div>` completo por `<img src="assets/<archivo>.jpg"
   alt="<descripción corta del mockup que reemplaza, en español>" loading="lazy">`. Mantén el
   `<div class="practica-item">` exterior y el `<p class="practica-caption">` tal cual — no los
   toques.
4. No agregues JavaScript en ningún paso — el swap es puramente HTML/CSS.

## Verify

```bash
# Para el video/poster:
! grep -q 'class="video-placeholder"' inmobiliarias/index.html   # expect: exit 0 — el placeholder ya no está
grep -q 'src="assets/demo.mp4"' inmobiliarias/index.html         # expect: exit 0 — el <video> sigue intacto

# Para una captura (ejemplo: la de "Calificando un lead"):
grep -q 'assets/screenshot-calificacion.jpg' inmobiliarias/index.html   # expect: exit 0
test "$(grep -c 'class="practica-item"' inmobiliarias/index.html)" = "4"   # expect: exit 0 — la grilla sigue teniendo 4 items
```

## Do not

- No cambies el número de columnas ni el `gap` de `.practica-grid` para "que la imagen real se vea
  mejor" — si el recorte no calza, ajusta la imagen fuente, no la grilla (ver Riesgo #3 del
  blueprint original: `.practica-item` se diseñó a propósito sin una relación de aspecto forzada
  para que este swap no requiera tocar CSS).
- No borres `inmobiliarias/assets/README.md` — sigue documentando la convención de nombres para
  cualquier archivo que todavía falte.
- No agregues un atributo `poster` distinto ni cambies `assets/poster.jpg` por otro nombre — si el
  archivo real tiene otro nombre, renómbralo a `poster.jpg`, no al revés.

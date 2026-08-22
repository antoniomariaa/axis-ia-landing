---
paths:
  - "inmobiliarias/**"
---

# Convenciones de la landing /inmobiliarias

- Todo vive inline dentro de `inmobiliarias/index.html` — un único `<style>`, SVGs inline, sin JS
  externo. Nunca crees un `.css` o `.js` separado.
- Todo `src`/`poster` que apunte a un archivo de `inmobiliarias/assets/` es una ruta **relativa a
  `inmobiliarias/index.html`** (`assets/demo.mp4`, `assets/poster.jpg`) — nunca con el prefijo
  `inmobiliarias/`.
- El número de WhatsApp es siempre `584121484033`. El mensaje pre-rellenado es siempre `Hola,
  quiero ver el agente de WhatsApp para mi inmobiliaria`, codificado como
  `Hola%2C%20quiero%20ver%20el%20agente%20de%20WhatsApp%20para%20mi%20inmobiliaria` en la URL de
  `wa.me`. Los 3 CTAs (nav, hero, CTA final) usan exactamente el mismo enlace.
- Los tokens de diseño (`--bg`, `--surface-1`, `--teal`, `--teal-light`, `--amber`, `--ink`,
  `--ink-soft`, etc.) se copian verbatim del `:root` de `index.html` (raíz) — nunca se aproximan ni
  se inventan valores nuevos de la misma paleta.
- El componente `.report-card`/`.rc-*` es el lenguaje visual para cualquier mockup de UI de
  producto en esta landing — se reutiliza, no se reinventa.
- Los mockups de producto usan etiquetas cualitativas en los badges ("Presupuesto capturado"),
  nunca cifras — no hay datos reales de cliente que las respalden.
- Esta landing no enlaza a `index.html` (raíz), ni a ninguna otra página fuera de
  `inmobiliarias/index.html` y sus propios anchors internos (`#contenido-principal`, `#contacto`).
- Los assets reales (`assets/demo.mp4`, `assets/poster.jpg`, capturas de pantalla) llegan después
  de este build — ver `inmobiliarias/assets/README.md` para las rutas y nombres exactos esperados.
  No inventes otros nombres de archivo.

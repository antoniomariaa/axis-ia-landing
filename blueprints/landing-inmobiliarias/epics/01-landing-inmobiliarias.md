# Epic 01: Landing Inmobiliarias

> Al terminar este epic existe `inmobiliarias/index.html` — una landing completa, autocontenida y
> ya verificada, dirigida a dueños/gerentes de agencias inmobiliarias, sin tocar `index.html`
> (raíz).

| | |
|---|---|
| **Epic id** | `01-landing-inmobiliarias` |
| **Tasks** | `E1-T1` … `E1-T5` |
| **Depends on** | nothing — start here |
| **Unlocks** | nada — es el único epic de este blueprint |
| **Parallel with** | nada — los 5 tasks editan el mismo archivo (`inmobiliarias/index.html`), así que corren en serie, en este orden |

You do not need any other file to complete this epic. Everything below is repeated here on
purpose.

---

## Stack

HTML5 + CSS3 planos, un solo archivo autocontenido · sin framework · sin gestor de paquetes · sin
build step · Vercel (hosting estático, proyecto ya existente).

No hay `package.json`, no hay lockfile, no hay `.nvmrc` — no existe ningún runtime que pinear más
allá de un navegador y, para verificar localmente, Node (vía `npx http-server`, sin instalación persistente).

| Task | Command |
|---|---|
| Servir localmente | `npx --yes http-server . -p 8080` — abre `http://localhost:8080/inmobiliarias/` |
| Verificar contenido | `grep -q '<patrón>' inmobiliarias/index.html` |
| Verificar ruta | `curl -s -o /dev/null -w '%{http_code}' http://localhost:8080/inmobiliarias/` |
| Confirmar landing 1 intacta | `git diff --stat -- index.html` (debe no mostrar salida) |

**Gate:** cada `Verify` de cada task de este epic debe salir con código 0, en orden, antes de
marcar el task como `done`. No hay `typecheck`/`lint`/`test` de framework — no aplica en este
proyecto.

Ningún task de este epic verifica contra un servicio con estado. El único "servicio" es el
servidor HTTP efímero que `E1-T5` levanta y apaga dentro de su propio comando `Verify` — no hay
nada que arrancar de antemano.

## Directory subtree

Solo la parte que este epic toca:

```
axis-ia-landing/
  index.html              # EXISTE — landing 1. Solo lectura para este epic. NUNCA se edita.
  inmobiliarias/
    index.html             # NUEVO — creado en E1-T1, editado en E1-T2, E1-T3, E1-T4
    assets/
      README.md            # NUEVO — creado en E1-T1, documenta assets pendientes (video/capturas reales)
```

Todo lo fuera de este subárbol está fuera de alcance. Si un task pareciera requerir editar un
archivo no listado aquí (empezando por `index.html` de la raíz), detente y repórtalo — significa
que el límite del epic está mal.

## Data model touched here

NOT APPLICABLE — no hay entidades de datos en este proyecto.

## Contracts

**Consumed** — ya existe, no se reconstruye:

| From | Interface | Guarantee |
|---|---|---|
| `index.html` (raíz) | Sistema de diseño en `:root` (tokens de color, tipografía, breakpoints), patrón de `.report-card`/`.rc-*`, patrón de `.btn-primary`, patrón de nav/footer | Estos valores y patrones se copian verbatim — no se reinterpretan ni se aproximan |

**Produced** — no hay epics posteriores que dependan de esto (es el único epic), pero el producto
final expone:

| Export | Signature | Used by |
|---|---|---|
| `inmobiliarias/index.html` | Página HTML completa servida en `/inmobiliarias/` | El QR impreso en tarjetas de presentación; Vercel lo sirve directamente |

## Conventions that bite in this area

- Todo el CSS vive en **un único** `<style>` dentro de `inmobiliarias/index.html` — nunca se crea
  un `.css` separado, ni siquiera "solo para esta sección".
- Toda ruta de asset (`src`, `poster`) es relativa a `inmobiliarias/index.html`
  (`assets/demo.mp4`), nunca con el prefijo `inmobiliarias/` — ver `CLAUDE.md`.
- El número de WhatsApp es siempre `584121484033` y el mensaje pre-rellenado siempre
  `Hola, quiero ver el agente de WhatsApp para mi inmobiliaria` (codificado como
  `Hola%2C%20quiero%20ver%20el%20agente%20de%20WhatsApp%20para%20mi%20inmobiliaria` en la URL) — en
  los 3 CTAs (nav, hero, CTA final), sin variación.
- `index.html` (raíz) es de solo lectura para todo este epic.

Full project rules: `CLAUDE.md`. Area rules: `.claude/rules/inmobiliarias-landing.md`. Ambos están
en la raíz del proyecto — el builder los copió ahí desde el `workspace/` de este bundle antes del
task uno.

---

## Tasks

Listados en el mismo orden que `tasks.json`. Ese orden es el orden de construcción — trabaja de
arriba hacia abajo, no reordenes por prioridad (todos son `p0` de todas formas: son 5 pasos
lineales sobre un mismo archivo).

### `E1-T1` — Estructura, shell de página, nav y hero con video/placeholder

**Depends on:** nothing · **Priority:** p0

Crea `inmobiliarias/`, `inmobiliarias/assets/`, y dos archivos nuevos. `inmobiliarias/index.html`
lleva el `<head>` completo (título, fuentes de Google Fonts idénticas a `index.html` raíz, y **todo**
el `<style>` que esta landing necesita — incluidas las reglas de secciones que se agregan en tasks
posteriores; es más simple escribirlas una sola vez aquí que editarlas después, y no tienen efecto
visible hasta que exista el HTML que las usa). El `<body>` lleva el nav (marca + CTA de WhatsApp) y
el hero (`<header class="hero-inmo">`): titular corto, un `.video-frame` con el `<video>` real
(apuntando a assets que todavía no existen) tapado por un `.video-placeholder` — mockup CSS de una
conversación de WhatsApp que reutiliza el lenguaje visual de `.report-card` — y el botón CTA de
WhatsApp debajo. Termina el archivo en `</body></html>`; los siguientes tasks insertan contenido
justo antes de `</body>`.

**Files**
- `inmobiliarias/index.html` — new
- `inmobiliarias/assets/README.md` — new

Contenido exacto de `inmobiliarias/assets/README.md`:

````markdown
# Assets pendientes — landing /inmobiliarias

Este directorio recibe los archivos reales de producto para la landing de inmobiliarias. Mientras
no existan, la página muestra un mockup CSS de reemplazo (ver `.video-placeholder` en
`inmobiliarias/index.html`).

## Rutas esperadas (no renombrar)

| Archivo | Uso | Formato |
|---|---|---|
| `demo.mp4` | Video de demostración del agente, referenciado en `<source src="assets/demo.mp4">` | MP4, H.264. El `<video>` ya está en `muted`, así que el audio es opcional |
| `poster.jpg` | Imagen fija mostrada antes de reproducir el video, referenciada en `poster="assets/poster.jpg"` | JPG, misma relación de aspecto que `.video-frame` (3:4, vertical) |

## Capturas reales del producto

Cuando existan capturas reales de la instancia de prueba, nómbralas así y reemplaza cada bloque
`.report-card` de la sección "Cómo se ve en la práctica" por una etiqueta `<img>` apuntando al
archivo correspondiente, manteniendo el contenedor `.practica-item` para no romper el layout de la
grilla:

| Archivo | Reemplaza el mockup |
|---|---|
| `screenshot-calificacion.jpg` | "Calificando un lead" |
| `screenshot-busqueda.jpg` | "Búsqueda de propiedades" |
| `screenshot-reparto.jpg` | "Reparto automático" |
| `screenshot-panel.jpg` | "Panel del dueño" |
````

Contenido exacto de `inmobiliarias/index.html` (hasta el cierre de `</header>`):

````html
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Axis IA para Inmobiliarias — Agente de WhatsApp que califica y reparte leads</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #12181A;
    --surface-1: #1B2A26;
    --surface-2: #223531;
    --teal: #0F6E56;
    --teal-light: #5DCAA5;
    --amber: #E9A23B;
    --amber-text: #F0B65C;
    --amber-bg: rgba(233, 162, 59, 0.14);
    --ink: #E9E5D8;
    --ink-soft: #9BAAA4;
    --border: rgba(233, 229, 216, 0.10);
    --border-strong: rgba(233, 229, 216, 0.18);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'IBM Plex Sans', sans-serif;
    background: var(--bg);
    color: var(--ink);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3, .display {
    font-family: 'Space Grotesk', sans-serif;
    color: var(--ink);
    font-weight: 700;
    letter-spacing: -0.01em;
  }

  a { color: inherit; }

  img, svg { display: block; max-width: 100%; }

  .wrap {
    max-width: 1120px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .skip-link {
    position: absolute;
    left: -9999px;
    top: 0;
    background: var(--teal-light);
    color: #082A1B;
    padding: 10px 18px;
    border-radius: 0 0 8px 0;
    font-weight: 600;
    font-size: 13px;
    z-index: 100;
  }
  .skip-link:focus { left: 0; }

  /* ---------- NAV (idéntico a index.html raíz) ---------- */
  .nav {
    position: sticky;
    top: 0;
    z-index: 50;
    background: rgba(18, 24, 26, 0.86);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--border);
  }
  .nav .wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 16px;
    padding-bottom: 16px;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .brand .mark {
    width: 34px;
    height: 34px;
    border-radius: 9px;
    background: var(--teal);
    position: relative;
    flex-shrink: 0;
  }
  .brand .mark svg { position: absolute; inset: 0; }
  .brand-name {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    font-size: 17px;
    color: var(--ink);
  }
  .nav-cta {
    background: var(--teal-light);
    color: #082A1B;
    font-size: 13.5px;
    font-weight: 600;
    padding: 9px 18px;
    border-radius: 100px;
    text-decoration: none;
    white-space: nowrap;
    transition: background 0.15s ease;
  }
  .nav-cta:hover { background: #74D9B4; }

  /* ---------- BOTÓN PRIMARIO (idéntico a index.html raíz) ---------- */
  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: var(--teal-light);
    color: #082A1B;
    font-weight: 600;
    font-size: 15px;
    padding: 15px 26px;
    border-radius: 100px;
    text-decoration: none;
    box-shadow: 0 10px 26px -8px rgba(93, 202, 165, 0.35);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 14px 30px -8px rgba(93, 202, 165, 0.42);
  }
  .btn-primary svg { flex-shrink: 0; }

  /* ---------- SECTION SHELL (idéntico a index.html raíz) ---------- */
  section { padding: 76px 0; }
  .section-head {
    max-width: 560px;
    margin: 0 auto 48px;
    text-align: center;
  }
  .section-tag {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--teal-light);
    margin-bottom: 12px;
    display: block;
  }
  .section-head h2 {
    font-size: clamp(26px, 3vw, 34px);
    line-height: 1.2;
  }
  .section-head p {
    color: var(--ink-soft);
    font-size: 15.5px;
    margin-top: 12px;
  }

  /* ---------- HERO (video-first, propio de esta landing) ---------- */
  .hero-inmo { padding: 48px 0 64px; }
  .hero-inmo-head {
    max-width: 640px;
    margin: 0 auto 32px;
    text-align: center;
  }
  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--teal-light);
    margin-bottom: 18px;
  }
  .eyebrow::before {
    content: "";
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--amber);
    display: inline-block;
  }
  .hero-inmo-head h1 {
    font-size: clamp(28px, 5vw, 42px);
    line-height: 1.15;
  }
  .video-frame {
    position: relative;
    aspect-ratio: 3 / 4;
    max-width: 360px;
    margin: 0 auto 32px;
    border-radius: 20px;
    overflow: hidden;
    background: var(--surface-1);
    border: 1px solid var(--border-strong);
    box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.55);
  }
  .demo-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    background: var(--surface-1);
  }
  /* PLACEHOLDER: eliminar .video-placeholder por completo (regla CSS + <div> en el HTML)
     en cuanto assets/demo.mp4 y assets/poster.jpg existan de verdad. */
  .video-placeholder {
    position: absolute;
    inset: 0;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    background: var(--surface-1);
    padding: 20px;
  }
  .vp-card {
    width: 100%;
    background: var(--surface-1);
    border: 1px solid var(--border-strong);
    border-radius: 14px;
    overflow: hidden;
  }
  .vp-head {
    background: var(--surface-2);
    padding: 12px 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    border-bottom: 1px solid var(--border);
  }
  .vp-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--teal-light); flex-shrink: 0; }
  .vp-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--ink-soft);
  }
  .vp-body { padding: 14px; display: flex; flex-direction: column; gap: 8px; }
  .vp-bubble { font-size: 12.5px; padding: 8px 12px; border-radius: 12px; max-width: 85%; line-height: 1.4; }
  .vp-bubble-in { background: var(--surface-2); color: var(--ink); align-self: flex-start; border-bottom-left-radius: 4px; }
  .vp-bubble-out { background: var(--teal); color: var(--ink); align-self: flex-end; border-bottom-right-radius: 4px; }
  .vp-typing { display: flex; gap: 4px; padding: 4px 12px; }
  .vp-typing span { width: 6px; height: 6px; border-radius: 50%; background: var(--ink-soft); opacity: 0.5; }
  .vp-note { font-size: 11.5px; color: var(--ink-soft); }
  .hero-inmo-actions { display: flex; justify-content: center; }

  /* ---------- REPORT CARD (idéntico a index.html raíz, reutilizado en "Cómo se ve en la práctica") ---------- */
  .report-card {
    background: var(--surface-1);
    border: 1px solid var(--border-strong);
    border-radius: 16px;
    box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.55);
    overflow: hidden;
    position: relative;
  }
  .report-card .rc-head {
    background: var(--surface-2);
    padding: 20px 22px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    border-bottom: 1px solid var(--border);
  }
  .report-card .rc-head .dot {
    width: 26px;
    height: 26px;
    border-radius: 8px;
    background: var(--teal);
    flex-shrink: 0;
  }
  .report-card .rc-head .rc-title {
    color: var(--ink);
    font-size: 12.5px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    opacity: 0.8;
  }
  .report-card .rc-body { padding: 22px; }
  .rc-point { display: flex; gap: 12px; margin-bottom: 16px; }
  .rc-point:last-child { margin-bottom: 0; }
  .rc-point .rc-num {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--teal);
    color: var(--ink);
    font-size: 11px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
  }
  .rc-point .rc-txt { flex: 1; }
  .rc-point .rc-txt .rc-line {
    height: 8px;
    border-radius: 4px;
    background: var(--border-strong);
    margin-bottom: 6px;
  }
  .rc-point .rc-txt .rc-line.short { width: 62%; }
  .rc-badge {
    display: inline-block;
    background: var(--amber-bg);
    color: var(--amber-text);
    font-size: 10.5px;
    font-weight: 700;
    padding: 4px 9px;
    border-radius: 4px;
    margin-top: 4px;
  }

  /* ---------- LOS DOLORES DE UNA AGENCIA ---------- */
  .pain-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
  .pain-item { background: var(--surface-1); border: 1px solid var(--border); border-radius: 12px; padding: 24px; }
  .pain-num {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: var(--teal-light);
    background: var(--surface-2);
    border: 1px solid var(--border-strong);
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
  }
  .pain-item h3 { font-size: 16.5px; margin-bottom: 8px; }
  .pain-item p { font-size: 13.8px; color: var(--ink-soft); }

  /* ---------- CÓMO SE VE EN LA PRÁCTICA ---------- */
  .practica-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 28px; }
  .practica-item { display: flex; flex-direction: column; gap: 14px; }
  .practica-item .report-card { transform: none; }
  .practica-caption { font-size: 13.5px; color: var(--ink-soft); }

  /* ---------- CTA FINAL (idéntico a index.html raíz) ---------- */
  .final-cta { text-align: center; padding-top: 88px; padding-bottom: 96px; }
  .final-cta h2 { font-size: clamp(28px, 3.6vw, 40px); max-width: 620px; margin: 0 auto 16px; line-height: 1.2; }
  .final-cta p { color: var(--ink-soft); font-size: 15.5px; max-width: 460px; margin: 0 auto 32px; }

  /* ---------- FOOTER (idéntico a index.html raíz) ---------- */
  footer { border-top: 1px solid var(--border); padding: 28px 0; }
  footer .wrap { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
  footer .f-brand { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--ink-soft); }
  footer .f-brand .fmark { width: 20px; height: 20px; border-radius: 6px; background: var(--teal); position: relative; }
  footer .f-brand .fmark svg { position: absolute; inset: 0; }
  footer .f-note { font-size: 12.5px; color: var(--ink-soft); }

  /* ---------- RESPONSIVE ---------- */
  @media (max-width: 860px) {
    .pain-grid { grid-template-columns: 1fr; }
    .practica-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 520px) {
    .hero-inmo { padding: 32px 0 40px; }
    section { padding: 56px 0; }
    .video-frame { max-width: 300px; }
  }

  :focus-visible {
    outline: 2px solid var(--teal-light);
    outline-offset: 3px;
  }
  @media (prefers-reduced-motion: reduce) {
    * { transition: none !important; scroll-behavior: auto !important; }
  }
</style>
</head>
<body>

  <a class="skip-link" href="#contenido-principal">Saltar al contenido principal</a>

  <nav class="nav">
    <div class="wrap">
      <div class="brand">
        <div class="mark">
          <svg viewBox="0 0 34 34" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
            <line x1="9" y1="25" x2="17" y2="9" stroke="#E9E5D8" stroke-width="3" stroke-linecap="round"/>
            <line x1="25" y1="25" x2="17" y2="9" stroke="#E9E5D8" stroke-width="3" stroke-linecap="round"/>
            <line x1="12" y1="19.5" x2="22" y2="19.5" stroke="#E9E5D8" stroke-width="2.4" stroke-linecap="round"/>
            <circle cx="17" cy="9" r="2.4" fill="#E9A23B"/>
          </svg>
        </div>
        <span class="brand-name">Axis IA</span>
      </div>
      <a class="nav-cta" href="https://wa.me/584121484033?text=Hola%2C%20quiero%20ver%20el%20agente%20de%20WhatsApp%20para%20mi%20inmobiliaria" target="_blank" rel="noopener">Hablar por WhatsApp</a>
    </div>
  </nav>

  <header class="hero-inmo" id="contenido-principal">
    <div class="wrap">
      <div class="hero-inmo-head">
        <span class="eyebrow">Para agencias con varios agentes</span>
        <h1>Así responde, califica y agenda un agente de WhatsApp hecho para tu inmobiliaria</h1>
      </div>

      <div class="video-frame">
        <video class="demo-video" muted autoplay loop playsinline controls poster="assets/poster.jpg" aria-label="Demostración del agente de WhatsApp de Axis IA para inmobiliarias">
          <source src="assets/demo.mp4" type="video/mp4">
          Tu navegador no puede reproducir este video. Escríbenos por WhatsApp y te mostramos una demostración en vivo.
        </video>
        <!-- PLACEHOLDER: eliminar este bloque completo en cuanto assets/demo.mp4 y assets/poster.jpg existan -->
        <div class="video-placeholder">
          <div class="vp-card">
            <div class="vp-head">
              <span class="vp-dot"></span>
              <span class="vp-label">Vista previa · Agente de WhatsApp</span>
            </div>
            <div class="vp-body">
              <div class="vp-bubble vp-bubble-in">Hola, vi el apartamento en la Av. Libertador, ¿sigue disponible?</div>
              <div class="vp-bubble vp-bubble-out">¡Sí! Tiene 3 habitaciones. ¿Buscas para vivir o para invertir?</div>
              <div class="vp-bubble vp-bubble-in">Para vivir con mi familia</div>
              <div class="vp-typing"><span></span><span></span><span></span></div>
            </div>
          </div>
          <span class="vp-note">Video de demostración próximamente</span>
        </div>
      </div>

      <div class="hero-inmo-actions">
        <a class="btn-primary" href="https://wa.me/584121484033?text=Hola%2C%20quiero%20ver%20el%20agente%20de%20WhatsApp%20para%20mi%20inmobiliaria" target="_blank" rel="noopener">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
            <path d="M12 2C6.48 2 2 6.48 2 12c0 1.82.48 3.53 1.32 5.01L2 22l5.12-1.3A9.94 9.94 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" fill="#082A1B" opacity="0.14"/>
            <path d="M17.3 14.13c-.28-.14-1.67-.82-1.93-.92-.26-.1-.45-.14-.64.14-.19.28-.73.92-.9 1.1-.16.19-.33.21-.61.07-.28-.14-1.18-.43-2.24-1.37-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.33.42-.5.14-.16.19-.28.28-.47.09-.19.05-.35-.02-.5-.07-.14-.64-1.53-.87-2.1-.23-.55-.47-.48-.64-.49-.16-.01-.35-.01-.54-.01-.19 0-.5.07-.76.35-.26.28-1 1-1 2.42 0 1.43 1.03 2.82 1.17 3.01.14.19 2.03 3.1 4.93 4.34.69.3 1.22.48 1.64.62.69.22 1.32.19 1.81.11.55-.08 1.67-.68 1.91-1.34.24-.66.24-1.22.17-1.34-.07-.12-.26-.19-.54-.33z" fill="#082A1B"/>
          </svg>
          Quiero ver el agente para mi inmobiliaria
        </a>
      </div>
    </div>
  </header>

</body>
</html>
````

**IMPORTANTE:** deja `</body>\n</html>` como el final del archivo — `E1-T2`, `E1-T3` y `E1-T4`
insertan contenido nuevo **inmediatamente antes de `</body>`**, en ese orden.

**Acceptance**

1. **WHEN** se abre `inmobiliarias/index.html` en un navegador **THE SYSTEM SHALL** mostrar la
   barra de navegación con el logo "Axis IA" y un botón "Hablar por WhatsApp" que enlaza a
   `https://wa.me/584121484033?text=Hola%2C%20quiero%20ver%20el%20agente%20de%20WhatsApp%20para%20mi%20inmobiliaria`.
2. **WHEN** se ejecuta `test "$(grep -c "584121484033" inmobiliarias/index.html)" = "2"` **THE
   SYSTEM SHALL** salir con código 0 (nav + CTA del hero — el CTA final todavía no existe).
3. **WHEN** se ejecuta `grep -q 'src="assets/demo.mp4"' inmobiliarias/index.html` **THE SYSTEM
   SHALL** salir con código 0.
4. **WHEN** se ejecuta `grep -q 'class="video-placeholder"' inmobiliarias/index.html` **THE SYSTEM
   SHALL** salir con código 0, confirmando que el mockup CSS de reemplazo del video está presente.
5. **WHEN** se ejecuta `test -f inmobiliarias/assets/README.md` **THE SYSTEM SHALL** salir con
   código 0.

**Verify**

```bash
grep -q 'class="brand-name"' inmobiliarias/index.html
test "$(grep -c "584121484033" inmobiliarias/index.html)" = "2"
grep -q 'src="assets/demo.mp4"' inmobiliarias/index.html
grep -q 'poster="assets/poster.jpg"' inmobiliarias/index.html
grep -q 'class="video-placeholder"' inmobiliarias/index.html
test -f inmobiliarias/assets/README.md
```

**Checkpoint**

```bash
git add -A && git commit -m "E1-T1: estructura, shell, nav y hero con video/placeholder"
git tag step-01-shell-nav-hero
```

Run both after the last `Verify` command exits 0, before starting the next task.

---

### `E1-T2` — Sección "Los dolores de una agencia"

**Depends on:** `E1-T1` · **Priority:** p0

Inserta la sección de 4 puntos de dolor **inmediatamente antes de `</body>`**. Todo el CSS que
necesita (`.pain-grid`, `.pain-item`, `.pain-num`) ya existe desde `E1-T1` — no crees ninguna regla
nueva. La copia está escrita desde la perspectiva de quien gestiona **todo un equipo** de agentes,
no de un agente individual — es la diferencia central entre esta landing y la landing general.

**Files**
- `inmobiliarias/index.html` — edit: insertar `<section class="pain">` antes de `</body>`

Contenido exacto a insertar:

```html
  <section class="pain">
    <div class="wrap">
      <div class="section-head">
        <span class="section-tag">El problema</span>
        <h2>Los dolores de una agencia con varios agentes</h2>
        <p>No es un problema de un agente — es un problema de coordinar a todo el equipo alrededor de WhatsApp.</p>
      </div>
      <div class="pain-grid">
        <div class="pain-item">
          <div class="pain-num">1</div>
          <h3>Leads que llegan y nadie les da seguimiento a tiempo</h3>
          <p>Un lead escribe a las 9pm o mientras el agente está en una visita. Si nadie responde en minutos, ya está hablando con la competencia.</p>
        </div>
        <div class="pain-item">
          <div class="pain-num">2</div>
          <h3>Sin forma clara de repartir leads entre agentes</h3>
          <p>Los leads llegan a un solo WhatsApp o se reparten a mano, por orden de llegada o por quién está disponible. No hay un criterio parejo ni un registro de quién tiene qué.</p>
        </div>
        <div class="pain-item">
          <div class="pain-num">3</div>
          <h3>El dueño o gerente no tiene visibilidad de qué pasa con cada lead</h3>
          <p>¿Cuántos leads entraron esta semana? ¿Cuántos llegaron a visita? Sin un reporte central, la única forma de saberlo es preguntarle a cada agente uno por uno.</p>
        </div>
        <div class="pain-item">
          <div class="pain-num">4</div>
          <h3>Coordinar visitas a propiedades consume horas del equipo</h3>
          <p>Confirmar disponibilidad, cruzar agendas y reenviar la dirección por chat — cada visita agendada a mano le quita tiempo al equipo que debería estar vendiendo.</p>
        </div>
      </div>
    </div>
  </section>
```

**Acceptance**

1. **WHEN** se ejecuta `test "$(grep -c 'class="pain-item"' inmobiliarias/index.html)" = "4"` **THE
   SYSTEM SHALL** salir con código 0.
2. **WHEN** se ejecuta `grep -q 'Los dolores de una agencia con varios agentes'
   inmobiliarias/index.html` **THE SYSTEM SHALL** salir con código 0.
3. **WHEN** se ejecuta `grep -q 'Sin forma clara de repartir leads entre agentes'
   inmobiliarias/index.html` **THE SYSTEM SHALL** salir con código 0.
4. **WHEN** se ejecuta `grep -q 'Coordinar visitas a propiedades consume horas del equipo'
   inmobiliarias/index.html` **THE SYSTEM SHALL** salir con código 0.

**Verify**

```bash
test "$(grep -c 'class="pain-item"' inmobiliarias/index.html)" = "4"
grep -q 'Los dolores de una agencia con varios agentes' inmobiliarias/index.html
grep -q 'Sin forma clara de repartir leads entre agentes' inmobiliarias/index.html
grep -q 'Coordinar visitas a propiedades consume horas del equipo' inmobiliarias/index.html
```

**Checkpoint**

```bash
git add -A && git commit -m "E1-T2: seccion los dolores de una agencia"
git tag step-02-pain-points
```

---

### `E1-T3` — Sección "Cómo se ve en la práctica"

**Depends on:** `E1-T2` · **Priority:** p0

Inserta 4 bloques que combinan un mockup `.report-card` con una descripción corta, cubriendo: el
bot calificando un lead, la búsqueda de propiedades en la conversación, el reparto automático del
lead al agente correspondiente, y el panel/reporte del dueño. **Reutiliza el componente
`.report-card`/`.rc-*` ya definido desde `E1-T1`** — no inventes un estilo nuevo. Los badges usan
etiquetas cualitativas ("Presupuesto capturado"), nunca números o cifras inventadas: son mockups de
producto, no resultados atribuidos a un cliente real.

**Files**
- `inmobiliarias/index.html` — edit: insertar `<section class="practica">` antes de `</body>`, después de la sección `.pain`

Contenido exacto a insertar:

```html
  <section class="practica">
    <div class="wrap">
      <div class="section-head">
        <span class="section-tag">El producto</span>
        <h2>Así se ve en la práctica</h2>
        <p>Un vistazo a cómo conversa el agente con un lead y qué ve el dueño de la agencia del otro lado.</p>
      </div>
      <div class="practica-grid">
        <div class="practica-item">
          <div class="report-card">
            <div class="rc-head"><div class="dot"></div><div class="rc-title">Calificando un lead</div></div>
            <div class="rc-body">
              <div class="rc-point">
                <div class="rc-num">1</div>
                <div class="rc-txt"><div class="rc-line"></div><div class="rc-line short"></div><span class="rc-badge">Presupuesto capturado</span></div>
              </div>
              <div class="rc-point">
                <div class="rc-num">2</div>
                <div class="rc-txt"><div class="rc-line"></div><div class="rc-line short"></div><span class="rc-badge">Zona de interés capturada</span></div>
              </div>
            </div>
          </div>
          <p class="practica-caption">El agente conversa con el lead y va capturando presupuesto, zona y tipo de propiedad antes de pasarlo a un agente humano — así cada quien recibe leads ya filtrados.</p>
        </div>

        <div class="practica-item">
          <div class="report-card">
            <div class="rc-head"><div class="dot"></div><div class="rc-title">Búsqueda de propiedades</div></div>
            <div class="rc-body">
              <div class="rc-point">
                <div class="rc-num">1</div>
                <div class="rc-txt"><div class="rc-line"></div><div class="rc-line short"></div><span class="rc-badge">Coincide con el presupuesto</span></div>
              </div>
              <div class="rc-point">
                <div class="rc-num">2</div>
                <div class="rc-txt"><div class="rc-line"></div><div class="rc-line short"></div><span class="rc-badge">Coincide con la zona</span></div>
              </div>
            </div>
          </div>
          <p class="practica-caption">El bot busca en el inventario de la inmobiliaria y responde con las opciones que calzan, directo en la conversación — sin que el cliente tenga que esperar a que alguien esté libre.</p>
        </div>

        <div class="practica-item">
          <div class="report-card">
            <div class="rc-head"><div class="dot"></div><div class="rc-title">Reparto automático</div></div>
            <div class="rc-body">
              <div class="rc-point">
                <div class="rc-num">1</div>
                <div class="rc-txt"><div class="rc-line"></div><div class="rc-line short"></div><span class="rc-badge">Asignado a agente disponible</span></div>
              </div>
              <div class="rc-point">
                <div class="rc-num">2</div>
                <div class="rc-txt"><div class="rc-line"></div><div class="rc-line short"></div><span class="rc-badge">Regla: por zona</span></div>
              </div>
            </div>
          </div>
          <p class="practica-caption">Cada lead calificado se asigna automáticamente al agente que le toca, según las reglas que tú definas — nada de "quien conteste primero se lo queda".</p>
        </div>

        <div class="practica-item">
          <div class="report-card">
            <div class="rc-head"><div class="dot"></div><div class="rc-title">Panel del dueño</div></div>
            <div class="rc-body">
              <div class="rc-point">
                <div class="rc-num">1</div>
                <div class="rc-txt"><div class="rc-line"></div><div class="rc-line short"></div><span class="rc-badge">Leads de la semana</span></div>
              </div>
              <div class="rc-point">
                <div class="rc-num">2</div>
                <div class="rc-txt"><div class="rc-line"></div><div class="rc-line short"></div><span class="rc-badge">Visitas agendadas</span></div>
              </div>
            </div>
          </div>
          <p class="practica-caption">Tú ves en un solo lugar cuántos leads entraron, cómo se repartieron entre el equipo y cuántos llegaron a visita — sin perseguir a cada agente por WhatsApp para saber cómo va todo.</p>
        </div>
      </div>
    </div>
  </section>
```

**Acceptance**

1. **WHEN** se ejecuta `test "$(grep -c 'class="practica-item"' inmobiliarias/index.html)" = "4"`
   **THE SYSTEM SHALL** salir con código 0.
2. **WHEN** se ejecuta `grep -q 'Así se ve en la práctica' inmobiliarias/index.html` **THE SYSTEM
   SHALL** salir con código 0.
3. **WHEN** se ejecuta `grep -q 'Reparto automático' inmobiliarias/index.html` **THE SYSTEM SHALL**
   salir con código 0.
4. **WHEN** se ejecuta `grep -q 'Panel del dueño' inmobiliarias/index.html` **THE SYSTEM SHALL**
   salir con código 0.

**Verify**

```bash
test "$(grep -c 'class="practica-item"' inmobiliarias/index.html)" = "4"
grep -q 'Así se ve en la práctica' inmobiliarias/index.html
grep -q 'Reparto automático' inmobiliarias/index.html
grep -q 'Panel del dueño' inmobiliarias/index.html
```

**Checkpoint**

```bash
git add -A && git commit -m "E1-T3: seccion como se ve en la practica"
git tag step-03-practica
```

---

### `E1-T4` — CTA final, footer y confirmación de la pasada responsive

**Depends on:** `E1-T3` · **Priority:** p0

Inserta el CTA final y el footer (idéntico al de `index.html` raíz) **inmediatamente antes de
`</body>`**, después de la sección `.practica`. Después de insertarlo, confirma que la página
entera se apila en una sola columna por debajo de 860px y reduce paddings por debajo de 520px — las
reglas ya están en el `<style>` desde `E1-T1`; este task solo las verifica contra el documento
completo. Detalle de implementación (Riesgo #3 del blueprint): `.practica-item` no fuerza una
relación de aspecto sobre el mockup, así que reemplazar un `.report-card` por una captura real más
adelante no requiere rehacer el CSS de la grilla.

**Files**
- `inmobiliarias/index.html` — edit: insertar `<section class="final-cta">` + `<footer>` antes de `</body>`, después de la sección `.practica`

Contenido exacto a insertar:

```html
  <section class="final-cta" id="contacto">
    <div class="wrap">
      <h2>¿Le mostramos el agente a tu equipo?</h2>
      <p>Te mostramos cómo funciona el agente de WhatsApp y cómo se adapta al proceso de tu agencia — sin compromiso.</p>
      <a class="btn-primary" href="https://wa.me/584121484033?text=Hola%2C%20quiero%20ver%20el%20agente%20de%20WhatsApp%20para%20mi%20inmobiliaria" target="_blank" rel="noopener">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
          <path d="M12 2C6.48 2 2 6.48 2 12c0 1.82.48 3.53 1.32 5.01L2 22l5.12-1.3A9.94 9.94 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" fill="#082A1B" opacity="0.14"/>
          <path d="M17.3 14.13c-.28-.14-1.67-.82-1.93-.92-.26-.1-.45-.14-.64.14-.19.28-.73.92-.9 1.1-.16.19-.33.21-.61.07-.28-.14-1.18-.43-2.24-1.37-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.33.42-.5.14-.16.19-.28.28-.47.09-.19.05-.35-.02-.5-.07-.14-.64-1.53-.87-2.1-.23-.55-.47-.48-.64-.49-.16-.01-.35-.01-.54-.01-.19 0-.5.07-.76.35-.26.28-1 1-1 2.42 0 1.43 1.03 2.82 1.17 3.01.14.19 2.03 3.1 4.93 4.34.69.3 1.22.48 1.64.62.69.22 1.32.19 1.81.11.55-.08 1.67-.68 1.91-1.34.24-.66.24-1.22.17-1.34-.07-.12-.26-.19-.54-.33z" fill="#082A1B"/>
        </svg>
        Quiero ver el agente para mi inmobiliaria
      </a>
    </div>
  </section>

  <footer>
    <div class="wrap">
      <div class="f-brand">
        <div class="fmark">
          <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
            <line x1="5" y1="15" x2="10" y2="5" stroke="#E9E5D8" stroke-width="1.8" stroke-linecap="round"/>
            <line x1="15" y1="15" x2="10" y2="5" stroke="#E9E5D8" stroke-width="1.8" stroke-linecap="round"/>
            <line x1="7" y1="11.5" x2="13" y2="11.5" stroke="#E9E5D8" stroke-width="1.4" stroke-linecap="round"/>
            <circle cx="10" cy="5" r="1.4" fill="#E9A23B"/>
          </svg>
        </div>
        <span>Axis IA</span>
      </div>
      <span class="f-note">Automatización con inteligencia artificial · Venezuela</span>
    </div>
  </footer>
```

**Acceptance**

1. **WHEN** se ejecuta `test "$(grep -c "584121484033" inmobiliarias/index.html)" = "3"` **THE
   SYSTEM SHALL** salir con código 0 (nav + hero + CTA final — ya completo).
2. **WHEN** se ejecuta `grep -q '@media (max-width: 860px)' inmobiliarias/index.html` **THE SYSTEM
   SHALL** salir con código 0.
3. **WHEN** se ejecuta `grep -q '@media (max-width: 520px)' inmobiliarias/index.html` **THE SYSTEM
   SHALL** salir con código 0.
4. **WHEN** se ejecuta `grep -q 'Automatización con inteligencia artificial · Venezuela'
   inmobiliarias/index.html` **THE SYSTEM SHALL** salir con código 0.
5. **WHEN** se ejecuta `grep -q '</html>' inmobiliarias/index.html` **THE SYSTEM SHALL** salir con
   código 0 — el archivo quedó correctamente cerrado.

**Verify**

```bash
test "$(grep -c "584121484033" inmobiliarias/index.html)" = "3"
grep -q '@media (max-width: 860px)' inmobiliarias/index.html
grep -q '@media (max-width: 520px)' inmobiliarias/index.html
grep -q 'Automatización con inteligencia artificial · Venezuela' inmobiliarias/index.html
grep -q '</html>' inmobiliarias/index.html
```

**Checkpoint**

```bash
git add -A && git commit -m "E1-T4: cta final, footer y pasada responsive"
git tag step-04-cta-footer-responsive
```

---

### `E1-T5` — Verificación final: la ruta resuelve y la landing 1 no cambió

**Depends on:** `E1-T4` · **Priority:** p0

Ningún archivo nuevo. Sirve el árbol completo del repositorio localmente con
`npx http-server` (el mismo mecanismo de resolución estática que usa Vercel en producción)
y confirma que `/inmobiliarias/` responde `200`. Confirma también, con `git diff`, que
`index.html` (raíz) no cambió ni un byte en todo este epic — es el gate más importante de este
cambio brownfield.

**Files**

Ninguno — este task es puramente de verificación.

**Acceptance**

1. **WHEN** se sirve el repositorio con `npx --yes http-server . -p 8080` y se pide
   `http://localhost:8080/inmobiliarias/` **THE SYSTEM SHALL** responder con código HTTP `200`.
2. **WHEN** se pide `http://localhost:8080/inmobiliarias/index.html` directamente **THE SYSTEM
   SHALL** responder también con código HTTP `200`.
3. **WHEN** se ejecuta `git diff --stat -- index.html` **THE SYSTEM SHALL** no producir ninguna
   salida — landing 1 permanece sin cambios.
4. **WHEN** se ejecuta `test "$(grep -c "584121484033" inmobiliarias/index.html)" = "3"` **THE
   SYSTEM SHALL** salir con código 0 — el conteo final de CTAs de WhatsApp es correcto.

**Verify**

```bash
kill_port_8080() {
  if command -v fuser >/dev/null 2>&1; then
    fuser -k 8080/tcp 2>/dev/null || true
  else
    for pid in $(netstat -ano 2>/dev/null | grep LISTENING | grep ":8080 " | awk '{print $NF}'); do
      taskkill //F //PID "$pid" //T 2>/dev/null || true
    done
  fi
}
kill_port_8080
npx --yes http-server . -p 8080 >/dev/null 2>&1 &
sleep 3
CODE_DIR=$(curl -s -o /dev/null -w '%{http_code}' http://localhost:8080/inmobiliarias/)
CODE_FILE=$(curl -s -o /dev/null -w '%{http_code}' http://localhost:8080/inmobiliarias/index.html)
kill_port_8080
test "$CODE_DIR" = "200" && test "$CODE_FILE" = "200"
```
```bash
test -z "$(git diff --stat -- index.html)"
```
```bash
test "$(grep -c "584121484033" inmobiliarias/index.html)" = "3"
```

Estos son los 3 elementos del array `verify` de `E1-T5` en `tasks.json`, uno por bloque — el primer
bloque levanta el servidor, hace las dos peticiones, lo apaga y decide su propio código de salida
con la comparación final; los otros dos son cada uno un comando independiente.

**Checkpoint**

```bash
git add -A && git commit -m "E1-T5: verificacion final — ruta resuelve, landing 1 intacta" --allow-empty
git tag step-05-verify-deploy-ready
git ls-files --error-unmatch inmobiliarias/index.html inmobiliarias/assets/README.md
test -z "$(git status --porcelain)"
```

Este task no modifica ningún archivo, así que el commit del checkpoint usa `--allow-empty` — de lo
contrario `git commit` fallaría con "nothing to commit".

---

## Epic acceptance

El epic está terminado cuando los 5 tasks están `done` **y**:

1. **WHEN** se abre `https://axisai.space/inmobiliarias/` en un teléfono real (tras `vercel
   --prod`) **THE SYSTEM SHALL** mostrar la landing completa con los 3 CTAs funcionando.
2. **WHEN** se compara `index.html` (raíz) contra el commit anterior al inicio de este epic **THE
   SYSTEM SHALL** no mostrar ninguna diferencia.

```bash
test "$(grep -c "584121484033" inmobiliarias/index.html)" = "3"
kill_port_8080() {
  if command -v fuser >/dev/null 2>&1; then
    fuser -k 8080/tcp 2>/dev/null || true
  else
    for pid in $(netstat -ano 2>/dev/null | grep LISTENING | grep ":8080 " | awk '{print $NF}'); do
      taskkill //F //PID "$pid" //T 2>/dev/null || true
    done
  fi
}
kill_port_8080
npx --yes http-server . -p 8080 >/dev/null 2>&1 &
sleep 3
test "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:8080/inmobiliarias/)" = "200"
kill_port_8080
test -z "$(git diff --stat -- index.html)"
```

Run from the project root. El criterio #1 (revisión en un teléfono real en producción) es manual,
listado en el checklist de lanzamiento de `blueprint.md` §20.1 — no bloquea el `done` de
`tasks.json`, que se decide enteramente por los `Verify` de cada task.

## Pitfalls

- **Editar `index.html` (raíz) "solo para agregar un link a la nueva landing".** No. Es un
  non-goal explícito — ver `CLAUDE.md`. Ni siquiera un link discreto en el footer.
- **Crear un `.css` o `.js` separado "para no repetir tanto código".** No. La convención de este
  repo es un archivo autocontenido por landing — ver `.claude/rules/inmobiliarias-landing.md`.
- **Usar `inmobiliarias/assets/demo.mp4` como valor del atributo `src`.** Es incorrecto: dentro de
  `inmobiliarias/index.html` la ruta es relativa a ese archivo, así que es `assets/demo.mp4` sin el
  prefijo de carpeta.
- **Inventar números en los mockups de "Cómo se ve en la práctica".** Los badges son cualitativos
  ("Presupuesto capturado"), nunca cifras — no hay cliente real que respalde una cifra.

## Before moving on

- [ ] Los 5 tasks de este epic están `done` en `tasks.json` — ninguno quedó `in_progress`.
- [ ] Cada `verify` de cada task de este epic pasó, no solo el primero.
- [ ] Ningún comando `verify` fue editado, ni se saltó porque un archivo que nombra no existía.
- [ ] Cada task tiene su tag de checkpoint en git — `git tag -l 'step-*'` lista 5.
- [ ] Gate command de la Epic acceptance pasa limpio, corrido desde la raíz del proyecto.
- [ ] `inmobiliarias/index.html` existe con las 4 secciones (`nav`, `hero-inmo`, `pain`,
      `practica`, `final-cta`, `footer`).
- [ ] Ningún archivo fuera del subárbol listado arriba fue modificado — en particular,
      `index.html` (raíz).
- [ ] `.env.example` — NOT APPLICABLE, este proyecto no tiene variables de entorno.
- [ ] Un commit por task, cada uno prefijado con su id de task, cada uno seguido de su tag de
      checkpoint.

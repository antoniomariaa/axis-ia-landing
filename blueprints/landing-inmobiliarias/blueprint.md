# Landing Inmobiliarias — Axis IA — Blueprint

> Generado por The Architect el 2026-08-22
> Shape: Marketing / Content Site (brownfield) · `knowledge/shapes/marketing-site.md`
> Runtime track: NINGUNO — desvío deliberado del track por defecto de la shape (`ts-node`). Ver §2 y §20.3, decisión #1.
> Emission mode: bundle
> Blueprint version: 1
> Versions last verified: 2026-08-22 — ver §11. Este proyecto no fija ninguna versión de paquete: no existe gestor de paquetes.

---

## Nota para quien ejecute este blueprint

`workspace/CLAUDE.md` y `workspace/AGENTS.md` son los **primeros** archivos de este tipo en el
repositorio `axis-ia-landing`. El Paso 0 de §10 los **agrega** a la raíz del repo — no hay nada
existente con lo que fusionarlos. Lo mismo aplica a `.claude/settings.json`.

Este es un cambio **brownfield**: el repositorio ya existe, tiene historial de git y un despliegue
en producción funcionando (`axisai.space`, vía Vercel). La landing existente en `index.html`
(raíz del repo) **no se toca en ningún paso** — es la regla más importante de este build.

---

## 1. Project Overview & Non-Goals

### Current state (brownfield — repo ya mapeado)

Repositorio: `C:\Users\grego\Downloads\axis-ia-landing\axis-ia-landing` — que **es** la raíz del
proyecto objetivo de este blueprint.

- Repo de git, remoto `https://github.com/antoniomariaa/axis-ia-landing.git`, rama `master`, árbol
  de trabajo limpio al momento de diseñar este blueprint.
- Despliegue: proyecto Vercel "axis-ia-landing" (`.vercel/project.json`, `projectId:
  prj_QU2TjYqMb5cus6Pi5H7bTfG8MTK6`), dominio `axisai.space`, desplegado manualmente vía
  `vercel --prod`. No existe `vercel.json` — el enrutamiento usa la resolución estática por
  defecto de Vercel (una petición a `/inmobiliarias` sirve `/inmobiliarias/index.html`
  automáticamente porque Vercel sirve archivos índice de directorio por defecto).
- Sin CI (no hay `.github/workflows`), sin test runner, sin linter ni formateador configurado en
  ningún punto del repo, sin `CLAUDE.md`/`AGENTS.md` en la raíz todavía.
- Estructura existente: solo `index.html` (archivo autocontenido de ~775 líneas: `<style>` inline,
  SVGs inline, sin JS externo, sin CSS/JS separados), `README.md`, `.gitignore`, `.vercel/`.
- `.gitignore` actual (2 líneas, `.vercel` duplicado + `.DS_Store`) — no contiene ningún patrón
  amplio (`.env*`, `*.local`, `.claude/`) que pudiera tragarse los archivos nuevos de este build.
- `README.md` ya documenta el plan: *"Próxima landing (inmobiliarias) irá en
  `/inmobiliarias/index.html`"* — confirma la ruta objetivo.
- Sistema de diseño ya vive en el bloque `:root` de `index.html` y **es la fuente de verdad**
  (copiado verbatim en este blueprint, no reaproximado):
  ```css
  --bg: #12181A; --surface-1: #1B2A26; --surface-2: #223531;
  --teal: #0F6E56; --teal-light: #5DCAA5;
  --amber: #E9A23B; --amber-text: #F0B65C; --amber-bg: rgba(233,162,59,0.14);
  --ink: #E9E5D8; --ink-soft: #9BAAA4;
  --border: rgba(233,229,216,0.10); --border-strong: rgba(233,229,216,0.18);
  ```
  Fuentes: Google Fonts `Space+Grotesk:wght@500;600;700` + `IBM+Plex+Sans:wght@400;500;600;700`,
  cargadas vía dos `<link rel="preconnect">` + un `<link>` de stylesheet, igual que en
  `index.html`. Space Grotesk 700 para `h1,h2,h3,.display`; IBM Plex Sans para el cuerpo.
  Logo: monograma circular sobre fondo teal (`.mark`/`.fmark`), SVG de dos líneas diagonales + una
  barra horizontal en `#E9E5D8` más un círculo ámbar en el vértice — copiado byte a byte de
  `index.html` líneas 568-573 (nav) y 760-765 (footer).
  Botón de WhatsApp: `.btn-primary` — píldora, `background: var(--teal-light)`, texto `#082A1B`,
  glifo de WhatsApp inline (copiado de `index.html` líneas 590-593), `target="_blank"
  rel="noopener"`.
  Convención de shell de sección: `.wrap{max-width:1120px;margin:0 auto;padding:0 24px}`,
  `section{padding:76px 0}`, patrón `.section-tag`/`.section-head h2`/`.section-head p`,
  breakpoints en `860px` y `520px`.
  Componente reutilizable clave: `.report-card`/`.rc-*` (tarjeta con header, filas numeradas,
  badge) — reutilizado en este blueprint para los mockups de "Cómo se ve en la práctica" en vez de
  inventar un estilo nuevo.
  Convención de nombres: clases planas, no-BEM, prefijadas por sección (`.hero-*`, `.process-*`,
  `.rc-*`, `.f-*`).

### Target state (delta de este cambio)

Un archivo nuevo: `inmobiliarias/index.html` (autocontenido, mismo patrón de autoría que
`index.html` raíz — `<style>` inline, SVGs inline, sin JS externo, sin CSS/JS compartido). Una
carpeta nueva: `inmobiliarias/assets/` para medios reales futuros (solo un `README.md` documentando
las rutas esperadas al terminar este build — el video y las capturas reales llegan después, ver
Non-Goals).

**Nada en el `index.html` existente (raíz) se modifica.** Non-goal explícito: la landing 1
(`/index.html`) permanece intacta — ningún paso de este blueprint la modifica, y el gate final (§9
Paso 5 y §20.1) verifica que su contenido en git no cambió ni un byte.

**Sin cross-linking entre las dos landings** — ni la landing 1 enlaza a `/inmobiliarias/` ni la
landing 2 enlaza a `/` — decisión explícita del usuario: cada canal de tráfico (código QR de
tarjeta física para la landing 2) debe llevar a una sola oferta, sin desviar la atención.

### Vision

Una segunda landing de marketing, independiente de la landing general de Axis IA, dirigida
específicamente a dueños y gerentes de agencias inmobiliarias que coordinan a **varios agentes de
venta** (no a un agente solo). Vende el agente de WhatsApp con IA que Axis IA ya construyó — no la
auditoría gratuita genérica que vende la landing existente en `/`. Se llega a ella principalmente
escaneando un código QR impreso en tarjetas de presentación, así que tiene que cargar rápido y
comunicar el valor en segundos, en un teléfono.

### Users

| Persona | What they come to do | Frequency |
|---|---|---|
| Dueño/gerente de una agencia inmobiliaria con varios agentes de venta | Decidir en segundos, desde el celular, si vale la pena escribir por WhatsApp para ver el agente de IA en acción | Una vez — llega escaneando el QR de una tarjeta física |

### Goals — v1 scope

1. La página comunica en menos de 5 segundos, desde la perspectiva de quien gestiona todo un
   equipo de agentes (no de un agente individual), qué hace el agente de WhatsApp de Axis IA.
2. Todo botón de la página lleva a una conversación de WhatsApp pre-rellenada con el número y el
   mensaje correctos — sin formularios, sin fricción.
3. La página carga rápido en un teléfono con datos móviles, sin ningún framework, sin build step,
   igual que la landing existente en `/`.

### Non-Goals — explicitly out of scope for v1

| Not building | Why not now | Revisit when |
|---|---|---|
| Modificar `index.html` (raíz) | Es la landing 1 en producción; este cambio es una adición, no una migración — tocarla no está en el alcance pedido | Nunca, salvo que se decida unificar ambas landings deliberadamente |
| Mencionar clientes reales del rubro inmobiliario o casos de éxito | No existe todavía un cliente cerrado en este rubro — esto es una demo de producto ya construido, no un caso de estudio | Cuando exista al menos un cliente real dispuesto a ser citado |
| Métricas o resultados de negocio inventados (tasas de conversión, leads cerrados, etc.) | No hay datos reales que respaldarlos; inventarlos es publicidad engañosa | Cuando existan datos reales medibles de un cliente del rubro |
| Cross-linking entre landing 1 y landing 2 | Decisión explícita del usuario — cada canal de tráfico debe llevar a una sola oferta | Si se decide unificar la navegación del sitio en un solo dominio con selector de audiencia |
| CSS o JS compartido / extraído a un archivo aparte | Mantiene la convención de archivo único autocontenido que ya usa `index.html` | Si el sitio crece a 3+ landings y la duplicación de tokens se vuelve costosa de mantener |
| CMS, build tool, framework de frontend, o lógica de servidor | Coincide exactamente con la convención cero-dependencias del repo existente | Si se necesita contenido editable por alguien no técnico, o lógica de servidor |
| Video real (`.mp4`), poster real y capturas reales del SaaS | El producto de prueba (instancia de prueba usada para grabar la demo) todavía no tiene grabación ni capturas listas — solo placeholders en este build | Cuando exista el archivo de video real y las capturas reales |
| SEO orgánico (sitemap, robots.txt, datos estructurados JSON-LD, imágenes OG por página) | Página alcanzada solo por QR impreso en tarjetas físicas, no por búsqueda orgánica | Si se decide que esta landing también debe ser encontrada por búsqueda |

**El builder no debe implementar nada de esta tabla**, aunque parezca una adición pequeña mientras
trabaja en un paso adyacente. Si un paso parece requerir un no-goal, eso es un defecto del
blueprint — deténte y repórtalo en vez de expandir el alcance.

### Success metrics

| Metric | Target | How measured |
|---|---|---|
| Los 3 CTAs de WhatsApp están presentes y apuntan al número/mensaje correctos | 3 de 3 (nav, hero, CTA final) | `test "$(grep -c "584121484033" inmobiliarias/index.html)" = "3"` — exit 0 |
| La ruta `/inmobiliarias/` resuelve como página completa, tanto localmente como en producción | Código HTTP `200` en ambos casos | `curl` local en §9 Paso 5 + verificación manual en producción en el gate de §20.1 |

---

## 2. Tech Stack

**Runtime track: NINGUNO.** Desvío deliberado del track por defecto de la shape marketing-site
(`ts-node.md`, con un framework de contenido estático). Este proyecto usa HTML + CSS planos, sin
build step, sin gestor de paquetes, sin dependencias — exactamente la convención que ya usa
`index.html` en este mismo repositorio. Ver §20.3, decisión #1, para el razonamiento completo y el
trigger de reversión.

| Layer | Choice | Why this, over what |
|---|---|---|
| Language / runtime | HTML5 + CSS3 planos, un solo archivo autocontenido | Coincide con `index.html` existente; cero build step que pueda romperse o quedar desactualizado |
| Framework | NOT APPLICABLE | Sin framework de frontend — el track por defecto de la shape (framework de contenido estático) se descarta explícitamente para igualar la convención del repo |
| Styling | CSS inline dentro de un único `<style>`, variables CSS (`:root`) copiadas del sistema de diseño existente | Mismo enfoque que `index.html`; sin utility-CSS framework, sin preprocesador |
| Component layer | NOT APPLICABLE | Sin componentes reutilizables entre archivos — es un solo HTML |
| Database | NOT APPLICABLE | Página de marketing estática, sin persistencia de datos |
| ORM / data access | NOT APPLICABLE | No hay capa de datos |
| Auth | NOT APPLICABLE | Página pública, sin cuentas |
| Background work | NOT APPLICABLE | Sin trabajos en segundo plano |
| Payments | NOT APPLICABLE | Sin cobros en esta página — la conversación de venta ocurre en WhatsApp |
| File storage | NOT APPLICABLE | Los assets de media (video, capturas) son archivos estáticos servidos directamente por Vercel, no un servicio de storage aparte |
| Email / notifications | NOT APPLICABLE | Sin notificaciones — el canal de contacto es un enlace directo a WhatsApp |
| Hosting | Vercel (proyecto existente `axis-ia-landing`, dominio `axisai.space`) | Ya está configurado y en producción para la landing 1; esta landing 2 se sirve del mismo despliegue estático, sin configuración adicional |
| Package manager | NOT APPLICABLE | No existe ningún manifiesto de dependencias en el repo — no se introduce uno |

### Compatibility check

Verificado contra `knowledge/stack-compatibility.md` — ninguna de las combinaciones conocidas como
problemáticas en esa tabla aplica aquí. Esa tabla está orientada a stacks con framework, ORM,
identidad y hosting de era JS/serverless; este proyecto no usa ninguno de esos ejes (sin
framework, sin ORM, sin identidad, hosting puramente estático), así que la superficie de conflicto
que la tabla cubre no existe en este build.

---

## 3. Directory Structure

```
axis-ia-landing/                        # raíz del repo — raíz del proyecto objetivo de este blueprint
  index.html                            # EXISTE — landing 1. NUNCA modificado por este blueprint.
  README.md                             # EXISTE — ya documenta la ruta /inmobiliarias/index.html. Sin cambios.
  .gitignore                            # EXISTE — el Paso 0 de §10 le agrega una línea (.workspace-applied). Ningún patrón previo se toca.
  .vercel/                              # EXISTE — config de deploy de Vercel. Sin cambios.
  CLAUDE.md                             # NUEVO — copiado desde workspace/CLAUDE.md (§19.1) por el Paso 0 de §10
  AGENTS.md                             # NUEVO — copiado desde workspace/AGENTS.md (§19.2) por el Paso 0 de §10
  .workspace-applied                    # NUEVO — marcador vacío que crea el Paso 0 de §10; gitignorado por el propio Paso 0, nunca se commitea
  .claude/
    settings.json                       # NUEVO — copiado desde workspace/.claude/settings.json (§19.3)
    skills/
      swap-media-placeholders/
        SKILL.md                        # NUEVO — copiado desde workspace/.claude/skills/... (§19.4)
    rules/
      inmobiliarias-landing.md          # NUEVO — copiado desde workspace/.claude/rules/... (§19.5)
  blueprints/
    landing-inmobiliarias/              # este bundle — permanece en el repo, NO se copia a ningún lado
      blueprint.md
      tasks.json
      epics/
        01-landing-inmobiliarias.md
      workspace/                        # el Paso 0 de §10 copia el CONTENIDO de esta carpeta a la raíz del repo
        CLAUDE.md
        AGENTS.md
        .claude/
          settings.json
          skills/swap-media-placeholders/SKILL.md
          rules/inmobiliarias-landing.md
  inmobiliarias/                        # NUEVO — carpeta de la landing 2 (creada en §9 Paso 1)
    index.html                          # NUEVO — la landing completa (§9 Pasos 1-4)
    assets/                             # NUEVO — carpeta para media real, pendiente (§9 Paso 1)
      README.md                         # NUEVO — documenta las rutas y nombres esperados para el video/capturas reales
      # demo.mp4      ← NO EXISTE TODAVÍA. Ruta esperada, ver inmobiliarias/assets/README.md. Non-goal.
      # poster.jpg    ← NO EXISTE TODAVÍA. Ruta esperada, ver inmobiliarias/assets/README.md. Non-goal.
```

**Boundary rules**

- `inmobiliarias/index.html` no importa ni referencia ningún archivo fuera de `inmobiliarias/assets/`.
- `index.html` (raíz) es de solo lectura para este blueprint — ningún paso de §9 lo edita, y el
  Paso 5 lo verifica explícitamente.
- No se crea ningún archivo CSS o JS separado — todo el CSS vive inline dentro del único `<style>`
  de `inmobiliarias/index.html`, igual que la convención de `index.html` raíz.
- **Convención de rutas de assets (la única "convención de enlace" que existe en este blueprint):**
  todo atributo `src`/`poster` dentro de `inmobiliarias/index.html` que apunte a un archivo de
  `inmobiliarias/assets/` usa una ruta **relativa a `inmobiliarias/index.html`** (`assets/demo.mp4`,
  `assets/poster.jpg`) — nunca `inmobiliarias/assets/demo.mp4`. Esa forma con el prefijo
  `inmobiliarias/` solo se usa para nombrar la ubicación en disco desde la raíz del repo, en este
  blueprint y en los comandos de `Verify`. Ver §19.6, *Resolution convention matrix*, para la
  reconciliación completa — es trivial en este proyecto porque solo existe un resolutor de rutas
  (el navegador), y se comporta igual sirviendo localmente que en producción.

---

## 4. Data Model

NOT APPLICABLE — página de marketing estática sin persistencia de datos, sin backend, sin cuentas
de usuario. No existe ninguna entidad que modelar.

---

## 5. API Design

NOT APPLICABLE — no hay ningún endpoint ni servidor en este proyecto. El único "canal de contacto"
es un enlace `https://wa.me/...` que abre WhatsApp fuera de este sitio; no es una API de este
repositorio.

---

## 6. Frontend Architecture

### Routes

| Route | Page | Data source | Auth |
|---|---|---|---|
| `/inmobiliarias/` (sirve `inmobiliarias/index.html`) | Landing para agencias inmobiliarias | Estático — todo el contenido vive en el propio HTML | Pública |

### Rendering strategy

100% estático. `inmobiliarias/index.html` es el HTML final tal cual se sirve — no hay
renderizado en servidor, no hay hidratación, no hay JavaScript de cliente en absoluto. Vercel sirve
el archivo directamente desde su CDN, exactamente como sirve `index.html` hoy.

### Component hierarchy

```
inmobiliarias/index.html
  <nav>                        # marca + CTA de WhatsApp, sticky
  <header class="hero-inmo">   # titular corto + video/placeholder + CTA de WhatsApp
    .video-frame
      <video>                 # demo.mp4 + poster.jpg (no existen aún — ver Non-Goals)
      .video-placeholder      # mockup CSS de reemplazo, visible mientras no exista el video real
  <section class="pain">       # "Los dolores de una agencia" — 4 .pain-item
  <section class="practica">   # "Cómo se ve en la práctica" — 4 .practica-item (mockups .report-card)
  <section class="final-cta">  # CTA de cierre
  <footer>                     # marca + nota, idéntico a index.html raíz
```

No hay distinción servidor/cliente — todo es HTML estático servido tal cual.

### State management

NOT APPLICABLE — no hay estado de aplicación. El único estado dinámico es el nativo del elemento
`<video>` (reproducir/pausar/volumen), gestionado enteramente por el navegador vía el atributo
`controls`.

### Loading, empty, and error states

- **Video:** mientras no exista `assets/demo.mp4` ni `assets/poster.jpg`, el `.video-placeholder`
  (mockup CSS de una conversación de WhatsApp, reutilizando el lenguaje visual de `.report-card`)
  cubre el área del video. Es el estado "vacío" del video, resuelto sin JavaScript. El elemento
  `<video>` además incluye texto de reemplazo dentro de las etiquetas para navegadores o
  rastreadores que no puedan reproducir video.
- No hay otros estados de carga o error — no hay llamadas de red iniciadas por esta página más allá
  de la carga de las fuentes de Google Fonts (que ya falla de forma silenciosa a una fuente del
  sistema si el servicio no responde, comportamiento nativo del navegador).

---

## 7. Design System

Copiado verbatim del sistema de diseño ya en producción en `index.html` (raíz) — no se define nada
nuevo, solo se añaden las clases necesarias para los componentes propios de esta landing (hero de
video, tarjetas de dolor, mockups de "en la práctica"), siguiendo el mismo lenguaje visual.

### Colors

| Token | Valor | Usage |
|---|---|---|
| `--bg` | `#12181A` | Fondo de página |
| `--surface-1` | `#1B2A26` | Tarjetas, paneles |
| `--surface-2` | `#223531` | Headers de tarjeta, chips |
| `--teal` | `#0F6E56` | Fondos de ícono, numeración |
| `--teal-light` | `#5DCAA5` | Botones primarios, acentos, texto de énfasis |
| `--amber` | `#E9A23B` | Punto decorativo del eyebrow, acento del logo |
| `--amber-text` | `#F0B65C` | Texto de badges |
| `--amber-bg` | `rgba(233,162,59,0.14)` | Fondo de badges |
| `--ink` | `#E9E5D8` | Texto principal |
| `--ink-soft` | `#9BAAA4` | Texto secundario |
| `--border` | `rgba(233,229,216,0.10)` | Divisores sutiles |
| `--border-strong` | `rgba(233,229,216,0.18)` | Bordes de tarjetas |

Esta landing usa un único tema (oscuro) — igual que `index.html` raíz, no hay modo claro.

**Contraste — medido con la fórmula WCAG de luminancia relativa, sobre los pares de mayor riesgo:**

| Par | Ratio | Uso | ¿Pasa AA? |
|---|---|---|---|
| `--ink` (#E9E5D8) sobre `--bg` (#12181A) | **14.23:1** | Texto de cuerpo | Sí (AAA) |
| `--ink-soft` (#9BAAA4) sobre `--bg` (#12181A) | **7.41:1** | Texto secundario, párrafos | Sí (AAA) |
| Texto de botón `#082A1B` sobre `--teal-light` (#5DCAA5) | **7.70:1** | Botones primarios (`.btn-primary`, `.nav-cta`) | Sí (AAA) |
| `--teal-light` (#5DCAA5) sobre `--bg` (#12181A) | **8.93:1** | Eyebrow, texto de acento | Sí (AAA) |
| `--amber-text` (#F0B65C) sobre `--surface-1` (#1B2A26) | **8.22:1** | Badges | Sí (AAA) |

Los cinco pares superan 4.5:1 (texto normal) y 3:1 (texto grande/bordes de UI) con margen amplio —
todos por encima de AAA, no solo de AA.

### Typography

| Role | Family | Size / line-height | Weight | Tracking |
|---|---|---|---|---|
| Display / headings | Space Grotesk | `clamp(28px,5vw,42px)` / 1.15 (h1) | 700 | -0.01em |
| Body | IBM Plex Sans | 15.5-16.5px / 1.6 | 400-600 | normal |
| Labels / eyebrow | Space Grotesk | 12px | 600 | 0.08em uppercase |

**Font loading:** Google Fonts vía `<link rel="preconnect">` ×2 + un `<link>` de stylesheet,
idéntico a `index.html`. `display=swap` ya incluido en la URL de Google Fonts — evita texto
invisible mientras carga. Fallback: `sans-serif` genérico del navegador.

### Spacing, radius, elevation

- Spacing: sigue los valores ya usados en `index.html` (24px de padding de `.wrap`, 76px de padding
  vertical de `section`, 16-24px de gaps internos).
- Radius: 100px (píldora, botones), 16-20px (tarjetas grandes), 12px (tarjetas pequeñas), 8-9px
  (marca del logo).
- Sombras: `0 30px 60px -20px rgba(0,0,0,0.55)` en tarjetas elevadas (`.report-card`,
  `.video-frame`) — idéntico a `index.html`.
- Max content width: 1120px (`.wrap`) · Breakpoints: 860px, 520px (idénticos a `index.html`).

### Motion

`html { scroll-behavior: smooth }` y `@media (prefers-reduced-motion: reduce) { * { transition:
none !important; scroll-behavior: auto !important; } }` — copiados verbatim de `index.html`.

**Excepción documentada:** el `<video>` lleva `autoplay muted loop playsinline`. No es posible
condicionar `autoplay` a `prefers-reduced-motion` sin JavaScript, y este proyecto es cero-JS por
decisión explícita (§20.3, decisión #4). El atributo `controls` le da a cualquier usuario una forma
inmediata de pausar el video — es la mitigación aceptada.

### Component style

Continuidad visual estricta con la landing 1: tarjetas oscuras con bordes sutiles, acentos en teal
y ámbar, tipografía Space Grotesk para títulos e IBM Plex Sans para cuerpo, botones en píldora. El
único componente genuinamente nuevo es `.video-frame`/`.video-placeholder` (marco de video vertical
3:4 con mockup de conversación de WhatsApp de reemplazo) — construido reutilizando exactamente la
paleta y las proporciones de `.report-card`, para que no se sienta como un componente ajeno al
resto del sitio.

---

## 8. Authentication & Authorization

NOT APPLICABLE — página pública sin cuentas de usuario, sin sesiones, sin datos privados.

---

## 9. BUILD ORDER

**Nota de alcance para este build order:** este es un cambio brownfield acotado a un único archivo
nuevo. 5 pasos es el tamaño real del trabajo — no se rellena a un conteo artificial. La regla de
conteo de `templates/blueprint-template.md` §9 ("One step, one unit") sigue aplicando: 5 pasos → 1
epic (`ceil(5÷9)=1`, `floor(5÷5)=1`), que es exactamente lo que emite este bundle.

### 9.1 Parity and cutover

NOT APPLICABLE — build greenfield dentro de un repo brownfield: no se reemplaza ningún sistema en
producción. `inmobiliarias/index.html` es un archivo nuevo que no existía; no hay una ruta vieja
que dar de baja ni tráfico que migrar.

---

### Step 1 — Estructura, shell de página, nav y hero con video/placeholder

**Do**

Crear:
- `inmobiliarias/` y `inmobiliarias/assets/` (carpetas)
- `inmobiliarias/assets/README.md` — documenta las rutas esperadas para el video y las capturas
  reales que llegarán después (contenido exacto abajo)
- `inmobiliarias/index.html` — el archivo completo del `<head>` hasta el cierre del `<header
  class="hero-inmo">`, incluyendo el `<style>` completo con **todas** las reglas CSS que esta
  landing necesita (incluidas las de las secciones que se rellenan en los Pasos 2-4 — es más simple
  escribir el `<style>` una sola vez que editarlo en cada paso; las reglas de secciones futuras no
  tienen efecto visible hasta que exista el HTML que las use, lo cual es inofensivo)

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

Contenido exacto de `inmobiliarias/index.html` (Paso 1 — hasta el cierre de `</header>`; los Pasos
2-4 insertan contenido inmediatamente antes de `</body>`, en el orden en que se listan):

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

**IMPORTANTE:** deja `</body>\n</html>` como el final del archivo por ahora — los Pasos 2, 3 y 4
insertan contenido nuevo **inmediatamente antes de `</body>`**, en ese orden.

**Done when**
- [ ] WHEN se abre `inmobiliarias/index.html` en un navegador THE SYSTEM SHALL mostrar la barra de
      navegación con el logo "Axis IA" y un botón "Hablar por WhatsApp" que enlaza a
      `https://wa.me/584121484033?text=Hola%2C%20quiero%20ver%20el%20agente%20de%20WhatsApp%20para%20mi%20inmobiliaria`.
- [ ] WHEN se ejecuta `test "$(grep -c "584121484033" inmobiliarias/index.html)" = "2"` THE SYSTEM
      SHALL salir con código 0 (nav + CTA del hero — el CTA final todavía no existe).
- [ ] WHEN se ejecuta `grep -q 'src="assets/demo.mp4"' inmobiliarias/index.html` THE SYSTEM SHALL
      salir con código 0.
- [ ] WHEN se ejecuta `grep -q 'class="video-placeholder"' inmobiliarias/index.html` THE SYSTEM
      SHALL salir con código 0, confirmando que el mockup CSS de reemplazo del video está presente.
- [ ] WHEN se ejecuta `test -f inmobiliarias/assets/README.md` THE SYSTEM SHALL salir con código 0.

**Verify**
```bash
grep -q 'class="brand-name"' inmobiliarias/index.html          # expect: exit 0
test "$(grep -c "584121484033" inmobiliarias/index.html)" = "2" # expect: exit 0
grep -q 'src="assets/demo.mp4"' inmobiliarias/index.html        # expect: exit 0
grep -q 'poster="assets/poster.jpg"' inmobiliarias/index.html   # expect: exit 0
grep -q 'class="video-placeholder"' inmobiliarias/index.html    # expect: exit 0
test -f inmobiliarias/assets/README.md                          # expect: exit 0
```

**Checkpoint**
```bash
git add -A && git commit -m "step 1: estructura, shell, nav y hero con video/placeholder"
git tag step-01-shell-nav-hero
# rollback target si el Paso 2 sale mal: git reset --hard step-01-shell-nav-hero
```

---

### Step 2 — Sección "Los dolores de una agencia"

**Do**

Editar `inmobiliarias/index.html`: insertar el siguiente bloque **inmediatamente antes de
`</body>`** (todo el CSS que este bloque necesita — `.pain-grid`, `.pain-item`, `.pain-num` — ya
existe desde el Paso 1).

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

**Done when**
- [ ] WHEN se ejecuta `test "$(grep -c 'class="pain-item"' inmobiliarias/index.html)" = "4"` THE
      SYSTEM SHALL salir con código 0.
- [ ] WHEN se ejecuta `grep -q 'Los dolores de una agencia con varios agentes'
      inmobiliarias/index.html` THE SYSTEM SHALL salir con código 0.
- [ ] WHEN se ejecuta `grep -q 'Sin forma clara de repartir leads entre agentes'
      inmobiliarias/index.html` THE SYSTEM SHALL salir con código 0.
- [ ] WHEN se ejecuta `grep -q 'Coordinar visitas a propiedades consume horas del equipo'
      inmobiliarias/index.html` THE SYSTEM SHALL salir con código 0.

**Verify**
```bash
test "$(grep -c 'class="pain-item"' inmobiliarias/index.html)" = "4"                          # expect: exit 0
grep -q 'Los dolores de una agencia con varios agentes' inmobiliarias/index.html               # expect: exit 0
grep -q 'Sin forma clara de repartir leads entre agentes' inmobiliarias/index.html             # expect: exit 0
grep -q 'Coordinar visitas a propiedades consume horas del equipo' inmobiliarias/index.html    # expect: exit 0
```

**Checkpoint**
```bash
git add -A && git commit -m "step 2: seccion los dolores de una agencia"
git tag step-02-pain-points
# rollback target si el Paso 3 sale mal: git reset --hard step-02-pain-points
```

---

### Step 3 — Sección "Cómo se ve en la práctica"

**Do**

Editar `inmobiliarias/index.html`: insertar el siguiente bloque **inmediatamente antes de
`</body>`** (después de la sección `.pain` del Paso 2). Reutiliza el componente `.report-card`/
`.rc-*` ya definido en el `<style>` del Paso 1 — sin inventar un estilo nuevo.

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

**Done when**
- [ ] WHEN se ejecuta `test "$(grep -c 'class="practica-item"' inmobiliarias/index.html)" = "4"`
      THE SYSTEM SHALL salir con código 0.
- [ ] WHEN se ejecuta `grep -q 'Así se ve en la práctica' inmobiliarias/index.html` THE SYSTEM
      SHALL salir con código 0.
- [ ] WHEN se ejecuta `grep -q 'Reparto automático' inmobiliarias/index.html` THE SYSTEM SHALL
      salir con código 0.
- [ ] WHEN se ejecuta `grep -q 'Panel del dueño' inmobiliarias/index.html` THE SYSTEM SHALL salir
      con código 0.

**Verify**
```bash
test "$(grep -c 'class="practica-item"' inmobiliarias/index.html)" = "4"    # expect: exit 0
grep -q 'Así se ve en la práctica' inmobiliarias/index.html                  # expect: exit 0
grep -q 'Reparto automático' inmobiliarias/index.html                       # expect: exit 0
grep -q 'Panel del dueño' inmobiliarias/index.html                          # expect: exit 0
```

**Checkpoint**
```bash
git add -A && git commit -m "step 3: seccion como se ve en la practica"
git tag step-03-practica
# rollback target si el Paso 4 sale mal: git reset --hard step-03-practica
```

---

### Step 4 — CTA final, footer y confirmación de la pasada responsive

**Do**

Editar `inmobiliarias/index.html`: insertar el siguiente bloque **inmediatamente antes de
`</body>`** (después de la sección `.practica` del Paso 3) — reemplaza el final del archivo por
este contenido seguido de `</body>\n</html>`.

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

Nota de implementación (Riesgo #3, §20.2): `.practica-item` es un contenedor de ancho flexible sin
una relación de aspecto forzada sobre el mockup — cuando llegue una captura real, se reemplaza el
`.report-card` interno por un `<img>` sin tener que rehacer el CSS de la grilla.

Después de insertar este bloque, confirma la pasada responsive completa: el archivo entero (nav +
hero + dolores + práctica + CTA final + footer) debe apilarse en una sola columna por debajo de
860px (`.pain-grid`, `.practica-grid` ya definidos así desde el Paso 1) y reducir paddings por
debajo de 520px — ambas reglas ya están en el `<style>` desde el Paso 1; este paso solo las verifica
contra el documento completo.

**Done when**
- [ ] WHEN se ejecuta `test "$(grep -c "584121484033" inmobiliarias/index.html)" = "3"` THE SYSTEM
      SHALL salir con código 0 (nav + hero + CTA final — ya completo).
- [ ] WHEN se ejecuta `grep -q '@media (max-width: 860px)' inmobiliarias/index.html` THE SYSTEM
      SHALL salir con código 0.
- [ ] WHEN se ejecuta `grep -q '@media (max-width: 520px)' inmobiliarias/index.html` THE SYSTEM
      SHALL salir con código 0.
- [ ] WHEN se ejecuta `grep -q 'Automatización con inteligencia artificial · Venezuela'
      inmobiliarias/index.html` THE SYSTEM SHALL salir con código 0.
- [ ] WHEN se ejecuta `grep -q '</html>' inmobiliarias/index.html` THE SYSTEM SHALL salir con
      código 0 — el archivo quedó correctamente cerrado.

**Verify**
```bash
test "$(grep -c "584121484033" inmobiliarias/index.html)" = "3"                                # expect: exit 0
grep -q '@media (max-width: 860px)' inmobiliarias/index.html                                    # expect: exit 0
grep -q '@media (max-width: 520px)' inmobiliarias/index.html                                    # expect: exit 0
grep -q 'Automatización con inteligencia artificial · Venezuela' inmobiliarias/index.html        # expect: exit 0
grep -q '</html>' inmobiliarias/index.html                                                       # expect: exit 0
```

**Checkpoint**
```bash
git add -A && git commit -m "step 4: cta final, footer y pasada responsive"
git tag step-04-cta-footer-responsive
# rollback target si el Paso 5 sale mal: git reset --hard step-04-cta-footer-responsive
```

---

### Step 5 — Verificación final: la ruta resuelve y la landing 1 no cambió

**Do**

Ningún archivo nuevo. Este paso solo verifica dos cosas críticas antes de dar el build por
terminado: (1) que `/inmobiliarias/` resuelve como página completa sirviendo el árbol estático
localmente — el mismo mecanismo que usa Vercel en producción (Riesgo #2, §20.2) — y (2) que
`index.html` (landing 1) no cambió ni un byte en todo este build.

**Done when**
- [ ] WHEN se sirve el repositorio con `npx --yes http-server . -p 8080` y se pide
      `http://localhost:8080/inmobiliarias/` THE SYSTEM SHALL responder con código HTTP `200`.
- [ ] WHEN se pide `http://localhost:8080/inmobiliarias/index.html` directamente THE SYSTEM SHALL
      responder también con código HTTP `200`.
- [ ] WHEN se ejecuta `git diff --stat -- index.html` THE SYSTEM SHALL no producir ninguna salida
      — landing 1 permanece sin cambios.
- [ ] WHEN se ejecuta `test "$(grep -c "584121484033" inmobiliarias/index.html)" = "3"` THE SYSTEM
      SHALL salir con código 0 — el conteo final de CTAs de WhatsApp es correcto.

**Verify**
```bash
# Mata cualquier servidor huérfano de una corrida anterior antes de empezar — necesario porque
# `kill "$SERVER_PID"` por sí solo no basta (ver la función abajo).
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

npx --yes http-server . -p 8080 >/dev/null 2>&1 &   # --yes evita el prompt interactivo de npx en la primera corrida
sleep 3   # npx puede tardar en resolver el paquete la primera vez — 1s no siempre alcanza

CODE_DIR=$(curl -s -o /dev/null -w '%{http_code}' http://localhost:8080/inmobiliarias/)
CODE_FILE=$(curl -s -o /dev/null -w '%{http_code}' http://localhost:8080/inmobiliarias/index.html)

kill_port_8080   # `kill "$SERVER_PID"` no es suficiente: npx deja el servidor real corriendo como
                 # hijo, y el PID que $! captura no lo arrastra consigo — verificado en esta máquina

test "$CODE_DIR" = "200"     # expect: exit 0 — Vercel sirve /inmobiliarias/ vía index.html por defecto, igual que aquí
test "$CODE_FILE" = "200"    # expect: exit 0

test -z "$(git diff --stat -- index.html)"                       # expect: exit 0 — landing 1 no cambió ni un byte
test "$(grep -c "584121484033" inmobiliarias/index.html)" = "3"  # expect: exit 0
```

**Checkpoint**
```bash
git add -A && git commit -m "step 5: verificacion final — ruta resuelve, landing 1 intacta" --allow-empty
git tag step-05-verify-deploy-ready
git ls-files --error-unmatch inmobiliarias/index.html inmobiliarias/assets/README.md   # expect: exit 0 — ambos commiteados
test -z "$(git status --porcelain)"                                                    # expect: exit 0 — árbol limpio tras el commit
# El build está listo para desplegar: vercel --prod
```

---

## 10. Environment Setup

### Prerequisites

| Tool | Version | Check |
|---|---|---|
| Git | cualquiera reciente | `git --version` |
| Shell POSIX (bash) | cualquiera — Git Bash o WSL en Windows, nativo en macOS/Linux | Todo comando `Verify`/`Checkpoint`/gate de este blueprint usa sintaxis bash (`$(...)`, `&`, `$!`, `\|\|`); cmd.exe/PowerShell puro no basta |
| Node.js + npm | cualquiera reciente (LTS) — necesario solo para servir localmente durante `Verify`, vía `npx http-server` | `node --version` y `npx --version`. Decisión explícita — ver §20.3, decisión #2: esta convención cero-dependencias prefería Python para no depender de npm, pero la máquina de desarrollo real no tiene un intérprete de Python funcional (solo alias de Microsoft Store que fallan), mientras que Node sí está presente |
| curl | cualquiera reciente (viene preinstalado en macOS, Linux y Windows 10+) | `curl --version` |
| Vercel CLI | cualquiera reciente — solo para desplegar, no para el build | `vercel --version` |

No hay Node, npm, pnpm, ni ningún gestor de paquetes en la lista de prerequisitos — este proyecto
no los usa.

### Accounts to create first

Ninguna cuenta nueva. El proyecto Vercel (`axis-ia-landing`) y el dominio (`axisai.space`) ya
existen y ya están conectados — este blueprint no crea infraestructura nueva.

### Environment variables

NOT APPLICABLE — no hay ninguna variable de entorno en este proyecto. No hay secretos, no hay
claves de API, no hay configuración sensible: es HTML estático servido tal cual.

### Files that must be committed

| File | Why it is committed | Ignore-file exception line |
|---|---|---|
| `inmobiliarias/index.html` | Es la landing completa — el entregable de este build | — no coincide con ningún patrón de `.gitignore` |
| `inmobiliarias/assets/README.md` | Documenta las rutas esperadas de los assets reales pendientes | — no coincide con ningún patrón de `.gitignore` |
| `CLAUDE.md`, `AGENTS.md` | Primeros archivos de agente del repo — deben persistir para sesiones futuras | — no coincide con ningún patrón de `.gitignore` |
| `.claude/settings.json`, `.claude/skills/**`, `.claude/rules/**` | Configuración del agente para este repo | — no coincide con ningún patrón de `.gitignore`; el `.gitignore` actual no tiene ninguna entrada `.claude/` |
| `blueprints/landing-inmobiliarias/**` | El propio bundle de este blueprint, para trazabilidad futura | — no coincide con ningún patrón de `.gitignore` |

`.gitignore` actual del repo (verificado antes de escribir este blueprint) contiene únicamente
`.vercel` (duplicado) y `.DS_Store` — ningún patrón amplio (`.env*`, `*.local`, `.claude/`) que
pudiera tragarse alguno de los archivos de arriba. La única línea que este blueprint le agrega es
`.workspace-applied` (ver Bootstrap abajo), para que el marcador de bootstrap nunca se commitee.

### Bootstrap

```bash
# orden: repo ya existe (historial previo, árbol limpio verificado) → copiar workspace/ (idempotente) → listo para el Paso 1

# El repositorio ya existe con commits previos — no se crea un commit vacío de "scaffold":
# el primer commit de este blueprint es el Checkpoint del Paso 1 en §9.
git rev-parse --git-dir >/dev/null 2>&1 || git init -b main   # no-op esperado: el repo ya existe

# Copia guardada del workspace del agente — no pisa CLAUDE.md/AGENTS.md/.claude/settings.json
# si alguien ya los editó a mano tras una corrida anterior de este mismo bootstrap.
# Ambas ramas del `||` salen con código 0: si el marcador ya existe, el test de la izquierda
# tiene éxito y no se ejecuta nada más.
[ -e ".workspace-applied" ] || { cp -R "blueprints/landing-inmobiliarias/workspace/." "." && touch ".workspace-applied"; }

# El marcador es un detalle de bootstrap, no un artefacto del proyecto — nunca debe commitearse.
# Sin esta línea, el `git add -A` del Checkpoint del Paso 1 lo commitearía igual.
grep -qxF ".workspace-applied" .gitignore 2>/dev/null || echo ".workspace-applied" >> .gitignore

# Carpeta de la landing 2 — -p no falla si ya existe (idempotente)
mkdir -p inmobiliarias/assets

node --version && npx --version   # confirma que Node/npx están disponibles para el Paso 5 y §20.1 — ver Prerequisites en §10
```

**Archivos que este bootstrap nunca vuelve a pisar una vez copiados:** `CLAUDE.md`, `AGENTS.md`,
`.claude/settings.json`, y todo lo que haya bajo `.claude/skills/` y `.claude/rules/` — el marcador
`.workspace-applied` es lo que lo garantiza.

---

## 11. Dependencies

NOT APPLICABLE en el sentido de un manifiesto de dependencias — **no existe ningún gestor de
paquetes en este proyecto**, ni antes de este blueprint ni después. No se emite `package.json`, ni
ningún equivalente. Esto es una decisión explícita, no un descuido: ver §20.3, decisión #1.

### Runtime

NOT APPLICABLE — sin paquetes de runtime, sin gestor de paquetes.

### Development

NOT APPLICABLE — sin paquetes de desarrollo, sin gestor de paquetes.

### Recursos externos alojados (sin versión — regla de provenance para servicios alojados)

| Recurso | Uso | Fuente | Checked |
|---|---|---|---|
| Google Fonts — `Space+Grotesk:wght@500;600;700` + `IBM+Plex+Sans:wght@400;500;600;700` | Tipografía del sitio, cargada vía `<link>` en el `<head>` | `https://fonts.googleapis.com/css2?...` — mismo enlace exacto que ya usa `index.html` en producción | 2026-08-22 — confirmado por inspección directa de `index.html` (línea 9), no por verificación de un registro de paquetes: es un servicio alojado, no una versión de paquete (regla de provenance: los servicios alojados no llevan número de versión) |

### Deliberately not used

| Rejected | Instead | Why |
|---|---|---|
| Framework de frontend (React, Astro, cualquier generador de sitios estáticos) | HTML estático plano | Coincide con la convención cero-dependencias de `index.html` existente — ver §20.3, decisión #1 |
| Gestor de paquetes (npm, pnpm, yarn) | Ninguno | No hay nada que gestionar: cero dependencias de código |
| Utility-CSS framework (Tailwind y similares) | CSS inline con variables `:root` | Mismo enfoque que `index.html`; introducir un framework de utilidades solo para una página rompería la coherencia del repo |
| `python3 -m http.server` | `npx http-server` (Node) | Esta máquina de desarrollo no tiene un intérprete de Python real — solo alias de Microsoft Store que fallan — mientras que Node sí está presente. Ver §20.3, decisión #2 |

---

## 12. Deployment Strategy

### Hosting

Vercel, proyecto existente `axis-ia-landing` (`projectId: prj_QU2TjYqMb5cus6Pi5H7bTfG8MTK6`),
dominio `axisai.space`. Sin build command (proyecto estático puro — Vercel sirve el árbol de
archivos tal cual). Output directory: la raíz del repo. Runtime: estático, sin funciones
serverless.

### Environments

| Environment | Branch | URL | Database | Third-party mode |
|---|---|---|---|---|
| Local | — | `http://localhost:8080/inmobiliarias/` (vía `npx http-server . -p 8080`) | NOT APPLICABLE | NOT APPLICABLE |
| Preview | No confirmado en este blueprint — depende de si el proyecto Vercel está conectado a GitHub para despliegues automáticos por PR. Verificar en el dashboard de Vercel antes de asumirlo | — | NOT APPLICABLE | NOT APPLICABLE |
| Production | `master` (deploy manual vía `vercel --prod`, según documenta `README.md`) | `https://axisai.space/inmobiliarias/` | NOT APPLICABLE | NOT APPLICABLE |

### CI/CD

NOT APPLICABLE — no existe `.github/workflows` ni ningún otro pipeline de CI en este repo, y este
blueprint no introduce uno. El despliegue es manual vía `vercel --prod`, tal como ya documenta
`README.md`.

### Release and rollback

El despliegue se promueve manualmente con `vercel --prod`. Si un despliegue sale mal, Vercel
conserva el historial de despliegues anteriores y permite volver a promover uno previo desde su
dashboard o con `vercel rollback` — mecanismo nativo de la plataforma, no algo que este blueprint
construya. No hay migraciones de base de datos que ordenar respecto al deploy — no hay base de
datos.

### Domain, DNS, TLS

`axisai.space` ya está conectado al proyecto Vercel (preexistente, fuera del alcance de este
blueprint). TLS gestionado automáticamente por Vercel. No se crean registros DNS nuevos — la ruta
`/inmobiliarias/` vive bajo el mismo dominio y certificado que ya sirve la landing 1.

---

## 13. Testing Strategy

| Layer | Framework | What it covers | Where | Runs |
|---|---|---|---|---|
| Estructural (grep/curl) | Ninguno — comandos de shell directos | Presencia de contenido, conteo exacto de CTAs, código de estado HTTP de la ruta | Comandos `Verify` de cada paso en §9 | En cada paso del build, y de nuevo en el gate global §20.1 |
| Unit / Integration / E2E | NOT APPLICABLE | — | — | No hay lógica de aplicación que probar — es HTML estático sin JavaScript |

### Critical flows to cover E2E

NOT APPLICABLE — no hay flujos de varios pasos que probar. El único "flujo" es abrir un enlace de
WhatsApp, que ocurre completamente fuera de este sitio.

### Test data

NOT APPLICABLE — no hay base de datos ni estado que sembrar.

### What is deliberately not tested

- **Regresión visual y renderizado cross-browser automatizado** — no hay herramienta instalada
  (Playwright, Percy, etc.) porque introducirla rompería la convención cero-dependencias. Se
  reemplaza por una revisión manual en un teléfono real antes de imprimir las tarjetas con el QR —
  ver el checklist de lanzamiento post-build en §20.1.
- **Accesibilidad automatizada (axe, pa11y)** — mismo motivo. Se reemplaza por el pase manual
  descrito en §15.

---

## 14. Security & Secrets

| Concern | Control | Implemented in |
|---|---|---|
| Secret storage | NOT APPLICABLE | No hay secretos — página pública sin credenciales de ningún tipo |
| Secret rotation | NOT APPLICABLE | — |
| Input validation | NOT APPLICABLE | No hay formularios ni entrada de usuario en esta página |
| Output encoding / XSS | NOT APPLICABLE | Contenido 100% estático, sin datos dinámicos reflejados |
| SQL injection | NOT APPLICABLE | Sin base de datos |
| AuthN / AuthZ | NOT APPLICABLE | Página pública |
| CSRF | NOT APPLICABLE | Sin formularios ni mutaciones |
| Rate limiting / abuse | NOT APPLICABLE | Sin endpoints propios que abusar — el único "endpoint" es `wa.me`, gestionado por WhatsApp |
| Webhook verification | NOT APPLICABLE | Sin webhooks |
| Dependency audit | NOT APPLICABLE | Sin dependencias que auditar |
| Security headers | No configurados explícitamente en este build — se heredan los defaults de Vercel para contenido estático | Fuera de alcance de este cambio; ver §20.4 si se decide endurecerlos más adelante |
| PII handling | NOT APPLICABLE | Esta página no recolecta ningún dato — la conversación ocurre enteramente dentro de WhatsApp, fuera de este sitio |
| Logging hygiene | NOT APPLICABLE | No hay código de servidor que genere logs |

**Hard rules**

- No hay ningún secreto que commitear, imprimir en un log, ni exponer en el bundle — no existe
  ningún secreto en este proyecto.
- No hay checks de autorización server-side porque no hay servidor.
- No hay webhooks de terceros que verificar.

Este proyecto no maneja datos regulados (salud, financieros, de menores, datos personales de la UE)
— no recolecta ningún dato en absoluto.

---

## 15. Accessibility

**Target: WCAG 2.2 Level AA.**

### Baseline requirements

| Requirement | Rule | Estado en esta landing |
|---|---|---|
| Semantic HTML | Landmarks, un `h1` por página, headings en orden, listas para listas | Cumple: `nav`/`header`/`section`×3/`footer`; un único `<h1>` en el hero; `h2` en cada sección, `h3` dentro de tarjetas — orden correcto |
| Keyboard | Todo elemento interactivo alcanzable por teclado; orden de tab lógico; sin trampas; skip-link | Cumple: los 3 CTAs son `<a>` nativos; el `<video>` usa controles nativos; se agrega `.skip-link` "Saltar al contenido principal" al inicio del `<body>` |
| Focus visible | Indicador de foco visible, ≥3:1 contra su fondo | Cumple: `:focus-visible { outline: 2px solid var(--teal-light) }` — copiado de `index.html` |
| Contrast | Texto 4.5:1, texto grande/bordes de UI 3:1 | Cumple con amplio margen — ver tabla medida en §7 (todos los pares superan 7:1) |
| Forms | NOT APPLICABLE | Sin formularios en esta página |
| Images | Imágenes con significado llevan alt; decorativas llevan `alt=""` o `aria-hidden` | Cumple: todos los SVG decorativos (logo de nav, logo de footer, íconos de WhatsApp) llevan `aria-hidden="true" focusable="false"`; el `<video>` lleva `aria-label` descriptivo |
| Motion | Todo lo animado respeta `prefers-reduced-motion: reduce` | Cumple para transiciones y scroll; **excepción documentada** para el `autoplay` del video — ver §7 Motion y §20.3 decisión #4 |
| Zoom / reflow | Usable al 200% de zoom y a 320px de ancho sin scroll horizontal | Cumple: layout de una sola columna centrada en el hero, grillas de 2 columnas que colapsan a 1 por debajo de 860px |
| Live regions | NOT APPLICABLE | Sin cambios de estado asíncronos que anunciar |

### WCAG 2.2 additions

| SC | Requirement | Estado |
|---|---|---|
| 2.4.11 Focus Not Obscured (Min) | Un elemento enfocado nunca queda oculto detrás de headers sticky | Cumple: el `.nav` sticky es corto (34px de marca) y no cubre el contenido enfocable de abajo |
| 2.5.7 Dragging Movements | NOT APPLICABLE | Sin interacciones de arrastre |
| 2.5.8 Target Size (Min) | Objetivos de puntero de al menos 24×24px CSS | Cumple: los botones `.btn-primary`/`.nav-cta` tienen padding amplio (9-15px), muy por encima del mínimo |
| 3.3.7 Redundant Entry | NOT APPLICABLE | Sin formularios multi-paso |
| 3.3.8 Accessible Authentication (Min) | NOT APPLICABLE | Sin autenticación |

### Verification

No hay una herramienta automatizada de a11y instalada en este build (axe, pa11y) — introducir una
requeriría Node/npm, lo cual rompe la decisión cero-dependencias (§20.3, decisión #1 y #2). En su
lugar, la verificación es manual, listada como gate en §20.1:

- Pasada completa por teclado (Tab) por el nav, el video y los 3 CTAs — cada uno debe recibir foco
  visible y ser activable con Enter.
- Una pasada con lector de pantalla (VoiceOver o NVDA) sobre el hero y el CTA final, confirmando
  que el `aria-label` del video y el texto de los botones se leen con sentido.
- Zoom al 200% sobre un viewport de 360px de ancho, confirmando que no aparece scroll horizontal.

---

## 16. Observability & Cost

### Instrumentation

NOT APPLICABLE — no se agrega ningún analytics, error tracking, ni logging a esta página,
consistente con `index.html` (raíz), que tampoco lleva ninguno. Ver §20.4 si se decide medir la
conversión real del QR más adelante.

### The metrics that matter for this project

Ver §1, Success metrics — son las únicas métricas de este build, y ambas se miden en tiempo de
construcción (grep/curl), no en producción, porque no hay instrumentación de runtime.

### Health check

NOT APPLICABLE — no hay servidor de aplicación que monitorear; Vercel gestiona la disponibilidad
de su CDN de forma nativa.

### Cost model

| Service | Free tier | Cost at v1 scale | Cost at 10× | Cliff to watch |
|---|---|---|---|---|
| Vercel Hobby (asumido — plan actual del proyecto no confirmado en este blueprint, verificar en el dashboard) | 100GB de ancho de banda/mes | $0/mes — una landing estática de una sola página, tráfico esperado de QR es bajo | $0/mes — el tráfico de QR impreso no escala 10× de forma realista | Si el proyecto ya está en Pro por otras razones ajenas a este build, no cambia nada aquí |
| Google Fonts | Ilimitado, siempre gratuito | $0/mes | $0/mes | Ninguno |

**Estimated monthly cost at launch: $0.** No hay línea de costo que crezca con el uso — es
contenido estático servido por CDN.

---

## 17. Model Routing

NOT APPLICABLE — esta página de marketing no llama a ningún LLM en tiempo de ejecución. El agente
de WhatsApp con IA que la página promociona corre en un sistema completamente distinto, fuera de
este repositorio.

---

## 18. Skills to Use During Build

| Skill | Build steps | Why | Install |
|---|---|---|---|
| `frontend-design` | Pasos 1-4 | Guía para que el HTML/CSS nuevo se sienta production-grade y visualmente distintivo, no genérico | `/plugin marketplace add anthropics/skills` luego `/plugin install example-skills@anthropic-agent-skills` |
| `/humanizalo` | Pasos 2-4 (copy de dolores, mockups y CTAs) | Pasada opcional de tono sobre el copy en español ya escrito en este blueprint, antes de darlo por final | `git clone https://github.com/Hainrixz/humanizalo.git ~/.claude/skills/humanizalo` |

---

## 19. Agent Workspace

Ver `workspace/` en este mismo bundle para los archivos reales. Esta sección describe qué se copia
y por qué — el contenido completo vive en los archivos, no duplicado aquí (bundle mode).

```
blueprints/landing-inmobiliarias/workspace/
├── CLAUDE.md                              # §19.1
├── AGENTS.md                              # §19.2
└── .claude/
    ├── settings.json                      # §19.3
    ├── skills/
    │   └── swap-media-placeholders/
    │       └── SKILL.md                   # §19.4
    └── rules/
        └── inmobiliarias-landing.md       # §19.5
```

El Paso 0 de §10 (Bootstrap) copia el **contenido** de esta carpeta a la raíz del repo con un
comando guardado (no-clobber vía marcador `.workspace-applied`) — ver §10 para el comando exacto y
la razón de por qué está guardado.

### 19.1 `CLAUDE.md`

Archivo completo en `workspace/CLAUDE.md` — el primer `CLAUDE.md` de este repositorio. Bajo 200
líneas, comandos primero. Cubre: cómo servir localmente y verificar, la arquitectura de un solo
archivo, las reglas de código de esta convención (todo inline, no tocar `index.html` raíz, número y
mensaje de WhatsApp), el sistema de diseño con valores literales, y los no-negociables.

### 19.2 `AGENTS.md`

Archivo completo en `workspace/AGENTS.md` — stub de ~20 líneas para agentes que no leen
`CLAUDE.md`, con los comandos y los no-negociables duplicados a propósito (ver
`templates/claude-md-template.md`, *Companion files* — la duplicación es deliberada y de bajo
riesgo porque ambos archivos cambian juntos).

### 19.3 `.claude/settings.json`

Archivo completo en `workspace/.claude/settings.json`. Pre-aprueba **cada** comando que aparece en
algún `Verify` de §9 o en el gate de §20.1 — `grep`, `test`, `curl`, `npx`, `node`, `mkdir`,
`touch`, `cp`, `kill`, `sleep`, `awk`, `netstat`, `taskkill`, `fuser` (los últimos cuatro solo los usa
`kill_port_8080()`, ver Paso 5), y los comandos de `git` de solo lectura o de checkpoint
(`status`, `diff`, `log`, `tag`, `add`, `commit`, `rev-parse`, `init`, `ls-files`).
Deniega `git push` (nunca automático) y `rm -rf` (destructivo, sin uso en este
build).

### 19.4 Project skills — `.claude/skills/<name>/SKILL.md`

| Skill | Triggers on | What it automates |
|---|---|---|
| `swap-media-placeholders` | "reemplaza el video placeholder", "ya tengo el demo.mp4", "sube las capturas reales" | El procedimiento exacto (con su propio `Verify`) para sustituir el `.video-placeholder` por el video real, y cada mockup `.report-card` de "Cómo se ve en la práctica" por una captura real, sin romper el layout ni el sistema de diseño |

Contenido completo en `workspace/.claude/skills/swap-media-placeholders/SKILL.md`.

### 19.5 `.claude/rules/*.md`

| File | `paths` globs | Covers |
|---|---|---|
| `.claude/rules/inmobiliarias-landing.md` | `inmobiliarias/**` | Convención de archivo único, número/mensaje de WhatsApp, tokens de diseño, no cross-linking |

Contenido completo en `workspace/.claude/rules/inmobiliarias-landing.md`. No se creó una segunda
regla con `paths: ["index.html"]` para proteger la landing 1: el patrón de glob para un archivo en
la raíz sin prefijo de carpeta es ambiguo entre implementaciones (podría también matchear
`inmobiliarias/index.html`, que sí se debe poder editar). La protección de `index.html` (raíz) vive
en el no-negociable #1 de `CLAUDE.md`/`AGENTS.md` (siempre cargado, sin ambigüedad de glob) y en el
gate del Paso 5/§20.1.

### 19.6 Verify-critical config and local infrastructure

**Tabla de archivos verify-critical: vacía por diseño.** Ningún `Verify` de §9 invoca un test
runner, un e2e runner, ni depende de un servicio con estado (base de datos, cache, cola, broker).
Todos los `Verify` de este blueprint son `grep`/`test`/`curl` sobre un archivo que el propio paso ya
crea o edita, más el servidor HTTP efímero (`npx http-server`, paquete de Node obtenido de forma
efímera vía `npx` — no se instala como dependencia persistente) que el mismo comando levanta y
apaga dentro del mismo bloque — no hay ningún archivo de configuración de infraestructura que
emitir. Los archivos bajo `workspace/.claude/` (CLAUDE.md, AGENTS.md, settings.json, skills, rules)
no son "verify-critical config" en el sentido de esta subsección — son la configuración del propio
agente, cubiertos en 19.1-19.5 arriba.

| Emit | Whenever |
|---|---|
| NOT APPLICABLE | Ningún `Verify` en este blueprint invoca un test/e2e runner ni depende de un servicio con estado |

#### Resolution convention matrix

**La convención, dicha una vez:** todo atributo `src`/`poster` dentro de `inmobiliarias/index.html`
que apunte a un archivo de `inmobiliarias/assets/` usa una ruta relativa a ese propio archivo
(`assets/demo.mp4`, `assets/poster.jpg`) — nunca con el prefijo `inmobiliarias/`.

NOT APPLICABLE en el sentido de necesitar una matriz de varios contextos — **no existe ningún
bundler, test runner, ni script standalone en este proyecto que resuelva rutas de forma distinta al
navegador.** El único resolutor de rutas es el navegador, y se comporta exactamente igual sirviendo
localmente (`npx http-server` desde la raíz del repo, §9 Paso 5) que en producción (Vercel
sirviendo el mismo árbol estático) — ambos resuelven `assets/demo.mp4` relativo a
`/inmobiliarias/`. No hay un segundo contexto que reconciliar.

#### Cross-artifact value reconciliation

| Shared value | Single source | Literal value | Every other place it appears | Compared |
|---|---|---|---|---|
| Número de WhatsApp | Este blueprint, §1 (dato provisto por el usuario) | `584121484033` | `inmobiliarias/index.html` (×3, Pasos 1 y 4), `tasks.json` (criterios de aceptación de E1-T1, E1-T4, E1-T5), `epics/01-landing-inmobiliarias.md` (mismos criterios), §9 Verify de los Pasos 1/4/5, §20.1 | yes |
| URL completa de WhatsApp con mensaje | Este blueprint, §1 (mensaje provisto por el usuario, codificado con `encodeURIComponent`) | `https://wa.me/584121484033?text=Hola%2C%20quiero%20ver%20el%20agente%20de%20WhatsApp%20para%20mi%20inmobiliaria` | `inmobiliarias/index.html` (×3: nav-cta, hero CTA, CTA final — Pasos 1 y 4) | yes |
| Ruta de la página | `README.md` existente (ya la documentaba antes de este blueprint) | `/inmobiliarias/` (sirve `inmobiliarias/index.html`) | §1 Vision, §9 Paso 5 Verify, §12 Environments, §20.1 gate | yes |
| Puerto del servidor local | Este blueprint, §10 (decisión propia — ver §20.3 decisión #2) | `8000` | §9 Paso 5 Verify, §20.1 gate, `workspace/CLAUDE.md` tabla de comandos | yes |
| Rutas de assets pendientes | `inmobiliarias/index.html`, atributos `src`/`poster` (Paso 1) | `assets/demo.mp4`, `assets/poster.jpg` | `inmobiliarias/assets/README.md` (Paso 1), §1 Non-Goals, §20.2 Riesgo #1 | yes |
| Ruta del bundle en disco | Ubicación real de este bundle | `blueprints/landing-inmobiliarias/workspace/` | §10 Bootstrap (comando de copia), §19 preámbulo, §3 árbol de directorios | yes |

#### Byte-exact artifact reconciliation

NOT APPLICABLE — ningún comando `Verify` de este blueprint compara bytes exactos contra un archivo
dorado, fixture o snapshot almacenado. Todos los `Verify` son `grep -q`/`grep -c` (presencia y
conteo de texto) o comparaciones de código de estado HTTP vía `curl` — ninguno hace `diff` contra un
literal pre-escrito.

#### El bundle vive dentro del proyecto — exclusión de rutas de configuración

NOT APPLICABLE — no existe ninguna herramienta en este proyecto que recorra el árbol de archivos en
busca de configuración (no hay linter, no hay formateador, no hay type-checker, no hay test
runner). `blueprints/landing-inmobiliarias/` no tiene ninguna superficie de herramienta con la que
interferir.

---

## 20. Acceptance Gate, Risks & Decision Log

### 20.1 Global acceptance gate

El proyecto está **terminado** cuando cada comando de abajo sale con código 0 en un checkout
limpio, y no antes.

```bash
# 1. Contenido y CTAs
test "$(grep -c "584121484033" inmobiliarias/index.html)" = "3"                 # expect: exit 0
test "$(grep -c 'class="pain-item"' inmobiliarias/index.html)" = "4"            # expect: exit 0
test "$(grep -c 'class="practica-item"' inmobiliarias/index.html)" = "4"        # expect: exit 0
grep -q 'src="assets/demo.mp4"' inmobiliarias/index.html                        # expect: exit 0
grep -q 'poster="assets/poster.jpg"' inmobiliarias/index.html                   # expect: exit 0
test -f inmobiliarias/assets/README.md                                          # expect: exit 0

# 2. La ruta resuelve igual que en Vercel (sirviendo estático desde la raíz del repo)
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
test "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:8080/inmobiliarias/)" = "200"           # expect: exit 0
test "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:8080/inmobiliarias/index.html)" = "200" # expect: exit 0
kill_port_8080

# 3. Landing 1 intacta
test -z "$(git diff --stat -- index.html)"     # expect: exit 0 — ni un byte cambiado
```

**No hay comando de a11y automatizado** en este gate — decisión cero-dependencias documentada en
§15. Su equivalente vive en la lista manual de abajo.

Plus these manual gates, each checked once before launch:

- [ ] Cada paso de §9 tiene su tag de checkpoint en git — `git tag -l 'step-*'` lista exactamente
      5, uno por paso.
- [ ] Cada archivo de la tabla "Files that must be committed" de §10 está presente en un checkout
      limpio: `git ls-files --error-unmatch <path>` sale 0 para cada uno, invocado una ruta a la
      vez.
- [ ] Cada fila de la tabla de reconciliación cruzada en §19.6 dice "Compared: yes" — confirmado
      manualmente al escribir este blueprint, y re-confirmable en cualquier momento re-leyendo esa
      tabla contra los archivos reales.
- [ ] `blueprints/landing-inmobiliarias/workspace/` se copió una segunda vez sobre un árbol ya
      bootstrapeado (`bash -c '[ -e ".workspace-applied" ] || { cp -R
      "blueprints/landing-inmobiliarias/workspace/." "." && touch ".workspace-applied"; }'`), salió
      con código 0, y no modificó `CLAUDE.md`, `AGENTS.md` ni `.claude/settings.json` (`git diff
      --stat -- CLAUDE.md AGENTS.md .claude/settings.json` no muestra salida tras la segunda
      corrida).
- [ ] Cada no-goal de §1 sigue sin construirse — en particular: `index.html` (raíz) no cambió
      (`git diff --stat -- index.html` sin salida), no existe ningún `<a>` en
      `inmobiliarias/index.html` que enlace de vuelta a `/` ni ningún `<a>` en `index.html` que
      enlace a `/inmobiliarias/`.
- [ ] Pase manual de accesibilidad completo, según §15: navegación por teclado de nav + video + 3
      CTAs, una pasada con lector de pantalla sobre el hero y el CTA final, zoom al 200% a 360px de
      ancho sin scroll horizontal.
- [ ] `vercel --prod` desplegado y `https://axisai.space/inmobiliarias/` responde `200` con
      certificado TLS válido — revisión manual en un teléfono real antes de imprimir tarjetas con
      el QR.
- [ ] Confirmar en el dashboard/despliegue de Vercel que `/inmobiliarias/` sirve
      `inmobiliarias/index.html` sin necesitar `vercel.json` (Riesgo #2, abajo). Si falla, aplicar
      el `vercel.json` mínimo documentado en el Riesgo #2 antes de dar el build por cerrado.

**No warnings are ignored.**

### 20.2 Risk register

| Risk | Likelihood | Impact | Early signal | Mitigation |
|---|---|---|---|---|
| El archivo `.mp4` real llega con un nombre o formato distinto al esperado | M | L | El video no reproduce tras copiar el archivo nuevo | Este blueprint fija y documenta una única ruta esperada (`inmobiliarias/assets/demo.mp4`) y su poster (`inmobiliarias/assets/poster.jpg`) en `inmobiliarias/assets/README.md` (Paso 1) — soltar el archivo real con ese nombre exacto no requiere ningún cambio de código |
| Vercel no resuelve `/inmobiliarias` a `/inmobiliarias/index.html` sin config explícita en este proyecto en particular | L | M | `curl` a `https://axisai.space/inmobiliarias/` devuelve 404 tras el deploy | El Paso 5 de §9 y el gate de §20.1 verifican esto sirviendo el árbol estático localmente antes de desplegar (mismo mecanismo de resolución que Vercel usa). Si en producción falla de todos modos, el fallback es agregar `vercel.json` en la raíz del repo con el contenido de abajo — paso condicional, solo si el gate de producción lo detecta |
| Los mockups CSS de "Cómo se ve en la práctica" no calzan en proporción con las capturas reales cuando lleguen | M | L | Al reemplazar un `.report-card` por un `<img>` real, el layout de la grilla salta o recorta la imagen | El Paso 4 de §9 fija `.practica-item` como contenedor de ancho flexible sin relación de aspecto forzada sobre el mockup — se acepta como detalle de implementación, no amerita un paso dedicado |
| `npx http-server` necesita descargar el paquete la primera vez que corre en una máquina sin caché de npm, así que el Paso 5/§20.1 requiere red en esa primera corrida (a diferencia de la alternativa de Python, que no la necesitaba) | L | L | El comando tarda varios segundos de más y falla si no hay conexión | Aceptado — toda máquina que corre este build ya necesita red para `vercel --prod`; corridas siguientes usan la caché de npm y no vuelven a descargar nada |
| `kill "$SERVER_PID"` no basta para terminar el servidor que `npx` deja corriendo — el PID que captura `$!` no arrastra al proceso hijo real. Sin limpieza, una corrida repetida del gate deja un servidor huérfano ocupando el puerto 8080 | M | M | Una segunda corrida del Paso 5/§20.1 falla con `curl` devolviendo `000`, o responde con contenido de una corrida anterior | Verificado con un smoke test real (dos corridas seguidas, sin fugas). El Paso 5 y el gate de §20.1 usan `kill_port_8080()` — libera el puerto por PID vía `netstat`+`taskkill //T` en Windows, o `fuser -k` en macOS/Linux — en vez de confiar en `kill "$SERVER_PID"` |

**`vercel.json` de fallback** (solo si el Riesgo #2 se materializa — no se crea por defecto):

```json
{
  "rewrites": [
    { "source": "/inmobiliarias", "destination": "/inmobiliarias/index.html" }
  ]
}
```

### 20.3 Decision log

| # | Decision | Rejected alternative | Why | Would reverse if |
|---|---|---|---|---|
| 1 | Página estática sin build ni gestor de paquetes (desvío del track por defecto `ts-node` de la shape marketing-site) | Framework de contenido estático con salida estática (el track por defecto de la shape) | Coincidir exactamente con la convención cero-dependencias de `index.html` existente; un framework introduciría un paso de build, un manifiesto de dependencias y una carpeta de módulos que no existen en ningún otro punto del repo | El sitio necesita una CMS, lógica de servidor, o un pipeline de build por cualquier otra razón futura |
| 2 | Servidor local de verificación: `npx http-server` (Node), no `npx serve` | `python3 -m http.server`; también se probó y se descartó `npx serve` | Verificado en la máquina real de desarrollo con un smoke test de extremo a extremo: (a) no tiene un intérprete de Python instalado — `python`/`python3` resuelven a los alias de Microsoft Store, que fallan con "Python was not found" — mientras que Node sí está presente; (b) `npx serve` se probó primero, pero por defecto responde `301` (no `200`) a una petición directa a `/index.html` — rompe la propia aserción del blueprint — mientras que `http-server` responde `200` en ambas rutas; (c) en ambos casos `kill "$SERVER_PID"` no bastaba para terminar el proceso real, así que el Paso 5/§20.1 usan `kill_port_8080()` (netstat+taskkill en Windows, fuser en POSIX) en su lugar. `npx` obtiene el paquete de forma efímera, sin instalación persistente — mismo espíritu cero-dependencias que la alternativa de Python que se había elegido antes de esta verificación | La máquina que corre el build tiene Python 3 real pero no Node disponible |
| 3 | Sin cross-linking entre landing 1 y landing 2 | Un link discreto en el footer de cada landing hacia la otra | Decisión explícita del usuario — cada canal de tráfico (QR de tarjeta física) debe llevar a una sola oferta sin desviar la atención | Se decide unificar la navegación del sitio en un solo dominio con selector de audiencia |
| 4 | Video con `autoplay muted loop playsinline controls`, sin condicionar el autoplay a `prefers-reduced-motion` | Deshabilitar autoplay vía JavaScript cuando el usuario prefiere movimiento reducido | La única forma de lograrlo requiere JavaScript, y el proyecto es cero-JS por decisión explícita (decisión #1); `controls` le da a cualquier usuario una forma inmediata de pausar | El proyecto alguna vez permite JavaScript mínimo (rompería también la decisión #1) |
| 5 | Un solo epic (`01-landing-inmobiliarias`) para los 5 pasos | Dividir en 2 epics (p. ej. "shell+hero" y "contenido+cierre") | 5 pasos brownfield acotados a un único archivo no justifican una segunda unidad de agrupación — la regla de conteo de `templates/blueprint-template.md` §9 permite exactamente 1 epic para este rango | Este cambio crece a 10+ pasos (contenido real integrado como pasos propios, SEO, etc.) |

### 20.4 What to build next

1. Video real (`inmobiliarias/assets/demo.mp4`) y poster (`inmobiliarias/assets/poster.jpg`) —
   trigger: cuando exista la grabación de la instancia de prueba usada para la demo.
2. Capturas reales reemplazando los 4 mockups de "Cómo se ve en la práctica" — trigger: mismo
   momento que el video, siguiendo la convención de nombres de
   `inmobiliarias/assets/README.md`.
3. `vercel.json` con el rewrite documentado en §20.2 — trigger: solo si el gate de producción del
   Paso 5/§20.1 detecta que `/inmobiliarias` no resuelve sin él.
4. SEO orgánico (sitemap, robots.txt, JSON-LD) — trigger: si se decide que esta landing también
   debe ser encontrada por búsqueda, no solo por QR.
5. Mención de clientes reales del rubro inmobiliario / casos de éxito — trigger: cuando exista al
   menos un cliente real dispuesto a ser citado.

---

*End of blueprint. Build order is §9. Stop when §20.1 is green.*

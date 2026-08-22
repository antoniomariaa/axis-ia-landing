# Landing Agentes — Axis IA — Blueprint

> Generado por The Architect el 2026-08-22
> Shape: Brownfield — tercera landing sobre un sitio de marketing estático ya existente (mismo
> desvío del track por defecto de `marketing-site.md` ya documentado y decidido en
> `blueprints/landing-inmobiliarias/blueprint.md` §2 y §20.3 decisión #1) · sin archivo de shape
> propio, porque este no es un proyecto nuevo
> Runtime track: NINGUNO — sin gestor de paquetes, sin build step, sin framework. Convención ya
> establecida en el repo, verificada leyendo `index.html`, `inmobiliarias/index.html` y
> `assets/shared.css` hoy.
> Emission mode: bundle — preferencia explícita del usuario para este build (el conteo de 5 pasos
> por defecto emitiría archivo único; se mantiene bundle por paridad con
> `blueprints/landing-inmobiliarias/`, que ya estableció este mismo precedente con el mismo número
> de pasos).
> Blueprint version: 1
> Versions last verified: 2026-08-22 — ver §11. Este proyecto no fija ninguna versión de paquete:
> no existe gestor de paquetes.

---

## Nota para quien ejecute este blueprint

Este es el **segundo** blueprint de este repositorio. El primero (`blueprints/landing-inmobiliarias/`)
ya se ejecutó por completo: `CLAUDE.md`, `AGENTS.md`, `.claude/settings.json` y
`.claude/rules/inmobiliarias-landing.md` **ya existen en la raíz del repo** con contenido real, y el
repo fue además rediseñado visualmente después de ese build — `assets/shared.css` ya extrae el CSS
que resultó ser idéntico byte a byte entre `index.html` e `inmobiliarias/index.html` (nav, botones,
`.hero`/`.stage`/`.tilt`, `.glance-*`, `.report-card`/`.rc-*`, footer, tokens). Ese estado —
verificado hoy leyendo los archivos reales, no asumido — es el punto de partida de este blueprint.

**Esto cambia el mecanismo del Paso 0 de §10 respecto al blueprint anterior.** Aquella vez
`workspace/CLAUDE.md` y `workspace/AGENTS.md` eran los primeros archivos de su tipo y el Paso 0 los
copiaba tal cual a una raíz que no tenía nada equivalente. Esta vez `workspace/CLAUDE.md` y
`workspace/AGENTS.md` son el **contenido final ya fusionado** — el `CLAUDE.md`/`AGENTS.md` actual de
la raíz más las adiciones de esta landing (una fila nueva en la tabla "Rules", una mención de la
tercera landing en "Architecture", la generalización de la regla de no-cross-linking a las tres
landings) — y el Paso 0 los **sobrescribe** en la raíz en vez de saltarlos si ya existen. Ver §10,
Bootstrap, para el razonamiento completo de por qué sobrescribir es seguro aquí y por qué
`.claude/settings.json` **no** se toca en absoluto.

El repositorio ya tiene historial de git y tags de un build previo (`step-01-shell-nav-hero` …
`step-05-verify-deploy-ready`). Este blueprint usa el namespace de tags **`agentes-`** para sus
propios checkpoints, para no colisionar con esos tags existentes.

`index.html` (raíz) e `inmobiliarias/index.html` **no se tocan en ningún paso** de este blueprint.

---

## 1. Project Overview & Non-Goals

### Current state (brownfield — repo ya mapeado hoy)

Repositorio: `C:\Users\grego\Downloads\axis-ia-landing\axis-ia-landing` — es la raíz del proyecto
objetivo de este blueprint.

- Sitio estático puro: HTML5 + CSS3 planos, sin build step, sin gestor de paquetes, sin JS, hosting
  Vercel (proyecto `axis-ia-landing`, dominio `axisai.space`). Sin CI, sin test runner — los
  "tests" son comandos `grep`/`curl`/`test` documentados como `Verify` en `tasks.json`, exactamente
  como en `blueprints/landing-inmobiliarias/`.
- `index.html` (raíz) — landing 1, auditoría gratuita general. Vende a cualquier negocio, tono
  "ustedes"/"tu negocio" genérico. **Nunca se edita** salvo pedido explícito por nombre.
- `inmobiliarias/index.html` — landing 2, vende el mismo agente de WhatsApp a **dueños de agencia**
  (lenguaje de equipo, reparto de leads entre agentes, panel del jefe). **Tampoco se toca** en este
  cambio.
- `assets/shared.css` — único CSS compartido permitido. Ya contiene, verificado leyendo el archivo
  hoy: el bloque `:root` con los 8 tokens de color, reset, `.wrap`, `.skip-link`, `.nav`/`.nav-cta`,
  `.btn-primary`/`.btn-secondary`, `.hero`/`.hero-text`/`.eyebrow`/`.hero-lead`/`.hero-actions`,
  `.stage`/`.tilt` (perspectiva 3D + resplandor), shell de sección (`section`, `.section-head`,
  `.section-tag`), `.glance-list`/`.glance-row`/`.glance-idx`/`.glance-body`/`.glance-label`,
  `.report-card`/`.rc-head`/`.rc-title`/`.rc-body`/`.rc-point`/`.rc-check`/`.rc-label`, footer
  (`.f-brand`/`.fmark`/`.f-note`), y las reglas de accesibilidad (`:focus-visible`,
  `prefers-reduced-motion`). Enlazado como `assets/shared.css` desde `index.html` y
  `../assets/shared.css` desde `inmobiliarias/index.html`.
- Tokens de color (verbatim de `assets/shared.css`):
  ```css
  --bg: #12181A; --surface-1: #1B2A26; --surface-2: #223531;
  --teal: #0F6E56; --teal-light: #5DCAA5; --amber: #E9A23B;
  --ink: #E9E5D8; --ink-soft: #9BAAA4;
  --border: rgba(233,229,216,0.10); --border-strong: rgba(233,229,216,0.18);
  ```
  Tipografía: `Space Grotesk` 700 (títulos), `IBM Plex Sans` 400-600 (cuerpo), Google Fonts
  `display=swap`. Radios: 100px botones, 16-20px tarjetas grandes, 12px tarjetas chicas.
  Breakpoints: 860px, 520px. `prefers-reduced-motion: reduce` desactiva transiciones.
- CSS propio de cada landing sigue inline en su `<style>` — solo lo que ya era 100% idéntico entre
  ambas se extrajo a `shared.css`. `index.html` tiene su propio patrón de prosa numerada
  (`.process-item`/`.process-num`) y su patrón de prosa+checklist (`.why-grid`/`.why-list`/`.check`),
  ninguno de los dos en `shared.css` porque solo los usa esa landing.
  `inmobiliarias/index.html` tiene su propio patrón `.practica-item` (report-card + caption).
- `CLAUDE.md`, `AGENTS.md` y `.claude/settings.json` **ya existen en la raíz**, con contenido real
  del build anterior (leídos hoy, no asumidos). `.claude/rules/inmobiliarias-landing.md` también
  existe, con `paths: ["inmobiliarias/**"]`.
- `.claude/settings.json` actual ya pre-aprueba: `grep`, `test`, `curl`, `npx`, `node`, `mkdir`,
  `touch`, `cp`, `kill`, `sleep`, `awk`, `netstat`, `taskkill`, `fuser`, `git status/diff/log/tag/
  add/commit/rev-parse/init/ls-files`, `vercel`. Deniega `git push` y `rm -rf`.
- `.gitignore` actual (repo, no `workspace/`): 2 líneas — `.vercel` (duplicado) y `.DS_Store`. Sin
  ningún patrón amplio (`.env*`, `*.local`, `.claude/`) que pudiera tragarse archivos nuevos.
- No existe ningún archivo, carpeta ni mención de `agentes/` en el repo hoy.

### Target state (delta de este cambio)

Un archivo nuevo: `agentes/index.html` (autocontenido, mismo patrón de autoría que las otras dos
landings — `<head>` con fuentes + `<link>` a `assets/shared.css`, `<style>` propio con lo que no es
compartido, SVGs inline, sin JS). **Sin carpeta `agentes/assets/`** — a diferencia de
`inmobiliarias/`, esta landing no tiene ningún video ni captura real planeada; su mockup de producto
es permanentemente el patrón CSS `.video-placeholder`/`.vp-*` de burbujas de chat (ver Non-Goals).

Tres adiciones pequeñas y bien acotadas a archivos ya existentes en la raíz: una fila nueva en la
tabla "Rules" de `CLAUDE.md`/`AGENTS.md`, una mención de la tercera landing en "Architecture", y la
generalización de la regla de no-cross-linking (ya existente, escrita solo para dos landings) a las
tres. Un archivo de reglas nuevo: `.claude/rules/agentes-landing.md`. **`.claude/settings.json` no
cambia** — ver §19.3.

**Nada en `index.html` ni en `inmobiliarias/index.html` se modifica.** Non-goal explícito y
verificado en el gate final (§9 Paso 5 y §20.1): ningún byte de ninguno de los dos cambia.

**Sin cross-linking entre ninguna de las tres landings** — decisión ya vigente para las dos
existentes, extendida explícitamente a la nueva. El footer de `agentes/index.html` es texto plano,
sin lista de enlaces — ver Non-Goals.

### Vision

Una tercera landing de marketing, independiente de las otras dos, dirigida a **un agente
inmobiliario independiente** — no a un dueño de agencia (esa es `inmobiliarias/index.html`) ni a un
negocio genérico (esa es `index.html`). Vende el mismo producto de fondo (el agente de WhatsApp con
IA de Axis IA) pero desde la perspectiva de una sola persona que vive de su comisión y de su
velocidad de respuesta: mientras enseña un apartamento, otro agente ya le contestó a su lead. Habla
en primera persona ("tú", tu comisión, tu tiempo, tus leads), tuteo neutro venezolano estricto, sin
mencionar coordinación de equipo ni panel gerencial.

### Users

| Persona | What they come to do | Frequency |
|---|---|---|
| Agente inmobiliario independiente (no dueño de agencia) | Decidir en segundos si el asistente de WhatsApp resuelve su problema real — leads que se enfrían mientras está en visita, dormido o con otro cliente — y escribir por WhatsApp para probarlo | Una vez, llegando por difusión directa (mismo canal de tráfico que las otras landings) |

### Goals — v1 scope

1. La página comunica, en el lenguaje de un agente individual (nunca de una agencia ni de un
   equipo), que ningún lead se le enfría mientras está ocupado siendo agente.
2. Los 3 puntos de contacto de la página (nav, hero, CTA final) abren WhatsApp con el número y el
   mensaje correctos de **esta** landing — distintos a los de `inmobiliarias/index.html`.
3. La página usa exclusivamente el sistema de diseño y los componentes ya compartidos en
   `assets/shared.css`, sin introducir un tercer archivo CSS ni JavaScript.
4. Todo el copy pasa la verificación de tuteo neutro venezolano — cero formas de voseo.

### Non-Goals — explicitly out of scope for v1

| Not building | Why not now | Revisit when |
|---|---|---|
| Modificar `index.html` o `inmobiliarias/index.html` | Ninguna de las dos landings existentes forma parte de este cambio — es una adición pura | Nunca, salvo que se pida explícitamente por nombre |
| Cross-linking entre cualquier par de las tres landings | Regla no-negociable ya vigente para las dos landings existentes, extendida explícitamente a esta — cada canal de tráfico lleva a una sola oferta | Si se decide unificar la navegación del sitio en un solo dominio con selector de audiencia |
| Video real, capturas reales o carpeta `agentes/assets/` | El mockup CSS de burbujas de chat (`.video-placeholder`/`.vp-*`) es la pieza final para esta landing, no un placeholder pendiente de reemplazo — a diferencia de `inmobiliarias/index.html`, no hay ninguna grabación en el roadmap inmediato | Si se decide grabar un video real específico para esta landing |
| Mencionar clientes reales o casos cerrados en el vertical inmobiliario | No existe todavía un cliente cerrado en ese rubro — esto es una demo de producto, no un caso de estudio (misma regla ya vigente para `inmobiliarias/index.html`) | Cuando exista al menos un cliente real dispuesto a ser citado |
| Métricas o resultados de negocio inventados (tasas de conversión, leads cerrados) | No hay datos reales que los respalden; inventarlos es publicidad engañosa | Cuando existan datos reales medibles de un cliente del rubro |
| Lenguaje de equipo, reparto de leads entre agentes, panel gerencial | Es exactamente el terreno de `inmobiliarias/index.html` — mezclar las dos audiencias diluye el diferenciador entre landings | Si se decide fusionar ambas audiencias en una sola landing |
| CSS o JS compartido nuevo, o un tercer archivo de estilos | Todo lo verdaderamente compartido ya vive en `assets/shared.css`; lo propio de esta landing va inline, igual que en las otras dos | Si aparece una cuarta landing y algo de lo propio de esta se vuelve idéntico byte a byte en ambas |
| Actualizar `README.md` para mencionar la ruta `/agentes/` | No fue pedido y no es necesario para que el build funcione — el README no es leído por ninguna herramienta de este repo | Si se decide mantener el README como documentación de rutas activas del sitio |
| CMS, build tool, framework de frontend o lógica de servidor | Coincide con la convención cero-dependencias ya vigente en todo el repo | Si se necesita contenido editable por alguien no técnico o lógica de servidor |
| SEO orgánico (sitemap, robots.txt, JSON-LD) | Página alcanzada por difusión directa, no por búsqueda orgánica — misma postura que las otras dos landings | Si se decide que esta landing también debe ser encontrada por búsqueda |

**El builder no debe implementar nada de esta tabla**, aunque parezca una adición pequeña mientras
trabaja en un paso adyacente. Si un paso parece requerir un no-goal, eso es un defecto del
blueprint — deténte y repórtalo en vez de expandir el alcance.

### Success metrics

| Metric | Target | How measured |
|---|---|---|
| Los 3 CTAs de WhatsApp de esta landing están presentes y apuntan al número/mensaje correctos de **esta** landing (no al de `inmobiliarias/index.html`) | 3 de 3, mensaje `para mis leads` | `test "$(grep -c "584121484033" agentes/index.html)" = "3"` y `grep -q "para mis leads" agentes/index.html` y `! grep -q "para mi inmobiliaria" agentes/index.html` — los tres exit 0 |
| El copy pasa la verificación de tuteo neutro venezolano | 0 coincidencias de voseo | `! grep -Eiq "\b(tenés\|querés\|podés\|sabés\|escribís\|sos)\b" agentes/index.html` — exit 0 |
| La ruta `/agentes/` resuelve como página completa, tanto localmente como en producción | Código HTTP `200` en ambos casos | `curl` local en §9 Paso 5 + verificación manual en producción en el gate de §20.1 |

---

## 2. Tech Stack

**Runtime track: NINGUNO.** Mismo desvío ya decidido y documentado en
`blueprints/landing-inmobiliarias/blueprint.md` §2 y §20.3 decisión #1 — HTML + CSS planos, sin
build step, sin gestor de paquetes, exactamente la convención que ya usan las dos landings
existentes de este mismo repositorio.

| Layer | Choice | Why this, over what |
|---|---|---|
| Language / runtime | HTML5 + CSS3 planos, un solo archivo autocontenido (`agentes/index.html`) | Coincide con `index.html` e `inmobiliarias/index.html`; cero build step que pueda romperse |
| Framework | NOT APPLICABLE | Sin framework de frontend, misma convención del repo |
| Styling | `assets/shared.css` (compartido, ya existente) + un único `<style>` propio en `agentes/index.html` para lo que no es compartido | Reutiliza el sistema de diseño ya extraído; nada nuevo se duplica de vuelta a un archivo separado |
| Component layer | NOT APPLICABLE | Sin componentes reutilizables entre archivos — reutiliza clases de `shared.css` directamente |
| Database | NOT APPLICABLE | Página de marketing estática, sin persistencia de datos |
| ORM / data access | NOT APPLICABLE | No hay capa de datos |
| Auth | NOT APPLICABLE | Página pública, sin cuentas |
| Background work | NOT APPLICABLE | Sin trabajos en segundo plano |
| Payments | NOT APPLICABLE | Sin cobros en esta página — la conversación de venta ocurre en WhatsApp |
| File storage | NOT APPLICABLE | Sin assets de media propios en esta landing (ver Non-Goals) |
| Email / notifications | NOT APPLICABLE | El canal de contacto es un enlace directo a WhatsApp |
| Hosting | Vercel (proyecto existente `axis-ia-landing`, dominio `axisai.space`) | Ya configurado y en producción; esta landing se sirve del mismo despliegue estático, sin configuración adicional |
| Package manager | NOT APPLICABLE | No existe ningún manifiesto de dependencias en el repo — no se introduce uno |

### Compatibility check

Verificado contra `knowledge/stack-compatibility.md` — ninguna combinación conocida como
problemática aplica. Esa tabla cubre stacks con framework, ORM, identidad y hosting de era
JS/serverless; este proyecto no usa ninguno de esos ejes.

---

## 3. Directory Structure

```
axis-ia-landing/                        # raíz del repo — raíz del proyecto objetivo de este blueprint
  index.html                            # EXISTE — landing 1. NUNCA modificado por este blueprint.
  inmobiliarias/
    index.html                          # EXISTE — landing 2. NUNCA modificado por este blueprint.
  assets/
    shared.css                          # EXISTE — CSS compartido entre las tres landings. Sin cambios.
  README.md                             # EXISTE — sin cambios (ver Non-Goals).
  .gitignore                            # EXISTE — sin cambios (ningún patrón nuevo hace falta).
  .vercel/                              # EXISTE — config de deploy de Vercel. Sin cambios.
  CLAUDE.md                             # EXISTE — el Paso 0 de §10 lo SOBRESCRIBE con el contenido fusionado de workspace/CLAUDE.md
  AGENTS.md                             # EXISTE — el Paso 0 de §10 lo SOBRESCRIBE con el contenido fusionado de workspace/AGENTS.md
  .claude/
    settings.json                      # EXISTE — sin cambios. Ver §19.3: ya cubre todo comando que este blueprint usa.
    rules/
      inmobiliarias-landing.md          # EXISTE — sin cambios.
      agentes-landing.md                # NUEVO — copiado desde workspace/.claude/rules/... (§19.5) por el Paso 0 de §10
  blueprints/
    landing-inmobiliarias/              # EXISTE — bundle anterior, ya ejecutado. Sin cambios.
    landing-agentes/                    # este bundle — permanece en el repo, NO se copia a ningún lado
      blueprint.md
      tasks.json
      epics/
        01-landing-agentes.md
      workspace/                        # el Paso 0 de §10 copia/sobrescribe el CONTENIDO de esta carpeta en la raíz del repo
        CLAUDE.md
        AGENTS.md
        .claude/
          rules/
            agentes-landing.md
  agentes/                              # NUEVO — carpeta de la landing 3 (creada en §9 Paso 1)
    index.html                          # NUEVO — la landing completa (§9 Pasos 1-4). Sin carpeta assets/ propia — ver Non-Goals.
```

**Boundary rules**

- `agentes/index.html` no importa ni referencia ningún archivo fuera de `assets/shared.css`.
- `index.html` e `inmobiliarias/index.html` son de solo lectura para este blueprint — ningún paso de
  §9 los edita, y el Paso 5 lo verifica explícitamente para ambos.
- No se crea ningún archivo CSS o JS separado — todo lo propio de esta landing vive inline en el
  único `<style>` de `agentes/index.html`; todo lo compartido viene de `assets/shared.css` sin
  duplicarlo de vuelta.
- **Convención de rutas (la única "convención de enlace" de este blueprint):** el único `<link>` de
  `agentes/index.html` que sale del propio archivo es `../assets/shared.css` (misma profundidad
  relativa que `inmobiliarias/index.html`, porque `agentes/` está al mismo nivel). Esta landing no
  tiene ningún `src`/`poster` de media propia — no aplica la convención de "assets relativos al
  archivo de landing" porque no hay ningún asset de media que resolver. Ver §19.6, *Resolution
  convention matrix*.

---

## 4. Data Model

NOT APPLICABLE — página de marketing estática sin persistencia de datos, sin backend, sin cuentas de
usuario. No existe ninguna entidad que modelar.

---

## 5. API Design

NOT APPLICABLE — no hay ningún endpoint ni servidor en este proyecto. El único "canal de contacto" es
un enlace `https://wa.me/...` que abre WhatsApp fuera de este sitio; no es una API de este
repositorio.

---

## 6. Frontend Architecture

### Routes

| Route | Page | Data source | Auth |
|---|---|---|---|
| `/agentes/` | `agentes/index.html` | Estático, contenido literal de este blueprint | público |

### Rendering strategy

100% estático. Vercel sirve `agentes/index.html` directamente por la resolución de directorio índice
por defecto (`/agentes` → `/agentes/index.html`) — el mismo mecanismo ya en producción para
`/inmobiliarias/`, sin necesitar `vercel.json`. Sin revalidación, sin cache dinámico: el archivo no
cambia entre peticiones.

### Component hierarchy

```
agentes/index.html
  nav (.nav)                              # de shared.css — logo + .nav-cta "Pruébalo gratis"
  header.hero (.hero)                     # de shared.css — .hero-text + .stage/.tilt
    .hero-text
      .eyebrow "Para agentes inmobiliarios"
      h1, .hero-lead, .hero-actions       # .btn-primary + .btn-secondary (de shared.css)
    .stage/.tilt
      .video-placeholder/.vp-*            # de inmobiliarias, patrón reutilizado — chat + .vp-badge (NUEVO, propio de esta landing)
  section "Los 4 dolores..."              # NUEVO propio — .pain-list/.pain-item/.pain-num
  section.glance (.glance)                # de shared.css — .glance-list/.glance-row ×4
  section "por qué es distinto"           # NUEVO propio — .distinto, dos <p>, sin grid ni checklist
  section.final-cta (#contacto)           # NUEVO propio (mínimo) — h2 + p + .btn-primary + texto de teléfono
  footer                                  # de shared.css — .f-brand + .f-note, SIN <a>
```

### State management

NOT APPLICABLE — sin JavaScript, sin estado de cliente ni de servidor.

### Loading, empty, and error states

NOT APPLICABLE — no hay ninguna operación asíncrona ni lista cargada dinámicamente en esta página.

---

## 7. Design System

Ya establecido en `assets/shared.css` — esta landing no agrega ningún token nuevo, solo reutiliza los
existentes.

### Colors

| Token | Value | Usage | Contraste medido |
|---|---|---|---|
| `--bg` | `#12181A` | Fondo de página | — |
| `--ink` | `#E9E5D8` | Texto principal sobre `--bg` | 14.23:1 sobre `--bg` — AA/AAA |
| `--ink-soft` | `#9BAAA4` | Texto secundario sobre `--bg` | 7.41:1 sobre `--bg` — AA/AAA |
| `--teal-light` | `#5DCAA5` | Botón primario, acentos, eyebrow | 8.93:1 sobre `--bg`; texto `#082A1B` sobre este fondo (botón) = 7.70:1 — ambos AA/AAA |
| `--teal` | `#0F6E56` | Fondos de ícono/mark | uso decorativo, no como fondo de texto |
| `--amber` | `#E9A23B` | Punto decorativo del eyebrow, acento del logo | uso decorativo puntual, no como fondo de texto |
| `--ink` sobre `--surface-1` (`#1B2A26`) | — | Texto dentro de tarjetas (`.report-card`, `.vp-card`) | 11.85:1 — AA/AAA |

Los tres pares de mayor riesgo (texto principal, texto secundario y texto de botón) están medidos con
la fórmula de luminancia relativa WCAG 2.x y superan 4.5:1 con amplio margen. Esta landing no
introduce ningún color nuevo, así que estos ratios se heredan sin necesidad de re-verificar.

### Typography

| Role | Family | Size / line-height | Weight | Tracking |
|---|---|---|---|---|
| Display / h1 | Space Grotesk | `clamp(34px, 6vw, 58px)` / 1.03 | 700 | -0.02em |
| Heading / h2, h3 | Space Grotesk | `clamp(26px, 3vw, 34px)` (h2) / 17px (h3) | 700 | -0.01em |
| Body | IBM Plex Sans | 14-16.5px / 1.6 | 400-600 | normal |
| Eyebrow / labels | IBM Plex Sans | 11-12px | 600 | 0.08em uppercase |

**Font loading:** Google Fonts, `Space+Grotesk:wght@500;600;700` + `IBM+Plex+Sans:wght@400;500;600;700`,
vía dos `<link rel="preconnect">` + un `<link>` de stylesheet con `display=swap` — idéntico a las
otras dos landings. Fallback: `sans-serif`.

### Spacing, radius, elevation

- Spacing: heredado de `shared.css` (`section{padding:76px 0}`, `.wrap{padding:0 24px}`, gaps de
  12-48px según componente).
- Radius: 100px botones, 16px `.glance-list`/`.report-card`, 12px tarjetas chicas (`.vp-card`).
- Shadows: `0 30px 60px -20px rgba(0,0,0,0.55)` en tarjetas elevadas (heredado de `.report-card`).
- Max content width: 1120px (`.wrap`). Breakpoints: 860px, 520px.

### Motion

`.tilt` usa `transform: perspective(...) rotateX/rotateY` con `transition: transform 0.4s ease`,
desactivado bajo `prefers-reduced-motion: reduce` (regla ya en `shared.css`, aplica automáticamente).
Esta landing no agrega ninguna transición nueva.

### Component style

Oscuro, editorial, con acentos verde-menta y ámbar sobre fondo casi negro — el mismo lenguaje visual
que las otras dos landings, sin variación. El único componente verdaderamente nuevo de esta landing
es el badge `.vp-badge` ("Recomendada"), que reutiliza la receta visual del badge `.process-time` ya
usado en `index.html` (pill pequeño, fondo `rgba(15,110,86,0.22)`, texto `--teal-light`, 100px de
radio) — no se inventa un estilo de badge nuevo.

---

## 8. Authentication & Authorization

NOT APPLICABLE — página pública sin cuentas, sin sesiones, sin roles.

---

## 9. BUILD ORDER

### Step map

| # | Step | Depends on | Touches | Gate |
|---|---|---|---|---|
| 1 | Estructura, shell de página, nav y hero con mockup de chat | — | `agentes/index.html` | `test "$(grep -c "584121484033" agentes/index.html)" = "2"` |
| 2 | Sección "Los 4 dolores del agente independiente" | 1 | `agentes/index.html` | `test "$(grep -c 'class="pain-item"' agentes/index.html)" = "4"` |
| 3 | Sección "de un vistazo" (glance) + sección "por qué es distinto" | 2 | `agentes/index.html` | `test "$(grep -c 'class="glance-row"' agentes/index.html)" = "4"` |
| 4 | CTA final, footer y responsive | 3 | `agentes/index.html` | `test "$(grep -c "584121484033" agentes/index.html)" = "3"` |
| 5 | Verificación final: ruta resuelve, landings 1 y 2 intactas, tuteo correcto | 4 | — | `curl` a `/agentes/` y `/agentes/index.html` = `200` |

5 pasos, brownfield, acotados a un único archivo — 1 epic (`ceil(5÷9)=1`, `floor(5÷5)=1`, la regla de
conteo de `templates/blueprint-template.md` §9 solo permite exactamente 1 en este rango).

---

#### Step 1 — Estructura, shell de página, nav y hero con mockup de chat

**Do**

Crear `agentes/index.html`: `<!DOCTYPE html>`, `<head>` con `<title>`, meta viewport, los dos
`<link rel="preconnect">` y el `<link>` de Google Fonts (idénticos a las otras landings), y
`<link rel="stylesheet" href="../assets/shared.css">`. Un único `<style>` propio con las reglas que
introduce este paso: `.vp-badge` (badge "Recomendada", misma receta visual que `.process-time` de
`index.html`: `background: rgba(15,110,86,0.22); color: var(--teal-light); border-radius:100px;
padding:4px 10px; font-size:11.5px; font-weight:600`, posicionado sobre la burbuja de salida del
mockup). El `<body>` abre con `.skip-link`, `<nav class="nav">` (logo `.brand`/`.brand-name` "Axis
IA" — SVG mark idéntico al de las otras landings — y `.nav-cta` con texto "Pruébalo gratis"), y
`<header class="hero" id="contenido-principal">` con:
- `.hero-text`: `.eyebrow` "Para agentes inmobiliarios"; `<h1>` "Mientras enseñas un apartamento,
  otro agente ya le contestó a tu lead."; `.hero-lead` "Un asistente de WhatsApp con IA que
  responde, califica y agenda por ti — incluso cuando estás en visita, dormido o con otro cliente.
  Tú cierras. Él nunca te deja esperando a nadie."; `.hero-actions` con `.btn-primary` "Pruébalo
  gratis" (glifo de WhatsApp inline, idéntico al de las otras landings) y `.btn-secondary` "Ver cómo
  funciona ↓" apuntando a `#de-un-vistazo` (ancla interna, sección del Paso 3).
- `.stage`/`.tilt` con el mockup `.video-placeholder`/`.vp-card`/`.vp-head`/`.vp-dot`/`.vp-label`
  (patrón ya establecido en `inmobiliarias/index.html`, reutilizado tal cual): burbujas de chat
  mostrando un lead escribiendo de noche y el asistente respondiendo al instante con una propiedad
  recomendada llevando el badge `.vp-badge` "Recomendada", más un `.vp-note` mencionando la hora
  ("11:47 pm").

**Ambos CTAs de WhatsApp de este paso (nav y hero) usan exactamente el mismo enlace**, fijo para
toda esta landing: `https://wa.me/584121484033?text=Hola%2C%20quiero%20probar%20el%20agente%20de%20WhatsApp%20para%20mis%20leads`
(mensaje decodificado: "Hola, quiero probar el agente de WhatsApp para mis leads" — **distinto** al
mensaje de `inmobiliarias/index.html`, que es "...para mi inmobiliaria". No copiar ese mensaje.)

**Done when**
- [ ] WHEN se abre `agentes/index.html` THE SYSTEM SHALL mostrar la nav con `class="brand-name"` conteniendo "Axis IA" y un `class="nav-cta"` con el texto "Pruébalo gratis".
- [ ] WHEN se ejecuta `test "$(grep -c "584121484033" agentes/index.html)" = "2"` THE SYSTEM SHALL salir con código 0 (nav + CTA primario del hero — el CTA final aún no existe).
- [ ] WHEN se ejecuta `grep -q "para mis leads" agentes/index.html` THE SYSTEM SHALL salir con código 0 — el mensaje de WhatsApp correcto de esta landing está presente.
- [ ] WHEN se ejecuta `grep -q "Mientras enseñas un apartamento" agentes/index.html` THE SYSTEM SHALL salir con código 0 — el H1 literal está presente.
- [ ] WHEN se ejecuta `grep -q "Ver cómo funciona" agentes/index.html` THE SYSTEM SHALL salir con código 0 — el CTA secundario de texto está presente.
- [ ] WHEN se ejecuta `grep -q "vp-badge" agentes/index.html` y `grep -q "Recomendada" agentes/index.html` THE SYSTEM SHALL salir ambos con código 0 — el badge del mockup existe.

**Verify**
```bash
grep -q 'class="brand-name"' agentes/index.html                        # expect: exit 0
grep -q 'class="nav-cta"' agentes/index.html                            # expect: exit 0
test "$(grep -c "584121484033" agentes/index.html)" = "2"               # expect: exit 0
grep -q "para mis leads" agentes/index.html                             # expect: exit 0
grep -q "Mientras enseñas un apartamento" agentes/index.html            # expect: exit 0
grep -q "Ver cómo funciona" agentes/index.html                          # expect: exit 0
grep -q "vp-badge" agentes/index.html                                   # expect: exit 0
grep -q "Recomendada" agentes/index.html                                # expect: exit 0
```

**Checkpoint**
```bash
git add -A && git commit -m "step 1: estructura, shell, nav y hero con mockup de chat (agentes)"
git tag agentes-01-shell-nav-hero
# rollback target si el paso 2 sale mal: git reset --hard agentes-01-shell-nav-hero
```

---

#### Step 2 — Sección "Los 4 dolores del agente independiente"

**Do**

Agregar a `agentes/index.html`, dentro del `<style>` propio, las reglas `.pain-list` (grid de 2
columnas × 2 filas con divisores, análogo a `.process-list` de `index.html` pero sin
`.process-time`, porque aquí no hay pasos de un proceso sino dolores) y `.pain-item`/`.pain-num`
(número circular 01-04, `<h3>`, `<p>`). Agregar la sección con `.section-head` (`.section-tag`
"Esto te suena" + `<h2>` "Los 4 dolores del agente independiente") y los 4 `.pain-item`:

1. `.pain-num` "01" — h3 "El primero que contesta, se queda con el lead" — p "Un comprador escribe a
   tres agentes al mismo tiempo. Si tardas 20 minutos porque estabas mostrando otra propiedad, ya
   perdiste — y ni te enteraste."
2. `.pain-num` "02" — h3 "Repites lo mismo cien veces" — p "'¿Cuántos metros tiene?' '¿Tiene puesto
   de estacionamiento?' '¿Acepta financiamiento?' Las mismas cinco preguntas, con cada propiedad, con
   cada lead. Horas que no facturas."
3. `.pain-num` "03" — h3 "Tu horario no es 24/7, pero tu WhatsApp sí recibe mensajes 24/7" — p "El
   lead que escribe un domingo a las 9pm no espera hasta el lunes. Si no le respondes ya, busca otra
   opción — o otro agente."
4. `.pain-num` "04" — h3 "No sabes cuál lead vale la pena perseguir" — p "Entre curiosos, gente que
   'solo está mirando' y compradores reales con presupuesto listo, pierdes tiempo con los primeros y
   a veces dejas fríos a los segundos."

**Done when**
- [ ] WHEN se ejecuta `test "$(grep -c 'class="pain-item"' agentes/index.html)" = "4"` THE SYSTEM SHALL salir con código 0.
- [ ] WHEN se ejecuta `grep -q "Esto te suena" agentes/index.html` THE SYSTEM SHALL salir con código 0.
- [ ] WHEN se ejecuta `grep -q "El primero que contesta, se queda con el lead" agentes/index.html` THE SYSTEM SHALL salir con código 0.
- [ ] WHEN se ejecuta `grep -q "Repites lo mismo cien veces" agentes/index.html` THE SYSTEM SHALL salir con código 0.
- [ ] WHEN se ejecuta `grep -q "tu WhatsApp sí recibe mensajes 24/7" agentes/index.html` THE SYSTEM SHALL salir con código 0.
- [ ] WHEN se ejecuta `grep -q "No sabes cuál lead vale la pena perseguir" agentes/index.html` THE SYSTEM SHALL salir con código 0.

**Verify**
```bash
test "$(grep -c 'class="pain-item"' agentes/index.html)" = "4"                        # expect: exit 0
grep -q "Esto te suena" agentes/index.html                                            # expect: exit 0
grep -q "El primero que contesta, se queda con el lead" agentes/index.html            # expect: exit 0
grep -q "Repites lo mismo cien veces" agentes/index.html                              # expect: exit 0
grep -q "tu WhatsApp sí recibe mensajes 24/7" agentes/index.html                      # expect: exit 0
grep -q "No sabes cuál lead vale la pena perseguir" agentes/index.html                # expect: exit 0
```

**Checkpoint**
```bash
git add -A && git commit -m "step 2: seccion los 4 dolores del agente independiente (agentes)"
git tag agentes-02-dolores
# rollback target si el paso 3 sale mal: git reset --hard agentes-02-dolores
```

---

#### Step 3 — Sección "de un vistazo" (glance) + sección "por qué es distinto"

**Do**

Agregar la sección `id="de-un-vistazo"` usando el patrón **ya existente en `shared.css`**
(`.glance`/`.section-head`/`.glance-list`/`.glance-row`/`.glance-idx`/`.glance-body`/`.glance-label`
— sin CSS nuevo, solo marcado) con `.section-tag` "Axis IA, de un vistazo" + `<h2>` "Cómo se ve en
la práctica", y 4 `.glance-row`:

- A — label "Respuesta" — h3 "Responde al instante, siempre" — p "En segundos, no en horas. Tu lead
  nunca ve el ícono de 'en línea' apagado."
- B — label "Calificación" — h3 "Precalifica antes de que tú intervengas" — p "Presupuesto, zona,
  tipo de propiedad, forma de pago — para cuando tú entras a la conversación, ya sabes si vale la
  pena."
- C — label "Catálogo" — h3 "Muestra tus propiedades solo" — p "Fotos, precio, metraje, ubicación —
  el lead ve lo que le interesa sin que tú tengas que mandar catálogo por catálogo."
- D — label "Traspaso" — h3 "Te avisa cuándo meterte tú" — p "El bot no cierra ventas. En el momento
  justo — lead caliente, listo para visita — te lo pasa a ti con todo el contexto ya armado."

Agregar después una segunda sección, propia de esta landing (clase `.distinto`, nueva, inline en el
`<style>` propio — solo `max-width` y espaciado para los párrafos, sin grid ni checklist), con
`.section-head` (`<h2>` "Por qué esto es distinto a 'poner un chatbot'", sin `.section-tag`
obligatorio) y dos `<p>`:

1. "No es un menú de opciones ni un bot que repite respuestas genéricas. Entiende lo que el lead
   escribe, en el orden que lo escriba, y responde con los datos reales de tus propiedades — no con
   un guion fijo."
2. "Tú sigues siendo el que cierra. Esto solo se encarga de que ningún lead se te enfríe mientras
   estás ocupado siendo agente, no recepcionista."

**Done when**
- [ ] WHEN se ejecuta `test "$(grep -c 'class="glance-row"' agentes/index.html)" = "4"` THE SYSTEM SHALL salir con código 0.
- [ ] WHEN se ejecuta `grep -q "Axis IA, de un vistazo" agentes/index.html` THE SYSTEM SHALL salir con código 0.
- [ ] WHEN se ejecuta `grep -q "Precalifica antes de que tú intervengas" agentes/index.html` THE SYSTEM SHALL salir con código 0.
- [ ] WHEN se ejecuta `grep -q "Te avisa cuándo meterte tú" agentes/index.html` THE SYSTEM SHALL salir con código 0.
- [ ] WHEN se ejecuta `grep -q "distinto a" agentes/index.html` THE SYSTEM SHALL salir con código 0 — el título de la sección "por qué es distinto" está presente.
- [ ] WHEN se ejecuta `grep -q "no recepcionista" agentes/index.html` THE SYSTEM SHALL salir con código 0 — el segundo párrafo de esa sección está presente.

**Verify**
```bash
test "$(grep -c 'class="glance-row"' agentes/index.html)" = "4"                # expect: exit 0
grep -q "Axis IA, de un vistazo" agentes/index.html                            # expect: exit 0
grep -q "Precalifica antes de que tú intervengas" agentes/index.html           # expect: exit 0
grep -q "Te avisa cuándo meterte tú" agentes/index.html                        # expect: exit 0
grep -q "distinto a" agentes/index.html                                        # expect: exit 0
grep -q "no recepcionista" agentes/index.html                                  # expect: exit 0
```

**Checkpoint**
```bash
git add -A && git commit -m "step 3: seccion de un vistazo y por que es distinto (agentes)"
git tag agentes-03-glance-distinto
# rollback target si el paso 4 sale mal: git reset --hard agentes-03-glance-distinto
```

---

#### Step 4 — CTA final, footer y responsive

**Do**

Agregar `<section class="final-cta" id="contacto">` (regla `.final-cta` propia, mínima — solo
centrado y `max-width` del párrafo, inline en el `<style>` propio de esta landing, no en
`shared.css`) con `<h2>` "¿Cuántos leads se te fueron esta semana por no contestar a tiempo?", `<p>`
"Pruébalo gratis con tus propias propiedades. Sin compromiso, sin tarjeta.", `.btn-primary` "Pruébalo
gratis" (mismo enlace de WhatsApp fijo de esta landing — tercera y última aparición), y debajo un
`<span>` de texto plano (sin `<a>`) con "+58 412 1484033".

Agregar `<footer>` reutilizando `.f-brand`/`.fmark`/`.f-note` de `shared.css` (mismo SVG de logo que
el footer de las otras landings): `.f-brand` con el mark + "Axis IA", y `.f-note` con el texto
"Automatización con IA para agentes y agencias inmobiliarias". **Cero `<a>` dentro de `<footer>`** —
sin lista de enlaces, sin link de vuelta a `index.html` ni a `inmobiliarias/index.html`.

Agregar las reglas `@media (max-width: 860px)` y `@media (max-width: 520px)` propias de esta
landing (colapsar `.pain-list` a 1 columna, ajustar padding de `.hero`/`section` y el ancho máximo
del mockup, igual que el patrón ya usado en las otras dos landings). Cerrar `</body></html>`.

**Done when**
- [ ] WHEN se ejecuta `test "$(grep -c "584121484033" agentes/index.html)" = "3"` THE SYSTEM SHALL salir con código 0 (nav + hero + CTA final — completo).
- [ ] WHEN se ejecuta `grep -q "Cuántos leads se te fueron esta semana" agentes/index.html` THE SYSTEM SHALL salir con código 0.
- [ ] WHEN se ejecuta `grep -q "+58 412 1484033" agentes/index.html` THE SYSTEM SHALL salir con código 0 — el número visible como texto plano está presente.
- [ ] WHEN se ejecuta `! (awk '/<footer>/,/<\/footer>/' agentes/index.html | grep -q "<a ")` THE SYSTEM SHALL salir con código 0 — cero enlaces dentro del footer.
- [ ] WHEN se ejecuta `grep -q "Automatización con IA para agentes y agencias inmobiliarias" agentes/index.html` THE SYSTEM SHALL salir con código 0.
- [ ] WHEN se ejecuta `grep -q "@media (max-width: 860px)" agentes/index.html && grep -q "@media (max-width: 520px)" agentes/index.html && grep -q "</html>" agentes/index.html` THE SYSTEM SHALL salir con código 0 — breakpoints presentes y el archivo quedó correctamente cerrado.

**Verify**
```bash
test "$(grep -c "584121484033" agentes/index.html)" = "3"                                        # expect: exit 0
grep -q "Cuántos leads se te fueron esta semana" agentes/index.html                               # expect: exit 0
grep -q "+58 412 1484033" agentes/index.html                                                      # expect: exit 0
! (awk '/<footer>/,/<\/footer>/' agentes/index.html | grep -q "<a ")                               # expect: exit 0 — no matches
grep -q "Automatización con IA para agentes y agencias inmobiliarias" agentes/index.html          # expect: exit 0
grep -q "@media (max-width: 860px)" agentes/index.html                                            # expect: exit 0
grep -q "@media (max-width: 520px)" agentes/index.html                                            # expect: exit 0
grep -q "</html>" agentes/index.html                                                               # expect: exit 0
```

**Checkpoint**
```bash
git add -A && git commit -m "step 4: cta final, footer y responsive (agentes)"
git tag agentes-04-cta-footer-responsive
# rollback target si el paso 5 sale mal: git reset --hard agentes-04-cta-footer-responsive
```

---

#### Step 5 — Verificación final: ruta resuelve, landings 1 y 2 intactas, tuteo correcto

**Do**

Ningún archivo nuevo. Este paso solo corre verificación: sirve el repo localmente y confirma que
`/agentes/` resuelve igual que en Vercel, que ni `index.html` ni `inmobiliarias/index.html`
cambiaron ni un byte, que el copy de `agentes/index.html` no tiene ninguna forma de voseo conocida,
y que el conteo y el mensaje de los 3 CTAs de WhatsApp son correctos y no fueron copiados por error
del mensaje de `inmobiliarias/index.html`.

**Done when**
- [ ] WHEN se sirve el repositorio con `npx --yes http-server . -p 8080` y se pide `http://localhost:8080/agentes/` THE SYSTEM SHALL responder con código HTTP `200`.
- [ ] WHEN se pide `http://localhost:8080/agentes/index.html` directamente THE SYSTEM SHALL responder también con código HTTP `200`.
- [ ] WHEN se ejecuta `git diff --stat -- index.html` THE SYSTEM SHALL no producir ninguna salida — landing 1 permanece intacta.
- [ ] WHEN se ejecuta `git diff --stat -- inmobiliarias/index.html` THE SYSTEM SHALL no producir ninguna salida — landing 2 permanece intacta.
- [ ] WHEN se busca cualquiera de las formas de voseo `tenés`, `querés`, `podés`, `sabés`, `escribís`, `sos` en `agentes/index.html` THE SYSTEM SHALL no encontrar ninguna coincidencia.
- [ ] WHEN se ejecuta `test "$(grep -c "584121484033" agentes/index.html)" = "3"` y `grep -q "para mis leads" agentes/index.html` y `! grep -q "para mi inmobiliaria" agentes/index.html` THE SYSTEM SHALL salir los tres con código 0 — el mensaje de WhatsApp es el correcto de esta landing, no el de `inmobiliarias/index.html`.

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
CODE_DIR=$(curl -s -o /dev/null -w '%{http_code}' http://localhost:8080/agentes/)
CODE_FILE=$(curl -s -o /dev/null -w '%{http_code}' http://localhost:8080/agentes/index.html)
kill_port_8080
test "$CODE_DIR" = "200" && test "$CODE_FILE" = "200"                                # expect: exit 0

test -z "$(git diff --stat -- index.html)"                                            # expect: exit 0
test -z "$(git diff --stat -- inmobiliarias/index.html)"                              # expect: exit 0

! grep -Eiq "\b(tenés|querés|podés|sabés|escribís|sos)\b" agentes/index.html          # expect: exit 0 — cero coincidencias

test "$(grep -c "584121484033" agentes/index.html)" = "3"                             # expect: exit 0
grep -q "para mis leads" agentes/index.html                                           # expect: exit 0
! grep -q "para mi inmobiliaria" agentes/index.html                                   # expect: exit 0 — mensaje no confundido con inmobiliarias
```

**Checkpoint**
```bash
git add -A && git commit -m "step 5: verificacion final landing agentes" --allow-empty
git tag agentes-05-verify-deploy-ready
# rollback target si algo posterior sale mal: git reset --hard agentes-05-verify-deploy-ready
```

---

### 9.1 Parity and cutover

NOT APPLICABLE — greenfield feature dentro de un repo brownfield: se agrega una landing nueva, no se
reemplaza ningún sistema ni comportamiento existente. `index.html` e `inmobiliarias/index.html`
siguen sirviendo exactamente el mismo contenido que antes de este build — no hay nada que poner en
paralelo, medir en sombra, ni cortar sobre.

---

## 10. Environment Setup

### Prerequisites

| Tool | Version | Check |
|---|---|---|
| Node.js (solo para `npx http-server`, efímero, no se instala como dependencia) | Cualquiera con `npx` disponible (ya requerido por el build anterior) | `node --version` |
| Git | Cualquiera con `git tag`/`git commit` | `git --version` |
| Vercel CLI | La que el desarrollador ya tenga configurada para este proyecto | `vercel --version` |

### Accounts to create first

Ninguna cuenta nueva — el proyecto Vercel `axis-ia-landing` y su dominio `axisai.space` ya existen y
están configurados desde el build anterior.

### Environment variables

NOT APPLICABLE — sin variables de entorno en ningún punto del repo.

### Files that must be committed

| File | Why it is committed | Ignore-file exception line |
|---|---|---|
| `agentes/index.html` | Es la landing nueva completa — el entregable de este build | No coincide con ningún patrón de `.gitignore` (`.vercel`, `.DS_Store`) — no necesita excepción |
| `CLAUDE.md`, `AGENTS.md` (sobrescritos) | Instrucciones del agente para todo el repo, ya committeadas desde el build anterior | No coinciden con ningún patrón de `.gitignore` |
| `.claude/rules/agentes-landing.md` | Convención scoped a `agentes/**` | No coincide con ningún patrón de `.gitignore` — `.claude/` no está listado ahí |
| `blueprints/landing-agentes/` (bundle completo) | Registro del diseño de este cambio, igual que `blueprints/landing-inmobiliarias/` ya committeado | No coincide con ningún patrón de `.gitignore` |

`.gitignore` actual del repo (`.vercel`, `.DS_Store`) no necesita ningún cambio para este build — se
verificó leyendo el archivo hoy y ningún patrón amplio existe que pudiera excluir accidentalmente
alguno de los archivos de arriba.

### Bootstrap

```bash
# order matters: repo + primer commit ya existen de builds anteriores (verificado) → sobrescribir
# CLAUDE.md/AGENTS.md con el contenido fusionado → agregar la regla nueva de agentes/** →
# NO tocar .claude/settings.json (ya cubre todo lo que este build necesita, ver §19.3) → commitear
# si hubo cambios reales (idempotente)

git rev-parse --git-dir >/dev/null 2>&1 || git init -b main   # idempotente: no-op, el repo ya existe desde el build anterior

# CLAUDE.md y AGENTS.md son contenido estático que NINGÚN paso de §9 vuelve a editar después de este
# Bootstrap — a diferencia de un manifiesto de dependencias generado por un `install`, sobrescribirlos
# es determinista e idempotente por construcción: correr esto una segunda vez produce el mismo
# resultado exacto y no revierte ningún trabajo posterior. No hace falta un guard de "no-clobber".
cp -f blueprints/landing-agentes/workspace/CLAUDE.md ./CLAUDE.md
cp -f blueprints/landing-agentes/workspace/AGENTS.md ./AGENTS.md

mkdir -p .claude/rules
cp -f blueprints/landing-agentes/workspace/.claude/rules/agentes-landing.md .claude/rules/agentes-landing.md

# .claude/settings.json NO se copia ni se sobrescribe: ya pre-aprueba grep/test/curl/npx/node/mkdir/
# touch/cp/kill/sleep/awk/netstat/taskkill/fuser y los comandos de git usados en este blueprint — ver
# §19.3. Este bundle no emite workspace/.claude/settings.json.

git add -A
git diff --cached --quiet || git commit -m "chore: merge agentes-landing workspace into CLAUDE.md/AGENTS.md and add .claude/rules/agentes-landing.md"
# ^ idempotente y exit 0 en ambas corridas: la primera vez hay cambios staged y commitea; la segunda
# vez `git diff --cached --quiet` sale 0 (nada staged) y el commit se salta sin fallar el bloque.
```

**Archivos deliberadamente nunca sobrescritos por una segunda corrida de este bloque:**
`agentes/index.html` (lo escriben los pasos de §9, no este Bootstrap) y `.claude/settings.json` (no
se toca en absoluto). `CLAUDE.md`/`AGENTS.md` sí se sobrescriben en cada corrida, a propósito — ver
el razonamiento arriba.

Este bloque se ejecuta, verbatim, antes de que el blueprint se presente (`questions/phase-4-generate.md`
Paso 6) — pero en este build, dado que el repo y sus commits previos ya existen de verdad en el
entorno del usuario, se documenta aquí para que el propio builder lo corra como Paso 0 de §9, no como
un experimento en un directorio vacío.

---

## 11. Dependencies

NOT APPLICABLE — no existe ningún gestor de paquetes en este repositorio y este blueprint no
introduce uno. Cero paquetes que fijar o instalar. `npx --yes http-server` obtiene el binario de
forma efímera en cada corrida de `Verify` — no es una dependencia instalada del proyecto, es una
herramienta de verificación local, igual que en `blueprints/landing-inmobiliarias/`.

### Deliberately not used

| Rejected | Instead | Why |
|---|---|---|
| Cualquier framework de sitios estáticos (Astro, Eleventy, Next.js estático) | HTML plano | Coincidir con la convención cero-dependencias ya vigente en las otras dos landings de este mismo repo |
| Un gestor de paquetes solo para `http-server` | `npx --yes http-server` efímero | Ya es la convención probada del build anterior; no vale la pena introducir un `package.json` para una sola herramienta de verificación local |

---

## 12. Deployment Strategy

### Hosting

Mismo proyecto Vercel ya existente (`axis-ia-landing`, dominio `axisai.space`). Build command:
ninguno (sitio estático). Output directory: la raíz del repo. Runtime: estático — Vercel sirve
`agentes/index.html` en `/agentes/` por la resolución de directorio índice por defecto, el mismo
mecanismo que ya funciona en producción para `/inmobiliarias/` sin necesitar `vercel.json` (no
existe ninguno en el repo hoy).

### Environments

| Environment | Branch | URL | Database | Third-party mode |
|---|---|---|---|---|
| Local | — | `http://localhost:8080/agentes/` | NOT APPLICABLE | NOT APPLICABLE |
| Production | `master` | `https://axisai.space/agentes/` | NOT APPLICABLE | NOT APPLICABLE |

Sin entorno de preview dedicado — mismo patrón que el build anterior (despliegue manual vía
`vercel --prod`, sin CI).

### CI/CD

NOT APPLICABLE — sin CI configurado en el repo. El gate de §20.1 se corre manualmente antes de cada
`vercel --prod`.

### Release and rollback

Deploy: `vercel --prod` desde la raíz del repo. Rollback: `git reset --hard` al tag de checkpoint
anterior (`agentes-04-cta-footer-responsive`, etc.) y volver a desplegar — no hay migraciones de base
de datos que ordenar respecto al deploy porque no existe base de datos.

### Domain, DNS, TLS

Sin cambios — `axisai.space` ya está configurado y con TLS válido desde el build anterior; `/agentes/`
es una ruta nueva dentro del mismo dominio, no requiere ningún registro DNS nuevo.

---

## 13. Testing Strategy

NOT APPLICABLE en el sentido de un framework de testing — no existe test runner en este repo. La
verificación de cada paso son los comandos `grep`/`test`/`curl` de §9, ejecutados como `Verify`
tanto en el bundle como en `tasks.json`. No hay "capa de test" separada del propio `Verify`.

### What is deliberately not tested

Renderizado visual pixel-perfect, comportamiento de fuentes en cada navegador, y la apariencia real
del mockup `.video-placeholder` en distintos tamaños de pantalla más allá de los dos breakpoints
documentados — decisión consistente con el resto del repo: sin test runner ni suite de regresión
visual, sustituido por el pase manual de accesibilidad y de responsive descrito en §15 y §20.1.

---

## 14. Security & Secrets

NOT APPLICABLE — página de marketing estática, sin secretos, sin autenticación, sin entrada de
usuario procesada por este sitio (el único "formulario" es un enlace a WhatsApp, que corre fuera de
este repositorio). No hay superficie de seguridad propia que este blueprint introduzca.

---

## 15. Accessibility

**Target: WCAG 2.2 Level AA** — mismo estándar aplicado a las otras dos landings de este repo.

### Baseline requirements

| Requirement | Cómo se cumple en esta landing |
|---|---|
| Semantic HTML | `<nav>`/`<header>`/`<footer>`, un solo `<h1>`, headings en orden (h1 → h2 → h3), sin saltos |
| Keyboard | Nav, `.btn-secondary`, ambos `.btn-primary` y el link implícito del skip-link son alcanzables por teclado en orden lógico; `:focus-visible` ya definido en `shared.css` |
| Focus visible | Heredado de `shared.css` — `outline: 2px solid var(--teal-light)` en todo elemento enfocable |
| Contrast | Ver §7 — todos los pares de texto superan 4.5:1 |
| Forms | NOT APPLICABLE — sin formularios |
| Images | El SVG del logo lleva `aria-hidden="true" focusable="false"` (mismo patrón de las otras landings); sin imágenes decorativas adicionales en esta landing |
| Motion | `.tilt` respeta `prefers-reduced-motion: reduce` (regla heredada de `shared.css`) |
| Zoom / reflow | Usable a 200% de zoom y 320px de ancho sin scroll horizontal — mismo layout responsive de `shared.css` + los breakpoints propios del Paso 4 |
| Live regions | NOT APPLICABLE — sin contenido asíncrono |

### Verification

NOT APPLICABLE — sin comando automatizado de a11y (decisión cero-dependencias, misma postura que
`blueprints/landing-inmobiliarias/blueprint.md`). Su equivalente vive en la lista manual de §20.1:
pase de teclado, una pasada de lector de pantalla, y zoom al 200% a 360px de ancho.

---

## 16. Observability & Cost

NOT APPLICABLE — página estática sin backend, sin servicio de pago adicional al hosting de Vercel ya
contratado para el proyecto existente. No hay ninguna métrica de aplicación que instrumentar; el
costo marginal de agregar una landing más al mismo despliegue estático es $0.

---

## 17. Model Routing

NOT APPLICABLE — este proyecto no llama a ningún LLM en tiempo de ejecución. El agente de WhatsApp
que esta landing promociona es un sistema (n8n + backend) completamente separado de este
repositorio, fuera del alcance de este blueprint.

---

## 18. Skills to Use During Build

Ninguno requerido. Todo el copy y el sistema de diseño ya están fijados literalmente en este
blueprint (§9), y los componentes visuales reutilizados (`.hero`/`.stage`/`.tilt`, `.glance-*`,
`.video-placeholder`/`.vp-*`) ya existen en el repo — no hace falta ningún skill de generación visual
ni de contenido para completar este build.

| Skill | Build steps | Why | Install |
|---|---|---|---|
| NOT APPLICABLE | — | Sin skill requerido para este build | — |

---

## 19. Agent Workspace

Ver `workspace/` en este mismo bundle para los archivos reales.

```
blueprints/landing-agentes/workspace/
├── CLAUDE.md                              # §19.1 — contenido FUSIONADO (CLAUDE.md raíz actual + adiciones)
├── AGENTS.md                              # §19.2 — contenido FUSIONADO (AGENTS.md raíz actual + adiciones)
└── .claude/
    └── rules/
        └── agentes-landing.md             # §19.5 — NUEVO
```

**Sin `.claude/settings.json` en este bundle** — ver §19.3. **Sin `.claude/skills/`** — ver §19.4.

El Paso 0 de §10 (Bootstrap) copia/sobrescribe estos dos archivos y crea el archivo de reglas nuevo,
con el comando exacto documentado en §10 — no un `cp -R` genérico de todo `workspace/`, porque
`CLAUDE.md`/`AGENTS.md` necesitan sobrescribir un archivo que ya existe con contenido distinto
(fusión), no un copy-si-no-existe.

### 19.1 `CLAUDE.md`

Archivo completo en `workspace/CLAUDE.md` — el `CLAUDE.md` actual de la raíz del repo (ya existente,
leído hoy) más: la mención de la tercera landing en "Architecture", la fila nueva en la tabla
"Rules", la generalización de las filas de comandos a las tres landings, y la generalización del
no-negociable de no-cross-linking de "landing 1 y landing 2" a las tres landings. Bajo 200 líneas.

### 19.2 `AGENTS.md`

Archivo completo en `workspace/AGENTS.md` — mismo tratamiento que `CLAUDE.md`: el stub actual más la
mención de la tercera landing y la generalización del no-negociable de cross-linking.

### 19.3 `.claude/settings.json`

**No se emite ningún archivo.** El `.claude/settings.json` ya existente en la raíz (leído hoy) ya
pre-aprueba cada comando que cualquier `Verify` de §9 o el gate de §20.1 de este blueprint usan:
`grep`, `test`, `curl`, `npx`, `node`, `mkdir`, `touch`, `cp`, `kill`, `sleep`, `awk`, `netstat`,
`taskkill`, `fuser`, y los comandos de `git` de solo lectura o de checkpoint (`status`, `diff`,
`log`, `tag`, `add`, `commit`, `rev-parse`, `init`, `ls-files`). Ninguno de los comandos nuevos que
introduce este blueprint (el `awk` sobre el rango `/<footer>/,/<\/footer>/`, el `grep -Ei` de
formas de voseo) es un binario distinto a los ya permitidos — son el mismo `grep`/`awk` con otros
argumentos, y `Bash(grep:*)`/`Bash(awk:*)` ya cubren cualquier argumento. Sobrescribir este archivo
sin necesidad sería el defecto que la regla de "no reemitir lo que ya basta" existe para prevenir.

### 19.4 Project skills — `.claude/skills/<name>/SKILL.md`

NOT APPLICABLE — a diferencia de `inmobiliarias/index.html` (que tiene `swap-media-placeholders`
porque espera un video real futuro), esta landing no tiene ningún placeholder de media pendiente de
reemplazo (ver Non-Goals) ni ningún otro flujo de trabajo repetible identificado. No se emite ningún
skill nuevo.

### 19.5 `.claude/rules/*.md`

| File | `paths` globs | Covers |
|---|---|---|
| `.claude/rules/agentes-landing.md` | `agentes/**` | Persona de agente individual (nunca agencia/equipo), tuteo neutro venezolano, número y mensaje de WhatsApp propios de esta landing, componentes compartidos vs. propios, footer sin enlaces, sin plan de video real |

Contenido completo en `workspace/.claude/rules/agentes-landing.md`. No se creó una regla equivalente
con `paths: ["index.html"]` ni `["inmobiliarias/index.html"]` — la protección de ambas landings
existentes ya vive en los no-negociables de `CLAUDE.md`/`AGENTS.md` (siempre cargados, sin
ambigüedad de glob) y en el gate del Paso 5/§20.1, igual que se decidió en el blueprint anterior.

### 19.6 Verify-critical config and local infrastructure

**Tabla de archivos verify-critical: vacía por diseño**, misma situación que
`blueprints/landing-inmobiliarias/blueprint.md` §19.6. Ningún `Verify` de §9 invoca un test runner,
un e2e runner, ni depende de un servicio con estado. Todos los `Verify` son `grep`/`test`/`awk`/`curl`
sobre un archivo que el propio paso ya crea o edita, más el servidor HTTP efímero que el mismo
comando levanta y apaga dentro del mismo bloque.

| Emit | Whenever |
|---|---|
| NOT APPLICABLE | Ningún `Verify` en este blueprint invoca un test/e2e runner ni depende de un servicio con estado |

#### Resolution convention matrix

**La convención, dicha una vez:** el único `<link>` externo de `agentes/index.html` es
`../assets/shared.css`, relativo al propio archivo (misma profundidad que
`inmobiliarias/index.html`, un nivel bajo la raíz).

NOT APPLICABLE en el sentido de necesitar una matriz de varios contextos — no existe ningún bundler,
test runner ni script standalone en este proyecto que resuelva rutas de forma distinta al navegador.
El único resolutor de rutas es el navegador, y se comporta igual sirviendo localmente (`npx
http-server` desde la raíz, §9 Paso 5) que en producción (Vercel sirviendo el mismo árbol estático).

#### Cross-artifact value reconciliation

| Shared value | Single source | Literal value | Every other place it appears | Compared |
|---|---|---|---|---|
| Número de WhatsApp de esta landing | Este blueprint, §1 (dato del usuario) | `584121484033` | `agentes/index.html` (×3, Pasos 1 y 4), `tasks.json` (E1-T1, E1-T4, E1-T5), `epics/01-landing-agentes.md`, `.claude/rules/agentes-landing.md`, §9 Verify de Pasos 1/4/5, §20.1 | yes |
| Mensaje de WhatsApp de esta landing (URL codificada) | Este blueprint, §1 (definido en este blueprint, distinto al de `inmobiliarias/index.html`) | `https://wa.me/584121484033?text=Hola%2C%20quiero%20probar%20el%20agente%20de%20WhatsApp%20para%20mis%20leads` | `agentes/index.html` (×3: nav-cta, hero, CTA final — Pasos 1 y 4), `.claude/rules/agentes-landing.md` | yes |
| Texto exacto del footer | Este blueprint, §1 (copy literal del usuario) | `Automatización con IA para agentes y agencias inmobiliarias` | `agentes/index.html` (Paso 4), `tasks.json`/epic (criterios de E1-T4) | yes |
| Ruta de la página | Este blueprint, §1 Vision | `/agentes/` (sirve `agentes/index.html`) | §6 Routes, §9 Paso 5 Verify, §12 Environments, §20.1 | yes |
| Puerto del servidor local | Ya establecido en `workspace/CLAUDE.md` (build anterior) | `8080` | §9 Paso 5 Verify, §20.1 gate | yes |
| Ruta del bundle en disco | Ubicación real de este bundle | `blueprints/landing-agentes/workspace/` | §10 Bootstrap (comandos de copia), §19 preámbulo, §3 árbol de directorios | yes |
| Namespace de tags de checkpoint | Este blueprint (decisión explícita del usuario) | `agentes-` | §9 (5 Checkpoints), `tasks.json` (5 campos `checkpoint`), `epics/01-landing-agentes.md`, §20.1 | yes |

#### Byte-exact artifact reconciliation

NOT APPLICABLE — ningún comando `Verify` de este blueprint compara bytes exactos contra un archivo
dorado, fixture o snapshot almacenado. Todos son `grep -q`/`grep -c`/`test`/`curl` sobre texto o
código de estado HTTP.

#### El bundle vive dentro del proyecto — exclusión de rutas de configuración

NOT APPLICABLE — no existe ninguna herramienta en este proyecto que recorra el árbol de archivos en
busca de configuración (no hay linter, formateador, type-checker ni test runner).
`blueprints/landing-agentes/` no tiene ninguna superficie de herramienta con la que interferir.

---

## 20. Acceptance Gate, Risks & Decision Log

### 20.1 Global acceptance gate

El proyecto está **terminado** cuando cada comando de abajo sale con código 0 en un checkout limpio,
y no antes.

```bash
# 1. Contenido y CTAs de la landing nueva
test "$(grep -c "584121484033" agentes/index.html)" = "3"                              # expect: exit 0
grep -q "para mis leads" agentes/index.html                                            # expect: exit 0
! grep -q "para mi inmobiliaria" agentes/index.html                                    # expect: exit 0
test "$(grep -c 'class="pain-item"' agentes/index.html)" = "4"                         # expect: exit 0
test "$(grep -c 'class="glance-row"' agentes/index.html)" = "4"                        # expect: exit 0
! (awk '/<footer>/,/<\/footer>/' agentes/index.html | grep -q "<a ")                    # expect: exit 0
! grep -Eiq "\b(tenés|querés|podés|sabés|escribís|sos)\b" agentes/index.html           # expect: exit 0

# 2. Sin cross-linking hacia ninguna de las otras dos landings
! grep -qE 'href="(\.\./)?(index\.html|/|inmobiliarias)' agentes/index.html            # expect: exit 0
! grep -qE 'href="[^"]*agentes' index.html                                              # expect: exit 0
! grep -qE 'href="[^"]*agentes' inmobiliarias/index.html                                # expect: exit 0
# nota: NO se usa `grep -q "agentes"` a secas contra inmobiliarias/index.html — esa landing habla
# de "agencias con varios agentes" en su propio copy legítimo (la palabra existe hoy en el archivo,
# verificado), así que un match de sustring sin anclar a `href="` sería un falso positivo permanente

# 3. La ruta resuelve igual que en Vercel (sirviendo estático desde la raíz del repo)
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
test "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:8080/agentes/)" = "200"            # expect: exit 0
test "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:8080/agentes/index.html)" = "200"  # expect: exit 0
kill_port_8080

# 4. Landings 1 y 2 intactas
test -z "$(git diff --stat -- index.html)"                    # expect: exit 0
test -z "$(git diff --stat -- inmobiliarias/index.html)"      # expect: exit 0
```

**No hay comando de a11y automatizado** en este gate — misma decisión cero-dependencias que
`blueprints/landing-inmobiliarias/`. Su equivalente vive en la lista manual de abajo.

Plus these manual gates, each checked once before launch:

- [ ] Cada paso de §9 tiene su tag de checkpoint en git — `git tag -l 'agentes-*'` lista exactamente
      5, uno por paso, y no colisiona con los `step-*` del build anterior (`git tag -l 'step-*'`
      sigue listando exactamente 5, sin cambios).
- [ ] Cada archivo de la tabla "Files that must be committed" de §10 está presente en un checkout
      limpio: `git ls-files --error-unmatch <path>` sale 0 para cada uno, una ruta a la vez.
- [ ] Cada fila de la tabla de reconciliación cruzada en §19.6 dice "Compared: yes" — confirmado al
      escribir este blueprint.
- [ ] El Bootstrap de §10 se corrió una segunda vez sobre un árbol ya bootstrapeado, salió con
      código 0, y `CLAUDE.md`/`AGENTS.md` quedaron con el mismo contenido exacto que en la primera
      corrida (`diff blueprints/landing-agentes/workspace/CLAUDE.md CLAUDE.md` sin salida, mismo
      para `AGENTS.md`) — confirma que la sobrescritura es determinista e idempotente.
- [ ] Cada no-goal de §1 sigue sin construirse — en particular: `index.html` e
      `inmobiliarias/index.html` no cambiaron, no existe ninguna carpeta `agentes/assets/`, y ningún
      `<a>` en ninguna de las tres landings enlaza a otra de las tres.
- [ ] Pase manual de accesibilidad completo según §15: navegación por teclado de nav + mockup + 3
      CTAs, una pasada con lector de pantalla sobre el hero y el CTA final, zoom al 200% a 360px de
      ancho sin scroll horizontal.
- [ ] `vercel --prod` desplegado y `https://axisai.space/agentes/` responde `200` con certificado
      TLS válido.
- [ ] Confirmar en el dashboard/despliegue de Vercel que `/agentes/` sirve `agentes/index.html` sin
      necesitar `vercel.json` (mismo mecanismo que ya funciona para `/inmobiliarias/` en producción,
      donde nunca hizo falta el `vercel.json` de fallback documentado en el Riesgo #1 de abajo).

**No warnings are ignored.**

### 20.2 Risk register

| Risk | Likelihood | Impact | Early signal | Mitigation |
|---|---|---|---|---|
| Vercel no resuelve `/agentes` a `/agentes/index.html` sin config explícita en este proyecto en particular | L | M | `curl` a `https://axisai.space/agentes/` devuelve 404 tras el deploy | El mismo mecanismo ya está probado en producción para `/inmobiliarias/` sin `vercel.json`; el Paso 5/§20.1 lo verifica localmente de todas formas antes de desplegar. Fallback si falla: `vercel.json` con `{"rewrites":[{"source":"/agentes","destination":"/agentes/index.html"}]}` |
| El mensaje de WhatsApp de esta landing se confunde o se copia por error del de `inmobiliarias/index.html` ("...para mi inmobiliaria") durante el build | M | M | El Paso 5/§20.1 encuentra la frase equivocada en `agentes/index.html` | Verify explícito en el Paso 5 y en §20.1: `grep -q "para mis leads"` (positivo) y `! grep -q "para mi inmobiliaria"` (negativo) sobre `agentes/index.html` |
| Voseo colado en el copy — ya ocurrió una vez durante el rediseño visual anterior de este mismo repo | M | M | El grep negativo del Paso 5 encuentra una coincidencia | Paso 5/§20.1 incluye el grep negativo explícito contra las 6 formas de voseo conocidas, bloqueante antes de dar el build por terminado |
| El badge "Recomendada" o las burbujas del mockup se leen como una afirmación de resultado real de un cliente inmobiliario | M | M | Revisión de copy detecta ambigüedad entre "ilustración de producto" y "resultado de cliente" | El badge y las burbujas usan lenguaje puramente cualitativo/ilustrativo (mismo patrón ya aprobado para "Presupuesto capturado" en `inmobiliarias/index.html`), sin cifras de conversión ni nombre de cliente |
| El footer sin lista de enlaces se percibe como "roto" o incompleto en una revisión visual rápida | L | L | Feedback humano en QA visual pidiendo agregar navegación | Documentado explícitamente como decisión deliberada del usuario en §1 y §20.3 — no es un defecto de este build |
| `npx http-server` necesita red la primera vez en una máquina sin caché de npm | L | L | Mismo riesgo ya aceptado en `blueprints/landing-inmobiliarias/blueprint.md` §20.2 | Aceptado — toda máquina que corre este build ya necesita red para `vercel --prod` |

### 20.3 Decision log

| # | Decision | Rejected alternative | Why | Would reverse if |
|---|---|---|---|---|
| 1 | Mensaje de WhatsApp propio para esta landing ("...para mis leads") | Reutilizar el mensaje de `inmobiliarias/index.html` ("...para mi inmobiliaria") | Esta landing habla a un agente individual, no a una agencia — el mensaje debe reflejar esa audiencia desde el primer contacto | El usuario decide unificar el mensaje de contacto entre las tres landings |
| 2 | Footer sin lista de enlaces (texto plano) | Agregar un link discreto entre las tres landings en el footer | Preserva la regla no-negociable existente de no cross-linking sin tocar `index.html` ni `inmobiliarias/index.html` — decisión explícita del usuario para este build | Se decide unificar la navegación del sitio en un solo dominio con selector de audiencia |
| 3 | Sin carpeta `agentes/assets/` ni video real planeado | Crear una carpeta `assets/` con `README.md` de placeholders, como se hizo para `inmobiliarias/` | El mockup CSS de burbujas de chat es la pieza final para esta landing — no hay grabación en el roadmap inmediato, así que no existe ningún archivo real por documentar todavía | Se decide grabar un video real específico para esta landing |
| 4 | Namespace de tags `agentes-*` en vez de continuar `step-06...` | Continuar la numeración global `step-06` a `step-10` | Instrucción explícita del usuario — aísla el rollback de este build del de `inmobiliarias`, y establece la convención de un namespace por landing para builds futuros | Nunca — namespacing por landing es ahora la convención del repo |
| 5 | `CLAUDE.md`/`AGENTS.md` se sobrescriben completos con el contenido ya fusionado, en vez de aplicar un parche `sed` incremental sobre los archivos existentes | Insertar líneas vía `sed` idempotente en las posiciones exactas de las tablas existentes | Con solo dos blueprints de por medio, mantener el contenido final completo y legible en `workspace/` es más simple y menos frágil que un parche posicional basado en coincidencia de texto, y sigue siendo idempotente porque ningún paso de §9 vuelve a editar `CLAUDE.md`/`AGENTS.md` después del Bootstrap | El repo acumula tantas landings/blueprints que el archivo fusionado se acerca al límite de 200 líneas y hay que modularizar contenido hacia `.claude/rules/` |
| 6 | No se emite `workspace/.claude/settings.json` en este bundle | Copiar el `settings.json` del bundle anterior tal cual, o reemitir uno nuevo con las mismas entradas | El `.claude/settings.json` ya existente en la raíz ya pre-aprueba cada comando que este blueprint usa (verificado línea por línea en §19.3) — reemitirlo sin necesidad no aporta nada y agrega una fuente más que mantener sincronizada | Un paso futuro de este blueprint necesitara un binario nuevo no cubierto por los patrones `Bash(<comando>:*)` ya presentes |

### 20.4 What to build next

1. Video real y capturas específicas para esta landing — trigger: si se decide grabar contenido real
   dirigido a un agente individual (distinto al de `inmobiliarias/index.html`).
2. Actualizar `README.md` para listar las tres rutas activas del sitio — trigger: si se decide
   mantener el README como documentación de rutas activas (hoy solo menciona `/inmobiliarias/`).
3. `vercel.json` con el rewrite de `/agentes` — trigger: solo si el gate de producción del Paso
   5/§20.1 detecta que `/agentes` no resuelve sin él.
4. Mención de clientes reales del vertical inmobiliario — trigger: cuando exista al menos un cliente
   real dispuesto a ser citado.
5. Selector de audiencia / navegación unificada entre las tres landings — trigger: si el negocio
   decide que un mismo visitante debe poder moverse entre las tres ofertas.

---

*End of blueprint. Build order is §9. Stop when §20.1 is green.*

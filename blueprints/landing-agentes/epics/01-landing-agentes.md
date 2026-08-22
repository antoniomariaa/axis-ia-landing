# Epic 01: Landing Agentes

> Después de este epic existe una tercera landing de marketing, `agentes/index.html`, dirigida a un
> agente inmobiliario independiente, reutilizando el sistema de diseño ya compartido en
> `assets/shared.css` — sin tocar `index.html` ni `inmobiliarias/index.html`.

| | |
|---|---|
| **Epic id** | `01-landing-agentes` |
| **Tasks** | `E1-T1` … `E1-T5` |
| **Depends on** | nothing — start here |
| **Unlocks** | nothing — es el único epic de este build |
| **Parallel with** | ninguno — los 5 pasos son secuenciales sobre el mismo archivo |

You do not need any other file to complete this epic. Everything below is repeated here on purpose.

---

## Stack

HTML5 + CSS3 planos, un archivo autocontenido (`agentes/index.html`) · sin framework · sin JS ·
Vercel (hosting estático, proyecto ya existente `axis-ia-landing`, dominio `axisai.space`).
Package manager: NOT APPLICABLE — no existe ningún gestor de paquetes en este repo. `npx` obtiene
`http-server` de forma efímera solo para la verificación local, no como dependencia instalada.

| Task | Command |
|---|---|
| Servir localmente | `npx --yes http-server . -p 8080` — abre `http://localhost:8080/agentes/` |
| Verificar ruta | `curl -s -o /dev/null -w '%{http_code}' http://localhost:8080/agentes/` — debe imprimir `200` |
| Buscar contenido | `grep -q '<patrón>' agentes/index.html` |
| Contar CTAs de WhatsApp | `grep -c "584121484033" agentes/index.html` — debe dar `3` al final del epic |
| Confirmar landing 1 intacta | `git diff --stat -- index.html` — debe no mostrar salida |
| Confirmar landing 2 intacta | `git diff --stat -- inmobiliarias/index.html` — debe no mostrar salida |
| Desplegar | `vercel --prod` |

**Gate:** ningún comando de tipo `typecheck`/`lint`/`test` existe en este repo — el gate de cada
tarea es su propio array `verify` en `tasks.json`, ejecutado en orden, con el último comando en
código 0.

No hay ningún servicio local que levantar antes de un task individual — el servidor HTTP efímero de
la verificación final (`E1-T5`) se levanta y se apaga dentro del propio comando `verify`.

## Directory subtree

Solo la parte que este epic toca:

```
agentes/
  index.html          # NUEVO — la landing completa. Un único archivo, todos los 5 tasks lo editan.
assets/
  shared.css           # EXISTE, solo lectura — nav, botones, hero/stage/tilt, glance-*, report-card/rc-*, footer
index.html              # EXISTE, solo lectura — landing 1, NUNCA se edita en este epic
inmobiliarias/
  index.html            # EXISTE, solo lectura — landing 2, NUNCA se edita en este epic
```

Todo lo fuera de este subárbol está fuera de alcance. Si una tarea parece requerir editar un archivo
no listado aquí (en particular `index.html` o `inmobiliarias/index.html`), detente y repórtalo — es
un defecto del boundary del epic, no una oportunidad de expandir el alcance.

## Data model touched here

NOT APPLICABLE — página de marketing estática sin persistencia de datos.

## Contracts

**Consumed** — ya existe, no se reconstruye:

| From | Interface | Guarantee |
|---|---|---|
| `assets/shared.css` (build anterior) | Clases `.nav`/`.nav-cta`, `.btn-primary`/`.btn-secondary`, `.hero`/`.hero-text`/`.eyebrow`/`.hero-lead`/`.hero-actions`, `.stage`/`.tilt`, `section`/`.section-head`/`.section-tag`, `.glance-list`/`.glance-row`/`.glance-idx`/`.glance-body`/`.glance-label`, `.report-card`/`.rc-*`, footer (`.f-brand`/`.fmark`/`.f-note`), tokens `:root` | Estilo y comportamiento visual idénticos a `index.html`/`inmobiliarias/index.html` sin necesitar copiar CSS de vuelta a este archivo |
| `inmobiliarias/index.html` (patrón, no interfaz de código) | `.video-placeholder`/`.vp-card`/`.vp-head`/`.vp-dot`/`.vp-label`/`.vp-body`/`.vp-bubble`/`.vp-bubble-in`/`.vp-bubble-out`/`.vp-typing`/`.vp-note` — definidas inline en ESE archivo, no en `shared.css` | Este epic **reimplementa** estas mismas reglas inline en `agentes/index.html` (no las importa) — mismo patrón visual, archivo propio |

**Produced** — nada fuera de este epic depende de sus exports, porque es el único epic del build:

| Export | Signature | Used by |
|---|---|---|
| NOT APPLICABLE | — | Este es el único epic; no hay ningún epic posterior que consuma algo de este |

## Conventions that bite in this area

- **Todo `<link>` que salga de `agentes/index.html` hacia CSS compartido es `../assets/shared.css`**
  — un nivel arriba, igual que `inmobiliarias/index.html`. No confundir con `assets/shared.css` (sin
  `../`), que es la forma correcta solo desde `index.html` en la raíz.
- **El mensaje de WhatsApp de esta landing NO es el de `inmobiliarias/index.html`.** Es fácil
  copiar/pegar el bloque de nav/hero de esa landing como punto de partida y olvidar cambiar el
  `text=` de la URL. El mensaje correcto de este epic es `Hola, quiero probar el agente de WhatsApp
  para mis leads`, codificado `Hola%2C%20quiero%20probar%20el%20agente%20de%20WhatsApp%20para%20mis%20leads`.
- **Tuteo neutro venezolano, siempre.** Nunca voseo (`tenés`, `querés`, `podés`, `sabés`,
  `escribís`, `sos`). Ya ocurrió una vez por accidente en el rediseño visual anterior de este mismo
  repo — revisa cada línea de copy nueva contra esta lista antes de dar una tarea por terminada.
- **Habla siempre a un agente individual, nunca a una agencia o equipo.** "Tú", nunca "ustedes" ni
  "tu equipo". No menciones coordinación de agentes ni panel gerencial — eso es contenido exclusivo
  de `inmobiliarias/index.html`.
- **El footer de esta landing es texto plano, sin ningún `<a>`.** No repitas el patrón de footer con
  links de otra landing si alguna vez lo tuviera — aquí, cero enlaces.

Full project rules: `CLAUDE.md`. Area rules: `.claude/rules/agentes-landing.md`. Ambos ya están en
la raíz del proyecto — el builder los copió/sobrescribió ahí en el Paso 0 de §10 antes del task uno.

---

## Tasks

Listed in the same order as `tasks.json`. That order is the build order — work top to bottom and do
not re-rank by priority or by what looks quick.

### `E1-T1` — Estructura, shell de página, nav y hero con mockup de chat

**Depends on:** nothing · **Priority:** p0 — metadata, no es un orden de ejecución

Crea `agentes/index.html` desde cero: `<!DOCTYPE html>`, `<head>` con `<title>`, meta viewport, los
dos `<link rel="preconnect">` de Google Fonts y el `<link>` de la hoja `Space+Grotesk`/`IBM+Plex+Sans`
(copia exacta de `inmobiliarias/index.html`), y `<link rel="stylesheet" href="../assets/shared.css">`.
Un único `<style>` propio con solo lo que introduce este task: la regla `.vp-badge` (misma receta
visual que `.process-time` de `index.html` — pill pequeño, fondo `rgba(15,110,86,0.22)`, texto
`var(--teal-light)`, radio 100px). El `<body>` abre con `.skip-link`, el `<nav class="nav">`
(logo `.brand`/`.brand-name` "Axis IA", mismo SVG mark que las otras landings, y `.nav-cta` con
texto "Pruébalo gratis" enlazando al WhatsApp de esta landing) y el `<header class="hero"
id="contenido-principal">` completo con `.hero-text` (eyebrow, h1, hero-lead, hero-actions con
`.btn-primary` + `.btn-secondary`) y `.stage`/`.tilt` con el mockup de chat completo (burbujas
`.vp-bubble-in`/`.vp-bubble-out`, `.vp-typing`, el badge `.vp-badge` "Recomendada" sobre la burbuja
de salida, y `.vp-note` mencionando "11:47 pm"). No cierres `</body></html>` todavía — eso llega en
`E1-T4`.

**Files**
- `agentes/index.html` — new

**Acceptance**

1. **WHEN** se abre `agentes/index.html` **THE SYSTEM SHALL** mostrar la nav con `class="brand-name"` conteniendo "Axis IA" y un `class="nav-cta"` con el texto "Pruébalo gratis".
2. **WHEN** se ejecuta `test "$(grep -c "584121484033" agentes/index.html)" = "2"` **THE SYSTEM SHALL** salir con código 0 (nav + CTA primario del hero — el CTA final aún no existe).
3. **WHEN** se ejecuta `grep -q "para mis leads" agentes/index.html` **THE SYSTEM SHALL** salir con código 0 — el mensaje de WhatsApp correcto de esta landing está presente.
4. **WHEN** se ejecuta `grep -q "Mientras enseñas un apartamento" agentes/index.html` **THE SYSTEM SHALL** salir con código 0 — el H1 literal está presente.
5. **WHEN** se ejecuta `grep -q "Ver cómo funciona" agentes/index.html` **THE SYSTEM SHALL** salir con código 0 — el CTA secundario de texto está presente.
6. **WHEN** se ejecuta `grep -q "vp-badge" agentes/index.html` y `grep -q "Recomendada" agentes/index.html` **THE SYSTEM SHALL** salir ambos con código 0 — el badge del mockup existe.

**Verify** — every command, in order, run from the project root.

```bash
grep -q 'class="brand-name"' agentes/index.html
grep -q 'class="nav-cta"' agentes/index.html
test "$(grep -c "584121484033" agentes/index.html)" = "2"
grep -q "para mis leads" agentes/index.html
grep -q "Mientras enseñas un apartamento" agentes/index.html
grep -q "Ver cómo funciona" agentes/index.html
grep -q "vp-badge" agentes/index.html
grep -q "Recomendada" agentes/index.html
```

**Checkpoint**

```bash
git add -A && git commit -m "E1-T1: estructura, shell, nav y hero con mockup de chat (agentes)"
git tag agentes-01-shell-nav-hero
```

### `E1-T2` — Sección Los 4 dolores del agente independiente

**Depends on:** `E1-T1` · **Priority:** p0

Agrega, en el `<style>` propio de `agentes/index.html`, las reglas `.pain-list` (grid 2×2 con
divisores, análogo a `.process-list` de `index.html` pero sin `.process-time` porque aquí no hay
pasos de un proceso) y `.pain-item`/`.pain-num` (número circular, `<h3>`, `<p>`). Agrega la sección
completa con `.section-head` (`.section-tag` "Esto te suena" + `<h2>` "Los 4 dolores del agente
independiente") y los 4 `.pain-item` con el copy literal del blueprint (números 01-04: "El primero
que contesta, se queda con el lead" / "Repites lo mismo cien veces" / "Tu horario no es 24/7, pero tu
WhatsApp sí recibe mensajes 24/7" / "No sabes cuál lead vale la pena perseguir", cada uno con su
párrafo literal). No parafrasees el copy — es texto final aprobado.

**Files**
- `agentes/index.html` — edit: agrega la sección de dolores después del `</header>` del hero

**Acceptance**

1. **WHEN** se ejecuta `test "$(grep -c 'class="pain-item"' agentes/index.html)" = "4"` **THE SYSTEM SHALL** salir con código 0.
2. **WHEN** se ejecuta `grep -q "Esto te suena" agentes/index.html` **THE SYSTEM SHALL** salir con código 0.
3. **WHEN** se ejecuta `grep -q "El primero que contesta, se queda con el lead" agentes/index.html` **THE SYSTEM SHALL** salir con código 0.
4. **WHEN** se ejecuta `grep -q "Repites lo mismo cien veces" agentes/index.html` **THE SYSTEM SHALL** salir con código 0.
5. **WHEN** se ejecuta `grep -q "tu WhatsApp sí recibe mensajes 24/7" agentes/index.html` **THE SYSTEM SHALL** salir con código 0.
6. **WHEN** se ejecuta `grep -q "No sabes cuál lead vale la pena perseguir" agentes/index.html` **THE SYSTEM SHALL** salir con código 0.

**Verify**

```bash
test "$(grep -c 'class="pain-item"' agentes/index.html)" = "4"
grep -q "Esto te suena" agentes/index.html
grep -q "El primero que contesta, se queda con el lead" agentes/index.html
grep -q "Repites lo mismo cien veces" agentes/index.html
grep -q "tu WhatsApp sí recibe mensajes 24/7" agentes/index.html
grep -q "No sabes cuál lead vale la pena perseguir" agentes/index.html
```

**Checkpoint**

```bash
git add -A && git commit -m "E1-T2: seccion los 4 dolores del agente independiente (agentes)"
git tag agentes-02-dolores
```

### `E1-T3` — Sección de un vistazo (glance) y por qué es distinto

**Depends on:** `E1-T2` · **Priority:** p0

Agrega la sección `id="de-un-vistazo"` reutilizando el patrón **ya existente en `shared.css`**
(`.glance`/`.section-head`/`.glance-list`/`.glance-row`/`.glance-idx`/`.glance-body`/`.glance-label`
— sin CSS nuevo, solo marcado HTML) con `.section-tag` "Axis IA, de un vistazo" + `<h2>` "Cómo se ve
en la práctica", y los 4 `.glance-row` A-D con el copy literal del blueprint (Respuesta/Calificación/
Catálogo/Traspaso). Agrega después una segunda sección propia (`.distinto`, nueva, solo `max-width` y
espaciado, sin grid ni checklist) con `<h2>` "Por qué esto es distinto a 'poner un chatbot'" y los dos
párrafos literales del blueprint.

**Files**
- `agentes/index.html` — edit: agrega ambas secciones después de la de dolores

**Acceptance**

1. **WHEN** se ejecuta `test "$(grep -c 'class="glance-row"' agentes/index.html)" = "4"` **THE SYSTEM SHALL** salir con código 0.
2. **WHEN** se ejecuta `grep -q "Axis IA, de un vistazo" agentes/index.html` **THE SYSTEM SHALL** salir con código 0.
3. **WHEN** se ejecuta `grep -q "Precalifica antes de que tú intervengas" agentes/index.html` **THE SYSTEM SHALL** salir con código 0.
4. **WHEN** se ejecuta `grep -q "Te avisa cuándo meterte tú" agentes/index.html` **THE SYSTEM SHALL** salir con código 0.
5. **WHEN** se ejecuta `grep -q "distinto a" agentes/index.html` **THE SYSTEM SHALL** salir con código 0 — el título de la sección "por qué es distinto" está presente.
6. **WHEN** se ejecuta `grep -q "no recepcionista" agentes/index.html` **THE SYSTEM SHALL** salir con código 0 — el segundo párrafo de esa sección está presente.

**Verify**

```bash
test "$(grep -c 'class="glance-row"' agentes/index.html)" = "4"
grep -q "Axis IA, de un vistazo" agentes/index.html
grep -q "Precalifica antes de que tú intervengas" agentes/index.html
grep -q "Te avisa cuándo meterte tú" agentes/index.html
grep -q "distinto a" agentes/index.html
grep -q "no recepcionista" agentes/index.html
```

**Checkpoint**

```bash
git add -A && git commit -m "E1-T3: seccion de un vistazo y por que es distinto (agentes)"
git tag agentes-03-glance-distinto
```

### `E1-T4` — CTA final, footer y responsive

**Depends on:** `E1-T3` · **Priority:** p0

Agrega `<section class="final-cta" id="contacto">` (regla `.final-cta` propia mínima, solo centrado y
`max-width` del párrafo) con el H2, el párrafo y el `.btn-primary` "Pruébalo gratis" literales del
blueprint (tercera y última aparición del enlace de WhatsApp de esta landing), y debajo un `<span>`
de texto plano (sin `<a>`) con "+58 412 1484033". Agrega `<footer>` reutilizando `.f-brand`/`.fmark`/
`.f-note` de `shared.css`: marca "Axis IA" + `.f-note` "Automatización con IA para agentes y agencias
inmobiliarias" — **cero `<a>` dentro de `<footer>`**. Agrega `@media (max-width: 860px)` y
`@media (max-width: 520px)` propios (colapsar `.pain-list` a 1 columna, ajustar padding del hero/
secciones y el ancho máximo del mockup). Cierra `</body></html>`.

**Files**
- `agentes/index.html` — edit: agrega CTA final, footer, media queries y cierra el archivo

**Acceptance**

1. **WHEN** se ejecuta `test "$(grep -c "584121484033" agentes/index.html)" = "3"` **THE SYSTEM SHALL** salir con código 0 (nav + hero + CTA final — completo).
2. **WHEN** se ejecuta `grep -q "Cuántos leads se te fueron esta semana" agentes/index.html` **THE SYSTEM SHALL** salir con código 0.
3. **WHEN** se ejecuta `grep -q "+58 412 1484033" agentes/index.html` **THE SYSTEM SHALL** salir con código 0 — el número visible como texto plano está presente.
4. **WHEN** se ejecuta `! (awk '/<footer>/,/<\/footer>/' agentes/index.html | grep -q "<a ")` **THE SYSTEM SHALL** salir con código 0 — cero enlaces dentro del footer.
5. **WHEN** se ejecuta `grep -q "Automatización con IA para agentes y agencias inmobiliarias" agentes/index.html` **THE SYSTEM SHALL** salir con código 0.
6. **WHEN** se ejecuta `grep -q "@media (max-width: 860px)" agentes/index.html && grep -q "@media (max-width: 520px)" agentes/index.html && grep -q "</html>" agentes/index.html` **THE SYSTEM SHALL** salir con código 0 — breakpoints presentes y el archivo quedó correctamente cerrado.

**Verify**

```bash
test "$(grep -c "584121484033" agentes/index.html)" = "3"
grep -q "Cuántos leads se te fueron esta semana" agentes/index.html
grep -q "+58 412 1484033" agentes/index.html
! (awk '/<footer>/,/<\/footer>/' agentes/index.html | grep -q "<a ")
grep -q "Automatización con IA para agentes y agencias inmobiliarias" agentes/index.html
grep -q "@media (max-width: 860px)" agentes/index.html
grep -q "@media (max-width: 520px)" agentes/index.html
grep -q "</html>" agentes/index.html
```

**Checkpoint**

```bash
git add -A && git commit -m "E1-T4: cta final, footer y responsive (agentes)"
git tag agentes-04-cta-footer-responsive
```

### `E1-T5` — Verificación final: ruta resuelve, landings 1 y 2 intactas, tuteo correcto

**Depends on:** `E1-T4` · **Priority:** p0

Ningún archivo nuevo. Sirve el repo localmente y confirma que `/agentes/` resuelve igual que en
Vercel, que ni `index.html` ni `inmobiliarias/index.html` cambiaron ni un byte, que el copy no tiene
ninguna forma de voseo conocida, y que el mensaje de WhatsApp es el correcto de esta landing (no el
de `inmobiliarias/index.html`).

**Files**

Ninguno — este task es puramente de verificación.

**Acceptance**

1. **WHEN** se sirve el repositorio con `npx --yes http-server . -p 8080` y se pide `http://localhost:8080/agentes/` **THE SYSTEM SHALL** responder con código HTTP `200`.
2. **WHEN** se pide `http://localhost:8080/agentes/index.html` directamente **THE SYSTEM SHALL** responder también con código HTTP `200`.
3. **WHEN** se ejecuta `git diff --stat -- index.html` **THE SYSTEM SHALL** no producir ninguna salida — landing 1 permanece intacta.
4. **WHEN** se ejecuta `git diff --stat -- inmobiliarias/index.html` **THE SYSTEM SHALL** no producir ninguna salida — landing 2 permanece intacta.
5. **WHEN** se busca cualquiera de las formas de voseo tenés, querés, podés, sabés, escribís, sos en `agentes/index.html` **THE SYSTEM SHALL** no encontrar ninguna coincidencia.
6. **WHEN** se ejecuta `test "$(grep -c "584121484033" agentes/index.html)" = "3"` y `grep -q "para mis leads" agentes/index.html` y `! grep -q "para mi inmobiliaria" agentes/index.html` **THE SYSTEM SHALL** salir los tres con código 0 — el mensaje de WhatsApp es el correcto de esta landing, no el de inmobiliarias/index.html.

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
test "$CODE_DIR" = "200" && test "$CODE_FILE" = "200"
test -z "$(git diff --stat -- index.html)"
test -z "$(git diff --stat -- inmobiliarias/index.html)"
! grep -Eiq "\b(tenés|querés|podés|sabés|escribís|sos)\b" agentes/index.html
test "$(grep -c "584121484033" agentes/index.html)" = "3"
grep -q "para mis leads" agentes/index.html
! grep -q "para mi inmobiliaria" agentes/index.html
```

**Checkpoint**

```bash
git add -A && git commit -m "E1-T5: verificacion final landing agentes" --allow-empty
git tag agentes-05-verify-deploy-ready
```

---

## Epic acceptance

The epic is done when every task is `done` **and**:

1. **WHEN** un visitante abre `https://axisai.space/agentes/` **THE SYSTEM SHALL** recibir la landing
   completa, con los 3 CTAs de WhatsApp funcionando y apuntando al mensaje correcto de esta landing.
2. **WHEN** se compara el estado de `index.html` e `inmobiliarias/index.html` contra el commit previo
   a este epic **THE SYSTEM SHALL** reportar cero diferencias en ambos.

```bash
test "$(grep -c "584121484033" agentes/index.html)" = "3" && grep -q "para mis leads" agentes/index.html && ! grep -q "para mi inmobiliaria" agentes/index.html
test -z "$(git diff --stat -- index.html)" && test -z "$(git diff --stat -- inmobiliarias/index.html)"
```

Run from the project root. Ambos criterios son decidibles por estos comandos — ninguno espera a un
humano ni a un servicio externo.

## Pitfalls

- **Copiar el bloque de nav/hero de `inmobiliarias/index.html` como punto de partida y olvidar
  cambiar el mensaje de WhatsApp** — el `text=` de la URL debe decir "para mis leads", nunca "para mi
  inmobiliaria". Ver Convention arriba y el Verify negativo de `E1-T5`.
- **Escribir "ustedes" o "tu equipo" en cualquier punto del copy** — esta landing habla siempre a un
  agente individual. Si una frase suena a coordinación de equipo, pertenece a
  `inmobiliarias/index.html`, no a este epic.
- **Voseo colado** ("tenés", "querés", etc.) — ya ocurrió una vez en el rediseño anterior de este
  mismo repo. El grep negativo de `E1-T5` es la última línea de defensa, pero conviene revisar cada
  frase nueva contra esta lista al escribirla, no solo al final.
- **Agregar un componente CSS nuevo para algo que ya existe en `shared.css`** — antes de escribir una
  regla nueva, confirma que `.glance-*`/`.report-card`/`.rc-*`/`.hero`/`.stage`/`.tilt` no la cubren
  ya.
- **Dejar el archivo sin cerrar** — `E1-T1` a `E1-T3` no cierran `</body></html>` a propósito (el
  archivo se construye incrementalmente); solo `E1-T4` lo cierra. No agregues un cierre prematuro en
  un task anterior.

## Before moving on

- [ ] Every task in this epic is `done` in `tasks.json` — no task left `in_progress`.
- [ ] Every `verify` command of every task in this epic passed, not just the first one.
- [ ] No `verify` command was edited, and none was skipped because a file it names did not exist.
- [ ] **Every task in this epic has its `checkpoint` tag in version control** — `git tag -l
      'agentes-*'` lista exactamente 5.
- [ ] Gate command passes clean, run from the project root.
- [ ] Every "Produced" contract above exists with the stated signature — NOT APPLICABLE, este epic
      no produce ningún export consumido por otro epic.
- [ ] No file outside the subtree was modified — en particular, `index.html` e
      `inmobiliarias/index.html` sin cambios.
- [ ] `.env.example` updated if this epic added a variable — NOT APPLICABLE, este proyecto no tiene
      variables de entorno.
- [ ] One commit per task, each prefixed with its task id, each followed by its checkpoint tag.

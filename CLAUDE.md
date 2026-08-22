# axis-ia-landing

Sitio de marketing de Axis IA: dos landings estáticas, sin build, sin framework, sin backend.

## Commands

| Task | Command |
|---|---|
| Servir localmente | `npx --yes http-server . -p 8080` — abre `http://localhost:8080/` (landing 1) o `http://localhost:8080/inmobiliarias/` (landing 2). Requiere Node/npm; no requiere Python |
| Verificar ruta | `curl -s -o /dev/null -w '%{http_code}' http://localhost:8080/inmobiliarias/` — debe imprimir `200` |
| Buscar contenido | `grep -q '<patrón>' inmobiliarias/index.html` |
| Contar CTAs de WhatsApp | `grep -c "584121484033" inmobiliarias/index.html` — debe dar `3` en la landing 2 |
| Confirmar landing 1 intacta | `git diff --stat -- index.html` — debe no mostrar salida |
| Desplegar | `vercel --prod` |

**Gate:** antes de dar cualquier tarea por terminada, corre los `grep`/`curl` que esa tarea define
en `tasks.json` (si estás trabajando desde un blueprint) o en la sección relevante del código, y
confirma código de salida 0 en todos.

No hay `package.json`, no hay lockfile, no hay `.nvmrc` — no existe ningún gestor de paquetes en
este repo. No lo introduzcas.

## Stack

HTML5 + CSS3 planos, un archivo autocontenido por landing · sin framework · sin JS externo ·
Vercel (hosting estático).

## Architecture

**Dos landings independientes, cada una un solo archivo:**

- `index.html` (raíz) — landing 1, auditoría gratuita general. **Nunca la edites** salvo que te lo
  pidan explícitamente por su nombre.
- `inmobiliarias/index.html` — landing 2, vende el agente de WhatsApp específicamente a dueños de
  agencias inmobiliarias. Assets reales pendientes (video, capturas) en `inmobiliarias/assets/` —
  ver el README ahí dentro.

**No hay cross-linking entre ambas landings** — ni una enlaza a la otra. Cada canal de tráfico
lleva a una sola oferta.

**Cada landing es 100% autocontenida:** `<style>` inline en el `<head>`, SVGs inline en el `<body>`,
sin JS. No existe ningún CSS ni JS compartido entre landings, y no se crea uno — cada archivo repite
las variables de diseño que necesita.

**Sistema de diseño — una sola fuente de verdad, `index.html` raíz:**

| Concern | Single source of truth |
|---|---|
| Tokens de color, tipografía, breakpoints | El bloque `:root` de `index.html` (raíz) — cada landing nueva copia estos valores verbatim, nunca los aproxima |
| Componente de tarjeta (`.report-card`/`.rc-*`) | Definido en `index.html`; se reutiliza para cualquier mockup de UI nuevo antes de inventar un componente distinto |
| Convención de rutas de assets | Todo `src`/`poster` dentro de un archivo de landing es relativo a **ese mismo archivo** (`assets/demo.mp4`), nunca con el prefijo de la carpeta de la landing |

## Code rules

1. **Un archivo por landing. Todo inline.** Nunca extraigas CSS o JS a un archivo separado, ni
   "solo para esta sección".
2. **Nunca edites `index.html` (raíz)** a menos que la tarea lo pida explícitamente por nombre —
   incluye no agregar links hacia otras landings.
3. **Copia los tokens de diseño, no los reinventes.** Si necesitas un color, tipografía o espaciado
   que no está en la paleta existente, pregúntate primero si un token ya cubre el caso.
4. **Sin gestor de paquetes, sin build step, sin framework.** Si una tarea parece requerir alguno de
   los tres, es una señal de que la tarea está fuera del alcance de este repo — repórtalo en vez de
   instalarlo.
5. **Todo enlace de contacto es un `https://wa.me/<numero>?text=<mensaje-codificado>`**, nunca un
   formulario. El número y el mensaje son literales fijados por la tarea que los pida — nunca los
   inventes ni los generalices a un placeholder.
6. **Nada de métricas o resultados de clientes inventados.** Los mockups de producto usan etiquetas
   cualitativas ("Presupuesto capturado"), nunca cifras — no hay datos reales que las respalden.
7. **Cero JavaScript.** Cualquier interacción se resuelve con HTML/CSS nativo (`<video controls>`,
   `:focus-visible`, `@media`) antes de considerar un script.

## Design system

Definido una sola vez en el `:root` de `index.html` (raíz); cada landing lo copia.

| Role | Value | Used for |
|---|---|---|
| `--bg` | `#12181A` | Fondo de página |
| `--surface-1` | `#1B2A26` | Tarjetas, paneles |
| `--surface-2` | `#223531` | Headers de tarjeta |
| `--teal` | `#0F6E56` | Fondos de ícono |
| `--teal-light` | `#5DCAA5` | Botones primarios, acentos |
| `--amber` | `#E9A23B` | Punto decorativo, acento del logo |
| `--ink` | `#E9E5D8` | Texto principal |
| `--ink-soft` | `#9BAAA4` | Texto secundario |

- **Tipografía:** títulos `Space Grotesk` 700; cuerpo `IBM Plex Sans` 400-600. Cargadas vía Google
  Fonts, `display=swap`.
- **Radios:** 100px (botones), 16-20px (tarjetas grandes), 12px (tarjetas pequeñas).
- **Breakpoints:** 860px, 520px — mobile-first, colapsan grillas a una columna.
- **Motion:** `prefers-reduced-motion: reduce` desactiva todas las transiciones y el scroll suave.

## Environment

NOT APPLICABLE — este proyecto no tiene ninguna variable de entorno. Es HTML estático sin backend,
sin secretos, sin configuración sensible.

## Rules

Convenciones diferidas — lee el archivo correspondiente antes de editar esa área:

| File | Applies to |
|---|---|
| `.claude/rules/inmobiliarias-landing.md` | `inmobiliarias/**` |

## Non-negotiable

1. **`index.html` (raíz) nunca se modifica** a menos que una tarea lo pida explícitamente por su
   nombre exacto.
2. **Nunca se crea un CSS o JS compartido entre landings** — cada archivo es autocontenido.
3. **Nunca se introduce un gestor de paquetes, framework o build step** sin que se pida
   explícitamente y se documente el cambio de convención.
4. **Nunca se inventan métricas, cifras o resultados atribuidos a un cliente real.**
5. **Nunca se agrega un link entre landing 1 y landing 2** — cada una vive sola.
6. Nunca se marca una tarea como terminada con un comando de `Verify` fallando.

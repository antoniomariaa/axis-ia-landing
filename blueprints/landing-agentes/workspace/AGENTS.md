# axis-ia-landing — agent instructions

Sitio de marketing de Axis IA: tres landings HTML estáticas, sin build, sin framework, sin backend.

## Commands

| Task | Command |
|---|---|
| Servir localmente | `npx --yes http-server . -p 8080` |
| Verificar ruta | `curl -s -o /dev/null -w '%{http_code}' http://localhost:8080/<landing>/` (`inmobiliarias` o `agentes`) |
| Contar CTAs de WhatsApp | `grep -c "584121484033" <landing>/index.html` |
| Confirmar una landing intacta | `git diff --stat -- <landing>/index.html` (o `index.html` para la raíz) |
| Desplegar | `vercel --prod` |

## Non-negotiable

1. `index.html` (raíz) nunca se modifica salvo que se pida explícitamente por su nombre exacto.
2. Nunca se crea un CSS o JS compartido nuevo fuera de `assets/shared.css` — lo propio de cada
   landing sigue inline.
3. Nunca se introduce un gestor de paquetes, framework o build step sin pedirlo explícitamente.
4. Nunca se inventan métricas, cifras o resultados atribuidos a un cliente real.
5. Nunca se agrega un link entre ninguna de las landings del sitio (`index.html`,
   `inmobiliarias/index.html`, `agentes/index.html`).
6. Nunca se marca una tarea como terminada con un comando de `Verify` fallando.

Arquitectura completa, límites y tokens de diseño: ver `CLAUDE.md` en este mismo directorio.

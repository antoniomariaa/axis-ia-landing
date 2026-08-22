# axis-ia-landing — agent instructions

Sitio de marketing de Axis IA: dos landings HTML estáticas, sin build, sin framework, sin backend.

## Commands

| Task | Command |
|---|---|
| Servir localmente | `npx --yes http-server . -p 8080` |
| Verificar ruta | `curl -s -o /dev/null -w '%{http_code}' http://localhost:8080/inmobiliarias/` |
| Contar CTAs de WhatsApp | `grep -c "584121484033" inmobiliarias/index.html` |
| Confirmar landing 1 intacta | `git diff --stat -- index.html` |
| Desplegar | `vercel --prod` |

## Non-negotiable

1. `index.html` (raíz) nunca se modifica salvo que se pida explícitamente por su nombre exacto.
2. Nunca se crea un CSS o JS compartido entre landings — cada archivo es autocontenido.
3. Nunca se introduce un gestor de paquetes, framework o build step sin pedirlo explícitamente.
4. Nunca se inventan métricas, cifras o resultados atribuidos a un cliente real.
5. Nunca se agrega un link entre landing 1 y landing 2.
6. Nunca se marca una tarea como terminada con un comando de `Verify` fallando.

Arquitectura completa, límites y tokens de diseño: ver `CLAUDE.md` en este mismo directorio.

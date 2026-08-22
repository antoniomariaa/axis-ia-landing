---
paths:
  - "agentes/**"
---

# Convenciones de la landing /agentes

- Todo vive inline dentro de `agentes/index.html` — un único `<style>`, SVGs inline, sin JS externo
  excepto el enlace a `../assets/shared.css`. Nunca crees un `.css` o `.js` separado nuevo para esta
  landing.
- Habla siempre a **un agente individual**, nunca a una agencia ni a un equipo: usa "tú", nunca
  "ustedes" ni "tu equipo". No menciones coordinación de equipo, reparto de leads entre agentes, ni
  panel gerencial — eso es contenido de `inmobiliarias/index.html`, no de esta landing.
- Tuteo neutro venezolano estricto: "tienes", "quieres", "tú decides". Nunca voseo ("tenés",
  "querés", "podés", "sabés", "escribís", "sos"). Verifica con un grep negativo antes de dar
  cualquier tarea por terminada — ya ocurrió una vez por accidente en el rediseño visual anterior de
  este mismo repo.
- El número de WhatsApp es siempre `584121484033`. El mensaje pre-rellenado de esta landing es
  siempre `Hola, quiero probar el agente de WhatsApp para mis leads`, codificado como
  `Hola%2C%20quiero%20probar%20el%20agente%20de%20WhatsApp%20para%20mis%20leads` en la URL de
  `wa.me`. Este mensaje es **distinto** al de `inmobiliarias/index.html`
  (`...para mi inmobiliaria`) — nunca lo copies de esa landing. Los 3 CTAs de WhatsApp de esta
  landing (nav, hero, CTA final) usan exactamente el mismo enlace. El número de teléfono visible
  como texto plano en el CTA final (`+58 412 1484033`) no es un enlace.
- Los tokens de diseño y los componentes compartidos (`.hero`/`.stage`/`.tilt`,
  `.glance-list`/`.glance-row`, `.report-card`/`.rc-*`, nav, botones, footer) vienen de
  `../assets/shared.css` — nunca se aproximan ni se reinventan. Lo propio de esta landing
  (`.pain-item`/`.pain-num`, `.vp-badge`, la sección "por qué es distinto") va inline en el
  `<style>` de `agentes/index.html`.
- El mockup del hero usa el patrón `.video-placeholder`/`.vp-*` ya establecido (burbujas de chat de
  WhatsApp) — sin video real, sin cifras ni logos de clientes. El badge "Recomendada" reutiliza el
  lenguaje visual de pill/badge ya usado en el repo (misma receta que `.process-time` en
  `index.html`), definido como una regla propia (`.vp-badge`) porque `.process-time` no vive en
  `shared.css`.
- El footer de esta landing es texto plano — "Axis IA" (marca) + "Automatización con IA para
  agentes y agencias inmobiliarias" — **sin ningún `<a>` dentro de `<footer>`**. No enlaza a
  `index.html`, a `inmobiliarias/index.html`, ni a ninguna otra página fuera de `agentes/index.html`
  y sus propios anchors internos.
- No se menciona ningún cliente ni caso cerrado en el vertical inmobiliario — es una demo de
  producto, no un caso de estudio.
- No se planea reemplazar el mockup CSS del hero por un video real — a diferencia de
  `inmobiliarias/index.html`, esta landing no tiene una carpeta `assets/` ni un `README.md` de
  medios pendientes. Si en el futuro se decide grabar un video real para esta landing, es una tarea
  nueva, no una continuación de este build.

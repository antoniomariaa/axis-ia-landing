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

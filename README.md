# AguiTech — Ideas en movimiento

Sitio de AguiTech con cinco secciones: Inicio, Universo, Enfoque, Laboratorio y Contacto. Incluye una escultura 3D interactiva, órbitas y partículas animadas, navegación por secciones y un diseño adaptable a móviles.

## Desarrollo local

El sitio usa HTML, CSS y JavaScript, con tipografías alojadas en el propio repositorio. No necesita instalar dependencias ni compilar.

```bash
python -m http.server 8000 --bind 127.0.0.1
```

Abre el servidor en tu navegador. Arrastra la escena para girarla y usa el botón de pausa para detenerla. La escena respeta la preferencia de movimiento reducido y deja de actualizarse cuando sale de pantalla.

## Publicación en GitHub Pages

El flujo `.github/workflows/pages.yml` publica el sitio con cada push a `main`. En GitHub, selecciona **Settings → Pages → Source → GitHub Actions** si Pages aún no está habilitado. El flujo intenta habilitarlo automáticamente; esa operación puede requerir permisos administrativos que el token de Actions no tenga.

Consulta **Actions → Deploy AguiTech to GitHub Pages** para comprobar el resultado. La dirección prevista es `https://aguitech.github.io/aguitech_chatgpt/`; solo estará disponible cuando el despliegue termine correctamente.

## Fuentes y contenido

- [Web de AguiTech](https://aguitech.com)
- [Currículum 2026](https://aguitech.com/CurriculumVitae/2026/ESP/)

La trayectoria personal y los proyectos históricos están pendientes de documentar a partir de estas fuentes. El sitio enlaza al CV y no atribuye logros que no se hayan verificado.

## Archivos

- `index.html`: contenido y estructura.
- `styles.css`: diseño, animaciones y adaptación a móviles.
- `app.js`: geometría 3D, proyección en perspectiva e interacción.
- `assets/fonts/`: DM Sans y Space Grotesk, con sus licencias SIL Open Font License.
- `.github/workflows/pages.yml`: publicación automática.

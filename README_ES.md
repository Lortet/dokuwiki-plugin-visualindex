# Visualindex

🇫🇷 [Français](README) | 🇬🇧 [English](README_EN) | 🇩🇪 [Deutsch](README_DE) | **🇪🇸 Español**

---

El plugin **visualindex** muestra un índice visual de páginas (o archivos de medios) de un namespace de DokuWiki.

Es compatible con:
- el editor clásico;
- ProseMirror.

## Funcionamiento

El plugin lee un namespace, construye una lista de elementos accesibles para lectura y muestra fichas con:
- una imagen;
- un título;
- un enlace a la página o al archivo de medios.

Si no hay elementos disponibles, se muestra un mensaje traducido.

## Sintaxis

Sintaxis básica:

```txt
{{visualindex>namespace}}
```

Ejemplos útiles:

```txt
{{visualindex>.}}
{{visualindex>wiki}}
{{visualindex>wiki;filter=start|syntax*}}
{{visualindex>wiki;desc=1}}
{{visualindex>wiki;medias=1}}
{{visualindex>.;filter=guide*;desc=1;medias=1}}
```

Opciones admitidas:
- `filter`: filtro simple con `*` (ej. `guide*|doc*`);
- `desc`: orden descendente (`1` / `true`);
- `medias`: mostrar medios del namespace (`1` / `true`).

Valores de namespace especiales:
- `.`: namespace actual;
- `~sub:carpeta`: namespace relativo al namespace actual.

## Parámetros de configuración

En el gestor de configuración:

- `icon_size`: tamaño del icono (ej. `100px`);
- `text_size`: tamaño del texto (ej. `13px`);
- `text_color`: color del texto (hex, rgb/rgba o nombre CSS);
- `skip_file`: expresión regular para páginas a ignorar;
- `show_in_editor_menu`: mostrar Visualindex en los menús del editor (clásico y ProseMirror);
- `use_pagesicon`: usar el helper `pagesicon` cuando esté disponible;
- `default_image`: imagen predeterminada (ID de medio, ej. `wiki:logo.png`); si está vacío, se usa la imagen interna del plugin.

## Integración con pagesicon

Si el plugin `pagesicon` está presente y activado mediante `use_pagesicon`:
- Visualindex obtiene los iconos de páginas a través del helper;
- Visualindex también obtiene los iconos de medios;
- si no se encuentra ningún icono, se usa el fallback predeterminado.

Orden de fallback:
1. icono proporcionado por `pagesicon`;
2. `default_image` de Visualindex;
3. imagen interna del plugin (`images/default_image.png`).

## ProseMirror

El plugin expone un botón `Visualindex` en ProseMirror (cuando `show_in_editor_menu` está activado) con un popup de configuración.

El popup permite configurar:
- namespace;
- filtro;
- orden descendente;
- visualización de medios.

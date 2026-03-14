====== Visualindex Plugin ======

---- plugin ----
description: Muestra un índice visual
author     : Valentin LORTET, Gabriel CHOIMET
email      : contact@valentinlortet.fr
type       : Syntax, Action
lastupdate : 2026-03-14
compatible : Librarian
depends    :
conflicts  :
similar    :
tags       : Navigation, Index, Media, ProseMirror, pagesicon

downloadurl: https://github.com/Lortet/dokuwiki-plugin-visualindex/zipball/master
bugtracker : https://github.com/Lortet/dokuwiki-plugin-visualindex/issues
sourcerepo : https://github.com/Lortet/dokuwiki-plugin-visualindex/
donationurl:
screenshot_img :
----

[[fr:plugin:visualindex|🇫🇷 Français]] | [[plugin:visualindex|🇬🇧 English]] | [[de:plugin:visualindex|🇩🇪 Deutsch]] | **🇪🇸 Español**

===== Instalación =====

Instalar el plugin desde el [[plugin:extension|Gestor de extensiones]].

===== Descripción =====

El plugin **visualindex** muestra un índice visual de las páginas (o archivos de medios) de un namespace de DokuWiki.

Es compatible con:
  * el editor clásico;
  * [[https://www.dokuwiki.org/plugin:prosemirror|ProseMirror]].

{{https://i.ibb.co/5WKQFcdF/Screenshot-2026-03-09-at-15-37-11-Wiki-doc-Wiki-BSPP.png}}

===== Sintaxis =====

Sintaxis básica:
  * ''%%{{visualindex>namespace}}%%''

Ejemplos:
  * ''%%{{visualindex>.}}%%''
  * ''%%{{visualindex>wiki}}%%''
  * ''%%{{visualindex>wiki;filter=start|syntax*}}%%''
  * ''%%{{visualindex>wiki;desc=1}}%%''
  * ''%%{{visualindex>wiki;medias=1}}%%''
  * ''%%{{visualindex>.;filter=guide*;desc=1;medias=1}}%%''

Opciones:
  * ''filter'' : filtro simple con ''*'' (ejemplo: ''guide*|doc*'');
  * ''desc'' : orden descendente (''1'' / ''true'');
  * ''medias'' : listar medios del namespace (''1'' / ''true'').

Namespace especial:
  * ''.'' : namespace actual;
  * ''~sub:carpeta'' : namespace relativo al namespace actual.

===== Configuración =====

^ Nombre ^ Descripción ^ Valor predeterminado ^
| icon_size | Tamaño del icono (ej. ''100px''). | ''100px'' |
| text_size | Tamaño del texto (ej. ''13px''). | ''13px'' |
| text_color | Color del texto (hex, rgb/rgba o nombre CSS). | ''black'' |
| skip_file | Regex de páginas a ignorar. | '''' |
| show_in_editor_menu | Mostrar Visualindex en los menús del editor (clásico y ProseMirror). | ''true'' |
| use_pagesicon | Usar el helper ''pagesicon'' cuando esté disponible. | ''true'' |
| default_image | Imagen predeterminada (ID de medio), ej. ''wiki:logo.png''. | '''' |

===== Integración con pagesicon =====

Si [[https://www.dokuwiki.org/plugin:pagesicon|pagesicon]] está instalado y ''use_pagesicon'' activado:
  * Visualindex resuelve los iconos de páginas;
  * Visualindex resuelve los iconos de medios;
  * se usa el fallback si no se encuentra ningún icono.

Orden de fallback:
  * icono proporcionado por ''pagesicon'';
  * ''default_image'' de Visualindex;
  * imagen interna del plugin (''images/default_image.png'').

===== ProseMirror =====

El plugin expone un botón ''Visualindex'' en ProseMirror (cuando ''show_in_editor_menu'' está activado) con un popup de configuración:
  * namespace;
  * filtro;
  * orden descendente;
  * visualización de medios.

===== Archivos principales =====

  * ''syntax/visualindex.php'' : análisis y renderizado XHTML;
  * ''action/prosemirror.php'' : integración del editor;
  * ''script/prosemirror.js'' : nodo ProseMirror;
  * ''script/toolbar.js'' : botón y popup;
  * ''style.css'' : estilos de visualización.

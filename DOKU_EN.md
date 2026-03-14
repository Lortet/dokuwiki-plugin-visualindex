====== Visualindex Plugin ======

---- plugin ----
description: Displays a visual index
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

[[fr:plugin:visualindex|🇫🇷 Français]] | **🇬🇧 English** | [[de:plugin:visualindex|🇩🇪 Deutsch]] | [[es:plugin:visualindex|🇪🇸 Español]]

===== Installation =====

Install the plugin from the [[plugin:extension|Extension Manager]].

===== Description =====

The plugin **visualindex** displays a visual index of pages (or media files) from a DokuWiki namespace.

It is compatible with:
  * the classic editor;
  * [[https://www.dokuwiki.org/plugin:prosemirror|ProseMirror]].

{{https://i.ibb.co/5WKQFcdF/Screenshot-2026-03-09-at-15-37-11-Wiki-doc-Wiki-BSPP.png}}

===== Syntax =====

Base syntax:
  * ''{{visualindex>namespace}}''

Examples:
  * ''{{visualindex>.}}''
  * ''{{visualindex>wiki}}''
  * ''{{visualindex>wiki;filter=start|syntax*}}''
  * ''{{visualindex>wiki;desc=1}}''
  * ''{{visualindex>wiki;medias=1}}''
  * ''{{visualindex>.;filter=guide*;desc=1;medias=1}}''

Options:
  * ''filter'' : simple wildcard filter with ''*'' (example: ''guide*|doc*'');
  * ''desc'' : descending sort (''1'' / ''true'');
  * ''medias'' : list media from namespace (''1'' / ''true'').

Special namespace:
  * ''.'' : current namespace;
  * ''~sub:folder'' : namespace relative to current namespace.

===== Settings =====

^ Name ^ Description ^ Default value ^
| icon_size | Icon size (example: ''100px''). | ''100px'' |
| text_size | Text size (example: ''13px''). | ''13px'' |
| text_color | Text color (hex, rgb/rgba, or CSS color name). | ''black'' |
| skip_file | Regex of pages to ignore. | '''' |
| show_in_editor_menu | Show Visualindex in editor menus (classic and ProseMirror). | ''true'' |
| use_pagesicon | Use ''pagesicon'' helper when available. | ''true'' |
| default_image | Default image (media ID), e.g. ''wiki:logo.png''. | '''' |

===== pagesicon integration =====

If [[https://www.dokuwiki.org/plugin:pagesicon|pagesicon]] is installed and ''use_pagesicon'' is enabled:
  * Visualindex resolves page icons;
  * Visualindex resolves media icons;
  * fallback is used if no icon is found.

Fallback order:
  * icon provided by ''pagesicon'';
  * Visualindex ''default_image'';
  * plugin internal image (''images/default_image.png'').

===== ProseMirror =====

The plugin exposes a ''Visualindex'' button in ProseMirror (when ''show_in_editor_menu'' is enabled), with a configuration popup:
  * namespace;
  * filter;
  * descending order;
  * media listing.

===== Main files =====

  * ''syntax/visualindex.php'' : parsing and XHTML rendering;
  * ''action/prosemirror.php'' : editor integration;
  * ''script/prosemirror.js'' : ProseMirror node;
  * ''script/toolbar.js'' : button and popup;
  * ''style.css'' : display styles.

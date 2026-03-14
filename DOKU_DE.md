====== Visualindex Plugin ======

---- plugin ----
description: Zeigt einen visuellen Index an
author     : Valentin LORTET, Gabriel CHOIMET
email      : contact@valentinlortet.fr
type       : Syntax, Action
lastupdate : 2026-03-09
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

[[fr:plugin:visualindex|🇫🇷 Français]] | [[plugin:visualindex|🇬🇧 English]] | **🇩🇪 Deutsch** | [[es:plugin:visualindex|🇪🇸 Español]]

===== Installation =====

Plugin über den [[plugin:extension|Extension Manager]] installieren.

===== Beschreibung =====

Das Plugin **visualindex** zeigt einen visuellen Index der Seiten (oder Mediendateien) eines DokuWiki-Namespace.

Es ist kompatibel mit:
  * dem klassischen Editor;
  * [[https://www.dokuwiki.org/plugin:prosemirror|ProseMirror]].

{{https://i.ibb.co/5WKQFcdF/Screenshot-2026-03-09-at-15-37-11-Wiki-doc-Wiki-BSPP.png}}

===== Syntax =====

Grundsyntax:
  * ''%%{{visualindex>namespace}}%%''

Beispiele:
  * ''%%{{visualindex>.}}%%''
  * ''%%{{visualindex>wiki}}%%''
  * ''%%{{visualindex>wiki;filter=start|syntax*}}%%''
  * ''%%{{visualindex>wiki;desc=1}}%%''
  * ''%%{{visualindex>wiki;medias=1}}%%''
  * ''%%{{visualindex>.;filter=guide*;desc=1;medias=1}}%%''

Optionen:
  * ''filter'' : einfacher Wildcard-Filter mit ''*'' (Beispiel: ''guide*|doc*'');
  * ''desc'' : absteigende Sortierung (''1'' / ''true'');
  * ''medias'' : Medien des Namespace auflisten (''1'' / ''true'').

Besonderer Namespace:
  * ''.'' : aktueller Namespace;
  * ''~sub:ordner'' : Namespace relativ zum aktuellen Namespace.

===== Einstellungen =====

^ Name ^ Beschreibung ^ Standardwert ^
| icon_size | Symbolgröße (z. B. ''100px''). | ''100px'' |
| text_size | Textgröße (z. B. ''13px''). | ''13px'' |
| text_color | Textfarbe (hex, rgb/rgba oder CSS-Farbname). | ''black'' |
| skip_file | Regex für zu ignorierende Seiten. | '''' |
| show_in_editor_menu | Visualindex in den Editor-Menüs anzeigen (klassisch und ProseMirror). | ''true'' |
| use_pagesicon | ''pagesicon''-Helfer verwenden, wenn verfügbar. | ''true'' |
| default_image | Standardbild (Medien-ID), z. B. ''wiki:logo.png''. | '''' |

===== pagesicon-Integration =====

Wenn [[https://www.dokuwiki.org/plugin:pagesicon|pagesicon]] installiert und ''use_pagesicon'' aktiviert ist:
  * Visualindex löst Seitensymbole auf;
  * Visualindex löst Mediensymbole auf;
  * Fallback wird verwendet, wenn kein Symbol gefunden wird.

Fallback-Reihenfolge:
  * Symbol von ''pagesicon'';
  * Visualindex ''default_image'';
  * internes Plugin-Bild (''images/default_image.png'').

===== ProseMirror =====

Das Plugin stellt eine ''Visualindex''-Schaltfläche in ProseMirror bereit (wenn ''show_in_editor_menu'' aktiviert ist) mit einem Konfigurations-Popup:
  * Namespace;
  * Filter;
  * absteigende Reihenfolge;
  * Medienanzeige.

===== Hauptdateien =====

  * ''syntax/visualindex.php'' : Parsing und XHTML-Rendering;
  * ''action/prosemirror.php'' : Editor-Integration;
  * ''script/prosemirror.js'' : ProseMirror-Knoten;
  * ''script/toolbar.js'' : Schaltfläche und Popup;
  * ''style.css'' : Anzeigestile.

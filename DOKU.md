====== Visualindex Plugin ======

---- plugin ----
description: Affiche un sommaire visuel
author     : Valentin LORTET, Gabriel CHOIMET
email      : contact@lortet.fr
type       : Syntax, Action
lastupdate : 2026-03-09
compatible : Librarian
depends    :
conflicts  :
similar    :
tags       : Navigation, Index, Media, ProseMirror, pagesicon

downloadurl:
bugtracker :
sourcerepo :
donationurl:
screenshot_img :
----

===== Installation =====

Installer le plugin depuis le [[fr:plugin:extension|Gestionnaire d'extensions]].

===== Description =====

Le plugin **visualindex** affiche un index visuel des pages (ou des médias) d'un namespace DokuWiki.

Il est compatible avec :
  * l'éditeur classique ;
  * [[https://www.dokuwiki.org/plugin:prosemirror|ProseMirror]].

===== Syntaxe =====

Syntaxe de base :
  * ''{{visualindex>namespace}}''

Exemples :
  * ''{{visualindex>.}}''
  * ''{{visualindex>wiki}}''
  * ''{{visualindex>wiki;filter=start|syntax*}}''
  * ''{{visualindex>wiki;desc=1}}''
  * ''{{visualindex>wiki;medias=1}}''
  * ''{{visualindex>.;filter=guide*;desc=1;medias=1}}''

Options :
  * ''filter'' : filtre simple avec ''*'' (ex. ''guide*|doc*'') ;
  * ''desc'' : tri descendant (''1'' / ''true'') ;
  * ''medias'' : affiche les médias du namespace (''1'' / ''true'').

Namespace spécial :
  * ''.'' : namespace courant ;
  * ''~sous:dossier'' : namespace relatif au namespace courant.

===== Paramètres =====

^ Nom ^ Description ^ Valeur par défaut ^
| taille_icone | Taille de l'icône (ex. ''100px''). | ''100px'' |
| taille_texte | Taille du texte (ex. ''13px''). | ''13px'' |
| couleur_texte | Couleur du texte (hex, rgb/rgba, ou nom CSS). | ''black'' |
| skip_file | Regex des pages à ignorer. | '''' |
| show_in_editor_menu | Afficher Visualindex dans les menus d'édition (classique et ProseMirror). | ''true'' |
| use_pagesicon | Utiliser le helper ''pagesicon'' si disponible. | ''true'' |
| default_image | Image par défaut (ID média), ex. ''wiki:logo.png''. | '''' |

===== Intégration pagesicon =====

Si [[https://www.dokuwiki.org/plugin:pagesicon|pagesicon]] est installé et ''use_pagesicon'' activé :
  * Visualindex récupère les icônes de pages ;
  * Visualindex récupère les icônes de médias ;
  * fallback par défaut si aucune icône n'est trouvée.

Ordre de fallback :
  * icône fournie par ''pagesicon'' ;
  * ''default_image'' de Visualindex ;
  * image interne du plugin (''images/default_image.png'').

===== ProseMirror =====

Le plugin expose un bouton ''Visualindex'' dans ProseMirror (si ''show_in_editor_menu'' est activé), avec une popup de configuration :
  * namespace ;
  * filtre ;
  * ordre descendant ;
  * affichage des médias.

===== Fichiers principaux =====

  * ''syntax/visualindex.php'' : parsing et rendu XHTML ;
  * ''action/prosemirror.php'' : intégration éditeur ;
  * ''script/prosemirror.js'' : nœud ProseMirror ;
  * ''script/toolbar.js'' : bouton et popup ;
  * ''style.css'' : styles d'affichage.

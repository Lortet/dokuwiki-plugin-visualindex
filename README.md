# Visualindex

**🇫🇷 Français** | [🇬🇧 English](README_EN) | [🇩🇪 Deutsch](README_DE) | [🇪🇸 Español](README_ES)

---

Le plugin **visualindex** affiche un index visuel des pages (ou des médias) d’un namespace DokuWiki.

Il est compatible avec :
- l’éditeur classique ;
- ProseMirror.

## Fonctionnement

Le plugin lit un namespace, construit une liste d’éléments accessibles en lecture, puis affiche des tuiles avec :
- une image ;
- un titre ;
- un lien vers la page ou le média.

Si aucun élément n’est disponible, un message traduit est affiché.

## Syntaxe

Syntaxe de base :

```txt
{{visualindex>namespace}}
```

Exemples utiles :

```txt
{{visualindex>.}}
{{visualindex>wiki}}
{{visualindex>wiki;filter=start|syntax*}}
{{visualindex>wiki;desc=1}}
{{visualindex>wiki;medias=1}}
{{visualindex>.;filter=guide*;desc=1;medias=1}}
```

Options supportées :
- `filter` : filtre simple avec `*` (ex. `guide*|doc*`) ;
- `desc` : tri descendant (`1` / `true`) ;
- `medias` : affiche les médias du namespace (`1` / `true`).

Namespace spécial :
- `.` : namespace courant ;
- `~sous:dossier` : namespace relatif au namespace courant.

## Paramètres de configuration

Dans le gestionnaire de configuration :

- `icon_size` : taille de l’icône (ex. `100px`) ;
- `text_size` : taille du texte (ex. `13px`) ;
- `text_color` : couleur du texte (hex, rgb/rgba, ou nom CSS) ;
- `skip_file` : expression régulière des pages à ignorer ;
- `show_in_editor_menu` : afficher Visualindex dans les menus d’édition (classique et ProseMirror) ;
- `use_pagesicon` : utiliser le helper `pagesicon` si disponible ;
- `default_image` : image par défaut (ID média, ex : `wiki:logo.png`) ; si vide, l’image interne du plugin est utilisée.

## Intégration avec pagesicon

Si le plugin `pagesicon` est présent et activé via `use_pagesicon` :
- Visualindex récupère les icônes des pages via le helper ;
- Visualindex récupère aussi les icônes des médias ;
- si aucune icône n’est trouvée, le fallback par défaut est utilisé.

Ordre de fallback :
1. icône fournie par `pagesicon` ;
2. `default_image` de Visualindex ;
3. image interne du plugin (`images/default_image.png`).

## ProseMirror

Le plugin expose un bouton `Visualindex` dans ProseMirror (si `show_in_editor_menu` est activé) avec une popup de configuration.

La popup permet de renseigner :
- le namespace ;
- le filtre ;
- l’ordre descendant ;
- l’affichage des médias.

## Fichiers principaux

- `syntax/visualindex.php` : parsing et rendu XHTML ;
- `action/prosemirror.php` : intégration éditeur ;
- `script/prosemirror.js` : nœud ProseMirror ;
- `script/toolbar.js` : bouton et popup ;
- `style.css` : styles d’affichage.

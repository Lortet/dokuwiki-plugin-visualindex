# Visualindex Plugin

## Plugin Info

- Description: displays a visual index
- Author: Valentin LORTET, Gabriel CHOIMET
- Email: contact@lortet.fr
- Type: Syntax, Action
- Last update: 2026-03-09
- Compatible: Librarian

## Installation

Install the plugin from the [Extension Manager](https://www.dokuwiki.org/plugin:extension).

## Description

The **visualindex** plugin displays a visual index of pages (or media files) from a DokuWiki namespace.

It is compatible with:
- the classic editor,
- [ProseMirror](https://www.dokuwiki.org/plugin:prosemirror).

## Syntax

Base syntax:

```txt
{{visualindex>namespace}}
```

Examples:

```txt
{{visualindex>.}}
{{visualindex>wiki}}
{{visualindex>wiki;filter=start|syntax*}}
{{visualindex>wiki;desc=1}}
{{visualindex>wiki;medias=1}}
{{visualindex>.;filter=guide*;desc=1;medias=1}}
```

Supported options:
- `filter`: simple wildcard filter with `*` (example: `guide*|doc*`),
- `desc`: descending sort (`1` / `true`),
- `medias`: list media from the namespace (`1` / `true`).

Special namespace values:
- `.`: current namespace,
- `~sub:folder`: namespace relative to current namespace.

## Settings

- `taille_icone`: icon size (example: `100px`),
- `taille_texte`: text size (example: `13px`),
- `couleur_texte`: text color (hex, rgb/rgba, or CSS color name),
- `skip_file`: regex of pages to ignore,
- `show_in_editor_menu`: show Visualindex in editor menus (classic and ProseMirror),
- `use_pagesicon`: use `pagesicon` helper when available,
- `default_image`: default image (media ID, e.g. `wiki:logo.png`); if empty, plugin internal image is used.

## pagesicon Integration

If [pagesicon](https://www.dokuwiki.org/plugin:pagesicon) is installed and `use_pagesicon` is enabled:
- Visualindex resolves page icons,
- Visualindex resolves media icons,
- fallback is applied when no icon is found.

Fallback order:
1. icon from `pagesicon`,
2. Visualindex `default_image`,
3. plugin internal image (`images/default_image.png`).

## ProseMirror

The plugin exposes a `Visualindex` button in ProseMirror (when `show_in_editor_menu` is enabled) with a configuration popup.

Popup fields:
- namespace,
- filter,
- descending order,
- media listing.

## Main Files

- `syntax/visualindex.php`: parsing and XHTML rendering,
- `action/prosemirror.php`: editor integration,
- `script/prosemirror.js`: ProseMirror node,
- `script/toolbar.js`: button and popup,
- `style.css`: display styles.

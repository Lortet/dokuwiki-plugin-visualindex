# Visualindex

[🇫🇷 Français](README) | **🇬🇧 English** | [🇩🇪 Deutsch](README_DE) | [🇪🇸 Español](README_ES)

---

The **visualindex** plugin displays a visual index of pages (or media files) from a DokuWiki namespace.

It is compatible with:
- the classic editor;
- ProseMirror.

## How It Works

The plugin reads a namespace, builds a list of readable items, then displays tiles with:
- an image;
- a title;
- a link to the page or media file.

If no item is available, a translated message is displayed.

## Syntax

Basic syntax:

```txt
{{visualindex>namespace}}
```

Useful examples:

```txt
{{visualindex>.}}
{{visualindex>wiki}}
{{visualindex>wiki;filter=start|syntax*}}
{{visualindex>wiki;desc=1}}
{{visualindex>wiki;medias=1}}
{{visualindex>.;filter=guide*;desc=1;medias=1}}
```

Supported options:
- `filter`: simple filter with `*` (e.g. `guide*|doc*`);
- `desc`: descending order (`1` / `true`);
- `medias`: show namespace media (`1` / `true`).

Special namespace values:
- `.`: current namespace;
- `~sub:folder`: namespace relative to the current namespace.

## Configuration Parameters

In the configuration manager:

- `icon_size`: icon size (e.g. `100px`);
- `text_size`: text size (e.g. `13px`);
- `text_color`: text color (hex, rgb/rgba, or CSS color name);
- `skip_file`: regular expression for pages to ignore;
- `show_in_editor_menu`: show Visualindex in editor menus (classic and ProseMirror);
- `use_pagesicon`: use the `pagesicon` helper when available;
- `default_image`: default image (media ID, e.g. `wiki:logo.png`); if empty, the plugin internal image is used.

## Integration with pagesicon

If the `pagesicon` plugin is present and enabled through `use_pagesicon`:
- Visualindex retrieves page icons through the helper;
- Visualindex also retrieves media icons;
- if no icon is found, the default fallback is used.

Fallback order:
1. icon provided by `pagesicon`;
2. Visualindex `default_image`;
3. plugin internal image (`images/default_image.png`).

## ProseMirror

The plugin exposes a `Visualindex` button in ProseMirror (when `show_in_editor_menu` is enabled), with a configuration popup.

The popup lets you configure:
- namespace;
- filter;
- descending order;
- media display.

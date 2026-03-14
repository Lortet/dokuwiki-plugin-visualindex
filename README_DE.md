# Visualindex

🇫🇷 [Français](README) | 🇬🇧 [English](README_EN) | **🇩🇪 Deutsch** | 🇪🇸 [Español](README_ES)

---

Das Plugin **visualindex** zeigt einen visuellen Index der Seiten (oder Mediendateien) eines DokuWiki-Namespace.

Es ist kompatibel mit:
- dem klassischen Editor;
- ProseMirror.

## Funktionsweise

Das Plugin liest einen Namespace, erstellt eine Liste lesbarer Elemente und zeigt Kacheln mit:
- einem Bild;
- einem Titel;
- einem Link zur Seite oder Mediendatei.

Wenn keine Elemente verfügbar sind, wird eine übersetzte Meldung angezeigt.

## Syntax

Grundsyntax:

```txt
{{visualindex>namespace}}
```

Nützliche Beispiele:

```txt
{{visualindex>.}}
{{visualindex>wiki}}
{{visualindex>wiki;filter=start|syntax*}}
{{visualindex>wiki;desc=1}}
{{visualindex>wiki;medias=1}}
{{visualindex>.;filter=guide*;desc=1;medias=1}}
```

Unterstützte Optionen:
- `filter`: einfacher Filter mit `*` (z. B. `guide*|doc*`);
- `desc`: absteigende Reihenfolge (`1` / `true`);
- `medias`: Medien des Namespace anzeigen (`1` / `true`).

Besondere Namespace-Werte:
- `.`: aktueller Namespace;
- `~sub:ordner`: Namespace relativ zum aktuellen Namespace.

## Konfigurationsparameter

Im Konfigurationsmanager:

- `icon_size`: Symbolgröße (z. B. `100px`);
- `text_size`: Textgröße (z. B. `13px`);
- `text_color`: Textfarbe (hex, rgb/rgba oder CSS-Farbnamen);
- `skip_file`: regulärer Ausdruck für zu ignorierende Seiten;
- `show_in_editor_menu`: Visualindex in den Editor-Menüs anzeigen (klassisch und ProseMirror);
- `use_pagesicon`: den `pagesicon`-Helfer verwenden, wenn verfügbar;
- `default_image`: Standardbild (Medien-ID, z. B. `wiki:logo.png`); wenn leer, wird das interne Plugin-Bild verwendet.

## Integration mit pagesicon

Wenn das Plugin `pagesicon` vorhanden und über `use_pagesicon` aktiviert ist:
- Visualindex ruft Seitensymbole über den Helfer ab;
- Visualindex ruft auch Mediensymbole ab;
- wenn kein Symbol gefunden wird, wird der Standard-Fallback verwendet.

Fallback-Reihenfolge:
1. Symbol von `pagesicon`;
2. Visualindex `default_image`;
3. internes Plugin-Bild (`images/default_image.png`).

## ProseMirror

Das Plugin stellt eine `Visualindex`-Schaltfläche in ProseMirror bereit (wenn `show_in_editor_menu` aktiviert ist) mit einem Konfigurations-Popup.

Das Popup ermöglicht die Konfiguration von:
- Namespace;
- Filter;
- absteigende Reihenfolge;
- Medienanzeige.

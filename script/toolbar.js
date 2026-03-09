if (typeof window.toolbar !== 'undefined') {
    function shouldShowInEditorMenu() {
        const raw = window.JSINFO &&
            JSINFO.plugins &&
            JSINFO.plugins.visualindex
            ? JSINFO.plugins.visualindex.show_in_editor_menu
            : true;

        if (typeof raw === 'boolean') return raw;
        const normalized = String(raw).trim().toLowerCase();
        return !(normalized === '0' || normalized === 'false' || normalized === 'off' || normalized === 'no');
    }

    function buildVisualIndexSyntax(values) {
        let syntax = '{{visualindex>' + (values.namespace || '.');
        if (values.filter) syntax += ';filter=' + values.filter;
        if (values.desc) syntax += ';desc=1';
        if (values.medias) syntax += ';medias=1';
        syntax += '}}';
        return syntax;
    }

    function insertAtSelection(area, text) {
        const selection = DWgetSelection(area);
        const before = area.value.substring(0, selection.start);
        const after = area.value.substring(selection.end);
        area.value = before + text + after;

        const pos = before.length + text.length;
        area.focus();
        area.setSelectionRange(pos, pos);
    }

    function openVisualIndexDialog(onSubmit) {
        const i18n = (window.LANG && LANG.plugins && LANG.plugins.visualindex) ? LANG.plugins.visualindex : {};
        const title = i18n.toolbar_popup_title || 'Visualindex';
        const insertLabel = i18n.toolbar_insert || 'Inserer';
        const cancelLabel = i18n.toolbar_cancel || 'Annuler';
        const namespaceLabel = i18n.toolbar_namespace || 'Namespace';
        const namespaceHelp = i18n.toolbar_namespace_help || 'Dossier. "." = dossier courant.';
        const namespacePickerLabel = i18n.toolbar_namespace_picker || 'Selectionner un dossier';
        const filterLabel = i18n.toolbar_filter || 'Filtre';
        const descLabel = i18n.toolbar_desc || 'Ordre descendant';
        const mediasLabel = i18n.toolbar_medias || 'Afficher les medias';

        const $dialog = jQuery('<div class="plugin_visualindex_form" title="' + title + '"></div>');

        $dialog.append('<label>' + namespaceLabel + '</label>');
        const $namespace = jQuery('<input type="text" class="edit" style="width:100%;" />').val('.');
        $dialog.append($namespace);
        $dialog.append('<div style="font-size:.9em;color:#555;margin-top:4px;">' + namespaceHelp + '</div>');

        const $pickerWrap = jQuery('<div style="margin-top:8px;"></div>');
        const $pickerBtn = jQuery('<button type="button" class="btn btn-default"></button>').text(namespacePickerLabel);
        const $nsList = jQuery('<select size="6" style="width:100%;margin-top:6px;display:none;"></select>');
        $pickerWrap.append($pickerBtn).append($nsList);
        $dialog.append($pickerWrap);

        $dialog.append('<label style="display:block;margin-top:8px;">' + filterLabel + '</label>');
        const $filter = jQuery('<input type="text" class="edit" style="width:100%;" />');
        $dialog.append($filter);

        const $descWrap = jQuery('<label style="display:block;margin-top:10px;"></label>');
        const $desc = jQuery('<input type="checkbox" />').prop('checked', false);
        $descWrap.append($desc).append(' ' + descLabel);
        $dialog.append($descWrap);

        const $mediasWrap = jQuery('<label style="display:block;margin-top:6px;"></label>');
        const $medias = jQuery('<input type="checkbox" />').prop('checked', false);
        $mediasWrap.append($medias).append(' ' + mediasLabel);
        $dialog.append($mediasWrap);

        const normalizeNamespace = function (value) {
            const val = String(value || '').trim();
            if (!val || val === '.') return '.';
            return val.replace(/:+$/, '');
        };

        const loadNamespaces = function () {
            const q = normalizeNamespace($namespace.val());
            jQuery.get(DOKU_BASE + 'lib/exe/ajax.php', {
                call: 'linkwiz',
                q: q === '.' ? '' : (q + ':')
            }).done(function (html) {
                const $root = jQuery('<div></div>').html(String(html || ''));
                const set = new Set();
                set.add('.');

                $root.find('a[title]').each(function () {
                    const titleVal = String(jQuery(this).attr('title') || '');
                    if (!titleVal.endsWith(':')) return;
                    const ns = normalizeNamespace(titleVal);
                    if (ns) set.add(ns);
                });

                $nsList.empty();
                Array.from(set).sort().forEach(function (ns) {
                    const opt = document.createElement('option');
                    opt.value = ns;
                    opt.textContent = ns;
                    $nsList.append(opt);
                });
                $nsList.show();
            });
        };

        $pickerBtn.on('click', function () {
            loadNamespaces();
        });

        $nsList.on('change dblclick', function () {
            const ns = String($nsList.val() || '.');
            $namespace.val(ns).trigger('focus');
        });

        $dialog.dialog({
            modal: true,
            width: 460,
            close: function () {
                jQuery(this).dialog('destroy').remove();
            },
            buttons: [
                {
                    text: insertLabel,
                    click: function () {
                        onSubmit({
                            namespace: String($namespace.val() || '.').trim() || '.',
                            filter: String($filter.val() || '').trim(),
                            desc: $desc.is(':checked'),
                            medias: $medias.is(':checked')
                        });
                        jQuery(this).dialog('close');
                    }
                },
                {
                    text: cancelLabel,
                    click: function () {
                        jQuery(this).dialog('close');
                    }
                }
            ]
        });
    }

    function addBtnActionVisualIndexPlugin($btn, props, edid) {
        $btn.on('click', function (e) {
            e.preventDefault();

            const area = document.getElementById(edid);
            if (!area) return;

            const submit = function (values) {
                insertAtSelection(area, buildVisualIndexSyntax(values));
            };

            if (typeof jQuery !== 'undefined' && jQuery.fn && typeof jQuery.fn.dialog === 'function') {
                openVisualIndexDialog(submit);
                return;
            }

            const ns = window.prompt('Namespace', '.') || '.';
            submit({namespace: ns, filter: '', desc: false, medias: false});
        });
    }

    if (shouldShowInEditorMenu()) {
        toolbar[toolbar.length] = {
            type: 'VisualIndexPlugin',
            title: (window.LANG && LANG.plugins && LANG.plugins.visualindex && LANG.plugins.visualindex.toolbar_button) || 'Visualindex',
            icon: '../../plugins/visualindex/images/folder.svg'
        };
    }
}

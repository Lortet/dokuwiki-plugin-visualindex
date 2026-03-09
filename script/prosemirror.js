(function () {
    function initializeVisualIndexProsemirror() {
        if (window.__visualindexProsemirrorInitialized) return;
        if (!window.Prosemirror || !window.Prosemirror.classes) return;
        window.__visualindexProsemirrorInitialized = true;

    const {classes: {MenuItem, AbstractMenuItemDispatcher}} = window.Prosemirror;
    function hiddenMenuItem() {
        return new MenuItem({
            label: '',
            render: () => {
                const el = document.createElement('span');
                el.style.display = 'none';
                return el;
            },
            command: () => false
        });
    }

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

    window.Prosemirror.pluginSchemas.push((nodes, marks) => {
        nodes = nodes.addToEnd('visualindex', {
            group: 'protected_block',
            inline: false,
            selectable: true,
            draggable: true,
            defining: true,
            isolating: true,
            code: true,
            attrs: {
                syntax: {default: '{{visualindex>.}}'}
            },
            toDOM: (node) => ['pre', {class: 'dwplugin', 'data-pluginname': 'visualindex'}, node.attrs.syntax],
            parseDOM: [{
                tag: 'pre.dwplugin[data-pluginname="visualindex"]',
                getAttrs: (dom) => ({syntax: (dom.textContent || '{{visualindex>.}}').trim()})
            }]
        });
        return {nodes, marks};
    });

    function parseVisualIndexSyntax(syntax) {
        const m = (syntax || '').match(/^\{\{visualindex>(.*?)\}\}$/i);
        if (!m) return null;

        const parts = m[1].split(';').map((p) => p.trim()).filter(Boolean);
        const namespace = parts.shift() || '.';
        const options = {namespace, filter: '', desc: false, medias: false};

        parts.forEach((part) => {
            const [keyRaw, valRaw] = part.split('=', 2);
            const key = (keyRaw || '').trim().toLowerCase();
            const val = valRaw === undefined ? '1' : String(valRaw).trim();
            if (key === 'filter') options.filter = val;
            if (key === 'desc') options.desc = (val !== '0' && val !== 'false' && val !== '');
            if (key === 'medias') options.medias = (val !== '0' && val !== 'false' && val !== '');
        });

        return options;
    }

    function buildVisualIndexSyntax(values) {
        let syntax = `{{visualindex>${values.namespace || '.'}`;
        if (values.filter) syntax += `;filter=${values.filter}`;
        if (values.desc) syntax += ';desc=1';
        if (values.medias) syntax += ';medias=1';
        syntax += '}}';
        return syntax;
    }

    function formatVisualIndexLabel(values) {
        const parts = [`VisualIndex: ${values.namespace || '.'}`];
        if (values.filter) parts.push(`filter=${values.filter}`);
        if (values.desc) parts.push('desc');
        if (values.medias) parts.push('medias');
        return parts.join(' | ');
    }

    function getFolderIconUrl() {
        const svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='%232f6fae' d='M10 4l2 2h8a2 2 0 0 1 2 2v2H2V6a2 2 0 0 1 2-2h6z'/><path fill='%233f88c8' d='M2 10h20v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8z'/></svg>";
        return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    }

    function getFolderMenuIcon() {
        const ns = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(ns, 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');

        const path1 = document.createElementNS(ns, 'path');
        path1.setAttribute('d', 'M10 4l2 2h8a2 2 0 0 1 2 2v2H2V6a2 2 0 0 1 2-2h6z');
        path1.setAttribute('fill', 'currentColor');
        svg.appendChild(path1);

        const path2 = document.createElementNS(ns, 'path');
        path2.setAttribute('d', 'M2 10h20v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8z');
        path2.setAttribute('fill', 'currentColor');
        svg.appendChild(path2);

        return svg;
    }

    function isLegacyVisualIndexPluginNode(node) {
        return !!(
            node &&
            node.type &&
            (node.type.name === 'dwplugin_inline' || node.type.name === 'dwplugin_block') &&
            node.attrs &&
            node.attrs['data-pluginname'] === 'visualindex'
        );
    }

    function isVisualIndexNode(node) {
        return !!(node && node.type && node.type.name === 'visualindex') || isLegacyVisualIndexPluginNode(node);
    }

    function syntaxFromNode(node) {
        if (!node) return '{{visualindex>.}}';
        if (node.type && node.type.name === 'visualindex') {
            return String((node.attrs && node.attrs.syntax) || '{{visualindex>.}}');
        }
        return String(node.textContent || '{{visualindex>.}}');
    }

    function createVisualIndexNode(schema, syntax) {
        const normalized = String(syntax || '{{visualindex>.}}').trim() || '{{visualindex>.}}';
        if (schema.nodes.visualindex) {
            return schema.nodes.visualindex.createChecked({syntax: normalized});
        }

        const fallback = schema.nodes.dwplugin_block;
        if (!fallback) return null;

        return fallback.createChecked(
            {class: 'dwplugin', 'data-pluginname': 'visualindex'},
            schema.text(normalized)
        );
    }

    function selectionIsVisualIndex(state) {
        const selected = findVisualIndexAtSelection(state);
        return !!selected;
    }

    function insertParagraphAfterSelectedVisualIndex(view) {
        if (!view || !view.state) return false;
        const selected = findVisualIndexAtSelection(view.state);
        if (!selected) return false;

        const {schema} = view.state;
        const paragraph = schema.nodes.paragraph && schema.nodes.paragraph.createAndFill();
        if (!paragraph) return false;

        const insertPos = selected.pos + selected.node.nodeSize;
        let tr = view.state.tr.insert(insertPos, paragraph).scrollIntoView();
        view.dispatch(tr);

        // Move cursor into the newly inserted paragraph.
        try {
            const SelectionClass = view.state.selection.constructor;
            const $target = view.state.doc.resolve(insertPos + 1);
            const selection = SelectionClass.near($target, 1);
            view.dispatch(view.state.tr.setSelection(selection).scrollIntoView());
        } catch (e) {
            // Keep default selection if we can't safely resolve a text position.
        }

        view.focus();
        return true;
    }

    function findVisualIndexAtSelection(state) {
        const {selection} = state;

        if (isVisualIndexNode(selection.node)) {
            return {node: selection.node, pos: selection.from};
        }

        const $from = selection.$from;

        if ($from.depth > 0 && isVisualIndexNode($from.parent)) {
            return {node: $from.parent, pos: $from.before($from.depth)};
        }

        if (isVisualIndexNode($from.nodeBefore)) {
            return {node: $from.nodeBefore, pos: $from.pos - $from.nodeBefore.nodeSize};
        }

        if (isVisualIndexNode($from.nodeAfter)) {
            return {node: $from.nodeAfter, pos: $from.pos};
        }

        for (let depth = $from.depth; depth > 0; depth -= 1) {
            const ancestor = $from.node(depth);
            if (isVisualIndexNode(ancestor)) {
                return {node: ancestor, pos: $from.before(depth)};
            }
        }

        return null;
    }

    function insertVisualIndexBlock(view, pluginNode) {
        const state = view.state;
        const {$from} = state.selection;
        const index = $from.index();

        if ($from.parent.canReplaceWith(index, index, pluginNode.type)) {
            view.dispatch(state.tr.replaceSelectionWith(pluginNode));
            return true;
        }

        for (let depth = $from.depth; depth > 0; depth -= 1) {
            const insertPos = $from.after(depth);
            try {
                view.dispatch(state.tr.insert(insertPos, pluginNode));
                return true;
            } catch (e) {
                // try a higher ancestor
            }
        }

        return false;
    }

    function showVisualIndexDialog(initialValues, onSubmit) {
        const values = {
            namespace: '.',
            filter: '',
            desc: false,
            medias: false,
            ...initialValues
        };

        const $dialog = jQuery('<div class="plugin_visualindex_form" title="Visualindex"></div>');
        $dialog.append('<label>Namespace</label>');
        const $namespace = jQuery('<input type="text" class="edit" style="width:100%;" />').val(values.namespace);
        $dialog.append($namespace);
        $dialog.append('<div style="font-size:.9em;color:#555;margin-top:4px;">Dossier. "." = dossier courant.</div>');

        $dialog.append('<label style="display:block;margin-top:8px;">Filtre</label>');
        const $filter = jQuery('<input type="text" class="edit" style="width:100%;" />').val(values.filter);
        $dialog.append($filter);

        const $descWrap = jQuery('<label style="display:block;margin-top:10px;"></label>');
        const $desc = jQuery('<input type="checkbox" />').prop('checked', !!values.desc);
        $descWrap.append($desc).append(' Ordre descendant');
        $dialog.append($descWrap);

        const $mediasWrap = jQuery('<label style="display:block;margin-top:6px;"></label>');
        const $medias = jQuery('<input type="checkbox" />').prop('checked', !!values.medias);
        $mediasWrap.append($medias).append(' Afficher les medias');
        $dialog.append($mediasWrap);

        $dialog.dialog({
            modal: true,
            width: 460,
            close: function () {
                jQuery(this).dialog('destroy').remove();
            },
            buttons: [
                {
                    text: 'Insérer',
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
                    text: 'Annuler',
                    click: function () {
                        jQuery(this).dialog('close');
                    }
                }
            ]
        });
    }

    class VisualIndexNodeView {
        constructor(node, view, getPos) {
            this.node = node;
            this.view = view;
            this.getPos = getPos;
            this.dom = document.createElement('div');
            const typeClass = (node.type && node.type.name === 'dwplugin_inline') ? 'pm_visualindex_inline' : 'pm_visualindex_block';
            this.dom.className = 'plugin_visualindex pm_visualindex_node nodeHasForm ' + typeClass;
            this.dom.setAttribute('contenteditable', 'false');
            this.render();

            this.dom.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                this.openEditor();
            });
        }

        render() {
            const syntax = syntaxFromNode(this.node);
            const parsed = parseVisualIndexSyntax(syntax);
            const label = parsed ? formatVisualIndexLabel(parsed) : syntax;
            this.dom.textContent = '';

            const icon = document.createElement('img');
            icon.className = 'pm_visualindex_icon';
            icon.src = getFolderIconUrl();
            icon.alt = '';
            icon.setAttribute('aria-hidden', 'true');
            this.dom.appendChild(icon);

            const text = document.createElement('span');
            text.textContent = label;
            this.dom.appendChild(text);
            this.dom.setAttribute('title', syntax);
        }

        openEditor() {
            const parsed = parseVisualIndexSyntax(syntaxFromNode(this.node)) || {
                namespace: '.',
                filter: '',
                desc: false,
                medias: false
            };

            showVisualIndexDialog(parsed, (values) => {
                const syntax = buildVisualIndexSyntax(values);
                const replacement = createVisualIndexNode(this.view.state.schema, syntax);
                if (!replacement) return;

                const pos = this.getPos();
                this.view.dispatch(this.view.state.tr.replaceWith(pos, pos + this.node.nodeSize, replacement));
                this.view.focus();
            });
        }

        update(node) {
            if (!isVisualIndexNode(node)) return false;
            this.node = node;
            const typeClass = (node.type && node.type.name === 'dwplugin_inline') ? 'pm_visualindex_inline' : 'pm_visualindex_block';
            this.dom.className = 'plugin_visualindex pm_visualindex_node nodeHasForm ' + typeClass;
            this.render();
            return true;
        }

        selectNode() { this.dom.classList.add('ProseMirror-selectednode'); }
        deselectNode() { this.dom.classList.remove('ProseMirror-selectednode'); }
        stopEvent() { return true; }
        ignoreMutation() { return true; }
    }

    class VisualIndexMenuItemDispatcher extends AbstractMenuItemDispatcher {
        static isAvailable(schema) {
            return !!(schema.nodes.visualindex || schema.nodes.dwplugin_block);
        }

        static getIcon() {
            const wrapper = document.createElement('span');
            wrapper.className = 'menuicon';
            wrapper.appendChild(getFolderMenuIcon());
            return wrapper;
        }

        static getMenuItem(schema) {
            if (!this.isAvailable(schema)) return hiddenMenuItem();

            return new MenuItem({
                label: 'VisualIndex',
                icon: this.getIcon(),
                command: (state, dispatch, view) => {
                    const existing = findVisualIndexAtSelection(state);
                    if (!dispatch || !view) return true;

                    let initialValues = {namespace: '.', filter: '', desc: false, medias: false};
                    if (existing) {
                        const parsed = parseVisualIndexSyntax(syntaxFromNode(existing.node));
                        if (parsed) initialValues = parsed;
                    }

                    showVisualIndexDialog(initialValues, (values) => {
                        const syntax = buildVisualIndexSyntax(values);
                        const pluginNode = createVisualIndexNode(schema, syntax);
                        if (!pluginNode) return;

                        if (existing) {
                            view.dispatch(view.state.tr.replaceWith(existing.pos, existing.pos + existing.node.nodeSize, pluginNode));
                        } else if (!insertVisualIndexBlock(view, pluginNode)) {
                            const endPos = view.state.doc.content.size;
                            view.dispatch(view.state.tr.insert(endPos, pluginNode));
                        }

                        view.focus();
                    });

                    return true;
                }
            });
        }
    }

    if (shouldShowInEditorMenu()) {
        window.Prosemirror.pluginMenuItemDispatchers.push(VisualIndexMenuItemDispatcher);
    }
    window.Prosemirror.pluginNodeViews.visualindex = (node, view, getPos) => new VisualIndexNodeView(node, view, getPos);

    const originalInline = window.Prosemirror.pluginNodeViews.dwplugin_inline;
    window.Prosemirror.pluginNodeViews.dwplugin_inline = (node, view, getPos) => {
        if (isLegacyVisualIndexPluginNode(node)) return new VisualIndexNodeView(node, view, getPos);
        return typeof originalInline === 'function' ? originalInline(node, view, getPos) : undefined;
    };

    const originalBlock = window.Prosemirror.pluginNodeViews.dwplugin_block;
    window.Prosemirror.pluginNodeViews.dwplugin_block = (node, view, getPos) => {
        if (isLegacyVisualIndexPluginNode(node)) return new VisualIndexNodeView(node, view, getPos);
        return typeof originalBlock === 'function' ? originalBlock(node, view, getPos) : undefined;
    };

    if (!window.__visualindexKeyboardGuardInstalled) {
        window.__visualindexKeyboardGuardInstalled = true;
        document.addEventListener('keydown', (event) => {
            const view = window.Prosemirror && window.Prosemirror.view;
            if (!view || !view.state) return;
            if (!selectionIsVisualIndex(view.state)) return;

            if (event.key === 'Enter') {
                event.preventDefault();
                event.stopPropagation();
                insertParagraphAfterSelectedVisualIndex(view);
                return;
            }

            if (event.key === 'Backspace' || event.key === 'Delete') {
                event.preventDefault();
                event.stopPropagation();
            }
        }, true);
    }
    }

    jQuery(document).on('PROSEMIRROR_API_INITIALIZED', initializeVisualIndexProsemirror);
    initializeVisualIndexProsemirror();
})();

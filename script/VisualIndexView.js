class VisualIndexView {
    constructor(node, outerView, getPos) {
        this.node = node;
        this.outerView = outerView;
        this.getPos = getPos;

        // Création du DOM
        this.dom = document.createElement('span');
        this.dom.className = 'plugin_visualindex';
        this.dom.setAttribute('data-namespace', node.attrs.namespace);
        this.dom.setAttribute('data-filter', node.attrs.filter);
        this.dom.setAttribute('data-desc', node.attrs.desc ? '1' : '0');

        this.dom.textContent = `VisualIndex: ${node.attrs.namespace}`;
    }

    // nécessaire pour ProseMirror
    selectNode() {
        this.dom.classList.add('ProseMirror-selectednode');
    }

    deselectNode() {
        this.dom.classList.remove('ProseMirror-selectednode');
    }

    stopEvent(event) {
        return false;
    }

    ignoreMutation(mutation) {
        return true;
    }
}
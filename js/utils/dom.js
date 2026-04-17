export function query(selector, scope = document) {
    return scope.querySelector(selector);
}

export function queryAll(selector, scope = document) {
    return Array.from(scope.querySelectorAll(selector));
}

export function setHtml(element, markup) {
    if (!element) {
        return;
    }

    element.innerHTML = markup;
}

export function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

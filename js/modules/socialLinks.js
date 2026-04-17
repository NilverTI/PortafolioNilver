import { escapeHtml, query, setHtml } from '../utils/dom.js';

function buildSocialLinkMarkup(link) {
    return `
        <a href="${escapeHtml(link.href)}" class="footer-social-link ${escapeHtml(link.hoverClassName)}"
            target="_blank" title="${escapeHtml(link.title)}">
            <i class="${escapeHtml(link.iconClassName)}"></i>
        </a>
    `;
}

export function renderSocialLinks(links) {
    const socialLinks = query('#socialLinks');

    setHtml(socialLinks, links.map(buildSocialLinkMarkup).join(''));
}

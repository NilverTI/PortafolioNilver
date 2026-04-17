import { SOCIAL_LINKS } from './constants/site-data.js';
import { renderSocialLinks } from './modules/social-links.js';

export function initFooterSection() {
    renderSocialLinks(SOCIAL_LINKS);
}

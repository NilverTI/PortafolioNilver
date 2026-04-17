import { SOCIAL_LINKS } from './constants/sitedata.js';
import { renderSocialLinks } from './modules/socialLinks.js';
import { initFooterParticles } from './modules/footerParticles.js';

export function initFooterSection() {
    renderSocialLinks(SOCIAL_LINKS);
    initFooterParticles();
}

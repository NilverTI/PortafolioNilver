import { renderSocialLinks } from './modules/socialLinks.js';

function scheduleIdleTask(callback, timeout = 2000) {
    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(callback, { timeout });
        return;
    }

    window.setTimeout(callback, 1);
}

export async function initFooterSection() {
    const socialLinks = document.querySelector('#socialLinks');

    if (socialLinks && socialLinks.children.length === 0) {
        const { SOCIAL_LINKS } = await import('./constants/sitedata.js');
        renderSocialLinks(SOCIAL_LINKS);
    }

    scheduleIdleTask(async () => {
        const { initFooterParticles } = await import('./modules/footerParticles.js');
        initFooterParticles();
    });
}

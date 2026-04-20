import { query, setHtml } from './utils/dom.js';
import { initContactForm } from './modules/contactForm.js';
import { SOCIAL_LINKS } from './constants/sitedata.js';

// Map social network name → brand color
const SOCIAL_COLORS = {
    Instagram: '#E1306C',
    GitHub:    '#6e5494',
    LinkedIn:  '#0A66C2',
    TikTok:    '#EE1D52',
    YouTube:   '#FF0000',
    Twitter:   '#1DA1F2',
    Facebook:  '#1877F2',
};

// Map social network name → @handle text
const SOCIAL_HANDLES = {
    Instagram: '@nilvert.i',
    GitHub:    'github.com/NilverTI',
    LinkedIn:  'linkedin.com/in/nilverti',
    TikTok:    '@nilvert.i',
    YouTube:   '@nilvert.i',
};

function buildSocialItem(link) {
    const color = SOCIAL_COLORS[link.title] || '#555';
    const handle = SOCIAL_HANDLES[link.title] || link.title;
    return `
        <a href="${link.href}" target="_blank" rel="noopener noreferrer"
           class="social-item" style="--social-color: ${color};"
           aria-label="${link.title}">
            <div class="social-item__icon">
                <i class="${link.iconClassName}"></i>
            </div>
            <div class="social-item__info">
                <p class="social-item__name">${link.title}</p>
                <p class="social-item__handle">${handle}</p>
            </div>
            <i class="fa-solid fa-arrow-up-right-from-square social-item__arrow"></i>
        </a>
    `;
}

export function initContactSection() {
    initContactForm();
    
    const socialList = query('#contactSocialList');
    if (socialList && socialList.innerHTML.includes('{{contactSocialLinks}}')) {
        setHtml(socialList, SOCIAL_LINKS.map(buildSocialItem).join(''));
    }
}
}

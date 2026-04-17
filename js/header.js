import { NAV_LINKS } from './constants/sitedata.js';
import { initNavigation, renderNavigation } from './modules/navigation.js';

export function initHeaderSection() {
    renderNavigation(NAV_LINKS);
    initNavigation();
}

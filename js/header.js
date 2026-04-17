import { NAV_LINKS } from './constants/site-data.js';
import { initNavigation, renderNavigation } from './modules/navigation.js';

export function initHeaderSection() {
    renderNavigation(NAV_LINKS);
    initNavigation();
}

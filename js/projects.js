import { PROJECTS } from './constants/sitedata.js';
import { LANGUAGE_CHANGE_EVENT } from './i18n.js';
import { renderProjects } from './modules/projectsList.js';

let projectsSectionInitialized = false;

export function initProjectsSection() {
    if (projectsSectionInitialized) {
        return;
    }

    projectsSectionInitialized = true;
    renderProjects(PROJECTS);
    window.addEventListener(LANGUAGE_CHANGE_EVENT, () => {
        renderProjects(PROJECTS);
    });
}

import { PROJECTS } from './constants/sitedata.js';
import { renderProjects } from './modules/projectsList.js';

export function initProjectsSection() {
    renderProjects(PROJECTS);
}

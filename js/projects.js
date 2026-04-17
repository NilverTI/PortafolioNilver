import { PROJECTS } from './constants/sitedata.js';
import { initProjectDetails } from './modules/project-details.js';
import { renderProjects } from './modules/projectsList.js';

export function initProjectsSection() {
    renderProjects(PROJECTS);
    initProjectDetails();
}

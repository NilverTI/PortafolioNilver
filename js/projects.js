import { PROJECTS } from './constants/site-data.js';
import { initProjectDetails } from './modules/project-details.js';
import { renderProjects } from './modules/projects-list.js';

export function initProjectsSection() {
    renderProjects(PROJECTS);
    initProjectDetails();
}

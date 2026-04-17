import { query, queryAll } from '../utils/dom.js';

export function initProjectDetails() {
    const projectsGrid = query('#projectsGrid');

    if (!projectsGrid) {
        return;
    }

    projectsGrid.addEventListener('click', (event) => {
        const toggleButton = event.target.closest('[data-project-toggle]');

        if (!toggleButton) {
            return;
        }

        const detailsContainer = toggleButton.nextElementSibling;
        const isOpen = detailsContainer?.classList.contains('open');

        queryAll('.details-container', projectsGrid).forEach((container) => {
            container.classList.remove('open');
            container.style.maxHeight = null;
        });

        if (detailsContainer && !isOpen) {
            detailsContainer.classList.add('open');
            detailsContainer.style.maxHeight = `${detailsContainer.scrollHeight}px`;
        }
    });
}

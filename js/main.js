import { initCustomScrollbar } from './modules/custom-scrollbar.js';

const SECTION_LOADERS = {
    header: () => import('./header.js').then((module) => module.initHeaderSection()),
    home: () => import('./home.js').then((module) => module.initHomeSection()),
    skills: () => import('./skills.js').then((module) => module.initSkillsSection()),
    projects: () => import('./projects.js').then((module) => module.initProjectsSection()),
    contact: () => import('./contact.js').then((module) => module.initContactSection()),
    footer: () => import('./footer.js').then((module) => module.initFooterSection())
};

const initializedSections = new Set();
const LAZY_SECTIONS = [
    { loaderId: 'skills', elementId: 'skills' },
    { loaderId: 'projects', elementId: 'projects' },
    { loaderId: 'contact', elementId: 'contact' },
    { loaderId: 'footer', elementId: 'footerCyberpunk' }
];

function initSection(sectionId) {
    if (initializedSections.has(sectionId)) {
        return;
    }

    initializedSections.add(sectionId);
    void SECTION_LOADERS[sectionId]?.();
}

function observeLazySections(sections) {
    if (!('IntersectionObserver' in window)) {
        sections.forEach(({ loaderId }) => initSection(loaderId));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            observer.unobserve(entry.target);
            initSection(entry.target.dataset.loaderId);
        });
    }, {
        rootMargin: '300px 0px'
    });

    sections.forEach(({ loaderId, elementId }) => {
        const element = document.getElementById(elementId);

        if (element) {
            element.dataset.loaderId = loaderId;
            observer.observe(element);
        }
    });
}

function bootstrap() {
    initCustomScrollbar();
    initSection('header');
    initSection('home');
    observeLazySections(LAZY_SECTIONS);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
} else {
    bootstrap();
}

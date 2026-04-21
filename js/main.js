import { initCustomScrollbar } from './modules/custom-scrollbar.js';

const SECTION_INITIALIZERS = {
    header: () => import('./header.js').then((m) => m.initHeaderSection()),
    home: () => import('./home.js').then((m) => m.initHomeSection()),
    skills: () => import('./skills.js').then((m) => m.initSkillsSection()),
    projects: () => import('./projects.js').then((m) => m.initProjectsSection()),
    contact: () => import('./contact.js').then((m) => m.initContactSection()),
    footer: () => import('./footer.js').then((m) => m.initFooterSection())
};

const initializedSections = new Set();

const LAZY_SECTIONS = [
    { loaderId: 'skills', elementId: 'skills' },
    { loaderId: 'projects', elementId: 'projects' },
    { loaderId: 'contact', elementId: 'contact' },
    { loaderId: 'footer', elementId: 'footerCyberpunk' }
];

function initSection(sectionId) {
    if (initializedSections.has(sectionId)) return;
    initializedSections.add(sectionId);
    void SECTION_INITIALIZERS[sectionId]?.();
}

function observeLazySections(sections) {
    if (!('IntersectionObserver' in window)) {
        sections.forEach(({ loaderId }) => initSection(loaderId));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            observer.unobserve(entry.target);
            initSection(entry.target.dataset.loaderId);
        });
    }, { rootMargin: '300px 0px' });

    sections.forEach(({ loaderId, elementId }) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.dataset.loaderId = loaderId;
            observer.observe(element);
        }
    });
}

async function bootstrap() {
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

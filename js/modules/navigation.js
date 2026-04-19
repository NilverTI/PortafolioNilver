import { query, queryAll } from '../utils/dom.js';

let navigationInitialized = false;

function setActiveNav(targetId) {
    queryAll('[data-nav-link]').forEach((link) => {
        const isActive = link.getAttribute('href') === targetId;
        link.classList.toggle('active-nav', isActive);
    });
}

function closeMobileMenu(mobileMenu, mobileButton) {
    if (!mobileMenu || mobileMenu.classList.contains('hidden')) {
        return;
    }

    mobileMenu.classList.add('hidden');
    mobileButton?.setAttribute('aria-expanded', 'false');
}

function scrollToSection(targetId) {
    const section = query(targetId);

    if (!section) {
        return;
    }

    const top = section.getBoundingClientRect().top + window.scrollY - 80;

    window.scrollTo({
        top,
        behavior: 'smooth'
    });
}

function initSectionHighlighting() {
    const sections = queryAll('section[id]');

    if (!sections.length) {
        return;
    }

    if (!('IntersectionObserver' in window)) {
        const highlightSection = () => {
            let currentSectionId = '#home';

            sections.forEach((section) => {
                if (window.scrollY >= section.offsetTop - 120) {
                    currentSectionId = `#${section.id}`;
                }
            });

            setActiveNav(currentSectionId);
        };

        window.addEventListener('scroll', highlightSection, { passive: true });
        highlightSection();
        return;
    }

    const visibleSections = new Map();
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            visibleSections.set(entry.target.id, entry);
        });

        const activeEntry = Array.from(visibleSections.values())
            .filter((entry) => entry.isIntersecting)
            .sort((entryA, entryB) => {
                if (entryB.intersectionRatio !== entryA.intersectionRatio) {
                    return entryB.intersectionRatio - entryA.intersectionRatio;
                }

                return entryA.boundingClientRect.top - entryB.boundingClientRect.top;
            })[0];

        if (activeEntry) {
            setActiveNav(`#${activeEntry.target.id}`);
        }
    }, {
        rootMargin: '-35% 0px -45% 0px',
        threshold: [0.1, 0.25, 0.5, 0.75]
    });

    sections.forEach((section) => observer.observe(section));
}

export function initNavigation() {
    if (navigationInitialized) {
        return;
    }

    navigationInitialized = true;

    const mobileButton = query('#mobileMenuButton');
    const mobileMenu = query('#mobileMenu');

    if (mobileButton && mobileMenu) {
        mobileButton.addEventListener('click', () => {
            const isExpanded = mobileButton.getAttribute('aria-expanded') === 'true';

            mobileMenu.classList.toggle('hidden');
            mobileButton.setAttribute('aria-expanded', String(!isExpanded));
        });
    }

    const headerLogo = query('#headerLogo');
    if (headerLogo) {
        headerLogo.addEventListener('click', (event) => {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            history.replaceState(null, '', window.location.pathname + window.location.search);
            setActiveNav('#home');
            closeMobileMenu(mobileMenu, mobileButton);
        });
    }

    document.addEventListener('click', (event) => {
        const link = event.target.closest('[data-nav-link]');

        if (!link) {
            return;
        }

        const targetId = link.getAttribute('href');
        if (!targetId?.startsWith('#')) {
            return;
        }

        event.preventDefault();
        scrollToSection(targetId);
        setActiveNav(targetId);
        closeMobileMenu(mobileMenu, mobileButton);
    });

    setActiveNav('#home');
    initSectionHighlighting();
}

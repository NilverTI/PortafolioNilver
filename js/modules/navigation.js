import { escapeHtml, query, queryAll, setHtml } from '../utils/dom.js';

function buildNavMarkup(navLinks) {
    return navLinks.map(({ href, label }) => `
        <li>
            <a href="${escapeHtml(href)}" class="nav-link" data-nav-link>
                ${escapeHtml(label)}
            </a>
        </li>
    `).join('');
}

function setActiveNav(targetId) {
    queryAll('[data-nav-link]').forEach((link) => {
        const isActive = link.getAttribute('href') === targetId;
        link.classList.toggle('active-nav', isActive);
    });
}

export function renderNavigation(navLinks) {
    const markup = buildNavMarkup(navLinks);

    queryAll('[data-nav-list]').forEach((list) => {
        setHtml(list, markup);
    });
}

export function initNavigation() {
    const mobileButton = query('#mobileMenuButton');
    const mobileMenu = query('#mobileMenu');
    const navLinks = queryAll('[data-nav-link]');

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
            
            // Clean up the URL hash without reloading the page
            history.replaceState(null, null, ' ');
            setActiveNav('#home');
        });
    }

    navLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const targetId = link.getAttribute('href');

            if (!targetId?.startsWith('#')) {
                return;
            }

            event.preventDefault();

            const section = query(targetId);

            if (section) {
                window.scrollTo({
                    top: section.offsetTop - 80,
                    behavior: 'smooth'
                });
            }

            setActiveNav(targetId);

            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                mobileButton?.setAttribute('aria-expanded', 'false');
            }
        });
    });

    function highlightSection() {
        const sections = queryAll('section');
        let currentSectionId = '';

        sections.forEach((section) => {
            if (window.pageYOffset >= section.offsetTop - 100) {
                currentSectionId = `#${section.id}`;
            }
        });

        if (currentSectionId) {
            setActiveNav(currentSectionId);
        }
    }

    window.addEventListener('scroll', highlightSection);
    highlightSection();
}

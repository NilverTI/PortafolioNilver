import { escapeHtml, query, setHtml } from '../utils/dom.js';
import { getLocalizedValue, translate } from '../i18n.js';

const PER_PAGE = 6;

let currentPage = 0;
let allProjects = [];

function getProjectImageSrc(imageSrc) {
    if (!imageSrc.endsWith('.webp')) {
        return imageSrc;
    }

    return imageSrc.replace('img/proyectos/', 'img/proyectos/optimized/');
}

function buildProjectCard(project) {
    const projectTitle = getLocalizedValue(project.title);
    const projectDescription = getLocalizedValue(project.description);
    const imageAlt = getLocalizedValue(project.imageAlt || project.title);

    return `
        <a href="${escapeHtml(project.websiteUrl)}" target="_blank" rel="noopener noreferrer"
           class="proj-card" aria-label="${escapeHtml(translate('projectsView.liveAria', { title: projectTitle }))}">
            <div class="proj-card__img-wrap">
                <img
                    src="${escapeHtml(getProjectImageSrc(project.imageSrc))}"
                    alt="${escapeHtml(imageAlt)}"
                    class="proj-card__img"
                    loading="lazy"
                    decoding="async"
                    fetchpriority="low"
                    width="1600"
                    height="1000"
                    sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw"
                />
            </div>
            <div class="proj-card__overlay">
                <span class="proj-card__visit">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    ${escapeHtml(translate('projectsView.visitWebsite'))}
                </span>
                <div class="proj-card__body">
                    <div class="proj-card__meta">
                        <h3 class="proj-card__title">${escapeHtml(projectTitle)}</h3>
                        <i class="fa-solid fa-arrow-up-right-from-square proj-card__arrow"></i>
                    </div>
                    <p class="proj-card__desc">${escapeHtml(projectDescription)}</p>
                </div>
            </div>
        </a>
    `;
}

function buildDots(totalPages, page) {
    return Array.from({ length: totalPages }, (_, index) => `
        <button
            class="proj-dot ${index === page ? 'active' : ''}"
            data-page="${index}"
            aria-label="${escapeHtml(translate('projectsView.goToPage', { page: index + 1 }))}"
        ></button>
    `).join('');
}

function updatePaginationUI(page) {
    const totalPages = Math.ceil(allProjects.length / PER_PAGE);
    const dots = query('#projPageDots');
    const prev = query('#projPrevBtn');
    const next = query('#projNextBtn');

    if (!dots || !prev || !next) {
        return;
    }

    setHtml(dots, buildDots(totalPages, page));

    prev.disabled = page === 0;
    next.disabled = page === totalPages - 1;
    prev.classList.toggle('disabled', page === 0);
    next.classList.toggle('disabled', page === totalPages - 1);
}

function renderPage(page, { animate = true } = {}) {
    const grid = query('#projectsGrid');
    if (!grid) {
        return;
    }

    const start = page * PER_PAGE;
    const slice = allProjects.slice(start, start + PER_PAGE);

    const applyMarkup = () => {
        setHtml(grid, slice.map(buildProjectCard).join(''));
        grid.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        grid.style.opacity = '1';
        grid.style.transform = 'translateY(0)';
        updatePaginationUI(page);
    };

    if (!animate) {
        applyMarkup();
        return;
    }

    grid.style.opacity = '0';
    grid.style.transform = 'translateY(12px)';

    window.setTimeout(applyMarkup, 220);
}

function goToPage(page) {
    const totalPages = Math.ceil(allProjects.length / PER_PAGE);

    if (page < 0 || page >= totalPages || page === currentPage) {
        return;
    }

    currentPage = page;
    renderPage(currentPage);
}

function bindPaginationEvents(pagination) {
    if (pagination.dataset.bound === 'true') {
        return;
    }

    pagination.dataset.bound = 'true';
    pagination.addEventListener('click', (event) => {
        const button = event.target.closest('button');
        if (!button) {
            return;
        }

        if (button.id === 'projPrevBtn') {
            goToPage(currentPage - 1);
            return;
        }

        if (button.id === 'projNextBtn') {
            goToPage(currentPage + 1);
            return;
        }

        if (button.dataset.page) {
            goToPage(Number(button.dataset.page));
        }
    });
}

export function renderProjects(projects) {
    allProjects = projects;
    currentPage = 0;

    const pagination = query('#projPagination');
    const grid = query('#projectsGrid');
    if (!pagination || !grid) {
        return;
    }

    const totalPages = Math.ceil(allProjects.length / PER_PAGE);
    pagination.style.display = totalPages <= 1 ? 'none' : 'flex';

    bindPaginationEvents(pagination);
    updatePaginationUI(0);
    renderPage(0, { animate: false });
}

import { escapeHtml, query, setHtml } from '../utils/dom.js';

const PER_PAGE = 6;
let currentPage = 0;
let allProjects = [];

function buildProjectCard(project) {
    return `
        <a href="${escapeHtml(project.websiteUrl)}" target="_blank" rel="noopener noreferrer"
           class="proj-card" aria-label="Ver ${escapeHtml(project.title)} en vivo">

            <!-- Image fills the entire card -->
            <div class="proj-card__img-wrap">
                <img
                    src="${escapeHtml(project.imageSrc)}"
                    alt="${escapeHtml(project.imageAlt || project.title)}"
                    class="proj-card__img"
                    loading="lazy"
                />
            </div>

            <!-- Hover overlay: pill + title + desc -->
            <div class="proj-card__overlay">
                <span class="proj-card__visit">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    Ver sitio web
                </span>
                <div class="proj-card__body">
                    <div class="proj-card__meta">
                        <h3 class="proj-card__title">${escapeHtml(project.title)}</h3>
                        <i class="fa-solid fa-arrow-up-right-from-square proj-card__arrow"></i>
                    </div>
                    <p class="proj-card__desc">${escapeHtml(project.description)}</p>
                </div>
            </div>

        </a>
    `;
}

function renderPage(page) {
    const grid = query('#projectsGrid');
    if (!grid) return;

    const start = page * PER_PAGE;
    const slice = allProjects.slice(start, start + PER_PAGE);

    // Fade out → swap → fade in
    grid.style.opacity = '0';
    grid.style.transform = 'translateY(12px)';

    setTimeout(() => {
        setHtml(grid, slice.map(buildProjectCard).join(''));
        grid.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        grid.style.opacity = '1';
        grid.style.transform = 'translateY(0)';
    }, 220);

    updatePaginationUI(page);
}

function updatePaginationUI(page) {
    const totalPages = Math.ceil(allProjects.length / PER_PAGE);
    const dots  = query('#projPageDots');
    const prev  = query('#projPrevBtn');
    const next  = query('#projNextBtn');

    if (!dots || !prev || !next) return;

    // Dots
    dots.innerHTML = Array.from({ length: totalPages }, (_, i) => `
        <button
            class="proj-dot ${i === page ? 'active' : ''}"
            data-page="${i}"
            aria-label="Ir a página ${i + 1}"
        ></button>
    `).join('');

    dots.querySelectorAll('.proj-dot').forEach((dot) => {
        dot.addEventListener('click', () => goToPage(Number(dot.dataset.page)));
    });

    // Prev / Next state
    prev.disabled = page === 0;
    next.disabled = page === totalPages - 1;
    prev.classList.toggle('disabled', page === 0);
    next.classList.toggle('disabled', page === totalPages - 1);
}

function goToPage(page) {
    currentPage = page;
    renderPage(currentPage);
}

export function renderProjects(projects) {
    allProjects = projects;
    currentPage = 0;

    const prev = query('#projPrevBtn');
    const next = query('#projNextBtn');
    const pagination = query('#projPagination');

    const totalPages = Math.ceil(allProjects.length / PER_PAGE);

    // Hide pagination if only 1 page
    if (pagination) {
        pagination.style.display = totalPages <= 1 ? 'none' : 'flex';
    }

    if (prev) prev.addEventListener('click', () => { if (currentPage > 0) goToPage(currentPage - 1); });
    if (next) next.addEventListener('click', () => { if (currentPage < totalPages - 1) goToPage(currentPage + 1); });

    renderPage(0);
}

import { escapeHtml, query, setHtml } from '../utils/dom.js';

const PAGE_SIZE = 9;
let currentPage = 0;
let allSkills = [];

function buildSkillCard(s) {
    return `
        <div class="sk-card">
            <div class="sk-card__head">
                <div class="sk-card__icon" style="--c:${s.color}">
                    <i class="${escapeHtml(s.icon)}" style="color:${s.color}"></i>
                </div>
                <div class="sk-card__info">
                    <span class="sk-card__name">${escapeHtml(s.name)}</span>
                    <span class="sk-card__cat">${escapeHtml(s.category)}</span>
                </div>
                <span class="sk-card__pct" style="color:${s.color}">${s.value}%</span>
            </div>
            <p class="sk-card__desc">${escapeHtml(s.desc)}</p>
            <div class="sk-bar__track">
                <div class="sk-bar__fill skill-bar-anim"
                     style="--tw:${s.value}%;--c:${s.color};"></div>
            </div>
        </div>
    `;
}

function buildPagination(totalPages) {
    const dots = Array.from({ length: totalPages }, (_, i) => `
        <button class="sk-page-dot ${i === currentPage ? 'sk-page-dot--active' : ''}"
                data-page="${i}" aria-label="Página ${i + 1}"></button>
    `).join('');

    return `
        <div class="sk-pagination">
            <button class="sk-page-btn sk-page-btn--prev" id="skillsPrev"
                    ${currentPage === 0 ? 'disabled' : ''}>
                <i class="fa-solid fa-chevron-left"></i>
            </button>
            <div class="sk-page-dots">${dots}</div>
            <button class="sk-page-btn sk-page-btn--next" id="skillsNext"
                    ${currentPage >= totalPages - 1 ? 'disabled' : ''}>
                <i class="fa-solid fa-chevron-right"></i>
            </button>
        </div>
        <p class="sk-page-info">
            Mostrando ${currentPage * PAGE_SIZE + 1}–${Math.min((currentPage + 1) * PAGE_SIZE, allSkills.length)} de ${allSkills.length} habilidades
        </p>
    `;
}

function renderPage(container, paginationContainer) {
    const totalPages = Math.ceil(allSkills.length / PAGE_SIZE);
    const pageSkills = allSkills.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

    // Render cards with fade-out then fade-in
    container.classList.add('sk-grid--fade');
    setTimeout(() => {
        setHtml(container, pageSkills.map(buildSkillCard).join(''));
        setHtml(paginationContainer, buildPagination(totalPages));
        container.classList.remove('sk-grid--fade');

        // Animate bars
        const fills = container.querySelectorAll('.skill-bar-anim');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('skill-bar-anim--go');
                    observer.unobserve(e.target);
                }
            });
        }, { threshold: 0.05 });
        fills.forEach(el => observer.observe(el));

        // Bind pagination buttons
        query('#skillsPrev')?.addEventListener('click', () => {
            if (currentPage > 0) { currentPage--; renderPage(container, paginationContainer); }
        });
        query('#skillsNext')?.addEventListener('click', () => {
            if (currentPage < totalPages - 1) { currentPage++; renderPage(container, paginationContainer); }
        });
        paginationContainer.querySelectorAll('.sk-page-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                currentPage = Number(dot.dataset.page);
                renderPage(container, paginationContainer);
            });
        });
    }, 150);
}

export function renderSkillCategories(categories) {
    const container = query('#skillsCategoryGrid');
    const paginationContainer = query('#skillsPagination');
    if (!container || !paginationContainer) return;

    // Flatten all skills from all categories
    allSkills = categories.flatMap(cat =>
        cat.skills.map(s => ({ ...s, category: cat.label }))
    );
    currentPage = 0;
    renderPage(container, paginationContainer);
}

/* ─── Legacy stubs ─── */
export function renderSkills() {}
export function initSkillsViewToggle() {}

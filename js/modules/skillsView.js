import { escapeHtml, query, setHtml } from '../utils/dom.js';

const PAGE_SIZE = 9;

let currentPage = 0;
let allSkills = [];
let skillsBarObserver;

function getSkillsBarObserver() {
    if (skillsBarObserver || !('IntersectionObserver' in window)) {
        return skillsBarObserver;
    }

    skillsBarObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add('skill-bar-anim--go');
            skillsBarObserver.unobserve(entry.target);
        });
    }, { threshold: 0.05 });

    return skillsBarObserver;
}

function animateSkillBars(container) {
    const fills = container.querySelectorAll('.skill-bar-anim');
    const observer = getSkillsBarObserver();

    if (!observer) {
        fills.forEach((fill) => fill.classList.add('skill-bar-anim--go'));
        return;
    }

    fills.forEach((fill) => {
        fill.classList.remove('skill-bar-anim--go');
        observer.observe(fill);
    });
}

function buildSkillCard(skill) {
    return `
        <div class="sk-card">
            <div class="sk-card__head">
                <div class="sk-card__icon" style="--c:${skill.color}">
                    <i class="${escapeHtml(skill.icon)}" style="color:${skill.color}"></i>
                </div>
                <div class="sk-card__info">
                    <span class="sk-card__name">${escapeHtml(skill.name)}</span>
                    <span class="sk-card__cat">${escapeHtml(skill.category)}</span>
                </div>
                <span class="sk-card__pct" style="color:${skill.color}">${skill.value}%</span>
            </div>
            <p class="sk-card__desc">${escapeHtml(skill.desc)}</p>
            <div class="sk-bar__track">
                <div class="sk-bar__fill skill-bar-anim"
                     style="--tw:${skill.value}%;--c:${skill.color};"></div>
            </div>
        </div>
    `;
}

function buildPagination(totalPages) {
    const dots = Array.from({ length: totalPages }, (_, index) => `
        <button class="sk-page-dot ${index === currentPage ? 'sk-page-dot--active' : ''}"
                data-page="${index}" aria-label="P&aacute;gina ${index + 1}"></button>
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
            Mostrando ${currentPage * PAGE_SIZE + 1}&ndash;${Math.min((currentPage + 1) * PAGE_SIZE, allSkills.length)} de ${allSkills.length} habilidades
        </p>
    `;
}

function renderPage(container, paginationContainer, { animate = true } = {}) {
    const totalPages = Math.ceil(allSkills.length / PAGE_SIZE);
    const pageSkills = allSkills.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

    const applyMarkup = () => {
        setHtml(container, pageSkills.map(buildSkillCard).join(''));
        setHtml(paginationContainer, buildPagination(totalPages));
        container.classList.remove('sk-grid--fade');
        animateSkillBars(container);
    };

    if (!animate) {
        applyMarkup();
        return;
    }

    container.classList.add('sk-grid--fade');
    window.setTimeout(applyMarkup, 150);
}

function bindPaginationEvents(container, paginationContainer) {
    if (paginationContainer.dataset.bound === 'true') {
        return;
    }

    paginationContainer.dataset.bound = 'true';
    paginationContainer.addEventListener('click', (event) => {
        const target = event.target.closest('button');
        if (!target) {
            return;
        }

        if (target.id === 'skillsPrev' && currentPage > 0) {
            currentPage -= 1;
            renderPage(container, paginationContainer);
            return;
        }

        if (target.id === 'skillsNext' && currentPage < Math.ceil(allSkills.length / PAGE_SIZE) - 1) {
            currentPage += 1;
            renderPage(container, paginationContainer);
            return;
        }

        if (target.dataset.page) {
            const nextPage = Number(target.dataset.page);
            if (Number.isNaN(nextPage) || nextPage === currentPage) {
                return;
            }

            currentPage = nextPage;
            renderPage(container, paginationContainer);
        }
    });
}

export function renderSkillCategories(categories) {
    const container = query('#skillsCategoryGrid');
    const paginationContainer = query('#skillsPagination');

    if (!container || !paginationContainer) {
        return;
    }

    allSkills = categories.flatMap((category) =>
        category.skills.map((skill) => ({ ...skill, category: category.label }))
    );
    currentPage = 0;

    bindPaginationEvents(container, paginationContainer);

    if (container.children.length > 0 && paginationContainer.children.length > 0) {
        animateSkillBars(container);
        return;
    }

    renderPage(container, paginationContainer, { animate: false });
}

export function renderSkills() {}
export function initSkillsViewToggle() {}

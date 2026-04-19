const fs = require('fs/promises');
const path = require('path');
const vm = require('vm');

async function readJson(filePath) {
    const fileContent = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContent);
}

async function readText(filePath) {
    return fs.readFile(filePath, 'utf8');
}

async function writeText(filePath, content) {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content, 'utf8');
}

function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function replaceTokens(template, replacements) {
    return Object.entries(replacements).reduce((result, [token, value]) =>
        result.replaceAll(`{{${token}}}`, value), template);
}

function buildStyleTag(bundleHref) {
    return `    <link rel="stylesheet" href="${bundleHref}" />`;
}

function toAbsoluteUrl(siteUrl, assetPath) {
    return new URL(assetPath, siteUrl).toString();
}

function buildStructuredData(metadata, socialLinks) {
    return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'NILVER T.I',
        url: metadata.siteUrl,
        image: toAbsoluteUrl(metadata.siteUrl, metadata.previewImage),
        jobTitle: 'Desarrollador Full Stack',
        description: metadata.description,
        sameAs: socialLinks.map((link) => link.href)
    });
}

function loadSiteDataFromSource(source) {
    const exports = {};
    const transformedSource = source.replaceAll('export const ', 'exports.');

    vm.runInNewContext(transformedSource, { exports }, {
        filename: 'js/constants/sitedata.js'
    });

    return exports;
}

function buildNavMarkup(navLinks) {
    return navLinks.map(({ href, label }) => `
        <li>
            <a href="${escapeHtml(href)}" class="nav-link" data-nav-link>
                ${escapeHtml(label)}
            </a>
        </li>
    `).join('');
}

function getProjectImageSrc(imageSrc) {
    if (!imageSrc.endsWith('.webp')) {
        return imageSrc;
    }

    return imageSrc.replace('img/proyectos/', 'img/proyectos/optimized/');
}

function buildProjectCard(project) {
    return `
        <a href="${escapeHtml(project.websiteUrl)}" target="_blank" rel="noopener noreferrer"
           class="proj-card" aria-label="Ver ${escapeHtml(project.title)} en vivo">
            <div class="proj-card__img-wrap">
                <img
                    src="${escapeHtml(getProjectImageSrc(project.imageSrc))}"
                    alt="${escapeHtml(project.imageAlt || project.title)}"
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

function buildProjectsMarkup(projects, perPage = 6, currentPage = 0) {
    const start = currentPage * perPage;
    return projects.slice(start, start + perPage).map(buildProjectCard).join('');
}

function buildProjectDots(projects, perPage = 6, currentPage = 0) {
    const totalPages = Math.ceil(projects.length / perPage);

    return Array.from({ length: totalPages }, (_, index) => `
        <button
            class="proj-dot ${index === currentPage ? 'active' : ''}"
            data-page="${index}"
            aria-label="Ir a p&aacute;gina ${index + 1}"
        ></button>
    `).join('');
}

function flattenSkills(categories) {
    return categories.flatMap((category) =>
        category.skills.map((skill) => ({ ...skill, category: category.label }))
    );
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

function buildSkillsGrid(categories, pageSize = 9, currentPage = 0) {
    const allSkills = flattenSkills(categories);
    const start = currentPage * pageSize;
    return allSkills.slice(start, start + pageSize).map(buildSkillCard).join('');
}

function buildSkillsPagination(categories, pageSize = 9, currentPage = 0) {
    const allSkills = flattenSkills(categories);
    const totalPages = Math.ceil(allSkills.length / pageSize);
    const start = currentPage * pageSize + 1;
    const end = Math.min((currentPage + 1) * pageSize, allSkills.length);
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
            Mostrando ${start}&ndash;${end} de ${allSkills.length} habilidades
        </p>
    `;
}

function buildContactSocialLinks(links) {
    const colors = {
        Instagram: '#E1306C',
        GitHub: '#6e5494',
        LinkedIn: '#0A66C2',
        TikTok: '#EE1D52',
        YouTube: '#FF0000',
        Twitter: '#1DA1F2',
        Facebook: '#1877F2'
    };

    const handles = {
        Instagram: '@nilvert.i',
        GitHub: 'github.com/NilverTI',
        LinkedIn: 'linkedin.com/in/nilverti',
        TikTok: '@nilvert.i',
        YouTube: '@nilvert.i'
    };

    return links.map((link) => `
        <a href="${escapeHtml(link.href)}" target="_blank" rel="noopener noreferrer"
           class="social-item" style="--social-color: ${colors[link.title] || '#555'};"
           aria-label="${escapeHtml(link.title)}">
            <div class="social-item__icon">
                <i class="${escapeHtml(link.iconClassName)}"></i>
            </div>
            <div class="social-item__info">
                <p class="social-item__name">${escapeHtml(link.title)}</p>
                <p class="social-item__handle">${escapeHtml(handles[link.title] || link.title)}</p>
            </div>
            <i class="fa-solid fa-arrow-up-right-from-square social-item__arrow"></i>
        </a>
    `).join('');
}

function buildFooterSocialLinks(links) {
    return links.map((link) => `
        <a href="${escapeHtml(link.href)}" class="footer-social-link ${escapeHtml(link.hoverClassName)}"
            target="_blank" rel="noopener noreferrer" title="${escapeHtml(link.title)}"
            aria-label="${escapeHtml(link.title)}">
            <i class="${escapeHtml(link.iconClassName)}"></i>
        </a>
    `).join('');
}

function renderProjectsSection(template, projects) {
    const withGrid = template.replace(
        '<div id="projectsGrid" class="proj-grid"></div>',
        `<div id="projectsGrid" class="proj-grid">${buildProjectsMarkup(projects)}</div>`
    );
    const withDots = withGrid.replace(
        '<div class="proj-page-dots" id="projPageDots"></div>',
        `<div class="proj-page-dots" id="projPageDots">${buildProjectDots(projects)}</div>`
    );
    const withPrevDisabled = withDots.replace(
        '<button class="proj-page-btn" id="projPrevBtn"',
        '<button class="proj-page-btn" id="projPrevBtn" disabled'
    );

    if (Math.ceil(projects.length / 6) <= 1) {
        return withPrevDisabled.replace(
            '<button class="proj-page-btn" id="projNextBtn"',
            '<button class="proj-page-btn" id="projNextBtn" disabled'
        );
    }

    return withPrevDisabled;
}

function renderSection(sectionId, template, siteData) {
    if (sectionId === 'header') {
        const navMarkup = buildNavMarkup(siteData.NAV_LINKS);
        return replaceTokens(template, {
            desktopNav: navMarkup,
            mobileNav: navMarkup
        });
    }

    if (sectionId === 'skills') {
        return replaceTokens(template, {
            skillsGrid: buildSkillsGrid(siteData.SKILL_CATEGORIES),
            skillsPagination: buildSkillsPagination(siteData.SKILL_CATEGORIES)
        });
    }

    if (sectionId === 'projects') {
        return renderProjectsSection(template, siteData.PROJECTS);
    }

    if (sectionId === 'contact') {
        return replaceTokens(template, {
            contactSocialLinks: buildContactSocialLinks(siteData.SOCIAL_LINKS)
        });
    }

    if (sectionId === 'footer') {
        return replaceTokens(template, {
            footerSocialLinks: buildFooterSocialLinks(siteData.SOCIAL_LINKS)
        });
    }

    return template;
}

async function ensurePathsExist(rootDir, config) {
    const pathsToCheck = [
        config.template,
        ...config.styles,
        ...config.sections.map((section) => section.template)
    ];

    await Promise.all(pathsToCheck.map(async (relativePath) => {
        await fs.access(path.join(rootDir, relativePath));
    }));
}

async function buildCssBundle(rootDir, config) {
    const styles = await Promise.all(
        config.styles.map((relativePath) => readText(path.join(rootDir, relativePath)))
    );

    const bundle = [
        '/* Generated file. Run `node scripts/build.js` after editing source CSS files. */',
        ...styles
    ].join('\n\n');

    await writeText(path.join(rootDir, config.stylesOutput), bundle);
}

async function writeSeoFiles(rootDir, metadata) {
    const robots = `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap.xml', metadata.siteUrl).toString()}\n`;
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${metadata.siteUrl}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>\n`;

    await writeText(path.join(rootDir, 'robots.txt'), robots);
    await writeText(path.join(rootDir, 'sitemap.xml'), sitemap);
}

async function main() {
    const rootDir = path.resolve(__dirname, '..');
    const configPath = path.join(rootDir, 'config', 'site.config.json');
    const config = await readJson(configPath);

    await ensurePathsExist(rootDir, config);
    await buildCssBundle(rootDir, config);

    const template = await readText(path.join(rootDir, config.template));
    const siteDataSource = await readText(path.join(rootDir, 'js', 'constants', 'sitedata.js'));
    const siteData = loadSiteDataFromSource(siteDataSource);

    const sectionMarkup = await Promise.all(config.sections.map(async (section) => {
        const sectionTemplate = await readText(path.join(rootDir, section.template));
        return renderSection(section.id, sectionTemplate, siteData);
    }));

    const indexHtml = replaceTokens(template, {
        metaTitle: escapeHtml(config.metadata.title),
        metaDescription: escapeHtml(config.metadata.description),
        themeColor: escapeHtml(config.metadata.themeColor),
        metaLocale: escapeHtml(config.metadata.locale),
        siteUrl: escapeHtml(config.metadata.siteUrl),
        previewImageUrl: escapeHtml(toAbsoluteUrl(config.metadata.siteUrl, config.metadata.previewImage)),
        structuredData: buildStructuredData(config.metadata, siteData.SOCIAL_LINKS),
        styles: buildStyleTag(config.stylesOutput),
        sectionMarkup: sectionMarkup.join('\n'),
        entryScript: config.entryScript
    });

    await writeText(path.join(rootDir, config.output), indexHtml);
    await writeSeoFiles(rootDir, config.metadata);

    console.log(`Generated ${config.output}`);
    console.log(`Generated ${config.stylesOutput}`);
    console.log('Generated robots.txt');
    console.log('Generated sitemap.xml');
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

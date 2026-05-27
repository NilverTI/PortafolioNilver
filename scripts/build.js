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

function getLocalizedValue(value, language = 'en') {
    if (
        value &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        Object.prototype.hasOwnProperty.call(value, 'en') &&
        Object.prototype.hasOwnProperty.call(value, 'es')
    ) {
        return value[language] ?? value.en ?? value.es ?? '';
    }

    return value ?? '';
}

function getTranslation(translations, language, key, replacements = {}) {
    const template = key.split('.').reduce((result, segment) => result?.[segment], translations[language])
        ?? key.split('.').reduce((result, segment) => result?.[segment], translations.en);

    if (typeof template !== 'string') {
        return '';
    }

    return Object.entries(replacements).reduce((result, [token, value]) =>
        result.replaceAll(`{${token}}`, String(value)), template);
}

function replaceTokens(template, replacements) {
    return Object.entries(replacements).reduce((result, [token, value]) =>
        result.replaceAll(`{{${token}}}`, value), template);
}

function buildStyleTag(bundleHref) {
    return `    <link rel="stylesheet" href="${bundleHref}" />`;
}

function indentMarkup(markup, spaces = 4) {
    const indentation = ' '.repeat(spaces);

    return markup
        .trim()
        .split('\n')
        .map((line) => `${indentation}${line}`)
        .join('\n');
}

function toAbsoluteUrl(siteUrl, assetPath) {
    return new URL(assetPath, siteUrl).toString();
}

function buildStructuredData(metadata, socialLinks) {
    return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Nilver TI',
        url: metadata.siteUrl,
        image: toAbsoluteUrl(metadata.siteUrl, metadata.previewImage),
        jobTitle: 'Frontend Developer',
        description: metadata.description,
        knowsAbout: ['React', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Node.js'],
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
                ${escapeHtml(getLocalizedValue(label))}
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

function buildProjectCard(project, translations, language = 'en') {
    const title = getLocalizedValue(project.title, language);
    const description = getLocalizedValue(project.description, language);
    const imageAlt = getLocalizedValue(project.imageAlt || project.title, language);

    return `
        <a href="${escapeHtml(project.websiteUrl)}" target="_blank" rel="noopener noreferrer"
           class="proj-card" aria-label="${escapeHtml(getTranslation(translations, language, 'projectsView.liveAria', { title }))}">
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
                    ${escapeHtml(getTranslation(translations, language, 'projectsView.visitWebsite'))}
                </span>
                <div class="proj-card__body">
                    <div class="proj-card__meta">
                        <h3 class="proj-card__title">${escapeHtml(title)}</h3>
                        <i class="fa-solid fa-arrow-up-right-from-square proj-card__arrow"></i>
                    </div>
                    <p class="proj-card__desc">${escapeHtml(description)}</p>
                </div>
            </div>
        </a>
    `;
}

function buildProjectsMarkup(projects, translations, perPage = 6, currentPage = 0, language = 'en') {
    const start = currentPage * perPage;
    return projects
        .slice(start, start + perPage)
        .map((project) => buildProjectCard(project, translations, language))
        .join('');
}

function buildProjectDots(projects, translations, perPage = 6, currentPage = 0, language = 'en') {
    const totalPages = Math.ceil(projects.length / perPage);

    return Array.from({ length: totalPages }, (_, index) => `
        <button
            class="proj-dot ${index === currentPage ? 'active' : ''}"
            data-page="${index}"
            aria-label="${escapeHtml(getTranslation(translations, language, 'projectsView.goToPage', { page: index + 1 }))}"
        ></button>
    `).join('');
}

function flattenSkills(categories) {
    return categories.flatMap((category) =>
        category.skills.map((skill) => ({ ...skill, category: category.label }))
    );
}

function buildSkillCard(skill, language = 'en') {
    const skillName = getLocalizedValue(skill.name, language);
    const skillCategory = getLocalizedValue(skill.category, language);
    const skillDescription = getLocalizedValue(skill.desc, language);

    return `
        <div class="sk-card">
            <div class="sk-card__head">
                <div class="sk-card__icon" style="--c:${skill.color}">
                    <i class="${escapeHtml(skill.icon)}" style="color:${skill.color}"></i>
                </div>
                <div class="sk-card__info">
                    <span class="sk-card__name">${escapeHtml(skillName)}</span>
                    <span class="sk-card__cat">${escapeHtml(skillCategory)}</span>
                </div>
                <span class="sk-card__pct" style="color:${skill.color}">${skill.value}%</span>
            </div>
            <p class="sk-card__desc">${escapeHtml(skillDescription)}</p>
            <div class="sk-bar__track">
                <div class="sk-bar__fill skill-bar-anim"
                     style="--tw:${skill.value}%;--c:${skill.color};"></div>
            </div>
        </div>
    `;
}

function buildSkillsGrid(categories, pageSize = 6, currentPage = 0, language = 'en') {
    const allSkills = flattenSkills(categories);
    const start = currentPage * pageSize;
    return allSkills
        .slice(start, start + pageSize)
        .map((skill) => buildSkillCard(skill, language))
        .join('');
}

function buildSkillsPagination(categories, translations, pageSize = 6, currentPage = 0, language = 'en') {
    const allSkills = flattenSkills(categories);
    const totalPages = Math.ceil(allSkills.length / pageSize);
    const start = currentPage * pageSize + 1;
    const end = Math.min((currentPage + 1) * pageSize, allSkills.length);
    const dots = Array.from({ length: totalPages }, (_, index) => `
        <button class="sk-page-dot ${index === currentPage ? 'sk-page-dot--active' : ''}"
                data-page="${index}"
                aria-label="${escapeHtml(getTranslation(translations, language, 'skillsView.goToPage', { page: index + 1 }))}"></button>
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
            ${escapeHtml(getTranslation(translations, language, 'skillsView.pageInfo', { start, end, total: allSkills.length }))}
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

function renderProjectsSection(template, projects, translations) {
    const withGrid = template.replace(
        '<div id="projectsGrid" class="proj-grid"></div>',
        `<div id="projectsGrid" class="proj-grid">${buildProjectsMarkup(projects, translations)}</div>`
    );
    const withDots = withGrid.replace(
        '<div class="proj-page-dots" id="projPageDots"></div>',
        `<div class="proj-page-dots" id="projPageDots">${buildProjectDots(projects, translations)}</div>`
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
            skillsPagination: buildSkillsPagination(siteData.SKILL_CATEGORIES, siteData.UI_TRANSLATIONS)
        });
    }

    if (sectionId === 'projects') {
        return renderProjectsSection(template, siteData.PROJECTS, siteData.UI_TRANSLATIONS);
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

async function copyDirContents(sourceDir, targetDir) {
    const entries = await fs.readdir(sourceDir, { withFileTypes: true });

    await Promise.all(entries.map(async (entry) => {
        const sourcePath = path.join(sourceDir, entry.name);
        const targetPath = path.join(targetDir, entry.name);

        if (entry.isDirectory()) {
            await fs.mkdir(targetPath, { recursive: true });
            await copyDirContents(sourcePath, targetPath);
            return;
        }

        await fs.mkdir(path.dirname(targetPath), { recursive: true });
        await fs.copyFile(sourcePath, targetPath);
    }));
}

async function copyDir(rootDir, sourceName) {
    const sourceDir = path.join(rootDir, sourceName);

    try {
        await fs.access(sourceDir);
    } catch {
        return;
    }

    await copyDirContents(sourceDir, rootDir);
}

async function copyPublicAssets(rootDir) {
    await copyDir(rootDir, 'public');
}

async function copyPages(rootDir) {
    await copyDir(rootDir, 'pages');
}

async function removeLegacyRootAssets(rootDir) {
    const legacyAssets = [
        'favicon.ico',
        'favicon-16x16.png',
        'favicon-32x32.png',
        'favicon-48x48.png',
        'apple-touch-icon.png',
        'android-chrome-192x192.png',
        'android-chrome-512x512.png'
    ];

    await Promise.all(legacyAssets.map(async (asset) => {
        const assetPath = path.join(rootDir, asset);

        try {
            await fs.unlink(assetPath);
        } catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }
    }));
}

async function writeSeoFiles(rootDir, metadata) {
    const robots = `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap.xml', metadata.siteUrl).toString()}\n`;
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${metadata.siteUrl}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n  <url>\n    <loc>${metadata.siteUrl}biografia</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.9</priority>\n  </url>\n  <url>\n    <loc>${metadata.siteUrl}curriculum</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.9</priority>\n  </url>\n  <url>\n    <loc>${metadata.siteUrl}terminos</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n</urlset>\n`;

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
        return {
            id: section.id,
            markup: renderSection(section.id, sectionTemplate, siteData)
        };
    }));

    const headerMarkup = sectionMarkup.find((section) => section.id === 'header')?.markup ?? '';
    const footerMarkup = sectionMarkup.find((section) => section.id === 'footer')?.markup ?? '';
    const mainMarkup = sectionMarkup
        .filter((section) => section.id !== 'header' && section.id !== 'footer')
        .map((section) => section.markup)
        .join('\n\n');

    const indexHtml = replaceTokens(template, {
        metaTitle: escapeHtml(config.metadata.title),
        metaDescription: escapeHtml(config.metadata.description),
        themeColor: escapeHtml(config.metadata.themeColor),
        metaLocale: escapeHtml(config.metadata.locale),
        siteUrl: escapeHtml(config.metadata.siteUrl),
        previewImageUrl: escapeHtml(toAbsoluteUrl(config.metadata.siteUrl, config.metadata.previewImage)),
        structuredData: buildStructuredData(config.metadata, siteData.SOCIAL_LINKS),
        styles: buildStyleTag(config.stylesOutput),
        headerMarkup: indentMarkup(headerMarkup),
        mainMarkup: indentMarkup(mainMarkup),
        footerMarkup: indentMarkup(footerMarkup),
        entryScript: config.entryScript
    });

    await writeText(path.join(rootDir, config.output), indexHtml);
    await writeSeoFiles(rootDir, config.metadata);
    await copyPublicAssets(rootDir);
    await copyPages(rootDir);
    await removeLegacyRootAssets(rootDir);

    console.log(`Generated ${config.output}`);
    console.log(`Generated ${config.stylesOutput}`);
    console.log('Generated robots.txt');
    console.log('Generated sitemap.xml');
    console.log('Synced public assets to project root');
    console.log('Synced pages to project root');
    console.log('Removed legacy favicon assets from project root');
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

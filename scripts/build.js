const fs = require('fs/promises');
const path = require('path');

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

function buildStyleTags(styles) {
    return styles.map((href) => `    <link rel="stylesheet" href="${href}" />`).join('\n');
}

function buildSectionSlots(sections) {
    return sections.map((section) =>
        `    <div id="${section.slotId}" data-section-slot="${section.id}"></div>`
    ).join('\n');
}

function buildConfigModule(config) {
    const runtimeConfig = {
        sections: config.sections
    };

    return `export const siteConfig = ${JSON.stringify(runtimeConfig, null, 4)};\n`;
}

function buildSectionTemplatesModule(sectionTemplates) {
    return `export const sectionTemplates = ${JSON.stringify(sectionTemplates, null, 4)};\n`;
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

async function main() {
    const rootDir = path.resolve(__dirname, '..');
    const configPath = path.join(rootDir, 'config', 'site.config.json');
    const config = await readJson(configPath);

    await ensurePathsExist(rootDir, config);

    const template = await readText(path.join(rootDir, config.template));
    const sectionTemplates = {};

    await Promise.all(config.sections.map(async (section) => {
        sectionTemplates[section.id] = await readText(path.join(rootDir, section.template));
    }));

    const indexHtml = template
        .replace('{{styles}}', buildStyleTags(config.styles))
        .replace('{{sectionSlots}}', buildSectionSlots(config.sections))
        .replace('{{entryScript}}', config.entryScript);

    await writeText(path.join(rootDir, config.output), indexHtml);
    await writeText(
        path.join(rootDir, 'js', 'generated', 'site-config.js'),
        buildConfigModule(config)
    );
    await writeText(
        path.join(rootDir, 'js', 'generated', 'section-templates.js'),
        buildSectionTemplatesModule(sectionTemplates)
    );

    console.log(`Generated ${config.output}`);
    console.log('Generated js/generated/site-config.js');
    console.log('Generated js/generated/section-templates.js');
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

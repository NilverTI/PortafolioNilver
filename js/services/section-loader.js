import { siteConfig } from '../generated/site-config.js';
import { sectionTemplates } from '../generated/section-templates.js';
import { query, setHtml } from '../utils/dom.js';

async function fetchSectionTemplate(section) {
    if (window.location.protocol === 'file:') {
        return sectionTemplates[section.id] || '';
    }

    try {
        const response = await window.fetch(section.template);

        if (response.ok) {
            return response.text();
        }
    } catch (error) {
        console.warn(`No se pudo cargar ${section.template}, usando fallback local.`, error);
    }

    return sectionTemplates[section.id] || '';
}

export async function mountSections() {
    const sectionMarkupList = await Promise.all(
        siteConfig.sections.map((section) => fetchSectionTemplate(section))
    );

    siteConfig.sections.forEach((section, index) => {
        const slot = query(`#${section.slotId}`);
        setHtml(slot, sectionMarkupList[index]);
    });

    return siteConfig.sections;
}

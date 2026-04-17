import { initContactSection } from './contact.js';
import { initFooterSection } from './footer.js';
import { initHeaderSection } from './header.js';
import { initHomeSection } from './home.js';
import { initProjectsSection } from './projects.js';
import { mountSections } from './services/section-loader.js';
import { initSkillsSection } from './skills.js';

const SECTION_INITIALIZERS = {
    header: initHeaderSection,
    home: initHomeSection,
    skills: initSkillsSection,
    projects: initProjectsSection,
    contact: initContactSection,
    footer: initFooterSection
};

async function bootstrap() {
    const sections = await mountSections();

    sections.forEach((section) => {
        SECTION_INITIALIZERS[section.id]?.();
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
} else {
    bootstrap();
}

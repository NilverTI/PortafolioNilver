import { SKILL_CATEGORIES } from './constants/sitedata.js';
import { LANGUAGE_CHANGE_EVENT } from './i18n.js';
import { renderSkillCategories } from './modules/skillsView.js';

let skillsSectionInitialized = false;

export function initSkillsSection() {
    if (skillsSectionInitialized) {
        return;
    }

    skillsSectionInitialized = true;
    renderSkillCategories(SKILL_CATEGORIES);
    window.addEventListener(LANGUAGE_CHANGE_EVENT, () => {
        renderSkillCategories(SKILL_CATEGORIES);
    });
}

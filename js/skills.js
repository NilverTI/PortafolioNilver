import { SKILL_CATEGORIES } from './constants/sitedata.js';
import { renderSkillCategories } from './modules/skillsView.js';

export function initSkillsSection() {
    renderSkillCategories(SKILL_CATEGORIES);
}

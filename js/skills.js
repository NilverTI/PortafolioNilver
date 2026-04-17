import { SKILLS, SKILL_CATEGORIES, SKILL_VIEW_LABELS } from './constants/sitedata.js';
import { renderSkills, renderSkillCategories, initSkillsViewToggle } from './modules/skillsView.js';

export function initSkillsSection() {
    renderSkillCategories(SKILL_CATEGORIES);
    renderSkills(SKILLS);
    initSkillsViewToggle(SKILL_VIEW_LABELS);
}

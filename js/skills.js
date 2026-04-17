import { SKILLS, SKILL_CATEGORIES, SKILL_VIEW_LABELS } from './constants/site-data.js';
import { renderSkills, renderSkillCategories, initSkillsViewToggle } from './modules/skills-view.js';

export function initSkillsSection() {
    renderSkillCategories(SKILL_CATEGORIES);
    renderSkills(SKILLS);
    initSkillsViewToggle(SKILL_VIEW_LABELS);
}

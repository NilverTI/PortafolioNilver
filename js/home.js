import { HOME_ROLES } from './constants/sitedata.js';
import { getLocalizedValue, LANGUAGE_CHANGE_EVENT } from './i18n.js';

let homeSectionInitialized = false;
let typewriterTimeoutId = 0;
let typewriterRunId = 0;

function initTypewriter() {
    const textElement = document.querySelector('.typed-text');
    if (!textElement) return;

    const roles = getLocalizedValue(HOME_ROLES);

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingDelay = 100;
    const runId = ++typewriterRunId;

    window.clearTimeout(typewriterTimeoutId);
    textElement.textContent = '';

    function type() {
        if (runId !== typewriterRunId) {
            return;
        }

        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            textElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingDelay = 50; // faster when deleting
        } else {
            textElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingDelay = 100; // normal typing speed
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingDelay = 2000; // wait before deleting
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingDelay = 500; // wait before typing new word
        }

        typewriterTimeoutId = window.setTimeout(type, typingDelay);
    }

    // Start typing after a small initial delay to let fade-up happen
    typewriterTimeoutId = window.setTimeout(type, 1000);
}

export function initHomeSection() {
    if (homeSectionInitialized) {
        return;
    }

    homeSectionInitialized = true;
    initTypewriter();
    window.addEventListener(LANGUAGE_CHANGE_EVENT, initTypewriter);
}

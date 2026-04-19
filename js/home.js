const roles = [
    "Desarrollador Full Stack",
    "Desarrollador Frontend",
    "Desarrollador Backend",
    "Especialista en React & Node.js"
];

let homeSectionInitialized = false;

function initTypewriter() {
    const textElement = document.querySelector('.typed-text');
    if (!textElement) return;

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingDelay = 100;

    function type() {
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

        setTimeout(type, typingDelay);
    }

    // Start typing after a small initial delay to let fade-up happen
    setTimeout(type, 1000);
}

export function initHomeSection() {
    if (homeSectionInitialized) {
        return;
    }

    homeSectionInitialized = true;
    initTypewriter();
}

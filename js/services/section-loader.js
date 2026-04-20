const SECTIONS = [
    { id: 'siteHeader', file: 'html/header.html' },
    { id: 'home', file: 'html/home.html' },
    { id: 'skills', file: 'html/skills.html' },
    { id: 'projects', file: 'html/projects.html' },
    { id: 'contact', file: 'html/contact.html' },
    { id: 'footerCyberpunk', file: 'html/footer.html' }
];

async function loadSection(section) {
    const container = document.getElementById(section.id);
    if (!container) return;

    try {
        const response = await fetch(section.file);
        if (response.ok) {
            container.innerHTML = await response.text();
        }
    } catch (error) {
        console.warn(`No se pudo cargar ${section.file}`, error);
    }
}

export async function loadAllSections() {
    await Promise.all(SECTIONS.map(loadSection));
}
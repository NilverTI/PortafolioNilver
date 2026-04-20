import { query, setHtml } from './utils/dom.js';
import { SOCIAL_LINKS } from './constants/sitedata.js';

// Map social network name → brand color
const SOCIAL_COLORS = {
    Instagram: '#E1306C',
    GitHub:    '#6e5494',
    LinkedIn:  '#0A66C2',
    TikTok:    '#EE1D52',
    YouTube:   '#FF0000',
    Twitter:   '#1DA1F2',
    Facebook:  '#1877F2',
};

// Map social network name → @handle text
const SOCIAL_HANDLES = {
    Instagram: '@nilvert.i',
    GitHub:    'github.com/NilverTI',
    LinkedIn:  'linkedin.com/in/nilverti',
    TikTok:    '@nilvert.i',
    YouTube:   '@nilvert.i',
};

function buildSocialItem(link) {
    const color = SOCIAL_COLORS[link.title] || '#555';
    const handle = SOCIAL_HANDLES[link.title] || link.title;
    return `
        <a href="${link.href}" target="_blank" rel="noopener noreferrer"
           class="social-item" style="--social-color: ${color};"
           aria-label="${link.title}">
            <div class="social-item__icon">
                <i class="${link.iconClassName}"></i>
            </div>
            <div class="social-item__info">
                <p class="social-item__name">${link.title}</p>
                <p class="social-item__handle">${handle}</p>
            </div>
            <i class="fa-solid fa-arrow-up-right-from-square social-item__arrow"></i>
        </a>
    `;
}

export function initContactSection() {
    // Render social links
    const socialList = query('#contactSocialList');
    // Sólo renderizar si aún tiene la marca o está vacío 
    if (socialList && socialList.innerHTML.includes('{{contactSocialLinks}}')) {
        setHtml(socialList, SOCIAL_LINKS.map(buildSocialItem).join(''));
    }

    // --- FORMULARIO DE CONTACTO ---
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('contactSubmitBtn');
    const submitText = document.getElementById('contactSubmitText');
    const submitIcon = document.getElementById('contactSubmitIcon');
    const successMsg = document.getElementById('contactSuccessMessage');
    const errorMsg = document.getElementById('contactErrorMessage');

    if (!form || !submitBtn) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Ocultar mensajes previos por si acaso
        successMsg.classList.add('hidden');
        errorMsg.classList.add('hidden');

        // Poner estado de carga en el botón
        const originalText = submitText.innerText;
        submitBtn.disabled = true;
        submitText.innerText = 'Enviando...';
        submitIcon.className = 'fa-solid fa-spinner fa-spin';

        try {
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: form.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Mostrar mensaje de éxito brillante y ocultar el form
                successMsg.classList.remove('hidden');
                form.reset(); // Limpiar el formulario
                form.style.display = 'none'; // Evitar múltiples envíos
            } else {
                // Leer errores que vengan del backend formspree
                const data = await response.json();
                if (data.errors) {
                    throw new Error(data.errors.map(err => err.message).join(', '));
                } else {
                    throw new Error('Error al enviar el formulario');
                }
            }
        } catch (error) {
            console.error('Error enviando correo a formspree:', error);
            // Mostrar mensaje de error 
            errorMsg.classList.remove('hidden');
        } finally {
            // Restaurar estado del botón
            submitBtn.disabled = false;
            submitText.innerText = originalText;
            submitIcon.className = 'fa-solid fa-paper-plane';
        }
    });
}

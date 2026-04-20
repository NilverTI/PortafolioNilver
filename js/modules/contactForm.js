import { query, queryAll } from '../utils/dom.js';

let contactFormInitialized = false;

const STATE = {
    IDLE: 'idle',
    SENDING: 'sending',
    SUCCESS: 'success',
    ERROR: 'error'
};

function setLoadingState(loading) {
    const submitBtn = query('#contactSubmitBtn');
    const submitText = query('#contactSubmitText');
    const submitIcon = query('#contactSubmitIcon');
    const successMsg = query('#contactSuccessMessage');
    const errorMsg = query('#contactErrorMessage');

    if (!submitBtn || !submitText || !submitIcon) {
        return;
    }

    if (loading) {
        submitBtn.disabled = true;
        submitText.textContent = 'Enviando...';
        submitIcon.className = 'fa-solid fa-spinner fa-spin';
    } else {
        submitBtn.disabled = false;
        submitText.textContent = 'Enviar mensaje';
        submitIcon.className = 'fa-solid fa-paper-plane';
    }

    successMsg?.classList.add('hidden');
    errorMsg?.classList.add('hidden');
}

function showMessage(type) {
    const form = query('#contactForm');
    const successMsg = query('#contactSuccessMessage');
    const errorMsg = query('#contactErrorMessage');
    const contactLeft = query('.contact-left');

    if (type === STATE.SUCCESS) {
        if (contactLeft) {
            contactLeft.classList.add('is-success');
            // Ocultar todo el contenido previo (labels, títulos, form)
            queryAll('.contact-label, .contact-title, .contact-subtitle, .contact-form', contactLeft)
                .forEach(el => el.style.display = 'none');
        }
        successMsg?.classList.remove('hidden');
        console.log('Mensaje enviado con éxito');
    } else if (type === STATE.ERROR) {
        errorMsg?.classList.remove('hidden');
        console.error('Error al enviar el mensaje');
    }
}

async function handleSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const submitBtn = query('#contactSubmitBtn');

    if (!form || submitBtn?.disabled) {
        return;
    }

    setLoadingState(true);

    try {
        const response = await fetch(form.action, {
            method: form.method,
            body: new FormData(form),
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            showMessage(STATE.SUCCESS);
        } else {
            const data = await response.json();
            if (data.errors) {
                throw new Error(data.errors.map((err) => err.message).join(', '));
            }
            throw new Error('Error al enviar');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage(STATE.ERROR);
        setLoadingState(false);
    }
}

export function initContactForm() {
    if (contactFormInitialized) {
        return;
    }

    const form = query('#contactForm');

    if (!form) {
        return;
    }

    contactFormInitialized = true;
    form.addEventListener('submit', handleSubmit);
}

export default {
    initContactForm
};
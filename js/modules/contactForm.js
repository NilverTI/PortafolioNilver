import { LANGUAGE_CHANGE_EVENT, translate } from '../i18n.js';
import { query, queryAll } from '../utils/dom.js';

let contactFormInitialized = false;
let languageListenerBound = false;
let currentState = 'idle';

const STATE = {
    IDLE: 'idle',
    SENDING: 'sending',
    SUCCESS: 'success',
    ERROR: 'error'
};

function syncSubmitButtonToLanguage() {
    const submitBtn = query('#contactSubmitBtn');
    const submitText = query('#contactSubmitText');
    const submitIcon = query('#contactSubmitIcon');

    if (!submitBtn || !submitText || !submitIcon) {
        return;
    }

    const isSending = currentState === STATE.SENDING;

    submitBtn.disabled = isSending;
    submitText.textContent = isSending
        ? translate('contact.sending')
        : translate('contact.submit');
    submitIcon.className = isSending
        ? 'fa-solid fa-spinner fa-spin'
        : 'fa-solid fa-paper-plane';
}

function setLoadingState(loading) {
    const successMsg = query('#contactSuccessMessage');
    const errorMsg = query('#contactErrorMessage');

    currentState = loading ? STATE.SENDING : STATE.IDLE;
    syncSubmitButtonToLanguage();

    successMsg?.classList.add('hidden');
    errorMsg?.classList.add('hidden');
}

function showMessage(type) {
    const successMsg = query('#contactSuccessMessage');
    const errorMsg = query('#contactErrorMessage');
    const contactLeft = query('.contact-left');

    if (type === STATE.SUCCESS) {
        currentState = STATE.SUCCESS;

        if (contactLeft) {
            contactLeft.classList.add('is-success');
            queryAll('.contact-label, .contact-title, .contact-subtitle, .contact-form', contactLeft)
                .forEach((element) => {
                    element.style.display = 'none';
                });
        }

        successMsg?.classList.remove('hidden');
        return;
    }

    if (type === STATE.ERROR) {
        currentState = STATE.ERROR;
        errorMsg?.classList.remove('hidden');
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
                Accept: 'application/json'
            }
        });

        if (response.ok) {
            showMessage(STATE.SUCCESS);
            return;
        }

        const data = await response.json();

        if (data.errors) {
            throw new Error(data.errors.map((error) => error.message).join(', '));
        }

        throw new Error(translate('contact.submitErrorFallback'));
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

    if (!languageListenerBound) {
        languageListenerBound = true;
        window.addEventListener(LANGUAGE_CHANGE_EVENT, syncSubmitButtonToLanguage);
    }
}

export default {
    initContactForm
};

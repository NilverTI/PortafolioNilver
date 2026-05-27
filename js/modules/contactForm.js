import { LANGUAGE_CHANGE_EVENT, translate } from '../i18n.js';
import { query, queryAll } from '../utils/dom.js';

let contactFormInitialized = false;
let languageListenerBound = false;
let termsModalInitialized = false;
let previousTermsModalFocus = null;
let currentState = 'idle';

const STATE = {
    IDLE: 'idle',
    SENDING: 'sending',
    SUCCESS: 'success',
    ERROR: 'error'
};

function clearTermsError() {
    const termsCheckbox = query('#termsAccepted');
    const termsGroup = query('#termsCheckGroup');

    termsCheckbox?.removeAttribute('aria-invalid');
    termsGroup?.classList.remove('is-error');
}

function openTermsModal(returnFocusElement = null) {
    const modal = query('#termsModal');
    const panel = modal ? query('.terms-modal__panel', modal) : null;

    if (!modal || !panel) {
        return;
    }

    previousTermsModalFocus = returnFocusElement ?? document.activeElement;
    modal.classList.remove('hidden');
    panel.focus();
}

function closeTermsModal() {
    const modal = query('#termsModal');

    if (!modal || modal.classList.contains('hidden')) {
        return;
    }

    modal.classList.add('hidden');

    if (previousTermsModalFocus instanceof HTMLElement) {
        previousTermsModalFocus.focus();
    }

    previousTermsModalFocus = null;
}

function validateTermsAcceptance() {
    const termsCheckbox = query('#termsAccepted');
    const termsGroup = query('#termsCheckGroup');

    if (!termsCheckbox || termsCheckbox.checked) {
        clearTermsError();
        return true;
    }

    termsCheckbox.setAttribute('aria-invalid', 'true');
    termsGroup?.classList.add('is-error');
    openTermsModal(termsCheckbox);
    return false;
}

function bindTermsModal() {
    if (termsModalInitialized) {
        return;
    }

    termsModalInitialized = true;

    queryAll('[data-terms-modal-close]').forEach((control) => {
        control.addEventListener('click', closeTermsModal);
    });

    const termsCheckbox = query('#termsAccepted');
    termsCheckbox?.addEventListener('change', clearTermsError);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeTermsModal();
        }
    });
}

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

    if (!validateTermsAcceptance()) {
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
    bindTermsModal();
    form.addEventListener('submit', handleSubmit);

    if (!languageListenerBound) {
        languageListenerBound = true;
        window.addEventListener(LANGUAGE_CHANGE_EVENT, syncSubmitButtonToLanguage);
    }
}

export default {
    initContactForm
};

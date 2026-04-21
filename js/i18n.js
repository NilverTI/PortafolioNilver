import { UI_TRANSLATIONS } from './constants/sitedata.js';
import { queryAll } from './utils/dom.js';

const STORAGE_KEY = 'portfolio-language';
const DEFAULT_LANGUAGE = 'en';

export const LANGUAGE_CHANGE_EVENT = 'portfolio:languagechange';

let currentLanguage = DEFAULT_LANGUAGE;
let i18nInitialized = false;

function resolveTranslationKey(source, key) {
    return key.split('.').reduce((result, segment) => result?.[segment], source);
}

function formatTranslation(template, replacements = {}) {
    return Object.entries(replacements).reduce((result, [token, value]) =>
        result.replaceAll(`{${token}}`, String(value)), template);
}

function normalizeLanguage(locale) {
    if (typeof locale !== 'string') {
        return DEFAULT_LANGUAGE;
    }

    const normalizedLocale = locale.toLowerCase();

    if (normalizedLocale.startsWith('es')) {
        return 'es';
    }

    if (normalizedLocale.startsWith('en')) {
        return 'en';
    }

    return DEFAULT_LANGUAGE;
}

function getStoredLanguage() {
    try {
        const storedLanguage = window.localStorage.getItem(STORAGE_KEY);
        return storedLanguage === 'en' || storedLanguage === 'es'
            ? storedLanguage
            : null;
    } catch {
        return null;
    }
}

function getBrowserLanguage() {
    const locales = Array.isArray(window.navigator.languages) && window.navigator.languages.length > 0
        ? window.navigator.languages
        : [window.navigator.language];

    return normalizeLanguage(locales[0]);
}

function getInitialLanguage() {
    return getStoredLanguage() ?? getBrowserLanguage() ?? DEFAULT_LANGUAGE;
}

function updateLanguageControls(scope = document) {
    queryAll('[data-language-option]', scope).forEach((button) => {
        const isActive = button.dataset.languageOption === currentLanguage;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
    });
}

export function getCurrentLanguage() {
    return currentLanguage;
}

export function getLocalizedValue(value, language = currentLanguage) {
    if (
        value &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        Object.prototype.hasOwnProperty.call(value, 'en') &&
        Object.prototype.hasOwnProperty.call(value, 'es')
    ) {
        return value[language] ?? value.en ?? value.es ?? '';
    }

    return value ?? '';
}

export function translate(key, replacements = {}, language = currentLanguage) {
    const translation =
        resolveTranslationKey(UI_TRANSLATIONS[language], key) ??
        resolveTranslationKey(UI_TRANSLATIONS[DEFAULT_LANGUAGE], key);

    if (typeof translation !== 'string') {
        return '';
    }

    return formatTranslation(translation, replacements);
}

export function applyTranslations(scope = document) {
    document.documentElement.lang = currentLanguage;

    queryAll('[data-i18n]', scope).forEach((element) => {
        element.textContent = translate(element.dataset.i18n);
    });

    queryAll('[data-i18n-html]', scope).forEach((element) => {
        element.innerHTML = translate(element.dataset.i18nHtml);
    });

    queryAll('[data-i18n-placeholder]', scope).forEach((element) => {
        element.setAttribute('placeholder', translate(element.dataset.i18nPlaceholder));
    });

    queryAll('[data-i18n-aria-label]', scope).forEach((element) => {
        element.setAttribute('aria-label', translate(element.dataset.i18nAriaLabel));
    });

    queryAll('[data-i18n-title]', scope).forEach((element) => {
        element.setAttribute('title', translate(element.dataset.i18nTitle));
    });

    queryAll('[data-i18n-alt]', scope).forEach((element) => {
        element.setAttribute('alt', translate(element.dataset.i18nAlt));
    });

    queryAll('[data-i18n-value]', scope).forEach((element) => {
        const value = translate(element.dataset.i18nValue);
        element.value = value;
        element.setAttribute('value', value);
    });

    updateLanguageControls(scope);
}

function bindLanguageControls() {
    queryAll('[data-language-option]').forEach((button) => {
        if (button.dataset.i18nBound === 'true') {
            return;
        }

        button.dataset.i18nBound = 'true';
        button.addEventListener('click', () => {
            setLanguage(button.dataset.languageOption, { persist: true });
        });
    });
}

export function setLanguage(language, { persist = false } = {}) {
    const nextLanguage = language === 'en' || language === 'es'
        ? language
        : normalizeLanguage(language);

    if (persist) {
        try {
            window.localStorage.setItem(STORAGE_KEY, nextLanguage);
        } catch {
            // Ignore localStorage errors.
        }
    }

    if (nextLanguage === currentLanguage && i18nInitialized) {
        applyTranslations();
        return;
    }

    currentLanguage = nextLanguage;
    applyTranslations();

    window.dispatchEvent(new CustomEvent(LANGUAGE_CHANGE_EVENT, {
        detail: { language: currentLanguage }
    }));
}

export function initI18n() {
    if (i18nInitialized) {
        return currentLanguage;
    }

    currentLanguage = getInitialLanguage();
    bindLanguageControls();
    applyTranslations();
    i18nInitialized = true;

    return currentLanguage;
}

export const RevealAnimations = {
    defaults: {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
        once: true
    },

    easing: {
        smooth: 'cubic-bezier(0.16, 1, 0.3, 1)',
        bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
    }
};

export function fadeUp(element, options = {}) {
    const settings = { ...RevealAnimations.defaults, ...options };
    
    element.style.opacity = '0';
    element.style.transform = 'translateY(24px)';
    element.style.transition = `opacity 0.6s ${RevealAnimations.easing.smooth}, transform 0.6s ${RevealAnimations.easing.smooth}`;
    
    return element;
}

export function slideIn(element, direction = 'left', options = {}) {
    const transforms = {
        left: 'translateX(-30px)',
        right: 'translateX(30px)',
        up: 'translateY(30px)',
        down: 'translateY(-30px)'
    };
    
    const settings = { ...RevealAnimations.defaults, ...options };
    
    element.style.opacity = '0';
    element.style.transform = transforms[direction] || transforms.left;
    element.style.transition = `opacity 0.5s ${RevealAnimations.easing.smooth}, transform 0.5s ${RevealAnimations.easing.smooth}`;
    
    return element;
}

export function scaleIn(element, options = {}) {
    const settings = { ...RevealAnimations.defaults, ...options };
    
    element.style.opacity = '0';
    element.style.transform = 'scale(0.92)';
    element.style.transition = `opacity 0.5s ${RevealAnimations.easing.smooth}, transform 0.5s ${RevealAnimations.easing.smooth}`;
    
    return element;
}

function animateIn(entry) {
    entry.target.style.opacity = '1';
    entry.target.style.transform = 'translateY(0)';
}

function animateOut(entry) {
    if (!RevealAnimations.defaults.once) {
        entry.target.style.opacity = '0';
        entry.target.style.transform = 'translateY(24px)';
    }
}

export function createScrollRevealObserver(options = {}) {
    const settings = { ...RevealAnimations.defaults, ...options };
    
    if (!('IntersectionObserver' in window)) {
        return null;
    }
    
    return new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animateIn(entry);
                if (settings.once) {
                    createScrollRevealObserver.observer.unobserve(entry.target);
                }
            } else if (!settings.once) {
                animateOut(entry);
            }
        });
    }, {
        threshold: settings.threshold,
        rootMargin: settings.rootMargin
    });
}

createScrollRevealObserver.observer = null;

export function initScrollReveal(selector = '[data-animate]', options = {}) {
    const elements = document.querySelectorAll(selector);
    
    if (elements.length === 0) {
        return;
    }
    
    elements.forEach((el) => {
        fadeUp(el);
    });
    
    const observer = createScrollRevealObserver(options);
    
    if (observer) {
        elements.forEach((el) => observer.observe(el));
        createScrollRevealObserver.observer = observer;
    } else {
        elements.forEach((el) => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }
}

export default {
    RevealAnimations,
    fadeUp,
    slideIn,
    scaleIn,
    createScrollRevealObserver,
    initScrollReveal
};
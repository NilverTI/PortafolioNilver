let lazyLoadObserver = null;

const defaultOptions = {
    root: null,
    rootMargin: '50px 0px',
    threshold: 0.01,
    loadedClass: 'lazy-loaded',
    errorClass: 'lazy-error'
};

export function lazyLoadImage(img, options = {}) {
    const settings = { ...defaultOptions, ...options };
    
    const src = img.dataset.src;
    const srcset = img.dataset.srcset;
    const sizes = img.dataset.sizes;
    
    if (!src) {
        return Promise.resolve(img);
    }
    
    return new Promise((resolve, reject) => {
        const onLoad = () => {
            img.classList.add(settings.loadedClass);
            img.removeAttribute('data-src');
            img.removeAttribute('data-srcset');
            img.removeAttribute('data-sizes');
            resolve(img);
        };
        
        const onError = () => {
            img.classList.add(settings.errorClass);
            reject(new Error(`Failed to load image: ${src}`));
        };
        
        img.addEventListener('load', onLoad, { once: true });
        img.addEventListener('error', onError, { once: true });
        
        if (srcset) {
            img.srcset = srcset;
        }
        
        if (sizes) {
            img.sizes = sizes;
        }
        
        img.src = src;
    });
}

export function initLazyLoadImages(options = {}) {
    const settings = { ...defaultOptions, ...options };
    const images = document.querySelectorAll('img[data-src]');
    
    if (images.length === 0) {
        return;
    }
    
    if (!('IntersectionObserver' in window)) {
        images.forEach((img) => lazyLoadImage(img, settings));
        return;
    }
    
    if (lazyLoadObserver) {
        lazyLoadObserver.disconnect();
    }
    
    lazyLoadObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }
            
            const img = entry.target;
            lazyLoadImage(img, settings)
                .then(() => observer.unobserve(img))
                .catch(() => observer.unobserve(img));
        });
    }, {
        root: settings.root,
        rootMargin: settings.rootMargin,
        threshold: settings.threshold
    });
    
    images.forEach((img) => lazyLoadObserver.observe(img));
}

export function destroyLazyLoadObserver() {
    if (lazyLoadObserver) {
        lazyLoadObserver.disconnect();
        lazyLoadObserver = null;
    }
}

export default {
    lazyLoadImage,
    initLazyLoadImages,
    destroyLazyLoadObserver
};
const LABEL_TEXT = 'NILVER T.I';

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

export function initCustomScrollbar() {
    const root = document.getElementById('customScrollbar');
    const track = document.getElementById('customScrollbarTrack');
    const labels = document.getElementById('customScrollbarLabels');
    const thumb = document.getElementById('customScrollbarThumb');

    if (!root || !track || !labels || !thumb) {
        return;
    }

    const state = {
        currentOffset: 0,
        currentLabelOffset: 0,
        targetOffset: 0,
        targetLabelOffset: 0,
        maxScroll: 0,
        maxThumbOffset: 0,
        frameId: 0,
        scrollTimerId: 0
    };

    function renderLabels() {
        const itemSpacing = window.innerWidth <= 767 ? 76 : 90;
        const labelCount = Math.max(
            3,
            Math.ceil(track.clientHeight / itemSpacing)
        );

        labels.innerHTML = Array.from({ length: labelCount }, (_, index) => `
            <span class="custom-scrollbar__label ${index % 2 === 0 ? 'is-ink' : 'is-ivory'}">
                ${LABEL_TEXT}
            </span>
        `).join('');
    }

    function updateTargets() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
        const progress = state.maxScroll > 0 ? scrollTop / state.maxScroll : 0;

        state.targetOffset = progress * state.maxThumbOffset;
        state.targetLabelOffset = progress * -10;
    }

    function updateMetrics() {
        const scrollElement = document.documentElement;
        const viewportHeight = window.innerHeight;
        const scrollHeight = scrollElement.scrollHeight;
        const trackHeight = track.clientHeight;
        const maxScroll = Math.max(scrollHeight - viewportHeight, 0);
        const minThumbHeight = window.innerWidth <= 767 ? 34 : 48;
        const thumbHeight = maxScroll === 0
            ? trackHeight
            : clamp((viewportHeight / scrollHeight) * trackHeight, minThumbHeight, trackHeight);

        state.maxScroll = maxScroll;
        state.maxThumbOffset = Math.max(trackHeight - thumbHeight, 0);

        thumb.style.height = `${thumbHeight}px`;
        root.classList.toggle('is-hidden', maxScroll <= 0);

        renderLabels();
        updateTargets();
        requestRender();
    }

    function renderFrame() {
        state.frameId = 0;

        state.currentOffset = lerp(state.currentOffset, state.targetOffset, 0.18);
        state.currentLabelOffset = lerp(state.currentLabelOffset, state.targetLabelOffset, 0.12);

        thumb.style.transform = `translate3d(0, ${state.currentOffset}px, 0)`;
        labels.style.transform = `translate3d(0, ${state.currentLabelOffset}px, 0)`;

        if (
            Math.abs(state.currentOffset - state.targetOffset) > 0.08 ||
            Math.abs(state.currentLabelOffset - state.targetLabelOffset) > 0.08
        ) {
            requestRender();
        }
    }

    function requestRender() {
        if (state.frameId) {
            return;
        }

        state.frameId = window.requestAnimationFrame(renderFrame);
    }

    function handleScroll() {
        updateTargets();
        requestRender();

        root.classList.add('is-scrolling');
        window.clearTimeout(state.scrollTimerId);
        state.scrollTimerId = window.setTimeout(() => {
            root.classList.remove('is-scrolling');
        }, 140);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateMetrics, { passive: true });
    window.addEventListener('load', updateMetrics, { once: true });

    if ('ResizeObserver' in window) {
        const resizeObserver = new ResizeObserver(updateMetrics);
        resizeObserver.observe(document.documentElement);
        resizeObserver.observe(document.body);
    }

    root.classList.add('is-ready');
    updateMetrics();
}

import { query } from '../utils/dom.js';

const PARTICLE_COLORS = ['#E50914', '#ff5252', '#ffffff'];
const MAX_PARTICLES = 650;
const BRUSH_RADIUS = 30;
const PARTICLE_STEP = 4;
const HEAL_STRENGTH = 0.04;
const DAMAGE_ALPHA_THRESHOLD = 24;
const TEXT_ALPHA_THRESHOLD = 70;

let footerParticlesInitialized = false;

function createDamageCanvas(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    return {
        canvas,
        context: canvas.getContext('2d', { willReadFrequently: true })
    };
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2.2 + 1.2;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.012;
        this.color = color;

        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 1.8;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - 0.6;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.96;
        this.vy = this.vy * 0.96 + 0.02;
        this.life -= this.decay;
    }

    draw(context) {
        const alpha = Math.max(0, this.life);

        context.globalAlpha = alpha;
        context.fillStyle = this.color;
        context.shadowBlur = 10;
        context.shadowColor = this.color;
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fill();
    }
}

export function initFooterParticles() {
    if (footerParticlesInitialized) {
        return;
    }

    footerParticlesInitialized = true;

    const particleCanvas = query('#particleCanvas');
    const eraseCanvas = query('#eraseCanvas');
    const container = query('#glitchContainer');
    const textElement = query('#glitchText');

    if (!particleCanvas || !eraseCanvas || !container || !textElement) {
        return;
    }

    const particleContext = particleCanvas.getContext('2d');
    const eraseContext = eraseCanvas.getContext('2d');

    if (!particleContext || !eraseContext) {
        return;
    }

    const textMask = createDamageCanvas(1, 1);
    const damageMask = createDamageCanvas(1, 1);

    if (!textMask.context || !damageMask.context) {
        return;
    }

    let particles = [];
    let animationFrame = 0;
    let resizeFrame = 0;
    let isVisible = !('IntersectionObserver' in window);
    let isPointerInside = false;
    let needsHealing = false;

    function resizeCanvases() {
        const width = Math.max(1, Math.round(container.clientWidth));
        const height = Math.max(1, Math.round(container.clientHeight));

        particleCanvas.width = width + 100;
        particleCanvas.height = height + 100;
        eraseCanvas.width = width;
        eraseCanvas.height = height;
        textMask.canvas.width = width;
        textMask.canvas.height = height;
        damageMask.canvas.width = width;
        damageMask.canvas.height = height;

        eraseContext.clearRect(0, 0, width, height);
        damageMask.context.clearRect(0, 0, width, height);

        const fontSize = window.getComputedStyle(textElement).fontSize;
        const text = textElement.getAttribute('data-text') || textElement.textContent || '';

        textMask.context.clearRect(0, 0, width, height);
        textMask.context.fillStyle = '#ffffff';
        textMask.context.font = `900 ${fontSize} Orbitron, Impact, sans-serif`;
        textMask.context.textAlign = 'center';
        textMask.context.textBaseline = 'middle';
        textMask.context.fillText(text, width / 2, height / 2);

        renderEraseMask();
    }

    function scheduleResize() {
        if (resizeFrame) {
            return;
        }

        resizeFrame = window.requestAnimationFrame(() => {
            resizeFrame = 0;
            resizeCanvases();
        });
    }

    function renderEraseMask() {
        eraseContext.clearRect(0, 0, eraseCanvas.width, eraseCanvas.height);
        eraseContext.drawImage(damageMask.canvas, 0, 0);
        eraseContext.globalCompositeOperation = 'source-in';
        eraseContext.fillStyle = '#050505';
        eraseContext.fillRect(0, 0, eraseCanvas.width, eraseCanvas.height);
        eraseContext.globalCompositeOperation = 'source-over';
    }

    function paintDamage(x, y) {
        const gradient = damageMask.context.createRadialGradient(x, y, 0, x, y, BRUSH_RADIUS);
        gradient.addColorStop(0, 'rgba(255,255,255,0.95)');
        gradient.addColorStop(0.55, 'rgba(255,255,255,0.55)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');

        damageMask.context.globalCompositeOperation = 'source-over';
        damageMask.context.fillStyle = gradient;
        damageMask.context.beginPath();
        damageMask.context.arc(x, y, BRUSH_RADIUS, 0, Math.PI * 2);
        damageMask.context.fill();
    }

    function healDamage() {
        damageMask.context.globalCompositeOperation = 'destination-out';
        damageMask.context.fillStyle = `rgba(0, 0, 0, ${HEAL_STRENGTH})`;
        damageMask.context.fillRect(0, 0, damageMask.canvas.width, damageMask.canvas.height);
        damageMask.context.globalCompositeOperation = 'source-over';
    }

    function hasRemainingDamage() {
        const sample = damageMask.context.getImageData(
            0,
            0,
            damageMask.canvas.width,
            damageMask.canvas.height
        ).data;

        for (let index = 3; index < sample.length; index += 64) {
            if (sample[index] > DAMAGE_ALPHA_THRESHOLD) {
                return true;
            }
        }

        return false;
    }

    function spawnParticlesFromBrush(mouseX, mouseY) {
        const startX = Math.max(0, Math.floor(mouseX - BRUSH_RADIUS));
        const startY = Math.max(0, Math.floor(mouseY - BRUSH_RADIUS));
        const scanWidth = Math.min(eraseCanvas.width - startX, BRUSH_RADIUS * 2);
        const scanHeight = Math.min(eraseCanvas.height - startY, BRUSH_RADIUS * 2);

        if (scanWidth <= 0 || scanHeight <= 0) {
            return;
        }

        const textPixels = textMask.context.getImageData(startX, startY, scanWidth, scanHeight).data;
        const damagePixels = damageMask.context.getImageData(startX, startY, scanWidth, scanHeight).data;
        let hitText = false;

        for (let y = 0; y < scanHeight; y += PARTICLE_STEP) {
            for (let x = 0; x < scanWidth; x += PARTICLE_STEP) {
                const dx = startX + x - mouseX;
                const dy = startY + y - mouseY;
                if (dx * dx + dy * dy > BRUSH_RADIUS * BRUSH_RADIUS) {
                    continue;
                }

                const pixelIndex = (y * scanWidth + x) * 4;
                const textAlpha = textPixels[pixelIndex + 3];
                const damageAlpha = damagePixels[pixelIndex + 3];

                if (textAlpha < TEXT_ALPHA_THRESHOLD || damageAlpha > DAMAGE_ALPHA_THRESHOLD) {
                    continue;
                }

                hitText = true;

                if (particles.length >= MAX_PARTICLES || Math.random() > 0.62) {
                    continue;
                }

                particles.push(new Particle(
                    startX + x + 50,
                    startY + y + 50,
                    PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)]
                ));
            }
        }

        if (!hitText) {
            return;
        }

        paintDamage(mouseX, mouseY);
        needsHealing = true;
        renderEraseMask();
        startAnimation();
    }

    function startAnimation() {
        if (animationFrame || !isVisible) {
            return;
        }

        animationFrame = window.requestAnimationFrame(animate);
    }

    function animate() {
        animationFrame = 0;

        particleContext.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

        if (!isPointerInside && needsHealing) {
            healDamage();
            needsHealing = hasRemainingDamage();
            renderEraseMask();
        }

        let hasAliveParticles = false;

        particles = particles.filter((particle) => {
            if (particle.life <= 0) {
                return false;
            }

            particle.update();
            particle.draw(particleContext);

            if (particle.life > 0) {
                hasAliveParticles = true;
                return true;
            }

            return false;
        });

        particleContext.globalAlpha = 1;
        particleContext.shadowBlur = 0;

        if ((isPointerInside && isVisible) || hasAliveParticles || needsHealing) {
            startAnimation();
        }
    }

    function updatePointerState(event) {
        const rect = container.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        isPointerInside = true;
        spawnParticlesFromBrush(mouseX, mouseY);
    }

    container.addEventListener('pointermove', updatePointerState);
    container.addEventListener('pointerenter', () => {
        isPointerInside = true;
        startAnimation();
    });
    container.addEventListener('pointerleave', () => {
        isPointerInside = false;
        if (particles.length > 0 || needsHealing) {
            startAnimation();
        }
    });

    window.addEventListener('resize', scheduleResize, { passive: true });

    if (document.fonts?.ready) {
        document.fonts.ready.then(scheduleResize).catch(scheduleResize);
    } else {
        scheduleResize();
    }

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                isVisible = entry.isIntersecting;

                if (isVisible) {
                    scheduleResize();
                    if (isPointerInside || particles.length > 0 || needsHealing) {
                        startAnimation();
                    }
                }
            });
        }, {
            threshold: 0.01
        });

        observer.observe(container);
    } else {
        scheduleResize();
    }
}

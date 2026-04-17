import { query } from '../utils/dom.js';

export function initFooterParticles() {
    const pCanvas = query('#particleCanvas');
    const eCanvas = query('#eraseCanvas');
    const container = query('#glitchContainer');
    const textElement = query('#glitchText');
    
    if(!pCanvas || !eCanvas || !container || !textElement) return;

    const pCtx = pCanvas.getContext('2d', { willReadFrequently: true });
    const eCtx = eCanvas.getContext('2d');
    
    let particles = [];
    let animationFrame;
    
    // Mouse tracking
    let mouseX = -1000;
    let mouseY = -1000;
    let isMouseOver = false;
    let offCtx; // Offscreen canvas to detect pixels

    function resize() {
        // Particle canvas bleeds out by 100px
        pCanvas.width = container.clientWidth + 100;
        pCanvas.height = container.clientHeight + 100;
        
        // Erase canvas matches exactly the text size container
        eCanvas.width = container.clientWidth;
        eCanvas.height = container.clientHeight;
        
        // Clear erase canvas (transparent)
        eCtx.clearRect(0, 0, eCanvas.width, eCanvas.height);
        
        // Rebuild offscreen canvas to match text size
        initOffscreenCanvas();
    }
    
    function initOffscreenCanvas() {
        const offCanvas = document.createElement('canvas');
        offCanvas.width = container.clientWidth;
        offCanvas.height = container.clientHeight;
        offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
        
        const fontSize = window.getComputedStyle(textElement).fontSize;
        const text = textElement.getAttribute('data-text');
        
        offCtx.fillStyle = '#ffffff';
        offCtx.font = `900 ${fontSize} Orbitron, Impact, sans-serif`;
        offCtx.textAlign = 'center';
        offCtx.textBaseline = 'middle';
        offCtx.fillText(text, offCanvas.width / 2, offCanvas.height / 2);
    }

    window.addEventListener('resize', resize);
    document.fonts.ready.then(resize);
    resize();

    class Particle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 2.5 + 1;
            
            // Explosion physics completely randomized outward
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 10 + 2; 
            this.vx = Math.cos(angle) * velocity;
            this.vy = Math.sin(angle) * velocity - 2; // slight upward bias
            
            this.color = color;
            this.life = 1.0;
            this.decay = Math.random() * 0.02 + 0.01;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vx *= 0.92; // friction
            this.vy *= 0.92; // friction
            this.life -= this.decay;
        }

        draw() {
            pCtx.globalAlpha = Math.max(0, this.life);
            pCtx.fillStyle = this.color;
            pCtx.shadowBlur = 8;
            pCtx.shadowColor = this.color;
            pCtx.beginPath();
            pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            pCtx.fill();
        }
    }

    function spawnParticlesFromBrush(mouseX, mouseY) {
        if (!offCtx) return;
        
        // Coordinates for the offscreen/erase canvases are relative to the container
        const brushRadius = 25; 
        
        // We only scan a small area around the mouse
        const startX = Math.max(0, mouseX - brushRadius);
        const startY = Math.max(0, mouseY - brushRadius);
        const scanWidth = Math.min(eCanvas.width - startX, brushRadius * 2);
        const scanHeight = Math.min(eCanvas.height - startY, brushRadius * 2);
        
        if(scanWidth <= 0 || scanHeight <= 0) return;

        const imgData = offCtx.getImageData(startX, startY, scanWidth, scanHeight).data;
        const colors = ['#E50914', '#ffffff', '#333333'];
        
        let spawnedAnything = false;
        
        // Check pixels in the brush area
        for (let y = 0; y < scanHeight; y += 4) {
            for (let x = 0; x < scanWidth; x += 4) {
                // Circular brush check
                const dx = (startX + x) - mouseX;
                const dy = (startY + y) - mouseY;
                if(dx*dx + dy*dy <= brushRadius*brushRadius) {
                    
                    const alpha = imgData[(y * scanWidth + x) * 4 + 3];
                    if (alpha > 128) {
                        // We hit text! 
                        const color = colors[Math.floor(Math.random() * colors.length)];
                        // particle canvas has a 50px offset (bleed out), so we add 50px
                        particles.push(new Particle(startX + x + 50, startY + y + 50, color));
                        spawnedAnything = true;
                    }
                }
            }
        }
        
        if(spawnedAnything) {
            // Draw a background-colored circle to "erase" the text dynamically
            // #050505 is the exact background color of the footer
            eCtx.globalCompositeOperation = 'source-over';
            eCtx.fillStyle = '#050505'; 
            eCtx.filter = 'blur(4px)'; 
            eCtx.beginPath();
            eCtx.arc(mouseX, mouseY, brushRadius, 0, Math.PI * 2);
            eCtx.fill();
            eCtx.filter = 'none';
        }
    }

    function animate() {
        // Clear particle canvas
        pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
        
        // Fade the erase canvas back to transparent slowly so the text "regrows" 
        if(!isMouseOver) {
            eCtx.globalCompositeOperation = 'destination-out';
            eCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            eCtx.fillRect(0, 0, eCanvas.width, eCanvas.height);
        }

        // Handle particles
        let alive = false;
        particles.forEach(p => {
            if (p.life > 0) {
                p.update();
                p.draw();
                alive = true;
            }
        });
        
        // Always run to heal the text or process particles
        animationFrame = requestAnimationFrame(animate);
    }

    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        isMouseOver = true;
        
        spawnParticlesFromBrush(mouseX, mouseY);
    });

    container.addEventListener('mouseenter', () => {
        isMouseOver = true;
    });

    container.addEventListener('mouseleave', () => {
        isMouseOver = false;
    });

    // Start animation loop
    animate();
}

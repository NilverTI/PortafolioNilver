import { query } from '../utils/dom.js';

const PARTICLE_COUNT = 100;

function createParticle(width, height) {
    return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        speedX: Math.random() * 0.6 - 0.3,
        speedY: Math.random() * 0.6 - 0.3
    };
}

export function initParticlesBackground() {
    const canvas = query('#particlesCanvas');
    const homeSection = query('#home');

    if (!canvas || !homeSection) {
        return;
    }

    const context = canvas.getContext('2d');
    const particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = homeSection.offsetHeight;
    }

    function animateParticles() {
        context?.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((particle) => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            if (particle.x < 0 || particle.x > canvas.width) {
                particle.speedX *= -1;
            }

            if (particle.y < 0 || particle.y > canvas.height) {
                particle.speedY *= -1;
            }

            context?.beginPath();
            context?.arc(particle.x, particle.y, particle.radius, 0, 2 * Math.PI);
            if (context) {
                context.fillStyle = 'rgba(229, 9, 20, 0.4)';
                context.fill();
            }
        });

        window.requestAnimationFrame(animateParticles);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    for (let index = 0; index < PARTICLE_COUNT; index += 1) {
        particles.push(createParticle(canvas.width, canvas.height));
    }

    animateParticles();
}

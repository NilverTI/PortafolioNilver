import { query } from '../utils/dom.js';

export function initProfileSvg() {
    const profileSvg = query('#profileSvg');

    if (!profileSvg) {
        return;
    }

    const leftEye = query('#leftEye');
    const rightEye = query('#rightEye');
    const faceOutline = query('#faceOutline');

    profileSvg.addEventListener('mousemove', (event) => {
        const rect = profileSvg.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 200;
        const y = ((event.clientY - rect.top) / rect.height) * 200;

        leftEye?.setAttribute('cx', 80 + (x - 80) * 0.05);
        leftEye?.setAttribute('cy', 80 + (y - 80) * 0.05);
        rightEye?.setAttribute('cx', 120 + (x - 120) * 0.05);
        rightEye?.setAttribute('cy', 80 + (y - 80) * 0.05);
        faceOutline?.setAttribute('d', `M60,100 Q100,${130 + (y - 100) * 0.2} 140,100`);
    });

    profileSvg.addEventListener('mouseleave', () => {
        leftEye?.setAttribute('cx', '80');
        leftEye?.setAttribute('cy', '80');
        rightEye?.setAttribute('cx', '120');
        rightEye?.setAttribute('cy', '80');
        faceOutline?.setAttribute('d', 'M60,100 Q100,150 140,100');
    });
}

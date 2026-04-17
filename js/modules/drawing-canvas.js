import { query } from '../utils/dom.js';

export function initDrawingCanvas() {
    const canvas = query('#drawingCanvas');

    if (!canvas) {
        return;
    }

    const context = canvas.getContext('2d');
    const clearButton = query('#clearCanvas');
    const state = {
        isDrawing: false,
        previousPoint: null
    };

    function draw(event) {
        if (!state.isDrawing || !context) {
            return;
        }

        const rect = canvas.getBoundingClientRect();
        const point = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };

        context.lineWidth = 2;
        context.lineCap = 'round';
        context.strokeStyle = '#E50914';

        if (state.previousPoint) {
            context.beginPath();
            context.moveTo(state.previousPoint.x, state.previousPoint.y);
            context.lineTo(point.x, point.y);
            context.stroke();
        }

        state.previousPoint = point;
    }

    function stopDrawing() {
        state.isDrawing = false;
        state.previousPoint = null;
    }

    canvas.addEventListener('mousedown', (event) => {
        state.isDrawing = true;
        draw(event);
    });
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    clearButton?.addEventListener('click', () => {
        context?.clearRect(0, 0, canvas.width, canvas.height);
        state.previousPoint = null;
    });
}

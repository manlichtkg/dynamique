/**
 * Simple Confetti Animation Utility
 * Creates a lightweight burst of particles without external dependencies.
 */
export function triggerConfetti() {
    const colors = ['#84CC16', '#F59E0B', '#3B82F6', '#EC4899', '#8B5CF6'];
    const particleCount = 50;

    // Create container
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999';
    document.body.appendChild(container);

    // Create particles
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const color = colors[Math.floor(Math.random() * colors.length)];
        const x = Math.random() * 100;
        const delay = Math.random() * 0.5;

        particle.style.position = 'absolute';
        particle.style.left = `${x}%`;
        particle.style.top = '-10px';
        particle.style.width = '8px';
        particle.style.height = '8px';
        particle.style.backgroundColor = color;
        particle.style.borderRadius = '50%';
        particle.style.animation = `fall 1.5s ease-out ${delay}s forwards`;

        container.appendChild(particle);
    }

    // Cleanup
    setTimeout(() => {
        document.body.removeChild(container);
    }, 2000);
}

// Inject CSS for animation if not exists
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes fall {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

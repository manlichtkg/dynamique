import React, { useEffect, useState } from 'react';

const COLORS = ['#FFC700', '#FF0000', '#2E3191', '#41BBC7'];
const SHAPES = ['square', 'triangle', 'circle'];

interface Particle {
    id: number;
    x: number;
    y: number;
    color: string;
    rotation: number;
    delay: number;
    shape: string;
}

export const Confetti = () => {
    const [isActive, setIsActive] = useState(false);
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        const handleConfetti = () => {
            setIsActive(true);
            const newParticles = Array.from({ length: 50 }).map((_, i) => ({
                id: i,
                x: Math.random() * 100, // vw
                y: -10, // start above viewport
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                rotation: Math.random() * 360,
                delay: Math.random() * 0.5,
                shape: SHAPES[Math.floor(Math.random() * SHAPES.length)]
            }));
            setParticles(newParticles);

            setTimeout(() => setIsActive(false), 3000);
        };

        window.addEventListener('confetti', handleConfetti);
        return () => window.removeEventListener('confetti', handleConfetti);
    }, []);

    if (!isActive) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="absolute w-3 h-3"
                    style={{
                        left: `${p.x}vw`,
                        top: `-10px`,
                        backgroundColor: p.color,
                        borderRadius: p.shape === 'circle' ? '50%' : '0',
                        transform: `rotate(${p.rotation}deg)`,
                        animation: `fall 2.5s ease-out forwards ${p.delay}s`,
                    }}
                />
            ))}
            <style>{`
                @keyframes fall {
                    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

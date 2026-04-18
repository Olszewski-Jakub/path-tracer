"use client";

import React, { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    shape: 'square' | 'circle' | 'sparkle';
    rotation: number;
    rotationSpeed: number;
    opacity: number;
    sway: number;
    swaySpeed: number;
    swayOffset: number;
}

const COLORS = [
    '#6366f1', '#818cf8',  // indigo
    '#06b6d4', '#22d3ee',  // cyan
    '#10b981', '#34d399',  // emerald
    '#f59e0b', '#fbbf24',  // amber
    '#a855f7', '#c084fc',  // purple
    '#ef4444', '#f87171',  // red
    '#ec4899', '#f472b6',  // pink
    '#ffffff',             // white sparkle
];

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, points: number) {
    const inner = r * 0.45;
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
        const angle = (Math.PI / points) * i - Math.PI / 2;
        const radius = i % 2 === 0 ? r : inner;
        if (i === 0) ctx.moveTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
        else ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
    }
    ctx.closePath();
    ctx.fill();
}

const ConfettiEffect: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const frameRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const count = 220;
        particlesRef.current = Array.from({ length: count }, (_, i) => {
            const shape: Particle['shape'] =
                i < count * 0.45 ? 'square' : i < count * 0.75 ? 'circle' : 'sparkle';
            return {
                x: Math.random() * canvas.width,
                y: -20 - Math.random() * 120,
                vx: (Math.random() - 0.5) * 5,
                vy: 2.5 + Math.random() * 3.5,
                size: shape === 'sparkle' ? 5 + Math.random() * 7 : 5 + Math.random() * 12,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                shape,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.14,
                opacity: 1,
                sway: 0,
                swaySpeed: 0.02 + Math.random() * 0.03,
                swayOffset: Math.random() * Math.PI * 2,
            };
        });

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const animate = (ts: number) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let alive = false;

            for (const p of particlesRef.current) {
                p.vy += 0.07;
                p.vx *= 0.995;
                p.sway = Math.sin(ts * p.swaySpeed + p.swayOffset) * 1.2;
                p.x += p.vx + p.sway;
                p.y += p.vy;
                p.rotation += p.rotationSpeed;
                p.opacity = Math.max(0, p.opacity - 0.005);

                if (p.opacity <= 0) continue;
                alive = true;

                ctx.save();
                ctx.globalAlpha = p.opacity;
                ctx.fillStyle = p.color;
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);

                if (p.shape === 'square') {
                    const h = p.size;
                    const w = p.size * (0.5 + Math.random() * 0.3);
                    ctx.fillRect(-w / 2, -h / 2, w, h);
                } else if (p.shape === 'circle') {
                    ctx.beginPath();
                    ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    drawStar(ctx, 0, 0, p.size, 5);
                }

                ctx.restore();
            }

            if (alive) {
                frameRef.current = requestAnimationFrame(animate);
            } else {
                frameRef.current = null;
            }
        };

        frameRef.current = requestAnimationFrame(animate);

        const cleanup = setTimeout(() => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
                frameRef.current = null;
            }
            particlesRef.current = [];
        }, 7000);

        return () => {
            clearTimeout(cleanup);
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
                frameRef.current = null;
            }
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
        />
    );
};

export default ConfettiEffect;

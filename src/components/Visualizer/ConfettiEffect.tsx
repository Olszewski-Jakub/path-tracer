"use client";

import React, { useEffect, useRef, useState } from 'react';

interface Particle {
    x: number;
    y: number;
    size: number;
    color: string;
    speed: number;
    angle: number;
    rotation: number;
    rotationSpeed: number;
    opacity: number;
}

const ConfettiEffect: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [particles, setParticles] = useState<Particle[]>([]);

    // Generate random particles
    useEffect(() => {
        const particlesCount = 150;
        const colors = ['#f94144', '#f3722c', '#f8961e', '#f9c74f', '#90be6d', '#43aa8b', '#577590', '#FF9BD2', '#8A4FFF', '#0096c7'];

        const newParticles = Array.from({ length: particlesCount }, () => {
            return {
                x: Math.random() * window.innerWidth,
                y: -20 - Math.random() * 100, // Start slightly above viewport
                size: 5 + Math.random() * 15,
                color: colors[Math.floor(Math.random() * colors.length)],
                speed: 2 + Math.random() * 3,
                angle: Math.random() * Math.PI * 2,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.2,
                opacity: 1.0
            };
        });

        setParticles(newParticles);

        // Auto-cleanup after 6 seconds
        const timer = setTimeout(() => {
            setParticles([]);
        }, 6000);

        return () => clearTimeout(timer);
    }, []);

    // Animation loop
    useEffect(() => {
        if (particles.length === 0) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Resize canvas to window
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let animationId: number;

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            let stillVisible = false;

            // Update and draw particles
            particles.forEach(particle => {
                // Update position
                particle.y += particle.speed;
                particle.x += Math.sin(particle.angle) * 1.5;
                particle.rotation += particle.rotationSpeed;

                // Fade out over time
                particle.opacity = Math.max(0, particle.opacity - 0.005);

                if (particle.opacity > 0) stillVisible = true;

                // Draw particle
                ctx.save();
                ctx.translate(particle.x, particle.y);
                ctx.rotate(particle.rotation);
                ctx.globalAlpha = particle.opacity;
                ctx.fillStyle = particle.color;

                // Rectangle particle
                ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);

                ctx.restore();
            });

            if (stillVisible) {
                animationId = requestAnimationFrame(animate);
            }
        };

        animationId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationId);
    }, [particles]);

    if (particles.length === 0) return null;

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
        />
    );
};

export default ConfettiEffect;
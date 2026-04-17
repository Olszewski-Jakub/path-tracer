"use client";

import React, { useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import Link from 'next/link';

const Header: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';
    const [showTutorial, setShowTutorial] = useState(false);

    return (
        <>
            {showTutorial && (
                <TutorialModalWithProps
                    isOpen={showTutorial}
                    onClose={() => setShowTutorial(false)}
                />
            )}

            <header
                style={{
                    background: isDark
                        ? 'rgba(8, 12, 20, 0.85)'
                        : 'rgba(248, 250, 252, 0.85)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderBottom: isDark
                        ? '1px solid rgba(255,255,255,0.07)'
                        : '1px solid rgba(15,23,42,0.08)',
                    boxShadow: isDark
                        ? '0 1px 0 rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,0.4)'
                        : '0 1px 0 rgba(15,23,42,0.06), 0 4px 24px rgba(0,0,0,0.06)',
                }}
                className="sticky top-0 z-40"
            >
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-[60px] items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div
                                style={{
                                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
                                    borderRadius: '10px',
                                    padding: '7px',
                                    boxShadow: '0 0 20px rgba(99,102,241,0.4)',
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-lg font-bold tracking-tight gradient-text">
                                    Path Tracer
                                </h1>
                                <p className="text-xs hidden sm:block" style={{ color: 'var(--text-muted)', marginTop: '-2px' }}>
                                    Algorithm Visualizer
                                </p>
                            </div>
                        </div>

                        {/* Nav Actions */}
                        <div className="flex items-center gap-2">
                            {/* Help */}
                            <button
                                onClick={() => setShowTutorial(true)}
                                style={{
                                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                    boxShadow: '0 0 16px rgba(99,102,241,0.35)',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                    <line x1="12" y1="17" x2="12.01" y2="17" />
                                </svg>
                                <span className="hidden sm:inline">Help</span>
                            </button>

                            {/* GitHub */}
                            <Link
                                href="https://github.com/Olszewski-Jakub/path-tracer"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.06)',
                                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.1)'}`,
                                    borderRadius: '8px',
                                    color: isDark ? '#f1f5f9' : '#0f172a',
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-opacity hover:opacity-80"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                                </svg>
                                <span className="hidden sm:inline">GitHub</span>
                            </Link>

                            {/* Portfolio */}
                            <Link
                                href="https://jakubolszewski.dev"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.06)',
                                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.1)'}`,
                                    borderRadius: '8px',
                                    color: isDark ? '#f1f5f9' : '#0f172a',
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-opacity hover:opacity-80"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                </svg>
                                <span className="hidden sm:inline">Portfolio</span>
                            </Link>

                            {/* Theme toggle */}
                            <button
                                onClick={toggleTheme}
                                aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                                style={{
                                    background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.06)',
                                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.1)'}`,
                                    borderRadius: '8px',
                                    color: isDark ? '#fbbf24' : '#6366f1',
                                    width: '36px',
                                    height: '36px',
                                }}
                                className="inline-flex items-center justify-center transition-opacity hover:opacity-80"
                            >
                                {isDark ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                        <circle cx="12" cy="12" r="5" />
                                        <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                        <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

interface TutorialModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const TutorialModalWithProps: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [currentStep, setCurrentStep] = useState(0);
    const [showAgain, setShowAgain] = useState(true);

    const closeTutorial = () => {
        onClose();
        if (!showAgain) {
            localStorage.setItem('hasSeenPathTracerTutorial', 'true');
        }
    };

    const nextStep = () => {
        if (currentStep < tutorialSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            closeTutorial();
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const tutorialSteps = [
        {
            title: "Welcome to Path Tracer!",
            icon: "🗺️",
            content: (
                <div className="space-y-2">
                    <p style={{ color: 'var(--text-muted)' }}>This app visualizes different pathfinding algorithms to help you understand how they work.</p>
                    <p style={{ color: 'var(--text-muted)' }}>Follow this quick tutorial to learn how to use the tool.</p>
                </div>
            )
        },
        {
            title: "Creating Walls",
            icon: "🧱",
            content: (
                <div className="space-y-2">
                    <p style={{ color: 'var(--text-muted)' }}>Click or drag on the grid to create walls.</p>
                    <p style={{ color: 'var(--text-muted)' }}>Walls are obstacles that the algorithm cannot pass through.</p>
                    <p style={{ color: 'var(--text-muted)' }}>Click on a wall again to remove it.</p>
                </div>
            )
        },
        {
            title: "Start and End Points",
            icon: "📍",
            content: (
                <div className="space-y-2">
                    <p style={{ color: 'var(--text-muted)' }}>The <span className="font-semibold text-emerald-500">green cell (S)</span> is the starting point.</p>
                    <p style={{ color: 'var(--text-muted)' }}>The <span className="font-semibold text-red-500">red cell (E)</span> is the destination.</p>
                    <p style={{ color: 'var(--text-muted)' }}>The algorithm will find a path from start to end.</p>
                </div>
            )
        },
        {
            title: "Choose an Algorithm",
            icon: "⚡",
            content: (
                <div className="space-y-3">
                    <p style={{ color: 'var(--text-muted)' }}>Select from 4 different algorithms:</p>
                    <ul className="space-y-2">
                        {[
                            { name: 'A* Search', desc: 'Uses a heuristic to find the optimal path efficiently', color: '#6366f1' },
                            { name: 'Dijkstra', desc: "Guarantees shortest path by exploring by distance", color: '#06b6d4' },
                            { name: 'BFS', desc: 'Explores all neighbors before going deeper', color: '#10b981' },
                            { name: 'DFS', desc: 'Goes deep along each branch before backtracking', color: '#f59e0b' },
                        ].map(algo => (
                            <li key={algo.name} className="flex items-start gap-2">
                                <span className="mt-0.5 w-2 h-2 rounded-full flex-shrink-0" style={{ background: algo.color, marginTop: '6px' }} />
                                <span style={{ color: 'var(--text-muted)' }}><span className="font-semibold" style={{ color: 'var(--foreground)' }}>{algo.name}</span>: {algo.desc}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )
        },
        {
            title: "Controls",
            icon: "🎮",
            content: (
                <div className="space-y-3">
                    <p style={{ color: 'var(--text-muted)' }}>Use the control bar to interact with the visualization:</p>
                    <ul className="space-y-1.5">
                        {[
                            ['Start', 'Begin the visualization'],
                            ['Pause/Resume', 'Control the animation'],
                            ['Step', 'Advance one step at a time'],
                            ['Speed', 'Adjust animation speed with the slider'],
                            ['Clear', 'Remove visited paths, keep walls'],
                            ['Reset', 'Clear the entire grid'],
                            ['Generate Maze', 'Create a random maze pattern'],
                        ].map(([label, desc]) => (
                            <li key={label} className="flex items-start gap-2 text-sm">
                                <span style={{ color: 'var(--text-muted)' }}><span className="font-semibold" style={{ color: 'var(--foreground)' }}>{label}</span>: {desc}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )
        },
        {
            title: "Grid Colors",
            icon: "🎨",
            content: (
                <div className="space-y-3">
                    <p style={{ color: 'var(--text-muted)' }}>Cell colors during execution:</p>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { color: '#10b981', label: 'Start (S)', shadow: '0 0 8px rgba(16,185,129,0.6)' },
                            { color: '#ef4444', label: 'End (E)', shadow: '0 0 8px rgba(239,68,68,0.6)' },
                            { color: isDark ? '#374151' : '#1e293b', label: 'Wall', shadow: 'none' },
                            { color: '#3b82f6', label: 'Visited', shadow: '0 0 8px rgba(59,130,246,0.4)' },
                            { color: '#06b6d4', label: 'Frontier', shadow: '0 0 8px rgba(6,182,212,0.4)' },
                            { color: '#a855f7', label: 'Current', shadow: '0 0 8px rgba(168,85,247,0.6)' },
                            { color: '#f59e0b', label: 'Path', shadow: '0 0 8px rgba(245,158,11,0.5)' },
                        ].map(item => (
                            <div key={item.label} className="flex items-center gap-2">
                                <span className="w-4 h-4 rounded flex-shrink-0" style={{ background: item.color, boxShadow: item.shadow }} />
                                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
        {
            title: "Performance Metrics",
            icon: "📊",
            content: (
                <div className="space-y-2">
                    <p style={{ color: 'var(--text-muted)' }}>The sidebar shows algorithm performance:</p>
                    <ul className="space-y-1.5">
                        {[
                            ['Nodes Explored', 'How many cells the algorithm checked'],
                            ['Path Length', 'Number of steps in the final path'],
                            ['Execution Time', 'How long it took to find the path'],
                            ['Efficiency Score', 'Lower is better (explored ÷ path length)'],
                        ].map(([label, desc]) => (
                            <li key={label} className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{label}</span>: {desc}
                            </li>
                        ))}
                    </ul>
                    <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>Compare algorithms to see which works best for each maze type!</p>
                </div>
            )
        },
        {
            title: "You're Ready!",
            icon: "🚀",
            content: (
                <div className="space-y-2">
                    <p style={{ color: 'var(--text-muted)' }}>You now know how to use Path Tracer!</p>
                    <p style={{ color: 'var(--text-muted)' }}>Try creating your own maze or generating a random one.</p>
                    <p style={{ color: 'var(--text-muted)' }}>Experiment with different algorithms to see which performs best in different scenarios.</p>
                </div>
            )
        },
    ];

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={(e) => e.target === e.currentTarget && closeTutorial()}
        >
            <div
                className="w-full max-w-lg mx-4 rounded-2xl overflow-hidden animate-float-in"
                style={{
                    background: isDark ? '#0d1422' : '#ffffff',
                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(15,23,42,0.1)',
                    boxShadow: isDark
                        ? '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)'
                        : '0 24px 64px rgba(0,0,0,0.15)',
                }}
            >
                {/* Progress bar */}
                <div style={{ height: '3px', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.06)' }}>
                    <div
                        className="h-full transition-all duration-500"
                        style={{
                            width: `${((currentStep + 1) / tutorialSteps.length) * 100}%`,
                            background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)',
                        }}
                    />
                </div>

                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-5">
                        <span className="text-2xl">{tutorialSteps[currentStep].icon}</span>
                        <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
                            {tutorialSteps[currentStep].title}
                        </h2>
                    </div>

                    {/* Content */}
                    <div className="min-h-[140px]">
                        {tutorialSteps[currentStep].content}
                    </div>

                    {/* Footer */}
                    <div className="mt-6 flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showAgain}
                                onChange={(e) => setShowAgain(e.target.checked)}
                                className="rounded"
                                style={{ accentColor: '#6366f1' }}
                            />
                            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Show again</span>
                        </label>

                        <div className="flex items-center gap-3">
                            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                {currentStep + 1} / {tutorialSteps.length}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={prevStep}
                                    disabled={currentStep === 0}
                                    style={{
                                        background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.06)',
                                        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(15,23,42,0.1)',
                                        color: currentStep === 0 ? 'var(--text-muted)' : 'var(--foreground)',
                                        borderRadius: '8px',
                                        opacity: currentStep === 0 ? 0.4 : 1,
                                    }}
                                    className="px-4 py-2 text-sm font-medium transition-opacity"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={nextStep}
                                    style={{
                                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                        boxShadow: '0 0 16px rgba(99,102,241,0.4)',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.15)',
                                        color: 'white',
                                    }}
                                    className="px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
                                >
                                    {currentStep < tutorialSteps.length - 1 ? 'Next →' : 'Get Started'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;

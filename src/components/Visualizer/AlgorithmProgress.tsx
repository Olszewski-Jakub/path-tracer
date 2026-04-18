import React from 'react';
import { AlgorithmStep, AlgorithmType } from "@/types";
import { ALGO_COLORS } from '@/utils/algorithmUtils';

interface AlgorithmProgressProps {
    isDark: boolean;
    algorithm: AlgorithmType;
    metrics: {
        nodesExplored: number;
        pathLength: number;
        executionTime: number;
        isPathFound: boolean;
    };
    isDone: boolean;
    isRevealingPath: boolean;
    currentStep: AlgorithmStep;
}

const AlgorithmProgress: React.FC<AlgorithmProgressProps> = ({
    isDark, algorithm, metrics, isDone, isRevealingPath, currentStep,
}) => {
    const accentColor = ALGO_COLORS[algorithm] ?? '#6366f1';

    const hexToRgba = (hex: string, alpha: number) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r},${g},${b},${alpha})`;
    };

    return (
        <div
            className="mt-4 rounded-xl animate-float-in"
            style={{
                background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.8)',
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(15,23,42,0.08)',
                backdropFilter: 'blur(8px)',
                overflow: 'hidden',
            }}
        >
            {/* Progress bar strip */}
            <div style={{ height: '3px', background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                {isDone ? (
                    <div
                        style={{
                            height: '100%',
                            width: '100%',
                            background: metrics.isPathFound
                                ? 'linear-gradient(90deg, #10b981, #34d399)'
                                : 'linear-gradient(90deg, #ef4444, #f87171)',
                            transition: 'background 0.4s ease',
                        }}
                    />
                ) : isRevealingPath ? (
                    <div
                        style={{
                            height: '100%',
                            width: '100%',
                            background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
                        }}
                    />
                ) : (
                    <div
                        style={{
                            height: '100%',
                            width: '60%',
                            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
                            animation: 'shimmerBar 1.8s ease-in-out infinite',
                        }}
                    />
                )}
            </div>

            {isDone ? (
                metrics.isPathFound ? (
                    <div className="flex items-center gap-4 p-4">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{
                                background: 'rgba(16,185,129,0.15)',
                                border: '1px solid rgba(16,185,129,0.3)',
                                boxShadow: '0 0 16px rgba(16,185,129,0.2)',
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="#10b981">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold" style={{ color: '#10b981' }}>Path Found!</p>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                {metrics.pathLength} steps &middot; {metrics.nodesExplored} nodes explored &middot; {metrics.executionTime.toFixed(2)} ms
                            </p>
                        </div>
                        <div className="flex gap-3 flex-shrink-0">
                            {[
                                { label: 'Steps', value: metrics.pathLength, color: '#10b981' },
                                { label: 'Nodes', value: metrics.nodesExplored, color: '#60a5fa' },
                                { label: 'Time', value: `${metrics.executionTime.toFixed(1)}ms`, color: '#818cf8' },
                            ].map(stat => (
                                <div key={stat.label} className="text-center hidden sm:block">
                                    <div className="text-lg font-bold font-mono" style={{ color: stat.color }}>{stat.value}</div>
                                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-4 p-4">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{
                                background: 'rgba(239,68,68,0.15)',
                                border: '1px solid rgba(239,68,68,0.3)',
                                boxShadow: '0 0 16px rgba(239,68,68,0.2)',
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="#ef4444">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-semibold" style={{ color: '#ef4444' }}>No Path Possible</p>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                Explored {metrics.nodesExplored} nodes — start and end are not connected.
                            </p>
                        </div>
                    </div>
                )
            ) : isRevealingPath ? (
                <div className="flex items-center gap-4 p-4">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                            background: 'rgba(245,158,11,0.15)',
                            border: '1px solid rgba(245,158,11,0.3)',
                            boxShadow: '0 0 16px rgba(245,158,11,0.2)',
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-semibold" style={{ color: '#f59e0b' }}>Tracing Path…</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                            {metrics.nodesExplored} nodes explored
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-4 p-4">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                            background: hexToRgba(accentColor, 0.15),
                            border: `1px solid ${hexToRgba(accentColor, 0.3)}`,
                            boxShadow: `0 0 16px ${hexToRgba(accentColor, 0.2)}`,
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 animate-spin-slow"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke={accentColor}
                            strokeWidth="2"
                        >
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-semibold" style={{ color: accentColor }}>Exploring…</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                            Current: ({currentStep.current?.row ?? 0}, {currentStep.current?.col ?? 0})
                            &nbsp;&middot;&nbsp; {metrics.nodesExplored} nodes visited
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AlgorithmProgress;

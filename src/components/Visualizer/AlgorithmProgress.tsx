import React from 'react';
import { AlgorithmStep } from "@/types";

interface AlgorithmProgressProps {
    isDark: boolean;
    metrics: {
        nodesExplored: number;
        pathLength: number;
        executionTime: number;
        isPathFound: boolean;
    };
    isDone: boolean;
    currentStep: AlgorithmStep;
}

const AlgorithmProgress: React.FC<AlgorithmProgressProps> = ({ isDark, metrics, isDone, currentStep }) => {
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
            ) : (
                <div className="flex items-center gap-4 p-4">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                            background: 'rgba(99,102,241,0.15)',
                            border: '1px solid rgba(99,102,241,0.3)',
                            boxShadow: '0 0 16px rgba(99,102,241,0.2)',
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 animate-spin-slow"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#6366f1"
                            strokeWidth="2"
                        >
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-semibold" style={{ color: '#818cf8' }}>Exploring...</p>
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

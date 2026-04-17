import React from 'react';
import { AlgorithmInfo, AlgorithmType } from '@/types';

interface LegendItem {
    label: string;
    color: string;
}

interface AlgorithmControlsProps {
    algorithm: AlgorithmType;
    algorithmInfoMap: Record<AlgorithmType, AlgorithmInfo>;
    handleAlgorithmChange: (algorithm: AlgorithmType) => void;
    isRunning: boolean;
    legendItems: Array<LegendItem>;
    isDark: boolean;
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

const ALGO_COLORS: Record<string, string> = {
    astar: '#6366f1',
    dijkstra: '#06b6d4',
    bfs: '#10b981',
    dfs: '#f59e0b',
};

const LEGEND_DOT_STYLES: Record<string, React.CSSProperties> = {
    'bg-green-500': { background: '#10b981', boxShadow: '0 0 6px rgba(16,185,129,0.5)' },
    'bg-red-500': { background: '#ef4444', boxShadow: '0 0 6px rgba(239,68,68,0.5)' },
    'bg-gray-200': { background: '#e2e8f0' },
    'bg-gray-800': { background: '#1e293b' },
    'bg-blue-400': { background: '#60a5fa', boxShadow: '0 0 6px rgba(96,165,250,0.4)' },
    'bg-yellow-400': { background: '#f59e0b', boxShadow: '0 0 6px rgba(245,158,11,0.5)' },
    'bg-purple-500': { background: '#a855f7', boxShadow: '0 0 6px rgba(168,85,247,0.5)' },
    'bg-cyan-400': { background: '#22d3ee', boxShadow: '0 0 6px rgba(34,211,238,0.4)' },
};

function getLegendDotStyle(colorClass: string): React.CSSProperties {
    const base = colorClass.split(' ')[0];
    return LEGEND_DOT_STYLES[base] ?? { background: '#94a3b8' };
}

const AlgorithmControls: React.FC<AlgorithmControlsProps> = ({
    algorithm,
    algorithmInfoMap,
    handleAlgorithmChange,
    isRunning,
    legendItems,
    isDark,
    sidebarOpen,
    setSidebarOpen,
}) => {
    const accentColor = ALGO_COLORS[algorithm] ?? '#6366f1';

    return (
        <div
            style={{
                background: isDark ? 'rgba(13,20,34,0.95)' : 'rgba(248,250,252,0.95)',
                borderBottom: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(15,23,42,0.08)',
                backdropFilter: 'blur(12px)',
            }}
            className="px-4 py-3"
        >
            <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Left: Sidebar toggle + Algorithm tabs */}
                <div className="flex items-center gap-3">
                    {/* Sidebar toggle */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        aria-label={`${sidebarOpen ? 'Hide' : 'Show'} sidebar`}
                        style={{
                            background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.06)',
                            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(15,23,42,0.1)',
                            borderRadius: '8px',
                            color: isDark ? '#94a3b8' : '#64748b',
                            width: '34px',
                            height: '34px',
                        }}
                        className="flex items-center justify-center transition-opacity hover:opacity-80 flex-shrink-0"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d={sidebarOpen ? "M11 19l-7-7 7-7m8 14l-7-7 7-7" : "M13 5l7 7-7 7M5 5l7 7-7 7"} />
                        </svg>
                    </button>

                    {/* Algorithm selector tabs */}
                    <div
                        className="flex gap-1 p-1 rounded-xl"
                        style={{
                            background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.05)',
                            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(15,23,42,0.08)',
                        }}
                    >
                        {Object.entries(algorithmInfoMap).map(([type, info]) => {
                            const isActive = algorithm === type;
                            const color = ALGO_COLORS[type] ?? '#6366f1';
                            return (
                                <button
                                    key={type}
                                    onClick={() => !isRunning && handleAlgorithmChange(type as AlgorithmType)}
                                    disabled={isRunning}
                                    style={isActive ? {
                                        background: `${color}22`,
                                        border: `1px solid ${color}55`,
                                        color: color,
                                        boxShadow: `0 0 12px ${color}30`,
                                        borderRadius: '8px',
                                        fontWeight: 600,
                                    } : {
                                        background: 'transparent',
                                        border: '1px solid transparent',
                                        color: isDark ? '#64748b' : '#94a3b8',
                                        borderRadius: '8px',
                                    }}
                                    className="px-3 py-1 text-sm transition-all duration-200 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {info.name}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Right: Legend */}
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Legend:</span>
                    {legendItems.map((item) => (
                        <div
                            key={item.label}
                            className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs"
                            style={{
                                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.04)',
                                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(15,23,42,0.08)',
                            }}
                        >
                            <span
                                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                style={getLegendDotStyle(item.color)}
                            />
                            <span style={{ color: isDark ? '#94a3b8' : '#64748b' }}>{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AlgorithmControls;

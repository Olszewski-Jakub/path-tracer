import React from 'react';
import { AlgorithmInfo, AlgorithmType } from "@/types";

interface SidebarProps {
    algorithm: AlgorithmType;
    algorithmInfoMap: Record<AlgorithmType, AlgorithmInfo>;
    rows: number;
    cols: number;
    handleSizeChange: (rows: number, cols: number) => void;
    isRunning: boolean;
    metrics: {
        nodesExplored: number;
        pathLength: number;
        executionTime: number;
        isPathFound: boolean;
    };
    isDone: boolean;
    getEfficiencyScore: () => string;
    isDark: boolean;
}

const ALGO_COLORS: Record<string, string> = {
    astar: '#6366f1',
    dijkstra: '#06b6d4',
    bfs: '#10b981',
    dfs: '#f59e0b',
};

const Card: React.FC<{ children: React.ReactNode; isDark: boolean; className?: string }> = ({ children, isDark, className = '' }) => (
    <div
        className={className}
        style={{
            background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.8)',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(15,23,42,0.08)',
            borderRadius: '12px',
            padding: '16px',
            backdropFilter: 'blur(8px)',
        }}
    >
        {children}
    </div>
);

const Sidebar: React.FC<SidebarProps> = ({
    algorithm,
    algorithmInfoMap,
    rows,
    cols,
    handleSizeChange,
    isRunning,
    metrics,
    isDone,
    getEfficiencyScore,
    isDark,
}) => {
    const accentColor = ALGO_COLORS[algorithm] ?? '#6366f1';
    const effScore = getEfficiencyScore();
    const effNum = parseFloat(effScore);

    const getEfficiencyColor = () => {
        if (isNaN(effNum)) return '#94a3b8';
        if (effNum < 1.5) return '#10b981';
        if (effNum < 3) return '#22c55e';
        if (effNum < 5) return '#f59e0b';
        if (effNum < 8) return '#f97316';
        return '#ef4444';
    };

    const getEfficiencyLabel = () => {
        if (isNaN(effNum)) return '';
        if (effNum < 1.5) return 'Excellent';
        if (effNum < 3) return 'Good';
        if (effNum < 5) return 'Fair';
        if (effNum < 8) return 'Poor';
        return 'Inefficient';
    };

    return (
        <aside
            style={{
                width: '280px',
                background: isDark ? '#080c14' : '#f8fafc',
                borderRight: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(15,23,42,0.08)',
                overflowY: 'auto',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
            }}
            className="fixed md:static top-[60px] bottom-0 left-0 z-[5] h-[calc(100vh-60px)] transition-all duration-300 ease-in-out animate-slide-in-left"
        >
            {/* Algorithm Info */}
            <Card isDark={isDark}>
                <div className="flex items-center gap-2 mb-3">
                    <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ background: accentColor, boxShadow: `0 0 8px ${accentColor}80` }}
                    />
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                        {algorithmInfoMap[algorithm].name}
                    </h3>
                </div>
                <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-muted)' }}>
                    {algorithmInfoMap[algorithm].description}
                </p>
                <div className="space-y-2">
                    {[
                        ['Time', algorithmInfoMap[algorithm].timeComplexity],
                        ['Space', algorithmInfoMap[algorithm].spaceComplexity],
                    ].map(([label, value]) => (
                        <div key={label} className="flex justify-between items-center">
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label} Complexity</span>
                            <span
                                className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md"
                                style={{
                                    background: `${accentColor}18`,
                                    border: `1px solid ${accentColor}30`,
                                    color: accentColor,
                                }}
                            >
                                {value}
                            </span>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Grid Size */}
            <Card isDark={isDark}>
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                    Grid Size
                </h3>
                <select
                    value={`${rows},${cols}`}
                    onChange={(e) => {
                        const [r, c] = e.target.value.split(',').map(Number);
                        handleSizeChange(r, c);
                    }}
                    disabled={isRunning}
                    style={{
                        width: '100%',
                        background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.05)',
                        border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(15,23,42,0.12)',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        fontSize: '13px',
                        color: 'var(--foreground)',
                        outline: 'none',
                        cursor: isRunning ? 'not-allowed' : 'pointer',
                        opacity: isRunning ? 0.5 : 1,
                    }}
                >
                    <option value="10,10">10 × 10</option>
                    <option value="15,15">15 × 15</option>
                    <option value="20,20">20 × 20</option>
                    <option value="25,25">25 × 25</option>
                    <option value="30,30">30 × 30</option>
                    <option value="50,50">50 × 50</option>
                </select>
                <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>Changing size resets the grid.</p>
            </Card>

            {/* Performance Metrics */}
            <Card isDark={isDark}>
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
                    Performance
                </h3>

                <div className="space-y-4">
                    {/* Nodes Explored */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Nodes Explored</span>
                            <span
                                className="text-sm font-bold font-mono"
                                style={{ color: isDone && metrics.isPathFound ? '#60a5fa' : 'var(--foreground)' }}
                            >
                                {metrics.nodesExplored}
                            </span>
                        </div>
                        <div
                            style={{
                                height: '4px',
                                borderRadius: '2px',
                                background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)',
                                overflow: 'hidden',
                            }}
                        >
                            <div
                                style={{
                                    height: '100%',
                                    width: `${Math.min(100, (metrics.nodesExplored / 400) * 100)}%`,
                                    background: 'linear-gradient(90deg, #3b82f6, #6366f1)',
                                    borderRadius: '2px',
                                    transition: 'width 0.4s ease',
                                }}
                            />
                        </div>
                    </div>

                    {/* Path Length */}
                    <div className="flex justify-between items-center">
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Path Length</span>
                        <span className="text-sm font-bold font-mono">
                            {isDone ? (
                                metrics.isPathFound
                                    ? <span style={{ color: '#10b981' }}>{metrics.pathLength}</span>
                                    : <span style={{ color: '#ef4444' }}>No path</span>
                            ) : (
                                <span style={{ color: 'var(--text-muted)' }}>—</span>
                            )}
                        </span>
                    </div>

                    {/* Execution Time */}
                    <div className="flex justify-between items-center">
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Execution Time</span>
                        <span className="text-sm font-bold font-mono" style={{ color: isDone ? '#818cf8' : 'var(--text-muted)' }}>
                            {isDone ? `${metrics.executionTime.toFixed(2)} ms` : '—'}
                        </span>
                    </div>

                    {/* Efficiency Score */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Efficiency Score</span>
                            <div className="flex items-center gap-2">
                                {effScore !== 'N/A' && (
                                    <span
                                        className="text-xs px-1.5 py-0.5 rounded font-medium"
                                        style={{
                                            background: `${getEfficiencyColor()}20`,
                                            color: getEfficiencyColor(),
                                            border: `1px solid ${getEfficiencyColor()}40`,
                                        }}
                                    >
                                        {getEfficiencyLabel()}
                                    </span>
                                )}
                                <span className="text-sm font-bold font-mono" style={{ color: getEfficiencyColor() }}>
                                    {effScore}
                                </span>
                            </div>
                        </div>
                        {effScore !== 'N/A' && (
                            <div
                                style={{
                                    height: '4px',
                                    borderRadius: '2px',
                                    background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)',
                                    overflow: 'hidden',
                                }}
                            >
                                <div
                                    style={{
                                        height: '100%',
                                        width: `${Math.min(100, 100 - Math.min(effNum * 10, 90))}%`,
                                        background: `linear-gradient(90deg, ${getEfficiencyColor()}, ${getEfficiencyColor()}aa)`,
                                        borderRadius: '2px',
                                        transition: 'width 0.5s ease',
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Status */}
                    <div
                        className="flex items-center justify-between p-2 rounded-lg"
                        style={{
                            background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.04)',
                        }}
                    >
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Status</span>
                        <div className="flex items-center gap-1.5">
                            <span
                                className="w-2 h-2 rounded-full"
                                style={{
                                    background: !isDone ? '#3b82f6' : metrics.isPathFound ? '#10b981' : '#ef4444',
                                    boxShadow: `0 0 6px ${!isDone ? '#3b82f680' : metrics.isPathFound ? '#10b98180' : '#ef444480'}`,
                                    animation: isRunning && !isDone ? 'pulse-ring 1.5s infinite' : 'none',
                                }}
                            />
                            <span
                                className="text-xs font-semibold"
                                style={{
                                    color: !isDone ? '#3b82f6' : metrics.isPathFound ? '#10b981' : '#ef4444',
                                }}
                            >
                                {!isDone
                                    ? isRunning ? 'Running' : 'Ready'
                                    : metrics.isPathFound ? 'Path found!' : 'No path'}
                            </span>
                        </div>
                    </div>
                </div>
            </Card>
        </aside>
    );
};

export default Sidebar;

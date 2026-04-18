import React, { useState } from 'react';
import { AlgorithmInfo, AlgorithmType } from "@/types";
import { RunRecord } from '@/hooks/useRunHistory';
import { PresetType } from '@/utils/gridUtils';

interface SidebarProps {
    algorithm: AlgorithmType;
    algorithmInfoMap: Record<AlgorithmType, AlgorithmInfo>;
    rows: number;
    cols: number;
    handleSizeChange: (rows: number, cols: number) => void;
    isRunning: boolean;
    isBusy: boolean;
    metrics: {
        nodesExplored: number;
        pathLength: number;
        executionTime: number;
        isPathFound: boolean;
    };
    isDone: boolean;
    getEfficiencyScore: () => string;
    isDark: boolean;
    allowDiagonals: boolean;
    setAllowDiagonals: (v: boolean) => void;
    loadPreset: (preset: PresetType) => void;
    onShareGrid: () => void;
    runHistory: RunRecord[];
    clearHistory: () => void;
}

const ALGO_COLORS: Record<string, string> = {
    astar: '#6366f1',
    dijkstra: '#06b6d4',
    bfs: '#10b981',
    dfs: '#f59e0b',
    greedy: '#f97316',
    bidirectional: '#ec4899',
};

const ALGO_SHORT: Record<string, string> = {
    astar: 'A*', dijkstra: 'DIJ', bfs: 'BFS', dfs: 'DFS', greedy: 'GRD', bidirectional: 'BI',
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

type Tab = 'algorithm' | 'grid' | 'stats';

const Sidebar: React.FC<SidebarProps> = ({
    algorithm, algorithmInfoMap, rows, cols, handleSizeChange,
    isRunning, isBusy, metrics, isDone, getEfficiencyScore, isDark,
    allowDiagonals, setAllowDiagonals, loadPreset, onShareGrid,
    runHistory, clearHistory,
}) => {
    const [activeTab, setActiveTab] = useState<Tab>('algorithm');

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

    const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
        {
            id: 'algorithm', label: 'Algorithm',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
                </svg>
            ),
        },
        {
            id: 'grid', label: 'Grid',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
            ),
        },
        {
            id: 'stats', label: 'Stats',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
        },
    ];

    return (
        <aside
            style={{
                width: '280px',
                background: isDark ? '#080c14' : '#f8fafc',
                borderRight: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(15,23,42,0.08)',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 0,
            }}
            className="fixed md:static top-[60px] bottom-0 left-0 z-[5] h-[calc(100vh-60px)] transition-all duration-300 ease-in-out animate-slide-in-left"
        >
            {/* Tab bar */}
            <div
                style={{
                    display: 'flex',
                    borderBottom: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(15,23,42,0.08)',
                    padding: '8px 12px 0',
                    gap: '2px',
                    flexShrink: 0,
                }}
            >
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '5px',
                            padding: '7px 4px',
                            fontSize: '11px',
                            fontWeight: activeTab === tab.id ? 600 : 400,
                            borderRadius: '8px 8px 0 0',
                            border: 'none',
                            borderBottom: activeTab === tab.id ? `2px solid ${accentColor}` : '2px solid transparent',
                            background: activeTab === tab.id
                                ? (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.05)')
                                : 'transparent',
                            color: activeTab === tab.id ? accentColor : 'var(--text-muted)',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                        }}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

                {/* ── ALGORITHM TAB ── */}
                {activeTab === 'algorithm' && (
                    <>
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

                        {/* Guarantees */}
                        <Card isDark={isDark}>
                            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                                Properties
                            </h3>
                            <div className="space-y-2">
                                {[
                                    { label: 'Optimal path', value: ['astar', 'dijkstra', 'bfs'].includes(algorithm) },
                                    { label: 'Complete', value: algorithm !== 'dfs' },
                                    { label: 'Uses heuristic', value: ['astar', 'greedy'].includes(algorithm) },
                                    { label: 'Weighted edges', value: ['astar', 'dijkstra', 'greedy'].includes(algorithm) },
                                ].map(({ label, value }) => (
                                    <div key={label} className="flex justify-between items-center">
                                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span>
                                        <span
                                            className="text-xs font-semibold px-2 py-0.5 rounded"
                                            style={{
                                                background: value ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                                                color: value ? '#10b981' : '#ef4444',
                                            }}
                                        >
                                            {value ? 'Yes' : 'No'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </>
                )}

                {/* ── GRID TAB ── */}
                {activeTab === 'grid' && (
                    <>
                        {/* Grid size */}
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
                                disabled={isBusy}
                                style={{
                                    width: '100%',
                                    background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.05)',
                                    border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(15,23,42,0.12)',
                                    borderRadius: '8px',
                                    padding: '8px 12px',
                                    fontSize: '13px',
                                    color: 'var(--foreground)',
                                    outline: 'none',
                                    cursor: isBusy ? 'not-allowed' : 'pointer',
                                    opacity: isBusy ? 0.5 : 1,
                                }}
                            >
                                <option value="10,10">10 × 10</option>
                                <option value="15,15">15 × 15</option>
                                <option value="20,20">20 × 20</option>
                                <option value="25,25">25 × 25</option>
                                <option value="30,30">30 × 30</option>
                                <option value="50,50">50 × 50</option>
                            </select>
                        </Card>

                        {/* Preset scenarios */}
                        <Card isDark={isDark}>
                            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                                Preset Scenarios
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                {([
                                    { id: 'empty',    label: 'Empty',    desc: 'Clean grid' },
                                    { id: 'diagonal', label: 'Diagonal', desc: 'Diagonal wall' },
                                    { id: 'zigzag',   label: 'Zigzag',   desc: 'Zigzag maze' },
                                    { id: 'rooms',    label: 'Rooms',    desc: 'Room layout' },
                                    { id: 'scatter',  label: 'Scatter',  desc: 'Random walls' },
                                ] as { id: PresetType; label: string; desc: string }[]).map(preset => (
                                    <button
                                        key={preset.id}
                                        onClick={() => !isBusy && loadPreset(preset.id)}
                                        disabled={isBusy}
                                        title={preset.desc}
                                        style={{
                                            borderRadius: '8px',
                                            padding: '8px',
                                            fontSize: '12px',
                                            fontWeight: 500,
                                            textAlign: 'left',
                                            background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.04)',
                                            border: isDark ? '1px solid rgba(255,255,255,0.09)' : '1px solid rgba(15,23,42,0.09)',
                                            color: 'var(--foreground)',
                                            cursor: isBusy ? 'not-allowed' : 'pointer',
                                            opacity: isBusy ? 0.5 : 1,
                                            transition: 'all 0.15s ease',
                                        }}
                                        className="hover:opacity-80 active:scale-95 transition-transform"
                                    >
                                        <div style={{ fontWeight: 600, marginBottom: '1px' }}>{preset.label}</div>
                                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{preset.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </Card>

                        {/* Options */}
                        <Card isDark={isDark}>
                            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                                Options
                            </h3>

                            {/* Diagonal movement toggle */}
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <div className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>Diagonal Movement</div>
                                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Allow 8-directional paths</div>
                                </div>
                                <button
                                    onClick={() => !isRunning && setAllowDiagonals(!allowDiagonals)}
                                    disabled={isRunning}
                                    style={{
                                        width: '40px',
                                        height: '22px',
                                        borderRadius: '11px',
                                        border: 'none',
                                        background: allowDiagonals ? accentColor : (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.15)'),
                                        cursor: isRunning ? 'not-allowed' : 'pointer',
                                        position: 'relative',
                                        transition: 'background 0.2s ease',
                                        flexShrink: 0,
                                    }}
                                    aria-label="Toggle diagonal movement"
                                >
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: '3px',
                                            left: allowDiagonals ? '21px' : '3px',
                                            width: '16px',
                                            height: '16px',
                                            borderRadius: '50%',
                                            background: 'white',
                                            transition: 'left 0.2s ease',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                                        }}
                                    />
                                </button>
                            </div>

                            {/* Share button */}
                            <button
                                onClick={onShareGrid}
                                style={{
                                    width: '100%',
                                    borderRadius: '8px',
                                    padding: '9px',
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '7px',
                                    background: isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.1)',
                                    border: '1px solid rgba(99,102,241,0.3)',
                                    color: '#818cf8',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                }}
                                className="hover:opacity-80 active:scale-95 transition-transform"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                                Copy Share URL
                            </button>
                        </Card>
                    </>
                )}

                {/* ── STATS TAB ── */}
                {activeTab === 'stats' && (
                    <>
                        {/* Current run metrics */}
                        <Card isDark={isDark}>
                            <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
                                Current Run
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Nodes Explored</span>
                                        <span className="text-sm font-bold font-mono" style={{ color: isDone && metrics.isPathFound ? '#60a5fa' : 'var(--foreground)' }}>
                                            {metrics.nodesExplored}
                                        </span>
                                    </div>
                                    <div style={{ height: '4px', borderRadius: '2px', background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)', overflow: 'hidden' }}>
                                        <div style={{
                                            height: '100%',
                                            width: `${Math.min(100, (metrics.nodesExplored / 400) * 100)}%`,
                                            background: 'linear-gradient(90deg, #3b82f6, #6366f1)',
                                            borderRadius: '2px',
                                            transition: 'width 0.4s ease',
                                        }} />
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Path Length</span>
                                    <span className="text-sm font-bold font-mono">
                                        {isDone
                                            ? metrics.isPathFound
                                                ? <span style={{ color: '#10b981' }}>{metrics.pathLength}</span>
                                                : <span style={{ color: '#ef4444' }}>No path</span>
                                            : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Execution Time</span>
                                    <span className="text-sm font-bold font-mono" style={{ color: isDone ? '#818cf8' : 'var(--text-muted)' }}>
                                        {isDone ? `${metrics.executionTime.toFixed(2)} ms` : '—'}
                                    </span>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Efficiency Score</span>
                                        <div className="flex items-center gap-2">
                                            {effScore !== 'N/A' && (
                                                <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{
                                                    background: `${getEfficiencyColor()}20`,
                                                    color: getEfficiencyColor(),
                                                    border: `1px solid ${getEfficiencyColor()}40`,
                                                }}>
                                                    {getEfficiencyLabel()}
                                                </span>
                                            )}
                                            <span className="text-sm font-bold font-mono" style={{ color: getEfficiencyColor() }}>
                                                {effScore}
                                            </span>
                                        </div>
                                    </div>
                                    {effScore !== 'N/A' && (
                                        <div style={{ height: '4px', borderRadius: '2px', background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)', overflow: 'hidden' }}>
                                            <div style={{
                                                height: '100%',
                                                width: `${Math.min(100, 100 - Math.min(effNum * 10, 90))}%`,
                                                background: `linear-gradient(90deg, ${getEfficiencyColor()}, ${getEfficiencyColor()}aa)`,
                                                borderRadius: '2px',
                                                transition: 'width 0.5s ease',
                                            }} />
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between p-2 rounded-lg" style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.04)' }}>
                                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Status</span>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full" style={{
                                            background: !isDone ? '#3b82f6' : metrics.isPathFound ? '#10b981' : '#ef4444',
                                            boxShadow: `0 0 6px ${!isDone ? '#3b82f680' : metrics.isPathFound ? '#10b98180' : '#ef444480'}`,
                                        }} />
                                        <span className="text-xs font-semibold" style={{ color: !isDone ? '#3b82f6' : metrics.isPathFound ? '#10b981' : '#ef4444' }}>
                                            {!isDone ? (isRunning ? 'Running' : 'Ready') : metrics.isPathFound ? 'Path found!' : 'No path'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Run history */}
                        <Card isDark={isDark}>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                                    Run History
                                </h3>
                                {runHistory.length > 0 && (
                                    <button
                                        onClick={clearHistory}
                                        style={{ fontSize: '10px', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                                        className="hover:opacity-70"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>

                            {runHistory.length === 0 ? (
                                <div className="text-center py-4" style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                                    Run an algorithm to see history
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {runHistory.map((run, i) => {
                                        const color = ALGO_COLORS[run.algorithm] ?? '#6366f1';
                                        return (
                                            <div
                                                key={run.id}
                                                style={{
                                                    borderRadius: '8px',
                                                    padding: '8px 10px',
                                                    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.03)',
                                                    border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(15,23,42,0.07)',
                                                    display: 'grid',
                                                    gridTemplateColumns: '1fr 1fr 1fr',
                                                    gap: '4px',
                                                }}
                                            >
                                                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                                    <span
                                                        className="text-xs font-bold font-mono px-1.5 py-0.5 rounded"
                                                        style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}
                                                    >
                                                        {ALGO_SHORT[run.algorithm] ?? run.algorithm.toUpperCase()}
                                                    </span>
                                                    <span
                                                        className="text-xs font-semibold"
                                                        style={{ color: run.isPathFound ? '#10b981' : '#ef4444' }}
                                                    >
                                                        {run.isPathFound ? '✓ Found' : '✗ No path'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="text-xs font-mono font-bold" style={{ color: 'var(--foreground)' }}>{run.nodesExplored}</div>
                                                    <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>nodes</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs font-mono font-bold" style={{ color: 'var(--foreground)' }}>{run.isPathFound ? run.pathLength : '—'}</div>
                                                    <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>length</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs font-mono font-bold" style={{ color: 'var(--foreground)' }}>{run.executionTime.toFixed(1)}ms</div>
                                                    <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>time</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </Card>
                    </>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;

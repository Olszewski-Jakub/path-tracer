import React from 'react';

interface LegendItem {
    label: string;
    color: string;
}

interface ControlPanelProps {
    isRunning: boolean;
    isPaused: boolean;
    isDone: boolean;
    isRevealingPath: boolean;
    isMazeGenerating: boolean;
    speed: number;
    handleStart: () => void;
    handlePause: () => void;
    handleResume: () => void;
    handleStop: () => void;
    handleStep: () => void;
    handleClear: () => void;
    handleReset: () => void;
    handleGenerateMaze: () => void;
    setSpeed: (speed: number) => void;
    isDark: boolean;
    sidebarOpen: boolean;
    legendItems?: LegendItem[];
}

interface BtnDef {
    label: string;
    busyLabel?: string;
    icon: React.ReactNode;
    busyIcon?: React.ReactNode;
    onClick: () => void;
    disabled: boolean;
    activeStyle: React.CSSProperties;
    isBusy?: boolean;
}

const SpinnerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
    </svg>
);

const ControlPanel: React.FC<ControlPanelProps> = ({
    isRunning, isPaused, isDone, isRevealingPath, isMazeGenerating,
    speed, handleStart, handlePause, handleResume, handleStop,
    handleStep, handleClear, handleReset, handleGenerateMaze,
    setSpeed, isDark, sidebarOpen,
}) => {
    const busy = isRunning || isRevealingPath || isMazeGenerating;

    const disabledStyle: React.CSSProperties = {
        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.05)',
        border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(15,23,42,0.07)',
        color: isDark ? '#475569' : '#94a3b8',
        cursor: 'not-allowed',
    };

    const playLabel = !isRunning && !isDone ? 'Start' : isPaused ? 'Resume' : 'Pause';
    const playDisabled = isDone || isMazeGenerating || isRevealingPath;
    const playStyle: React.CSSProperties = playDisabled ? disabledStyle
        : isRunning && !isPaused ? {
            background: 'linear-gradient(135deg, #d97706, #f59e0b)',
            border: '1px solid rgba(245,158,11,0.4)',
            boxShadow: '0 0 14px rgba(245,158,11,0.35)',
            color: 'white',
        } : {
            background: 'linear-gradient(135deg, #059669, #10b981)',
            border: '1px solid rgba(16,185,129,0.4)',
            boxShadow: '0 0 14px rgba(16,185,129,0.35)',
            color: 'white',
        };

    const PlayIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
            {!isRunning && !isDone
                ? <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></>
                : isPaused
                    ? <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></>
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            }
        </svg>
    );

    const buttons: BtnDef[] = [
        {
            label: playLabel,
            icon: <PlayIcon />,
            onClick: !isRunning && !isDone ? handleStart : isPaused ? handleResume : handlePause,
            disabled: playDisabled,
            activeStyle: playStyle,
        },
        {
            label: 'Stop',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
            ),
            onClick: handleStop,
            disabled: (!isRunning && !isPaused) || isMazeGenerating,
            activeStyle: {
                background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                border: '1px solid rgba(239,68,68,0.4)',
                boxShadow: '0 0 14px rgba(239,68,68,0.3)',
                color: 'white',
            },
        },
        {
            label: 'Step',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
            ),
            onClick: handleStep,
            disabled: busy || isDone,
            activeStyle: {
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                border: '1px solid rgba(168,85,247,0.4)',
                boxShadow: '0 0 14px rgba(168,85,247,0.3)',
                color: 'white',
            },
        },
        {
            label: 'Clear',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            ),
            onClick: handleClear,
            disabled: busy,
            activeStyle: {
                background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.07)',
                border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(15,23,42,0.12)',
                color: isDark ? '#cbd5e1' : '#475569',
            },
        },
        {
            label: 'Reset',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            ),
            onClick: handleReset,
            disabled: busy,
            activeStyle: {
                background: 'linear-gradient(135deg, #0369a1, #0ea5e9)',
                border: '1px solid rgba(14,165,233,0.4)',
                boxShadow: '0 0 14px rgba(14,165,233,0.25)',
                color: 'white',
            },
        },
        {
            label: isMazeGenerating ? 'Generating…' : 'Generate Maze',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
            ),
            busyIcon: <SpinnerIcon />,
            onClick: handleGenerateMaze,
            disabled: isRunning || isRevealingPath || isMazeGenerating,
            isBusy: isMazeGenerating,
            activeStyle: isMazeGenerating ? {
                background: 'linear-gradient(135deg, #065f46, #10b981)',
                border: '1px solid rgba(16,185,129,0.5)',
                boxShadow: '0 0 16px rgba(16,185,129,0.4)',
                color: 'white',
            } : {
                background: 'linear-gradient(135deg, #065f46, #10b981)',
                border: '1px solid rgba(16,185,129,0.35)',
                boxShadow: '0 0 14px rgba(16,185,129,0.25)',
                color: 'white',
            },
        },
    ];

    return (
        <div
            className="px-4 py-3"
            style={{
                background: isDark ? 'rgba(8,12,20,0.8)' : 'rgba(248,250,252,0.8)',
                borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(15,23,42,0.07)',
            }}
        >
            <div className={`flex flex-wrap items-center gap-2 ${!sidebarOpen ? 'justify-center' : ''}`}>
                {buttons.map((btn) => (
                    <button
                        key={btn.label.replace('…', '')}
                        onClick={btn.onClick}
                        disabled={btn.disabled}
                        style={{
                            borderRadius: '10px',
                            padding: '7px 14px',
                            fontSize: '13px',
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'opacity 0.2s ease',
                            ...(btn.disabled && !btn.isBusy ? disabledStyle : btn.activeStyle),
                        }}
                        className="active:scale-95 transition-transform"
                    >
                        {btn.isBusy && btn.busyIcon ? btn.busyIcon : btn.icon}
                        {btn.label}
                    </button>
                ))}

                {/* Speed slider */}
                <div
                    className="flex items-center gap-3 ml-2"
                    style={{
                        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.04)',
                        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(15,23,42,0.08)',
                        borderRadius: '10px',
                        padding: '6px 14px',
                        minWidth: '180px',
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-xs font-medium flex-shrink-0" style={{ color: 'var(--text-muted)' }}>Speed</span>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={speed}
                        onChange={(e) => setSpeed(parseInt(e.target.value))}
                        disabled={isRunning && !isPaused}
                        className="flex-1"
                        style={{ minWidth: '80px' }}
                    />
                    <span className="text-xs font-mono font-bold w-4 text-right flex-shrink-0"
                        style={{ color: 'var(--accent-primary)' }}>
                        {speed}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ControlPanel;

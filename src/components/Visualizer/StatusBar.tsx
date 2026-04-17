import React from 'react';

interface StatusBarProps {
    isDark: boolean;
    currentStep: any;
    getStatusMessage: () => React.ReactNode;
    legendItems: Array<{
        label: string;
        color: string;
    }>;
}

const LEGEND_DOT_STYLES: Record<string, React.CSSProperties> = {
    'bg-green-500': { background: '#10b981', boxShadow: '0 0 5px rgba(16,185,129,0.6)' },
    'bg-red-500': { background: '#ef4444', boxShadow: '0 0 5px rgba(239,68,68,0.6)' },
    'bg-gray-200': { background: '#e2e8f0' },
    'bg-gray-800': { background: '#1e293b' },
    'bg-blue-400': { background: '#60a5fa', boxShadow: '0 0 5px rgba(96,165,250,0.5)' },
    'bg-yellow-400': { background: '#f59e0b', boxShadow: '0 0 5px rgba(245,158,11,0.6)' },
    'bg-purple-500': { background: '#a855f7', boxShadow: '0 0 5px rgba(168,85,247,0.6)' },
    'bg-cyan-400': { background: '#22d3ee', boxShadow: '0 0 5px rgba(34,211,238,0.5)' },
};

function getLegendDotStyle(colorClass: string): React.CSSProperties {
    const base = colorClass.split(' ')[0];
    return LEGEND_DOT_STYLES[base] ?? { background: '#94a3b8' };
}

const StatusBar: React.FC<StatusBarProps> = ({ isDark, currentStep, getStatusMessage, legendItems }) => {
    const message = currentStep ? getStatusMessage() : null;

    return (
        <div
            style={{
                padding: '10px 16px',
                background: isDark ? 'rgba(13,20,34,0.6)' : 'rgba(241,245,249,0.8)',
                borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(15,23,42,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                minHeight: '42px',
            }}
        >
            {/* Status message */}
            <div className="flex items-center gap-2 min-w-0">
                {currentStep && (
                    <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{
                            background: '#6366f1',
                            boxShadow: '0 0 6px rgba(99,102,241,0.7)',
                            animation: 'pulse-ring 1.5s infinite',
                        }}
                    />
                )}
                <span
                    className="text-sm truncate"
                    style={{ color: currentStep ? 'var(--foreground)' : 'var(--text-muted)' }}
                >
                    {message ?? 'Click on the grid to create walls, then press Start.'}
                </span>
            </div>

            {/* Mobile legend dots */}
            <div className="flex lg:hidden items-center gap-1.5 flex-shrink-0">
                {legendItems.map((item) => (
                    <span
                        key={item.label}
                        className="w-2.5 h-2.5 rounded-full"
                        style={getLegendDotStyle(item.color)}
                        title={item.label}
                    />
                ))}
            </div>
        </div>
    );
};

export default StatusBar;

import React, { memo, useEffect, useRef, useState } from 'react';
import { Cell as CellType, CellPosition } from '../../types';

interface CellProps {
    cell: CellType;
    onMouseDown: (position: CellPosition) => void;
    onMouseEnter: (position: CellPosition) => void;
    onMouseUp: () => void;
    isDark?: boolean;
}

// Types that trigger a CSS animation when entered
const ANIMATED_TYPES = new Set(['visited', 'path', 'current', 'frontier', 'wall']);

// Return the CSS class responsible for the cell's animation
function getAnimationClass(type: string): string {
    switch (type) {
        case 'visited':  return 'animate-visit-pop';
        case 'frontier': return 'animate-frontier-breath';
        case 'current':  return 'animate-current-spotlight';
        case 'path':     return 'animate-path-reveal';
        case 'wall':     return 'animate-wall-slam';
        default:         return '';
    }
}

// Outer (stable, never re-keyed) fill styles per type
function getCellBg(type: string, isDark: boolean): React.CSSProperties {
    switch (type) {
        case 'start':
            return {
                background: 'linear-gradient(135deg, #059669, #10b981)',
                boxShadow: '0 0 10px rgba(16,185,129,0.6), 0 0 20px rgba(16,185,129,0.2)',
                border: '1px solid rgba(16,185,129,0.4)',
            };
        case 'end':
            return {
                background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                boxShadow: '0 0 10px rgba(239,68,68,0.6), 0 0 20px rgba(239,68,68,0.2)',
                border: '1px solid rgba(239,68,68,0.4)',
            };
        case 'wall':
            return {
                background: isDark
                    ? 'linear-gradient(135deg, #1e293b, #273449)'
                    : 'linear-gradient(135deg, #1e293b, #0f172a)',
                border: isDark
                    ? '1px solid rgba(255,255,255,0.08)'
                    : '1px solid rgba(15,23,42,0.3)',
            };
        case 'visited':
            return {
                background: isDark
                    ? 'linear-gradient(135deg, rgba(37,99,235,0.8), rgba(59,130,246,0.65))'
                    : 'linear-gradient(135deg, rgba(37,99,235,0.7), rgba(99,158,246,0.6))',
                border: '1px solid rgba(59,130,246,0.3)',
            };
        case 'frontier':
            return {
                background: isDark
                    ? 'linear-gradient(135deg, rgba(8,145,178,0.8), rgba(6,182,212,0.65))'
                    : 'linear-gradient(135deg, rgba(8,145,178,0.7), rgba(6,182,212,0.6))',
                border: '1px solid rgba(6,182,212,0.35)',
            };
        case 'path':
            return {
                background: 'linear-gradient(135deg, #d97706, #f59e0b)',
                boxShadow: '0 0 10px rgba(245,158,11,0.7), 0 0 20px rgba(245,158,11,0.3)',
                border: '1px solid rgba(245,158,11,0.5)',
            };
        case 'current':
            return {
                background: 'linear-gradient(135deg, #9333ea, #a855f7)',
                border: '1px solid rgba(168,85,247,0.5)',
            };
        default:
            return {
                background: isDark ? '#0d1422' : '#f8fafc',
                border: isDark
                    ? '1px solid rgba(255,255,255,0.05)'
                    : '1px solid rgba(15,23,42,0.08)',
                transition: 'background 0.12s ease',
            };
    }
}

function getTooltipText(cell: CellType): string {
    switch (cell.type) {
        case 'start':    return 'Start Node';
        case 'end':      return 'End Node';
        case 'wall':     return 'Wall';
        case 'visited':  return `Visited (dist: ${cell.distance === Infinity ? '∞' : cell.distance})`;
        case 'path':     return 'Path';
        case 'current':  return 'Current Node';
        case 'frontier': {
            const f = cell.fScore === Infinity ? '∞' : (typeof cell.fScore === 'number' ? cell.fScore.toFixed(1) : 'N/A');
            const g = cell.gScore === Infinity ? '∞' : (typeof cell.gScore === 'number' ? cell.gScore : 'N/A');
            return `Frontier (f=${f}, g=${g})`;
        }
        default: return 'Empty';
    }
}

const Cell: React.FC<CellProps> = ({ cell, onMouseDown, onMouseEnter, onMouseUp, isDark = false }) => {
    const { position, type } = cell;

    // Track type changes so we can bump the animationKey to restart CSS animations
    const prevTypeRef = useRef<string | undefined>(undefined);
    const [animationKey, setAnimationKey] = useState(0);

    useEffect(() => {
        if (prevTypeRef.current !== type) {
            if (ANIMATED_TYPES.has(type)) {
                setAnimationKey(k => k + 1);
            }
            prevTypeRef.current = type;
        }
    }, [type]);

    const bgStyle = getCellBg(type, isDark);
    const animClass = getAnimationClass(type);

    return (
        <div
            style={{
                width: '24px',
                height: '24px',
                position: 'relative',
                cursor: 'pointer',
                flexShrink: 0,
            }}
            onMouseDown={() => onMouseDown(position)}
            onMouseEnter={() => onMouseEnter(position)}
            onMouseUp={onMouseUp}
            title={getTooltipText(cell)}
        >
            {/* Inner div is re-keyed on every animated type change → restarts CSS animation */}
            <div
                key={animationKey}
                className={animClass}
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    willChange: 'transform',
                    ...bgStyle,
                }}
            >
                {type === 'start' && (
                    <span style={{ color: 'white', fontSize: '10px', fontWeight: 700, lineHeight: 1, textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>S</span>
                )}
                {type === 'end' && (
                    <span style={{ color: 'white', fontSize: '10px', fontWeight: 700, lineHeight: 1, textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>E</span>
                )}
            </div>
        </div>
    );
};

export default memo(Cell, (prev, next) => {
    if (prev.cell.type !== next.cell.type) return false;
    if (prev.cell.position.row !== next.cell.position.row) return false;
    if (prev.cell.position.col !== next.cell.position.col) return false;
    if (prev.isDark !== next.isDark) return false;
    return true;
});

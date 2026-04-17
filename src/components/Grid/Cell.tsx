import React, { memo } from 'react';
import { Cell as CellType, CellPosition } from '../../types';

interface CellProps {
  cell: CellType;
  onMouseDown: (position: CellPosition) => void;
  onMouseEnter: (position: CellPosition) => void;
  onMouseUp: () => void;
  isDark?: boolean;
}

const CELL_STYLES: Record<string, React.CSSProperties> = {
  start: {
    background: 'linear-gradient(135deg, #059669, #10b981)',
    boxShadow: '0 0 10px rgba(16,185,129,0.6), 0 0 20px rgba(16,185,129,0.2)',
    border: '1px solid rgba(16,185,129,0.4)',
  },
  end: {
    background: 'linear-gradient(135deg, #dc2626, #ef4444)',
    boxShadow: '0 0 10px rgba(239,68,68,0.6), 0 0 20px rgba(239,68,68,0.2)',
    border: '1px solid rgba(239,68,68,0.4)',
  },
  path: {
    background: 'linear-gradient(135deg, #d97706, #f59e0b)',
    boxShadow: '0 0 8px rgba(245,158,11,0.7), 0 0 16px rgba(245,158,11,0.3)',
    border: '1px solid rgba(245,158,11,0.5)',
  },
  current: {
    background: 'linear-gradient(135deg, #9333ea, #a855f7)',
    boxShadow: '0 0 10px rgba(168,85,247,0.7), 0 0 20px rgba(168,85,247,0.3)',
    border: '1px solid rgba(168,85,247,0.5)',
    animation: 'pulse-ring 1.2s infinite',
  },
};

const Cell: React.FC<CellProps> = ({
  cell,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  isDark = false,
}) => {
  const { position, type } = cell;

  const getCellStyle = (): React.CSSProperties => {
    switch (type) {
      case 'start':
        return CELL_STYLES.start;
      case 'end':
        return CELL_STYLES.end;
      case 'wall':
        return {
          background: isDark
            ? 'linear-gradient(135deg, #1e293b, #273449)'
            : 'linear-gradient(135deg, #1e293b, #0f172a)',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(15,23,42,0.3)',
        };
      case 'visited':
        return {
          background: isDark
            ? 'linear-gradient(135deg, rgba(37,99,235,0.75), rgba(59,130,246,0.6))'
            : 'linear-gradient(135deg, rgba(37,99,235,0.65), rgba(99,158,246,0.55))',
          border: '1px solid rgba(59,130,246,0.3)',
          boxShadow: '0 0 4px rgba(59,130,246,0.2)',
        };
      case 'frontier':
        return {
          background: isDark
            ? 'linear-gradient(135deg, rgba(8,145,178,0.75), rgba(6,182,212,0.6))'
            : 'linear-gradient(135deg, rgba(8,145,178,0.65), rgba(6,182,212,0.55))',
          border: '1px solid rgba(6,182,212,0.35)',
          boxShadow: '0 0 6px rgba(6,182,212,0.3)',
        };
      case 'path':
        return CELL_STYLES.path;
      case 'current':
        return CELL_STYLES.current;
      default:
        return {
          background: isDark ? '#0d1422' : '#f8fafc',
          border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(15,23,42,0.08)',
        };
    }
  };

  const getTooltipText = (): string => {
    switch (type) {
      case 'start': return 'Start Node';
      case 'end': return 'End Node';
      case 'wall': return 'Wall';
      case 'visited': return `Visited (Distance: ${cell.distance === Infinity ? '∞' : cell.distance})`;
      case 'path': return 'Path';
      case 'current': return 'Current Node';
      case 'frontier': {
        const fScore = cell.fScore === Infinity ? '∞' : (typeof cell.fScore === 'number' ? cell.fScore.toFixed(1) : 'N/A');
        const gScore = cell.gScore === Infinity ? '∞' : (typeof cell.gScore === 'number' ? cell.gScore : 'N/A');
        return `Frontier (f=${fScore}, g=${gScore})`;
      }
      default: return 'Empty';
    }
  };

  return (
    <div
      style={{
        width: '24px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.15s ease',
        cursor: 'pointer',
        position: 'relative',
        ...getCellStyle(),
      }}
      onMouseDown={() => onMouseDown(position)}
      onMouseEnter={() => onMouseEnter(position)}
      onMouseUp={onMouseUp}
      title={getTooltipText()}
    >
      {type === 'start' && (
        <span className="text-white font-bold" style={{ fontSize: '10px', lineHeight: 1, textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>S</span>
      )}
      {type === 'end' && (
        <span className="text-white font-bold" style={{ fontSize: '10px', lineHeight: 1, textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>E</span>
      )}
    </div>
  );
};

export default memo(Cell, (prevProps, nextProps) => {
  if (prevProps.cell.type !== nextProps.cell.type) return false;
  if (prevProps.cell.position.row !== nextProps.cell.position.row || prevProps.cell.position.col !== nextProps.cell.position.col) return false;
  if (prevProps.isDark !== nextProps.isDark) return false;
  return true;
});

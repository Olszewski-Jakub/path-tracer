import React, { useState, useCallback, useRef } from 'react';
import Cell from './Cell';
import { GridMatrix, CellPosition } from '@/types';

interface GridProps {
    grid: GridMatrix;
    onCellChange: (position: CellPosition) => void;
    isDisabled: boolean;
    isDark?: boolean;
}

const Grid: React.FC<GridProps> = ({
    grid,
    onCellChange,
    isDisabled,
    isDark = false,
}) => {
    const [isMousePressed, setIsMousePressed] = useState(false);
    const gridRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = useCallback(
        (position: CellPosition) => {
            if (isDisabled) return;
            setIsMousePressed(true);
            onCellChange(position);
        },
        [onCellChange, isDisabled]
    );

    const handleMouseEnter = useCallback(
        (position: CellPosition) => {
            if (isDisabled) return;
            if (isMousePressed) {
                onCellChange(position);
            }
        },
        [isMousePressed, onCellChange, isDisabled]
    );

    const handleMouseUp = useCallback(() => {
        setIsMousePressed(false);
    }, []);

    React.useEffect(() => {
        const handleGlobalMouseUp = () => setIsMousePressed(false);
        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }, []);

    return (
        <div
            style={{
                padding: '16px',
                borderRadius: '12px',
                background: isDark
                    ? 'linear-gradient(135deg, #080c14 0%, #0d1422 100%)'
                    : 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(15,23,42,0.1)',
                boxShadow: isDark
                    ? 'inset 0 1px 0 rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.4)'
                    : 'inset 0 1px 0 rgba(255,255,255,0.8), 0 4px 24px rgba(15,23,42,0.08)',
                overflow: 'auto',
            }}
            ref={gridRef}
        >
            <div
                style={{
                    display: 'grid',
                    gap: '1px',
                    gridTemplateColumns: `repeat(${grid[0].length}, 24px)`,
                    gridTemplateRows: `repeat(${grid.length}, 24px)`,
                    cursor: isDisabled ? 'not-allowed' : 'crosshair',
                    opacity: isDisabled ? 0.85 : 1,
                    transition: 'opacity 0.2s ease',
                }}
            >
                {grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <Cell
                            key={`${rowIndex}-${colIndex}`}
                            cell={cell}
                            onMouseDown={handleMouseDown}
                            onMouseEnter={handleMouseEnter}
                            onMouseUp={handleMouseUp}
                            isDark={isDark}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default Grid;

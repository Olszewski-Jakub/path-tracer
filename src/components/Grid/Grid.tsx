import React, { useState, useCallback, useRef } from 'react';
import Cell from './Cell';
import { GridMatrix, CellPosition } from '@/types';

interface GridProps {
    grid: GridMatrix;
    onCellChange: (position: CellPosition) => void;
    onEraseCell?: (position: CellPosition) => void;
    onNodeMove?: (type: 'start' | 'end', from: CellPosition, to: CellPosition) => void;
    isDisabled: boolean;
    drawMode?: 'wall' | 'erase';
    isDark?: boolean;
}

const CELL_SIZE = 24;
const CELL_GAP = 1;

const Grid: React.FC<GridProps> = ({
    grid, onCellChange, onEraseCell, onNodeMove,
    isDisabled, drawMode = 'wall', isDark = false,
}) => {
    const [isMousePressed, setIsMousePressed] = useState(false);
    const [draggingNode, setDraggingNode] = useState<'start' | 'end' | null>(null);
    const [dragPos, setDragPos] = useState<CellPosition | null>(null);
    const [dragOrigin, setDragOrigin] = useState<CellPosition | null>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = useCallback(
        (position: CellPosition) => {
            if (isDisabled) return;
            const cell = grid[position.row]?.[position.col];
            if (!cell) return;

            if (cell.type === 'start' || cell.type === 'end') {
                setDraggingNode(cell.type);
                setDragOrigin(position);
                setDragPos(position);
                return;
            }

            setIsMousePressed(true);
            if (drawMode === 'erase' && onEraseCell) {
                onEraseCell(position);
            } else {
                onCellChange(position);
            }
        },
        [grid, onCellChange, onEraseCell, isDisabled, drawMode]
    );

    const handleMouseEnter = useCallback(
        (position: CellPosition) => {
            if (isDisabled) return;

            if (draggingNode) {
                const cell = grid[position.row]?.[position.col];
                // Don't drag over the other special node
                if (cell && cell.type !== (draggingNode === 'start' ? 'end' : 'start')) {
                    setDragPos(position);
                }
                return;
            }

            if (!isMousePressed) return;
            const cell = grid[position.row]?.[position.col];
            if (!cell || cell.type === 'start' || cell.type === 'end') return;
            if (drawMode === 'erase' && onEraseCell) {
                onEraseCell(position);
            } else {
                onCellChange(position);
            }
        },
        [isMousePressed, draggingNode, grid, onCellChange, onEraseCell, isDisabled, drawMode]
    );

    const handleMouseUp = useCallback(
        (position?: CellPosition) => {
            if (draggingNode && dragPos && dragOrigin) {
                const moved = dragPos.row !== dragOrigin.row || dragPos.col !== dragOrigin.col;
                if (moved && onNodeMove) {
                    onNodeMove(draggingNode, dragOrigin, dragPos);
                }
                setDraggingNode(null);
                setDragPos(null);
                setDragOrigin(null);
            }
            setIsMousePressed(false);
        },
        [draggingNode, dragPos, dragOrigin, onNodeMove]
    );

    React.useEffect(() => {
        const up = () => handleMouseUp();
        window.addEventListener('mouseup', up);
        return () => window.removeEventListener('mouseup', up);
    }, [handleMouseUp]);

    const cols = grid[0]?.length ?? 0;
    const rows = grid.length;

    return (
        <div
            ref={gridRef}
            style={{
                position: 'relative',
                padding: '16px',
                borderRadius: '12px',
                background: isDark
                    ? 'linear-gradient(135deg, #080c14 0%, #0d1422 100%)'
                    : 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                border: isDark
                    ? '1px solid rgba(255,255,255,0.06)'
                    : '1px solid rgba(15,23,42,0.1)',
                boxShadow: isDark
                    ? 'inset 0 1px 0 rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.4)'
                    : 'inset 0 1px 0 rgba(255,255,255,0.8), 0 4px 24px rgba(15,23,42,0.08)',
                overflow: 'auto',
            }}
        >
            {/* Dot pattern overlay */}
            <div
                className="grid-dot-pattern"
                style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '12px',
                    pointerEvents: 'none',
                    zIndex: 0,
                }}
            />

            {/* Cell grid */}
            <div
                style={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'grid',
                    gap: `${CELL_GAP}px`,
                    gridTemplateColumns: `repeat(${cols}, ${CELL_SIZE}px)`,
                    gridTemplateRows: `repeat(${rows}, ${CELL_SIZE}px)`,
                    cursor: isDisabled ? 'not-allowed' : draggingNode ? 'grabbing' : drawMode === 'erase' ? 'cell' : 'crosshair',
                    opacity: isDisabled ? 0.85 : 1,
                    transition: 'opacity 0.2s ease',
                    userSelect: 'none',
                }}
            >
                {grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => {
                        const isGhostTarget = draggingNode !== null &&
                            dragPos?.row === rowIndex && dragPos?.col === colIndex &&
                            (dragOrigin?.row !== rowIndex || dragOrigin?.col !== colIndex);

                        return (
                            <Cell
                                key={`${rowIndex}-${colIndex}`}
                                cell={cell}
                                onMouseDown={handleMouseDown}
                                onMouseEnter={handleMouseEnter}
                                onMouseUp={() => handleMouseUp({ row: rowIndex, col: colIndex })}
                                isDark={isDark}
                                isDragging={draggingNode !== null && cell.type === draggingNode}
                                isGhostTarget={isGhostTarget}
                                ghostType={draggingNode ?? undefined}
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Grid;

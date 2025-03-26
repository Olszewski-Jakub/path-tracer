import React, { useState, useCallback, useRef } from 'react';
import Cell from './Cell';
import { GridMatrix, CellPosition } from '@/types';

/**
 * React functional component representing a grid of cells.
 *
 * @param {GridProps} props - The properties passed to the component.
 * @param {GridMatrix} props.grid - The grid data representing the map with cells.
 * @param {function} props.onCellChange - Function to handle cell change events.
 * @param {boolean} props.isDisabled - Flag to indicate if the grid is disabled.
 * @param {boolean} [props.isDark=false] - Optional flag to indicate if the dark theme is enabled.
 * @returns {JSX.Element} The rendered grid component.
 */
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
                                       isDark = false
                                   }) => {
    const [isMousePressed, setIsMousePressed] = useState(false);
    const gridRef = useRef<HTMLDivElement>(null);

    /**
     * Handles the mouse down event on a cell.
     *
     * @param {CellPosition} position - The position of the cell.
     */
    const handleMouseDown = useCallback(
        (position: CellPosition) => {
            if (isDisabled) return;

            setIsMousePressed(true);
            onCellChange(position);
        },
        [onCellChange, isDisabled]
    );

    /**
     * Handles the mouse enter event on a cell.
     *
     * @param {CellPosition} position - The position of the cell.
     */
    const handleMouseEnter = useCallback(
        (position: CellPosition) => {
            if (isDisabled) return;

            if (isMousePressed) {
                onCellChange(position);
            }
        },
        [isMousePressed, onCellChange, isDisabled]
    );

    /**
     * Handles the mouse up event.
     */
    const handleMouseUp = useCallback(() => {
        setIsMousePressed(false);
    }, []);

    /**
     * Adds a global mouse up event listener to handle mouse up events outside the grid.
     */
    React.useEffect(() => {
        const handleGlobalMouseUp = () => {
            setIsMousePressed(false);
        };

        window.addEventListener('mouseup', handleGlobalMouseUp);

        return () => {
            window.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, []);

    return (
        <div
            className={`grid-container p-4 overflow-auto rounded-lg shadow-md ${
                isDark ? 'bg-gray-800' : 'bg-gray-50'
            }`}
            ref={gridRef}
        >
            <div
                className={`grid gap-0 ${
                    isDisabled
                        ? 'cursor-not-allowed opacity-80'
                        : 'cursor-pointer'
                }`}
                style={{
                    gridTemplateColumns: `repeat(${grid[0].length}, 24px)`,
                    gridTemplateRows: `repeat(${grid.length}, 24px)`,
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
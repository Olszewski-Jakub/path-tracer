import { useState, useCallback, useRef, useEffect } from 'react';
import {
    createEmptyGrid,
    setStartAndEndPoints,
    toggleCellType,
    clearPathAndVisited,
    findCellByType,
    generateRecursiveBacktrackingMaze,
    MazeStep,
} from '@/utils/gridUtils';
import { CellPosition, GridMatrix } from '@/types';

interface UseGridProps {
    initialRows?: number;
    initialCols?: number;
}

interface UseGridReturn {
    grid: GridMatrix;
    rows: number;
    cols: number;
    setGrid: (grid: GridMatrix) => void;
    toggleCell: (position: CellPosition) => void;
    updateSize: (newRows: number, newCols: number) => void;
    resetGrid: () => void;
    clearGrid: () => void;
    generateMaze: () => void;
    isMazeGenerating: boolean;
}

const MAZE_STEP_DELAY = 14; // ms between each carve step (~70 steps/sec)

export const useGrid = ({ initialRows = 20, initialCols = 20 }: UseGridProps = {}): UseGridReturn => {
    const [rows, setRows] = useState<number>(initialRows);
    const [cols, setCols] = useState<number>(initialCols);
    const [isMazeGenerating, setIsMazeGenerating] = useState<boolean>(false);

    const [grid, setGrid] = useState<GridMatrix>(() => {
        const emptyGrid = createEmptyGrid(initialRows, initialCols);
        return setStartAndEndPoints(emptyGrid);
    });

    // Refs for maze animation RAF loop
    const mazeGenRef = useRef<Generator<MazeStep, MazeStep, unknown> | null>(null);
    const mazeFrameRef = useRef<number | null>(null);
    const mazeLastRef = useRef<number>(0);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (mazeFrameRef.current !== null) {
                cancelAnimationFrame(mazeFrameRef.current);
            }
        };
    }, []);

    const toggleCell = useCallback((position: CellPosition): void => {
        setGrid((prevGrid) => toggleCellType(prevGrid, position));
    }, []);

    const updateSize = useCallback((newRows: number, newCols: number): void => {
        setRows(newRows);
        setCols(newCols);
        const emptyGrid = createEmptyGrid(newRows, newCols);
        setGrid(setStartAndEndPoints(emptyGrid));
    }, []);

    const resetGrid = useCallback((): void => {
        const emptyGrid = createEmptyGrid(rows, cols);
        setGrid(setStartAndEndPoints(emptyGrid));
    }, [rows, cols]);

    const clearGrid = useCallback((): void => {
        setGrid((prevGrid) => clearPathAndVisited(prevGrid));
    }, []);

    const generateMaze = useCallback((): void => {
        if (isMazeGenerating) return;

        // Build a fresh grid to find start/end positions
        const emptyGrid = createEmptyGrid(rows, cols);
        const gridWithSE = setStartAndEndPoints(emptyGrid);
        const startPos = findCellByType(gridWithSE, 'start');
        const endPos = findCellByType(gridWithSE, 'end');
        if (!startPos || !endPos) return;

        // Initialise the generator
        mazeGenRef.current = generateRecursiveBacktrackingMaze(rows, cols, startPos, endPos);
        setIsMazeGenerating(true);
        mazeLastRef.current = performance.now();

        const loop = (ts: number) => {
            if (!mazeGenRef.current) return;

            if (ts - mazeLastRef.current >= MAZE_STEP_DELAY) {
                mazeLastRef.current = ts;
                const result = mazeGenRef.current.next();
                setGrid(result.value.grid);

                if (result.done) {
                    setIsMazeGenerating(false);
                    mazeGenRef.current = null;
                    mazeFrameRef.current = null;
                    return;
                }
            }

            mazeFrameRef.current = requestAnimationFrame(loop);
        };

        mazeFrameRef.current = requestAnimationFrame(loop);
    }, [rows, cols, isMazeGenerating]);

    return {
        grid,
        rows,
        cols,
        setGrid,
        toggleCell,
        updateSize,
        resetGrid,
        clearGrid,
        generateMaze,
        isMazeGenerating,
    };
};

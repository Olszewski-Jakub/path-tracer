import { useState, useCallback, useRef, useEffect } from 'react';
import {
    createEmptyGrid, setStartAndEndPoints, toggleCellType, eraseCellType,
    clearPathAndVisited, findCellByType, generateRecursiveBacktrackingMaze,
    generatePreset, PresetType, MazeStep,
} from '@/utils/gridUtils';
import { decodeGridFromUrl, applyEncodedGrid } from '@/utils/urlUtils';
import { CellPosition, CellType, GridMatrix } from '@/types';

interface UseGridProps {
    initialRows?: number;
    initialCols?: number;
}

interface UseGridReturn {
    grid: GridMatrix;
    rows: number;
    cols: number;
    setGrid: (grid: GridMatrix | ((prev: GridMatrix) => GridMatrix)) => void;
    toggleCell: (position: CellPosition) => void;
    eraseCell: (position: CellPosition) => void;
    moveNode: (type: 'start' | 'end', from: CellPosition, to: CellPosition) => void;
    updateSize: (newRows: number, newCols: number) => void;
    resetGrid: () => void;
    clearGrid: () => void;
    generateMaze: () => void;
    loadPreset: (preset: PresetType) => void;
    isMazeGenerating: boolean;
}

const MAZE_STEP_DELAY = 14;

export const useGrid = ({ initialRows = 20, initialCols = 20 }: UseGridProps = {}): UseGridReturn => {
    const [rows, setRows] = useState<number>(initialRows);
    const [cols, setCols] = useState<number>(initialCols);
    const [isMazeGenerating, setIsMazeGenerating] = useState<boolean>(false);

    const [grid, setGrid] = useState<GridMatrix>(() => {
        // Try to load from URL on first render
        const fromUrl = decodeGridFromUrl();
        if (fromUrl) {
            const base = setStartAndEndPoints(createEmptyGrid(fromUrl.rows, fromUrl.cols));
            return applyEncodedGrid(fromUrl.encoded, fromUrl.rows, fromUrl.cols, base);
        }
        return setStartAndEndPoints(createEmptyGrid(initialRows, initialCols));
    });

    const mazeGenRef  = useRef<Generator<MazeStep, MazeStep, unknown> | null>(null);
    const mazeFrameRef = useRef<number | null>(null);
    const mazeLastRef  = useRef<number>(0);

    useEffect(() => {
        return () => {
            if (mazeFrameRef.current !== null) cancelAnimationFrame(mazeFrameRef.current);
        };
    }, []);

    const toggleCell = useCallback((position: CellPosition) => {
        setGrid(prev => toggleCellType(prev, position));
    }, []);

    const eraseCell = useCallback((position: CellPosition) => {
        setGrid(prev => eraseCellType(prev, position));
    }, []);

    const moveNode = useCallback((type: 'start' | 'end', from: CellPosition, to: CellPosition) => {
        setGrid(prev => {
            const next = prev.map(row => row.map(cell => {
                // Clear algorithm state from all cells
                if (['visited', 'path', 'current', 'frontier'].includes(cell.type as string))
                    return { ...cell, type: 'empty' as CellType, parent: null, isVisited: false, distance: Infinity, fScore: Infinity, gScore: Infinity };
                return cell;
            }));
            // Remove from old position
            next[from.row][from.col] = { ...next[from.row][from.col], type: 'empty', parent: null, isVisited: false, distance: Infinity, fScore: Infinity, gScore: Infinity };
            // Place at new position
            next[to.row][to.col] = {
                ...next[to.row][to.col],
                type: type as CellType,
                distance: type === 'start' ? 0 : Infinity,
                fScore: type === 'start' ? 0 : Infinity,
                gScore: type === 'start' ? 0 : Infinity,
                parent: null,
                isVisited: false,
            };
            return next;
        });
    }, []);

    const updateSize = useCallback((newRows: number, newCols: number) => {
        setRows(newRows);
        setCols(newCols);
        setGrid(setStartAndEndPoints(createEmptyGrid(newRows, newCols)));
    }, []);

    const resetGrid = useCallback(() => {
        setGrid(setStartAndEndPoints(createEmptyGrid(rows, cols)));
    }, [rows, cols]);

    const clearGrid = useCallback(() => {
        setGrid(prev => clearPathAndVisited(prev));
    }, []);

    const loadPreset = useCallback((preset: PresetType) => {
        setGrid(generatePreset(rows, cols, preset));
    }, [rows, cols]);

    const generateMaze = useCallback(() => {
        if (isMazeGenerating) return;
        const emptyGrid = createEmptyGrid(rows, cols);
        const gridWithSE = setStartAndEndPoints(emptyGrid);
        const startPos = findCellByType(gridWithSE, 'start');
        const endPos   = findCellByType(gridWithSE, 'end');
        if (!startPos || !endPos) return;

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
        grid, rows, cols, setGrid,
        toggleCell, eraseCell, moveNode,
        updateSize, resetGrid, clearGrid,
        generateMaze, loadPreset, isMazeGenerating,
    };
};

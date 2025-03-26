// src/hooks/useGrid.js
import { useState, useCallback } from 'react';
import { createEmptyGrid, setStartAndEndPoints, toggleCellType, clearPathAndVisited, generateRandomMaze } from '@/utils/gridUtils';
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
}

export const useGrid = ({ initialRows = 20, initialCols = 20 }: UseGridProps = {}): UseGridReturn => {
  const [rows, setRows] = useState<number>(initialRows);
  const [cols, setCols] = useState<number>(initialCols);

  const [grid, setGrid] = useState<GridMatrix>(() => {
    const emptyGrid = createEmptyGrid(rows, cols);
    return setStartAndEndPoints(emptyGrid);
  });

  const toggleCell = useCallback((position: CellPosition): void => {
    setGrid((prevGrid) => toggleCellType(prevGrid, position));
  }, []);

  const updateSize = useCallback((newRows: number, newCols: number): void => {
    setRows(newRows);
    setCols(newCols);
  }, []);

  const resetGrid = useCallback((): void => {
    const emptyGrid = createEmptyGrid(rows, cols);
    const gridWithStartEnd = setStartAndEndPoints(emptyGrid);
    setGrid(gridWithStartEnd);
  }, [rows, cols]);

  const clearGrid = useCallback((): void => {
    setGrid((prevGrid) => clearPathAndVisited(prevGrid));
  }, []);

  const generateMaze = useCallback((): void => {
    const emptyGrid = createEmptyGrid(rows, cols);
    const gridWithStartEnd = setStartAndEndPoints(emptyGrid);
    const mazeGrid = generateRandomMaze(gridWithStartEnd, 0.3);
    setGrid(mazeGrid);
  }, [rows, cols]);

  return {
    grid,
    rows,
    cols,
    setGrid,
    toggleCell,
    updateSize,
    resetGrid,
    clearGrid,
    generateMaze
  };
};


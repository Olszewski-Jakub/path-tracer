import { Cell, CellPosition, CellType, GridMatrix } from '@/types';

export const createEmptyGrid = (rows: number, cols: number): GridMatrix => {
    const grid: GridMatrix = [];

    for (let row = 0; row < rows; row++) {
        const currentRow: Cell[] = [];
        for (let col = 0; col < cols; col++) {
            currentRow.push({
                position: { row, col },
                type: 'empty',
                distance: Infinity,
                fScore: Infinity,
                gScore: Infinity,
                hScore: 0,
                parent: null,
                isVisited: false,
            });
        }
        grid.push(currentRow);
    }

    return grid;
};

export const setStartAndEndPoints = (
    grid: GridMatrix,
    startPos: CellPosition = { row: 1, col: 1 },
    endPos: CellPosition = { row: grid.length - 2, col: grid[0].length - 2 }
): GridMatrix => {
    const newGrid = JSON.parse(JSON.stringify(grid)) as GridMatrix;

    
    newGrid[startPos.row][startPos.col] = {
        ...newGrid[startPos.row][startPos.col],
        type: 'start',
        distance: 0,
        fScore: 0,
        gScore: 0,
    };

    
    newGrid[endPos.row][endPos.col] = {
        ...newGrid[endPos.row][endPos.col],
        type: 'end',
    };

    return newGrid;
};

export const toggleCellType = (grid: GridMatrix, position: CellPosition): GridMatrix => {
    const { row, col } = position;
    const cell = grid[row][col];

    
    if (cell.type === 'start' || cell.type === 'end') {
        return grid;
    }

    const newGrid = JSON.parse(JSON.stringify(grid)) as GridMatrix;
    newGrid[row][col] = {
        ...newGrid[row][col],
        type: cell.type === 'wall' ? 'empty' : 'wall',
    };

    return newGrid;
};

export const isValidPosition = (grid: GridMatrix, position: CellPosition): boolean => {
    const { row, col } = position;
    return row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;
};

export const getNeighbors = (grid: GridMatrix, position: CellPosition): CellPosition[] => {
    const { row, col } = position;
    const neighbors: CellPosition[] = [];
    const directions = [
        { row: -1, col: 0 }, 
        { row: 0, col: 1 },  
        { row: 1, col: 0 },  
        { row: 0, col: -1 }, 
    ];

    for (const direction of directions) {
        const newRow = row + direction.row;
        const newCol = col + direction.col;
        const newPos = { row: newRow, col: newCol };

        if (isValidPosition(grid, newPos)) {
            
            const cellType = grid[newRow][newCol].type;
            if (cellType !== 'wall') {
                neighbors.push(newPos);
            }
        }
    }

    
    console.log(`Neighbors for (${row},${col}):`, neighbors);

    return neighbors;
};

export const findCellByType = (grid: GridMatrix, type: CellType): CellPosition | null => {
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            if (grid[row][col].type === type) {
                return { row, col };
            }
        }
    }
    return null;
};

export const findSpecialPoints = (grid: GridMatrix): { start: CellPosition | null; end: CellPosition | null } => {
    let start: CellPosition | null = null;
    let end: CellPosition | null = null;

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            const cellType = grid[row][col].type;
            if (cellType === 'start') {
                start = { row, col };
            } else if (cellType === 'end') {
                end = { row, col };
            }

            if (start && end) break;
        }
        if (start && end) break;
    }

    return { start, end };
};

export const clearPathAndVisited = (grid: GridMatrix): GridMatrix => {
    const newGrid = JSON.parse(JSON.stringify(grid)) as GridMatrix;

    
    const { start, end } = findSpecialPoints(grid);

    for (let row = 0; row < newGrid.length; row++) {
        for (let col = 0; col < newGrid[0].length; col++) {
            const cell = newGrid[row][col];

            
            if (cell.type === 'visited' || cell.type === 'path' || cell.type === 'current' || cell.type === 'frontier') {
                
                let originalType: CellType;

                
                if (start && row === start.row && col === start.col) {
                    originalType = 'start';
                } else if (end && row === end.row && col === end.col) {
                    originalType = 'end';
                } else {
                    
                    const originalCell = grid[row][col];
                    originalType = originalCell.type === 'wall' ? 'wall' : 'empty';
                }

                
                newGrid[row][col] = {
                    ...cell,
                    type: originalType,
                    distance: originalType === 'start' ? 0 : Infinity,
                    fScore: originalType === 'start' ? 0 : Infinity,
                    gScore: originalType === 'start' ? 0 : Infinity,
                    parent: null,
                    isVisited: false,
                };
            }
        }
    }

    return newGrid;
};

export const resetGrid = (grid: GridMatrix): GridMatrix => {
    const newGrid = JSON.parse(JSON.stringify(grid)) as GridMatrix;

    for (let row = 0; row < newGrid.length; row++) {
        for (let col = 0; col < newGrid[0].length; col++) {
            const cell = newGrid[row][col];

            
            let cellType: CellType;
            if (cell.type === 'start') {
                cellType = 'start';
            } else if (cell.type === 'end') {
                cellType = 'end';
            } else if (cell.type === 'wall') {
                cellType = 'wall';
            } else {
                cellType = 'empty';
            }

            newGrid[row][col] = {
                ...cell,
                type: cellType,
                distance: cellType === 'start' ? 0 : Infinity,
                fScore: cellType === 'start' ? 0 : Infinity,
                gScore: cellType === 'start' ? 0 : Infinity,
                hScore: 0,
                parent: null,
                isVisited: false,
            };
        }
    }

    return newGrid;
};

export const generateRandomMaze = (grid: GridMatrix, wallDensity: number = 0.3): GridMatrix => {
    const newGrid = JSON.parse(JSON.stringify(grid)) as GridMatrix;
    const startPos = findCellByType(newGrid, 'start');
    const endPos = findCellByType(newGrid, 'end');

    for (let row = 0; row < newGrid.length; row++) {
        for (let col = 0; col < newGrid[0].length; col++) {
            
            if (
                (startPos && row === startPos.row && col === startPos.col) ||
                (endPos && row === endPos.row && col === endPos.col)
            ) {
                continue;
            }

            if (Math.random() < wallDensity) {
                newGrid[row][col] = {
                    ...newGrid[row][col],
                    type: 'wall',
                };
            } else {
                newGrid[row][col] = {
                    ...newGrid[row][col],
                    type: 'empty',
                };
            }
        }
    }

    return newGrid;
};

export const calculateManhattanDistance = (a: CellPosition, b: CellPosition): number => {
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
};

export const calculateEuclideanDistance = (a: CellPosition, b: CellPosition): number => {
    return Math.sqrt(Math.pow(a.row - b.row, 2) + Math.pow(a.col - b.col, 2));
};

export const reconstructPath = (grid: GridMatrix, endPos: CellPosition): CellPosition[] => {
    const path: CellPosition[] = [];
    let current: CellPosition | null = endPos;

    while (current !== null) {
        path.unshift(current);
        const cell:Cell = grid[current.row][current.col];
        current = cell.parent;
    }

    return path;
};

export const visualizePath = (grid: GridMatrix, path: CellPosition[]): GridMatrix => {
    const newGrid = JSON.parse(JSON.stringify(grid)) as GridMatrix;

    
    for (let i = 1; i < path.length - 1; i++) {
        const { row, col } = path[i];
        newGrid[row][col] = {
            ...newGrid[row][col],
            type: 'path',
        };
    }

    return newGrid;
};
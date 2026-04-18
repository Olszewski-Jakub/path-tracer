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

// ─── Recursive Backtracking Maze Generator ──────────────────────────────────

export interface MazeStep {
    grid: GridMatrix;
    isDone: boolean;
}

export function* generateRecursiveBacktrackingMaze(
    rows: number,
    cols: number,
    startPos: CellPosition,
    endPos: CellPosition
): Generator<MazeStep, MazeStep, unknown> {
    // Start with all walls
    const grid = createEmptyGrid(rows, cols);
    for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
            grid[r][c] = { ...grid[r][c], type: 'wall' };

    const visited = new Set<string>();
    const stack: CellPosition[] = [];

    const key = (r: number, c: number) => `${r},${c}`;
    // Valid carve targets: inside border, on even coords (the passage cells)
    const isPassageCell = (r: number, c: number) =>
        r > 0 && r < rows - 1 && c > 0 && c < cols - 1;

    // Snap start carve origin to odd grid coords so passages align
    const sr = startPos.row % 2 === 0 ? Math.min(startPos.row + 1, rows - 2) : startPos.row;
    const sc = startPos.col % 2 === 0 ? Math.min(startPos.col + 1, cols - 2) : startPos.col;

    grid[sr][sc] = { ...grid[sr][sc], type: 'empty' };
    visited.add(key(sr, sc));
    stack.push({ row: sr, col: sc });

    // Yield initial state (all walls except first passage cell)
    const snap0 = JSON.parse(JSON.stringify(grid)) as GridMatrix;
    snap0[startPos.row][startPos.col] = { ...snap0[startPos.row][startPos.col], type: 'start', distance: 0, fScore: 0, gScore: 0 };
    snap0[endPos.row][endPos.col] = { ...snap0[endPos.row][endPos.col], type: 'end' };
    yield { grid: snap0, isDone: false };

    // 4 directions, 2 cells at a time (skip over a wall cell)
    const DIRS: [number, number][] = [[-2, 0], [2, 0], [0, -2], [0, 2]];

    while (stack.length > 0) {
        const { row: cr, col: cc } = stack[stack.length - 1];

        // Shuffle directions to get different mazes each run
        const shuffled = [...DIRS].sort(() => Math.random() - 0.5);
        let carved = false;

        for (const [dr, dc] of shuffled) {
            const nr = cr + dr;
            const nc = cc + dc;
            if (isPassageCell(nr, nc) && !visited.has(key(nr, nc))) {
                // Carve the wall cell between current and neighbor
                const wr = cr + dr / 2;
                const wc = cc + dc / 2;
                grid[wr][wc] = { ...grid[wr][wc], type: 'empty' };
                grid[nr][nc] = { ...grid[nr][nc], type: 'empty' };
                visited.add(key(nr, nc));
                stack.push({ row: nr, col: nc });
                carved = true;

                // Yield a snapshot after carving each passage
                const snap = JSON.parse(JSON.stringify(grid)) as GridMatrix;
                snap[startPos.row][startPos.col] = { ...snap[startPos.row][startPos.col], type: 'start', distance: 0, fScore: 0, gScore: 0 };
                snap[endPos.row][endPos.col] = { ...snap[endPos.row][endPos.col], type: 'end' };
                yield { grid: snap, isDone: false };
                break;
            }
        }

        if (!carved) {
            stack.pop();
        }
    }

    // Final state: place start and end definitively
    const finalGrid = JSON.parse(JSON.stringify(grid)) as GridMatrix;
    finalGrid[startPos.row][startPos.col] = { ...finalGrid[startPos.row][startPos.col], type: 'start', distance: 0, fScore: 0, gScore: 0 };
    finalGrid[endPos.row][endPos.col] = { ...finalGrid[endPos.row][endPos.col], type: 'end' };
    return { grid: finalGrid, isDone: true };
}

// ────────────────────────────────────────────────────────────────────────────

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
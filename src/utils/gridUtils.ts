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
    // Fill with walls
    const grid = createEmptyGrid(rows, cols);
    for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
            grid[r][c] = { ...grid[r][c], type: 'wall' };

    // Passage nodes sit at ODD row AND ODD col, strictly inside the border.
    // Wall cells between them (one step away) get carved when connecting nodes.
    const isPassageNode = (r: number, c: number) =>
        r % 2 === 1 && c % 2 === 1 && r >= 1 && r <= rows - 2 && c >= 1 && c <= cols - 2;

    // Snap any position to the nearest valid passage node.
    const snapToPassage = (r: number, c: number): [number, number] => {
        const sr = r % 2 === 0 ? (r - 1 >= 1 ? r - 1 : r + 1) : r;
        const sc = c % 2 === 0 ? (c - 1 >= 1 ? c - 1 : c + 1) : c;
        return [Math.max(1, Math.min(rows - 2, sr)), Math.max(1, Math.min(cols - 2, sc))];
    };

    const [sr, sc] = snapToPassage(startPos.row, startPos.col);
    const [er, ec] = snapToPassage(endPos.row, endPos.col);

    const visited = new Set<string>();
    const key = (r: number, c: number) => `${r},${c}`;

    // Helper — snapshot with start/end overlaid on their actual positions
    const snap = () => {
        const g = JSON.parse(JSON.stringify(grid)) as GridMatrix;
        g[startPos.row][startPos.col] = { ...g[startPos.row][startPos.col], type: 'start', distance: 0, fScore: 0, gScore: 0 };
        g[endPos.row][endPos.col] = { ...g[endPos.row][endPos.col], type: 'end' };
        return g;
    };

    // Open first passage node
    grid[sr][sc] = { ...grid[sr][sc], type: 'empty' };
    visited.add(key(sr, sc));
    const stack: [number, number][] = [[sr, sc]];

    yield { grid: snap(), isDone: false };

    const DIRS: [number, number][] = [[-2, 0], [2, 0], [0, -2], [0, 2]];

    // DFS recursive backtracking — visits every passage node exactly once
    while (stack.length > 0) {
        const [cr, cc] = stack[stack.length - 1];
        // Shuffle directions so each run produces a different maze
        const dirs = [...DIRS].sort(() => Math.random() - 0.5);
        let moved = false;

        for (const [dr, dc] of dirs) {
            const nr = cr + dr;
            const nc = cc + dc;
            if (isPassageNode(nr, nc) && !visited.has(key(nr, nc))) {
                // Carve the wall cell between the two passage nodes
                grid[cr + dr / 2][cc + dc / 2] = { ...grid[cr + dr / 2][cc + dc / 2], type: 'empty' };
                grid[nr][nc] = { ...grid[nr][nc], type: 'empty' };
                visited.add(key(nr, nc));
                stack.push([nr, nc]);
                moved = true;
                yield { grid: snap(), isDone: false };
                break;
            }
        }

        if (!moved) stack.pop();
    }

    // Add loops: knock out a fraction of wall cells that sit between two open passage
    // cells. This creates multiple routes and makes the maze feel more complex.
    const removableWalls: [number, number][] = [];
    for (let r = 1; r < rows - 1; r++) {
        for (let c = 1; c < cols - 1; c++) {
            if (grid[r][c].type !== 'wall') continue;
            // Horizontal wall between two horizontal passage nodes
            const horizOk = r % 2 === 1 && c % 2 === 0
                && grid[r][c - 1]?.type === 'empty'
                && grid[r][c + 1]?.type === 'empty';
            // Vertical wall between two vertical passage nodes
            const vertOk = r % 2 === 0 && c % 2 === 1
                && grid[r - 1]?.[c]?.type === 'empty'
                && grid[r + 1]?.[c]?.type === 'empty';
            if (horizOk || vertOk) removableWalls.push([r, c]);
        }
    }
    const loopCount = Math.floor(removableWalls.length * 0.18);
    for (const [r, c] of removableWalls.sort(() => Math.random() - 0.5).slice(0, loopCount)) {
        grid[r][c] = { ...grid[r][c], type: 'empty' };
        yield { grid: snap(), isDone: false };
    }

    // Guarantee the actual start/end cells are open and connected to the nearest
    // passage node (needed when they fall on even coordinates, e.g. even-sized grids).
    const carveToSnapped = (fromR: number, fromC: number, toR: number, toC: number) => {
        grid[fromR][fromC] = { ...grid[fromR][fromC], type: 'empty' };
        let r = fromR;
        let c = fromC;
        while (r !== toR || c !== toC) {
            if (r !== toR) r += toR > fromR ? 1 : -1;
            else c += toC > fromC ? 1 : -1;
            grid[r][c] = { ...grid[r][c], type: 'empty' };
        }
    };

    carveToSnapped(startPos.row, startPos.col, sr, sc);
    carveToSnapped(endPos.row, endPos.col, er, ec);

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
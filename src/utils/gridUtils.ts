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
    if (cell.type === 'start' || cell.type === 'end') return grid;
    const newGrid = JSON.parse(JSON.stringify(grid)) as GridMatrix;
    newGrid[row][col] = { ...newGrid[row][col], type: cell.type === 'wall' ? 'empty' : 'wall' };
    return newGrid;
};

export const eraseCellType = (grid: GridMatrix, position: CellPosition): GridMatrix => {
    const { row, col } = position;
    const cell = grid[row][col];
    if (cell.type === 'start' || cell.type === 'end' || cell.type === 'empty') return grid;
    const newGrid = JSON.parse(JSON.stringify(grid)) as GridMatrix;
    newGrid[row][col] = { ...newGrid[row][col], type: 'empty' };
    return newGrid;
};

export const isValidPosition = (grid: GridMatrix, position: CellPosition): boolean => {
    const { row, col } = position;
    return row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;
};

export const getNeighbors = (
    grid: GridMatrix,
    position: CellPosition,
    allowDiagonals = false
): CellPosition[] => {
    const { row, col } = position;
    const neighbors: CellPosition[] = [];
    const dirs = [
        [-1, 0], [0, 1], [1, 0], [0, -1],
        ...(allowDiagonals ? [[-1, -1], [-1, 1], [1, -1], [1, 1]] : []),
    ] as [number, number][];

    for (const [dr, dc] of dirs) {
        const nr = row + dr;
        const nc = col + dc;
        if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length) {
            if (grid[nr][nc].type !== 'wall') {
                neighbors.push({ row: nr, col: nc });
            }
        }
    }
    return neighbors;
};

export const findCellByType = (grid: GridMatrix, type: CellType): CellPosition | null => {
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            if (grid[row][col].type === type) return { row, col };
        }
    }
    return null;
};

export const findSpecialPoints = (
    grid: GridMatrix
): { start: CellPosition | null; end: CellPosition | null } => {
    let start: CellPosition | null = null;
    let end: CellPosition | null = null;
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            if (grid[row][col].type === 'start') start = { row, col };
            else if (grid[row][col].type === 'end') end = { row, col };
            if (start && end) return { start, end };
        }
    }
    return { start, end };
};

export const clearPathAndVisited = (grid: GridMatrix): GridMatrix => {
    const newGrid = JSON.parse(JSON.stringify(grid)) as GridMatrix;
    const { start, end } = findSpecialPoints(grid);
    for (let row = 0; row < newGrid.length; row++) {
        for (let col = 0; col < newGrid[0].length; col++) {
            const cell = newGrid[row][col];
            if (!['visited', 'path', 'current', 'frontier'].includes(cell.type)) continue;
            let originalType: CellType;
            if (start && row === start.row && col === start.col) originalType = 'start';
            else if (end && row === end.row && col === end.col) originalType = 'end';
            else originalType = grid[row][col].type === 'wall' ? 'wall' : 'empty';
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
    return newGrid;
};

export const resetGrid = (grid: GridMatrix): GridMatrix => {
    const newGrid = JSON.parse(JSON.stringify(grid)) as GridMatrix;
    for (let row = 0; row < newGrid.length; row++) {
        for (let col = 0; col < newGrid[0].length; col++) {
            const cell = newGrid[row][col];
            const cellType: CellType =
                cell.type === 'start' ? 'start'
                : cell.type === 'end' ? 'end'
                : cell.type === 'wall' ? 'wall'
                : 'empty';
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

export const generateRandomMaze = (grid: GridMatrix, wallDensity = 0.3): GridMatrix => {
    const newGrid = JSON.parse(JSON.stringify(grid)) as GridMatrix;
    const startPos = findCellByType(newGrid, 'start');
    const endPos = findCellByType(newGrid, 'end');
    for (let row = 0; row < newGrid.length; row++) {
        for (let col = 0; col < newGrid[0].length; col++) {
            if ((startPos && row === startPos.row && col === startPos.col) ||
                (endPos && row === endPos.row && col === endPos.col)) continue;
            newGrid[row][col] = { ...newGrid[row][col], type: Math.random() < wallDensity ? 'wall' : 'empty' };
        }
    }
    return newGrid;
};

// ─── Grid Presets ───────────────────────────────────────────────────────────

export type PresetType = 'empty' | 'diagonal' | 'zigzag' | 'rooms' | 'scatter';

export function generatePreset(rows: number, cols: number, preset: PresetType): GridMatrix {
    const base = setStartAndEndPoints(createEmptyGrid(rows, cols));
    if (preset === 'empty') return base;
    if (preset === 'scatter') return generateRandomMaze(base, 0.32);

    const g = JSON.parse(JSON.stringify(base)) as GridMatrix;
    const startPos = findCellByType(g, 'start')!;
    const endPos = findCellByType(g, 'end')!;

    const wall = (r: number, c: number) => {
        if (r < 0 || r >= rows || c < 0 || c >= cols) return;
        if ((r === startPos.row && c === startPos.col) || (r === endPos.row && c === endPos.col)) return;
        g[r][c] = { ...g[r][c], type: 'wall' };
    };

    if (preset === 'diagonal') {
        // Vertical barriers every 6 cols, alternating gap at top/bottom
        const gap = 4;
        for (let c = 5; c < cols - 1; c += 6) {
            const gapAtBottom = Math.floor(c / 6) % 2 === 0;
            for (let r = 0; r < rows; r++) {
                const inGap = gapAtBottom ? r >= rows - gap - 1 : r <= gap;
                if (!inGap) wall(r, c);
            }
        }
    } else if (preset === 'zigzag') {
        // Horizontal barriers every 5 rows, alternating gap left/right
        const gap = Math.floor(cols * 0.3);
        for (let r = 4; r < rows - 1; r += 5) {
            const gapOnRight = Math.floor(r / 5) % 2 === 0;
            for (let c = 0; c < cols; c++) {
                const inGap = gapOnRight ? c >= cols - gap - 1 : c <= gap;
                if (!inGap) wall(r, c);
            }
        }
    } else if (preset === 'rooms') {
        const hMid = Math.floor(rows / 2);
        const vMid = Math.floor(cols / 2);
        // Draw 4 walls forming a cross, with one door in each segment
        for (let c = 0; c < cols; c++) wall(hMid, c);
        for (let r = 0; r < rows; r++) wall(r, vMid);
        // Doors
        const d1c = Math.floor(vMid / 2);
        const d2c = Math.floor(vMid + (cols - vMid) / 2);
        const d1r = Math.floor(hMid / 2);
        const d2r = Math.floor(hMid + (rows - hMid) / 2);
        // Open doors in horizontal wall
        for (let dc = -1; dc <= 1; dc++) {
            if (g[hMid]?.[d1c + dc]) g[hMid][d1c + dc] = { ...g[hMid][d1c + dc], type: 'empty' };
            if (g[hMid]?.[d2c + dc]) g[hMid][d2c + dc] = { ...g[hMid][d2c + dc], type: 'empty' };
        }
        // Open doors in vertical wall
        for (let dr = -1; dr <= 1; dr++) {
            if (g[d1r + dr]?.[vMid]) g[d1r + dr][vMid] = { ...g[d1r + dr][vMid], type: 'empty' };
            if (g[d2r + dr]?.[vMid]) g[d2r + dr][vMid] = { ...g[d2r + dr][vMid], type: 'empty' };
        }
        // Restore start/end
        g[startPos.row][startPos.col] = { ...g[startPos.row][startPos.col], type: 'start' };
        g[endPos.row][endPos.col] = { ...g[endPos.row][endPos.col], type: 'end' };
    }

    return g;
}

// ─── Recursive Backtracking Maze Generator ──────────────────────────────────

export interface MazeStep { grid: GridMatrix; isDone: boolean; }

export function* generateRecursiveBacktrackingMaze(
    rows: number,
    cols: number,
    startPos: CellPosition,
    endPos: CellPosition
): Generator<MazeStep, MazeStep, unknown> {
    const grid = createEmptyGrid(rows, cols);
    for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
            grid[r][c] = { ...grid[r][c], type: 'wall' };

    const isPassageNode = (r: number, c: number) =>
        r % 2 === 1 && c % 2 === 1 && r >= 1 && r <= rows - 2 && c >= 1 && c <= cols - 2;

    const snapToPassage = (r: number, c: number): [number, number] => {
        const sr = r % 2 === 0 ? (r - 1 >= 1 ? r - 1 : r + 1) : r;
        const sc = c % 2 === 0 ? (c - 1 >= 1 ? c - 1 : c + 1) : c;
        return [Math.max(1, Math.min(rows - 2, sr)), Math.max(1, Math.min(cols - 2, sc))];
    };

    const [sr, sc] = snapToPassage(startPos.row, startPos.col);
    const [er, ec] = snapToPassage(endPos.row, endPos.col);

    const visited = new Set<string>();
    const key = (r: number, c: number) => `${r},${c}`;

    const snap = () => {
        const g = JSON.parse(JSON.stringify(grid)) as GridMatrix;
        g[startPos.row][startPos.col] = { ...g[startPos.row][startPos.col], type: 'start', distance: 0, fScore: 0, gScore: 0 };
        g[endPos.row][endPos.col] = { ...g[endPos.row][endPos.col], type: 'end' };
        return g;
    };

    grid[sr][sc] = { ...grid[sr][sc], type: 'empty' };
    visited.add(key(sr, sc));
    const stack: [number, number][] = [[sr, sc]];
    yield { grid: snap(), isDone: false };

    const DIRS: [number, number][] = [[-2, 0], [2, 0], [0, -2], [0, 2]];
    while (stack.length > 0) {
        const [cr, cc] = stack[stack.length - 1];
        const dirs = [...DIRS].sort(() => Math.random() - 0.5);
        let moved = false;
        for (const [dr, dc] of dirs) {
            const nr = cr + dr; const nc = cc + dc;
            if (isPassageNode(nr, nc) && !visited.has(key(nr, nc))) {
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

    // Add ~18% loops
    const removable: [number, number][] = [];
    for (let r = 1; r < rows - 1; r++) {
        for (let c = 1; c < cols - 1; c++) {
            if (grid[r][c].type !== 'wall') continue;
            const h = r % 2 === 1 && c % 2 === 0 && grid[r][c-1]?.type === 'empty' && grid[r][c+1]?.type === 'empty';
            const v = r % 2 === 0 && c % 2 === 1 && grid[r-1]?.[c]?.type === 'empty' && grid[r+1]?.[c]?.type === 'empty';
            if (h || v) removable.push([r, c]);
        }
    }
    for (const [r, c] of removable.sort(() => Math.random() - 0.5).slice(0, Math.floor(removable.length * 0.18))) {
        grid[r][c] = { ...grid[r][c], type: 'empty' };
        yield { grid: snap(), isDone: false };
    }

    const carve = (fromR: number, fromC: number, toR: number, toC: number) => {
        grid[fromR][fromC] = { ...grid[fromR][fromC], type: 'empty' };
        let r = fromR; let c = fromC;
        while (r !== toR || c !== toC) {
            if (r !== toR) r += toR > fromR ? 1 : -1;
            else c += toC > fromC ? 1 : -1;
            grid[r][c] = { ...grid[r][c], type: 'empty' };
        }
    };
    carve(startPos.row, startPos.col, sr, sc);
    carve(endPos.row, endPos.col, er, ec);

    const finalGrid = JSON.parse(JSON.stringify(grid)) as GridMatrix;
    finalGrid[startPos.row][startPos.col] = { ...finalGrid[startPos.row][startPos.col], type: 'start', distance: 0, fScore: 0, gScore: 0 };
    finalGrid[endPos.row][endPos.col] = { ...finalGrid[endPos.row][endPos.col], type: 'end' };
    return { grid: finalGrid, isDone: true };
}

// ────────────────────────────────────────────────────────────────────────────

export const calculateManhattanDistance = (a: CellPosition, b: CellPosition): number =>
    Math.abs(a.row - b.row) + Math.abs(a.col - b.col);

export const calculateChebyshevDistance = (a: CellPosition, b: CellPosition): number =>
    Math.max(Math.abs(a.row - b.row), Math.abs(a.col - b.col));

export const calculateEuclideanDistance = (a: CellPosition, b: CellPosition): number =>
    Math.sqrt(Math.pow(a.row - b.row, 2) + Math.pow(a.col - b.col, 2));

export const reconstructPath = (grid: GridMatrix, endPos: CellPosition): CellPosition[] => {
    const path: CellPosition[] = [];
    let current: CellPosition | null = endPos;
    while (current !== null) {
        path.unshift(current);
        const cell: Cell = grid[current.row][current.col];
        current = cell.parent;
    }
    return path;
};

export const visualizePath = (grid: GridMatrix, path: CellPosition[]): GridMatrix => {
    const newGrid = JSON.parse(JSON.stringify(grid)) as GridMatrix;
    for (let i = 1; i < path.length - 1; i++) {
        const { row, col } = path[i];
        newGrid[row][col] = { ...newGrid[row][col], type: 'path' };
    }
    return newGrid;
};

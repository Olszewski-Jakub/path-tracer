import { GridMatrix, Cell, CellPosition } from '@/types';

export const debugGrid = (grid: GridMatrix): void => {
    console.log('Grid dimensions:', grid.length, 'x', grid[0].length);


    const counts: Record<string, number> = {};

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            const cell = grid[row][col];
            if (!counts[cell.type]) {
                counts[cell.type] = 0;
            }
            counts[cell.type]++;


            if (cell.type === 'start' || cell.type === 'end') {
                console.log(`${cell.type} cell at (${row}, ${col})`);
            }
        }
    }

    console.log('Cell type counts:', counts);
};

export const validatePath = (grid: GridMatrix): boolean => {
    let startPos: CellPosition | null = null;
    let endPos: CellPosition | null = null;

    
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            const cell = grid[row][col];
            if (cell.type === 'start') {
                startPos = { row, col };
            } else if (cell.type === 'end') {
                endPos = { row, col };
            }

            if (startPos && endPos) {
                break;
            }
        }
    }

    if (!startPos || !endPos) {
        console.error('Start or end position not found!');
        return false;
    }

    
    const queue: CellPosition[] = [startPos];
    const visited = new Set<string>();
    visited.add(`${startPos.row},${startPos.col}`);

    while (queue.length > 0) {
        const current = queue.shift()!;

        
        if (current.row === endPos.row && current.col === endPos.col) {
            return true;
        }

        
        const directions = [
            { row: -1, col: 0 }, 
            { row: 0, col: 1 },  
            { row: 1, col: 0 },  
            { row: 0, col: -1 }, 
        ];

        for (const dir of directions) {
            const newRow = current.row + dir.row;
            const newCol = current.col + dir.col;

            
            if (
                newRow >= 0 && newRow < grid.length &&
                newCol >= 0 && newCol < grid[0].length
            ) {
                const newPos = { row: newRow, col: newCol };
                const key = `${newRow},${newCol}`;

                
                if (!visited.has(key) && grid[newRow][newCol].type !== 'wall') {
                    visited.add(key);
                    queue.push(newPos);
                }
            }
        }
    }

    console.warn('No path exists from start to end!');
    return false;
};

export const debugAlgorithm = (
    algorithm: string,
    step: number,
    current: CellPosition | null,
    frontier: CellPosition[],
    visited: CellPosition[]
): void => {
    console.log(`[${algorithm}] Step ${step}:`);
    console.log('Current:', current);
    console.log('Frontier size:', frontier.length);
    console.log('Visited nodes:', visited.length);
};
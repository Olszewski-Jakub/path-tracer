import { AlgorithmStep, AlgorithmConfig, CellPosition, GridMatrix } from '@/types';
import { findCellByType, getNeighbors, reconstructPath, visualizePath } from '@/utils/gridUtils';

export function* bfs(
    grid: GridMatrix,
    config: AlgorithmConfig = {}
): Generator<AlgorithmStep, AlgorithmStep, unknown> {
    const { allowDiagonals = false } = config;
    let currentGrid = grid;

    const startPos = findCellByType(currentGrid, 'start');
    const endPos   = findCellByType(currentGrid, 'end');

    if (!startPos || !endPos) {
        return { grid: currentGrid, current: null, frontier: [], visited: [], path: [], isDone: true, isPathFound: false, nodesExplored: 0, executionTime: 0 };
    }

    const queue: CellPosition[] = [{ ...startPos }];
    const visited = new Set<string>([`${startPos.row},${startPos.col}`]);
    let frontier: CellPosition[] = [];
    const visitedNodes: CellPosition[] = [];
    let current: CellPosition | null = null;
    let isPathFound = false;
    let nodesExplored = 0;
    const startTime = performance.now();

    while (queue.length > 0) {
        current = queue.shift()!;
        nodesExplored++;

        if (current.row === endPos.row && current.col === endPos.col) {
            isPathFound = true;
            break;
        }

        if (current.row !== startPos.row || current.col !== startPos.col) {
            currentGrid[current.row][current.col] = {
                ...currentGrid[current.row][current.col],
                type: 'visited',
                isVisited: true,
            };
        }

        visitedNodes.push({ ...current });
        const neighbors = getNeighbors(currentGrid, current, allowDiagonals);
        const newFrontier: CellPosition[] = [];

        for (const nb of neighbors) {
            const nk = `${nb.row},${nb.col}`;
            if (!visited.has(nk)) {
                visited.add(nk);
                currentGrid[nb.row][nb.col] = {
                    ...currentGrid[nb.row][nb.col],
                    parent: { row: current.row, col: current.col },
                    type: (nb.row === endPos.row && nb.col === endPos.col) ? 'end' : 'frontier',
                };
                queue.push({ ...nb });
                newFrontier.push({ ...nb });
            }
        }

        frontier = newFrontier;

        yield {
            grid: currentGrid,
            current: { ...current },
            frontier: [...frontier],
            visited: [...visitedNodes],
            path: [],
            isDone: false,
            isPathFound: false,
            nodesExplored,
            executionTime: performance.now() - startTime,
        };

        for (const cell of visitedNodes) {
            if ((cell.row !== startPos.row || cell.col !== startPos.col) &&
                (cell.row !== endPos.row   || cell.col !== endPos.col) &&
                (cell.row !== current!.row || cell.col !== current!.col))
                currentGrid[cell.row][cell.col] = { ...currentGrid[cell.row][cell.col], type: 'visited' };
        }
        for (const cell of frontier) {
            if ((cell.row !== startPos.row || cell.col !== startPos.col) &&
                (cell.row !== endPos.row   || cell.col !== endPos.col))
                currentGrid[cell.row][cell.col] = { ...currentGrid[cell.row][cell.col], type: 'frontier' };
        }
    }

    const path: CellPosition[] = [];
    if (isPathFound) {
        const fullPath = reconstructPath(currentGrid, endPos);
        path.push(...fullPath);
        currentGrid = visualizePath(currentGrid, fullPath);
    }

    return {
        grid: currentGrid,
        current,
        frontier,
        visited: visitedNodes,
        path,
        isDone: true,
        isPathFound,
        nodesExplored,
        executionTime: performance.now() - startTime,
    };
}

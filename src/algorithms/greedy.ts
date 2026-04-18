import { CellPosition, GridMatrix, AlgorithmStep, AlgorithmConfig } from '@/types';
import {
    findCellByType, getNeighbors,
    calculateManhattanDistance, calculateChebyshevDistance,
    reconstructPath, visualizePath,
} from '@/utils/gridUtils';
import { PriorityQueue } from '@/utils/algorithmUtils';

export function* greedy(
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

    const heuristic = (pos: CellPosition) =>
        allowDiagonals
            ? calculateChebyshevDistance(pos, endPos)
            : calculateManhattanDistance(pos, endPos);

    const openSet = new PriorityQueue<CellPosition>();
    const openSetKeys = new Set<string>();
    const closedSet = new Set<string>();
    const visitedNodes: CellPosition[] = [];
    let frontier: CellPosition[] = [];
    let current: CellPosition | null = null;
    let isPathFound = false;
    let nodesExplored = 0;
    const startTime = performance.now();

    // Initialise heuristics
    for (let row = 0; row < currentGrid.length; row++)
        for (let col = 0; col < currentGrid[0].length; col++)
            currentGrid[row][col].hScore = heuristic({ row, col });

    openSet.enqueue(startPos, currentGrid[startPos.row][startPos.col].hScore);
    openSetKeys.add(`${startPos.row},${startPos.col}`);
    frontier = [{ ...startPos }];

    while (!openSet.isEmpty()) {
        current = openSet.dequeue();
        if (!current) break;

        const ck = `${current.row},${current.col}`;
        openSetKeys.delete(ck);

        if (current.row === endPos.row && current.col === endPos.col) {
            isPathFound = true;
            break;
        }

        closedSet.add(ck);
        nodesExplored++;
        visitedNodes.push({ ...current });

        if (current.row !== startPos.row || current.col !== startPos.col) {
            currentGrid[current.row][current.col] = {
                ...currentGrid[current.row][current.col],
                type: 'visited',
                isVisited: true,
            };
        }

        const neighbors = getNeighbors(currentGrid, current, allowDiagonals);
        const newFrontier: CellPosition[] = [];

        for (const nb of neighbors) {
            const nk = `${nb.row},${nb.col}`;
            if (closedSet.has(nk) || openSetKeys.has(nk)) continue;

            currentGrid[nb.row][nb.col].parent = { row: current.row, col: current.col };

            if (nb.row !== endPos.row || nb.col !== endPos.col)
                currentGrid[nb.row][nb.col].type = 'frontier';

            openSet.enqueue({ ...nb }, currentGrid[nb.row][nb.col].hScore);
            openSetKeys.add(nk);
            newFrontier.push({ ...nb });
        }

        frontier = newFrontier;

        yield {
            grid: JSON.parse(JSON.stringify(currentGrid)),
            current: { ...current },
            frontier: frontier.map(p => ({ ...p })),
            visited: visitedNodes.map(p => ({ ...p })),
            path: [],
            isDone: false,
            isPathFound: false,
            nodesExplored,
            executionTime: performance.now() - startTime,
        };
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

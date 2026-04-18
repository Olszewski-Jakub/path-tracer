import { CellPosition, GridMatrix, AlgorithmStep, AlgorithmConfig } from '@/types';
import {
    findCellByType, getNeighbors,
    calculateManhattanDistance, calculateChebyshevDistance,
    reconstructPath, visualizePath,
} from '@/utils/gridUtils';
import { PriorityQueue } from '@/utils/algorithmUtils';

export function* astar(
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
    const openSetPositions = new Set<string>();
    const closedSet = new Set<string>();
    const frontier: CellPosition[] = [];
    const visitedNodes: CellPosition[] = [];
    let current: CellPosition | null = null;
    let isPathFound = false;
    let nodesExplored = 0;
    const startTime = performance.now();

    for (let row = 0; row < currentGrid.length; row++) {
        for (let col = 0; col < currentGrid[0].length; col++) {
            currentGrid[row][col].gScore = Infinity;
            currentGrid[row][col].fScore = Infinity;
            currentGrid[row][col].hScore = heuristic({ row, col });
        }
    }

    currentGrid[startPos.row][startPos.col].gScore = 0;
    currentGrid[startPos.row][startPos.col].fScore = currentGrid[startPos.row][startPos.col].hScore;
    openSet.enqueue(startPos, currentGrid[startPos.row][startPos.col].fScore);
    openSetPositions.add(`${startPos.row},${startPos.col}`);
    frontier.push({ ...startPos });

    while (!openSet.isEmpty()) {
        current = openSet.dequeue();
        if (!current) break;

        const ck = `${current.row},${current.col}`;
        openSetPositions.delete(ck);

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

        const currentG = currentGrid[current.row][current.col].gScore;
        const neighbors = getNeighbors(currentGrid, current, allowDiagonals);
        const newFrontier: CellPosition[] = [];

        for (const nb of neighbors) {
            const nk = `${nb.row},${nb.col}`;
            if (closedSet.has(nk)) continue;

            const tentG = currentG + 1;
            if (tentG < currentGrid[nb.row][nb.col].gScore) {
                currentGrid[nb.row][nb.col].gScore = tentG;
                currentGrid[nb.row][nb.col].fScore = tentG + currentGrid[nb.row][nb.col].hScore;
                currentGrid[nb.row][nb.col].parent = { row: current.row, col: current.col };

                if (nb.row !== endPos.row || nb.col !== endPos.col)
                    currentGrid[nb.row][nb.col].type = 'frontier';

                if (!openSetPositions.has(nk)) {
                    openSet.enqueue({ ...nb }, currentGrid[nb.row][nb.col].fScore);
                    openSetPositions.add(nk);
                    newFrontier.push({ ...nb });
                }
            }
        }

        frontier.length = 0;
        frontier.push(...newFrontier);

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

        visitedNodes.forEach(cell => {
            if ((cell.row !== startPos.row || cell.col !== startPos.col) &&
                (cell.row !== endPos.row   || cell.col !== endPos.col) &&
                (cell.row !== current!.row || cell.col !== current!.col) &&
                currentGrid[cell.row][cell.col].type !== 'frontier') {
                currentGrid[cell.row][cell.col].type = 'visited';
            }
        });
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

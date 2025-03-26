import {AlgorithmStep, CellPosition, GridMatrix} from '@/types';
import {findCellByType, getNeighbors, reconstructPath, visualizePath} from '@/utils/gridUtils';

/**
 * Breadth-First Search (BFS) algorithm implementation for pathfinding.
 *
 * @param {GridMatrix} grid - The grid representing the map with cells.
 * @returns {Generator<AlgorithmStep, AlgorithmStep, unknown>} - A generator yielding steps of the algorithm.
 */
export function* bfs(grid: GridMatrix): Generator<AlgorithmStep, AlgorithmStep, unknown> {
    console.log("Starting BFS algorithm");

    let currentGrid = grid;

    const startPos = findCellByType(currentGrid, 'start');
    const endPos = findCellByType(currentGrid, 'end');

    console.log("Start position:", startPos);
    console.log("End position:", endPos);

    if (!startPos || !endPos) {
        console.error("Start or end position not found!");
        return {
            grid: currentGrid,
            current: null,
            frontier: [],
            visited: [],
            path: [],
            isDone: true,
            isPathFound: false,
            nodesExplored: 0,
            executionTime: 0,
        };
    }

    const queue: CellPosition[] = [startPos];
    const visited: Set<string> = new Set();
    const frontier: CellPosition[] = [];
    const visitedNodes: CellPosition[] = [];
    let current: CellPosition | null = null;
    let isPathFound = false;
    let nodesExplored = 0;
    const startTime = performance.now();

    visited.add(`${startPos.row},${startPos.col}`);

    while (queue.length > 0) {

        current = queue.shift()!;
        nodesExplored++;

        if (current.row === endPos.row && current.col === endPos.col) {
            isPathFound = true;
            break;
        }

        if (current.row !== startPos.row || current.col !== startPos.col) {
            if (current.row === endPos.row && current.col === endPos.col) {

                currentGrid[current.row][current.col].isVisited = true;
            } else {

                currentGrid[current.row][current.col] = {
                    ...currentGrid[current.row][current.col],
                    type: 'visited',
                    isVisited: true,
                };
            }
        }

        visitedNodes.push(current);

        const neighbors = getNeighbors(currentGrid, current);
        console.log(`Processing node (${current.row},${current.col}) with ${neighbors.length} neighbors`);

        const newFrontier: CellPosition[] = [];

        for (const neighbor of neighbors) {
            const posKey = `${neighbor.row},${neighbor.col}`;

            if (!visited.has(posKey)) {

                visited.add(posKey);
                console.log(`Adding neighbor (${neighbor.row},${neighbor.col}) to queue`);

                if (neighbor.row === endPos.row && neighbor.col === endPos.col) {
                    console.log(`Found end node at (${neighbor.row},${neighbor.col})!`);
                }

                currentGrid[neighbor.row][neighbor.col] = {
                    ...currentGrid[neighbor.row][neighbor.col],
                    parent: {row: current.row, col: current.col},
                };

                if (neighbor.row === endPos.row && neighbor.col === endPos.col) {

                    currentGrid[neighbor.row][neighbor.col].type = 'end';
                } else {

                    currentGrid[neighbor.row][neighbor.col].type = 'frontier';
                }

                queue.push(neighbor);
                newFrontier.push(neighbor);
            }
        }

        frontier.length = 0;
        frontier.push(...newFrontier);

        yield {
            grid: currentGrid,
            current,
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
                (cell.row !== endPos.row || cell.col !== endPos.col) &&
                (cell.row !== current?.row || cell.col !== current?.col)) {
                currentGrid[cell.row][cell.col] = {
                    ...currentGrid[cell.row][cell.col],
                    type: 'visited',
                };
            }
        }

        for (const cell of frontier) {
            if ((cell.row !== startPos.row || cell.col !== startPos.col) &&
                (cell.row !== endPos.row || cell.col !== endPos.col)) {
                currentGrid[cell.row][cell.col] = {
                    ...currentGrid[cell.row][cell.col],
                    type: 'frontier',
                };
            }
        }
    }

    const path: CellPosition[] = [];
    if (isPathFound) {
        const fullPath = reconstructPath(currentGrid, endPos);
        path.push(...fullPath);
        currentGrid = visualizePath(currentGrid, fullPath);
    }

    const executionTime = performance.now() - startTime;

    return {
        grid: currentGrid,
        current,
        frontier,
        visited: visitedNodes,
        path,
        isDone: true,
        isPathFound,
        nodesExplored,
        executionTime,
    };
}
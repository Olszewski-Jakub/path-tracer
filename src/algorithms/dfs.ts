import {CellPosition, AlgorithmStep, GridMatrix} from '@/types';
import { findCellByType, getNeighbors, reconstructPath, visualizePath } from '@/utils/gridUtils';

/**
 * Depth-First Search (DFS) algorithm implementation for pathfinding.
 *
 * @param {GridMatrix} grid - The grid representing the map with cells.
 * @returns {Generator<AlgorithmStep, AlgorithmStep, unknown>} - A generator yielding steps of the algorithm.
 */
export function* dfs(grid: GridMatrix): Generator<AlgorithmStep, AlgorithmStep, unknown> {
  let currentGrid = grid;

  const startPos = findCellByType(currentGrid, 'start');
  const endPos = findCellByType(currentGrid, 'end');

  if (!startPos || !endPos) {
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

  const stack: CellPosition[] = [startPos];
  const visited: Set<string> = new Set();
  const frontier: CellPosition[] = [];
  const visitedNodes: CellPosition[] = [];
  let current: CellPosition | null = null;
  let isPathFound = false;
  let nodesExplored = 0;
  const startTime = performance.now();

  visited.add(`${startPos.row},${startPos.col}`);

  while (stack.length > 0) {
    current = stack.pop()!;
    nodesExplored++;

    if (current.row === endPos.row && current.col === endPos.col) {
      isPathFound = true;
      break;
    }

    if (current.row !== startPos.row || current.col !== startPos.col) {
      currentGrid[current.row][current.col] = {
        ...currentGrid[current.row][current.col],
        type: 'current',
        isVisited: true,
      };
    }

    visitedNodes.push(current);

    const neighbors = getNeighbors(currentGrid, current);
    frontier.length = 0;

    for (const neighbor of neighbors) {
      const posKey = `${neighbor.row},${neighbor.col}`;

      if (!visited.has(posKey)) {

        visited.add(posKey);

        currentGrid[neighbor.row][neighbor.col] = {
          ...currentGrid[neighbor.row][neighbor.col],
          parent: { row: current.row, col: current.col },
          type: neighbor.row === endPos.row && neighbor.col === endPos.col ? 'end' : 'frontier',
        };

        stack.push(neighbor);
        frontier.push(neighbor);
      }
    }

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
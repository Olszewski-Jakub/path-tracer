import { CellPosition, GridMatrix, AlgorithmStep } from '@/types';
import { findCellByType, getNeighbors, reconstructPath, visualizePath } from '@/utils/gridUtils';
import { PriorityQueue } from '@/utils/algorithmUtils';

/**
 * Dijkstra's algorithm implementation for pathfinding.
 *
 * @param {GridMatrix} grid - The grid representing the map with cells.
 * @returns {Generator<AlgorithmStep, AlgorithmStep, unknown>} - A generator yielding steps of the algorithm.
 */
export function* dijkstra(grid: GridMatrix): Generator<AlgorithmStep, AlgorithmStep, unknown> {
  console.log("Starting Dijkstra's algorithm");

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

  const pq = new PriorityQueue<CellPosition>();
  const visited = new Set<string>();
  const frontier: CellPosition[] = [];
  const visitedNodes: CellPosition[] = [];
  let current: CellPosition | null = null;
  let isPathFound = false;
  let nodesExplored = 0;
  const startTime = performance.now();

  for (let row = 0; row < currentGrid.length; row++) {
    for (let col = 0; col < currentGrid[0].length; col++) {
      const pos = { row, col };
      const posKey = `${row},${col}`;
      const distance = row === startPos.row && col === startPos.col ? 0 : Infinity;
      currentGrid[row][col].distance = distance;
    }
  }

  pq.enqueue(startPos, 0);
  frontier.push(startPos);

  while (!pq.isEmpty()) {
    current = pq.dequeue();
    if (!current) break;

    const currentKey = `${current.row},${current.col}`;

    if (visited.has(currentKey)) {
      console.log(`Skipping already visited node (${current.row},${current.col})`);
      continue;
    }

    console.log(`Processing node (${current.row},${current.col})`);

    visited.add(currentKey);
    nodesExplored++;
    visitedNodes.push({ ...current });

    if (current.row === endPos.row && current.col === endPos.col) {
      console.log("Found end node! Path complete.");
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

    const currentDistance = currentGrid[current.row][current.col].distance;

    const neighbors = getNeighbors(currentGrid, current);
    console.log(`Found ${neighbors.length} neighbors for node (${current.row},${current.col})`);

    const newFrontier: CellPosition[] = [];

    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.row},${neighbor.col}`;


      if (visited.has(neighborKey)) {
        console.log(`Neighbor (${neighbor.row},${neighbor.col}) already visited`);
        continue;
      }

      const newDistance = currentDistance + 1;
      const neighborCurrentDistance = currentGrid[neighbor.row][neighbor.col].distance;

      if (newDistance < neighborCurrentDistance) {
        console.log(`Found shorter path to (${neighbor.row},${neighbor.col}): ${newDistance} < ${neighborCurrentDistance}`);

        currentGrid[neighbor.row][neighbor.col].distance = newDistance;

        currentGrid[neighbor.row][neighbor.col] = {
          ...currentGrid[neighbor.row][neighbor.col],
          parent: { row: current.row, col: current.col },
          distance: newDistance,
        };

        if (neighbor.row === endPos.row && neighbor.col === endPos.col) {

          currentGrid[neighbor.row][neighbor.col].type = 'end';
        } else {

          currentGrid[neighbor.row][neighbor.col].type = 'frontier';
        }

        pq.enqueue(neighbor, newDistance);
        newFrontier.push({ ...neighbor });
      }
    }

    frontier.length = 0;
    frontier.push(...newFrontier);

    const gridCopy = JSON.parse(JSON.stringify(currentGrid)) as GridMatrix;
    const currentCopy = current ? { ...current } : null;
    const frontierCopy = frontier.map(pos => ({ ...pos }));
    const visitedCopy = visitedNodes.map(pos => ({ ...pos }));

    yield {
      grid: gridCopy,
      current: currentCopy,
      frontier: frontierCopy,
      visited: visitedCopy,
      path: [],
      isDone: false,
      isPathFound: false,
      nodesExplored,
      executionTime: performance.now() - startTime,
    };

    visitedNodes.forEach(cell => {
      if ((cell.row !== startPos.row || cell.col !== startPos.col) &&
          (cell.row !== endPos.row || cell.col !== endPos.col) &&
          (cell.row !== current?.row || cell.col !== current?.col) &&
          currentGrid[cell.row][cell.col].type !== 'frontier') {
        currentGrid[cell.row][cell.col].type = 'visited';
      }
    });
  }

  const path: CellPosition[] = [];
  if (isPathFound) {
    console.log("Path found! Reconstructing path.");
    const fullPath = reconstructPath(currentGrid, endPos);
    path.push(...fullPath);
    currentGrid = visualizePath(currentGrid, fullPath);
  } else {
    console.log("No path found!");
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
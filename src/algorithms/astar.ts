import { CellPosition, GridMatrix, AlgorithmStep } from '@/types';
import { findCellByType, getNeighbors, calculateManhattanDistance, reconstructPath, visualizePath } from '@/utils/gridUtils';
import { PriorityQueue } from '@/utils/algorithmUtils';

export function* astar(grid: GridMatrix): Generator<AlgorithmStep, AlgorithmStep, unknown> {
  let currentGrid = grid;

  const startPos = findCellByType(currentGrid, 'start');
  const endPos = findCellByType(currentGrid, 'end');

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
      currentGrid[row][col].hScore = calculateManhattanDistance(
          { row, col },
          endPos
      );
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

    const currentKey = `${current.row},${current.col}`;
    openSetPositions.delete(currentKey);

    if (current.row === endPos.row && current.col === endPos.col) {
      isPathFound = true;
      break;
    }

    closedSet.add(currentKey);
    nodesExplored++;
    visitedNodes.push({ ...current });

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

    const currentGScore = currentGrid[current.row][current.col].gScore;

    const neighbors = getNeighbors(currentGrid, current);
    console.log(`Found ${neighbors.length} neighbors for node (${current.row},${current.col})`);

    const newFrontier: CellPosition[] = [];

    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.row},${neighbor.col}`;

      if (closedSet.has(neighborKey)) {
        console.log(`Neighbor (${neighbor.row},${neighbor.col}) already in closed set`);
        continue;
      }

      const tentativeGScore = currentGScore + 1;
      const neighborGScore = currentGrid[neighbor.row][neighbor.col].gScore;

      if (tentativeGScore < neighborGScore) {
        currentGrid[neighbor.row][neighbor.col].gScore = tentativeGScore;
        currentGrid[neighbor.row][neighbor.col].fScore =
            tentativeGScore + currentGrid[neighbor.row][neighbor.col].hScore;

        currentGrid[neighbor.row][neighbor.col].parent = {
          row: current.row,
          col: current.col
        };

        if (neighbor.row === endPos.row && neighbor.col === endPos.col) {
          currentGrid[neighbor.row][neighbor.col].type = 'end';
        } else {
          currentGrid[neighbor.row][neighbor.col].type = 'frontier';
        }

        if (!openSetPositions.has(neighborKey)) {
          openSet.enqueue(
              { ...neighbor },
              currentGrid[neighbor.row][neighbor.col].fScore
          );
          openSetPositions.add(neighborKey);
          newFrontier.push({ ...neighbor });
        }
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
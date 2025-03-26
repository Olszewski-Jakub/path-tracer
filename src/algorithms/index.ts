import { astar } from './astar';
import { dijkstra } from './dijkstra';
import { bfs } from './bfs';
import { dfs } from './dfs';
import { AlgorithmType, GridMatrix, AlgorithmStep } from '@/types';

export { astar, dijkstra, bfs, dfs };

/**
 * Returns a generator function for the specified pathfinding algorithm.
 *
 * @param {AlgorithmType} type - The type of algorithm to use (e.g., 'astar', 'dijkstra', 'bfs', 'dfs').
 * @param {GridMatrix} grid - The grid representing the map with cells.
 * @returns {Generator<AlgorithmStep, AlgorithmStep, unknown>} - A generator yielding steps of the algorithm.
 */
export const getAlgorithmGenerator = (type: AlgorithmType, grid: GridMatrix): Generator<AlgorithmStep, AlgorithmStep, unknown> => {

  const gridCopy = JSON.parse(JSON.stringify(grid)) as GridMatrix;

  console.log(`Creating algorithm generator for ${type}`);
  console.log("Grid dimensions:", gridCopy.length, "x", gridCopy[0].length);

  for (let row = 0; row < gridCopy.length; row++) {
    for (let col = 0; col < gridCopy[0].length; col++) {
      gridCopy[row][col] = {
        ...gridCopy[row][col],
        distance: gridCopy[row][col].type === 'start' ? 0 : Infinity,
        fScore: gridCopy[row][col].type === 'start' ? 0 : Infinity,
        gScore: gridCopy[row][col].type === 'start' ? 0 : Infinity,
        hScore: 0,
        parent: null,
        isVisited: false,
      };
    }
  }

  switch (type) {
    case 'astar':
      return astar(gridCopy);
    case 'dijkstra':
      return dijkstra(gridCopy);
    case 'bfs':
      return bfs(gridCopy);
    case 'dfs':
      return dfs(gridCopy);
    default:
      console.log("Unknown algorithm type, defaulting to A*");
      return astar(gridCopy);
  }
};
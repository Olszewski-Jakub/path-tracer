import { astar }         from './astar';
import { dijkstra }      from './dijkstra';
import { bfs }           from './bfs';
import { dfs }           from './dfs';
import { greedy }        from './greedy';
import { bidirectional } from './bidirectional';
import { AlgorithmType, AlgorithmConfig, GridMatrix, AlgorithmStep } from '@/types';

export { astar, dijkstra, bfs, dfs, greedy, bidirectional };

export const getAlgorithmGenerator = (
    type: AlgorithmType,
    grid: GridMatrix,
    config: AlgorithmConfig = {}
): Generator<AlgorithmStep, AlgorithmStep, unknown> => {
    const gridCopy = JSON.parse(JSON.stringify(grid)) as GridMatrix;

    for (let row = 0; row < gridCopy.length; row++) {
        for (let col = 0; col < gridCopy[0].length; col++) {
            gridCopy[row][col] = {
                ...gridCopy[row][col],
                distance: gridCopy[row][col].type === 'start' ? 0 : Infinity,
                fScore:   gridCopy[row][col].type === 'start' ? 0 : Infinity,
                gScore:   gridCopy[row][col].type === 'start' ? 0 : Infinity,
                hScore:   0,
                parent:   null,
                isVisited: false,
            };
        }
    }

    switch (type) {
        case 'astar':         return astar(gridCopy, config);
        case 'dijkstra':      return dijkstra(gridCopy, config);
        case 'bfs':           return bfs(gridCopy, config);
        case 'dfs':           return dfs(gridCopy, config);
        case 'greedy':        return greedy(gridCopy, config);
        case 'bidirectional': return bidirectional(gridCopy, config);
        default:              return astar(gridCopy, config);
    }
};

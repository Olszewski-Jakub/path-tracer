import { GridMatrix, CellPosition } from './grid';

export type AlgorithmType = 'astar' | 'dijkstra' | 'bfs' | 'dfs';

export interface AlgorithmStep {
    grid: GridMatrix;
    current: CellPosition | null;
    frontier: CellPosition[];
    visited: CellPosition[];
    path: CellPosition[];
    isDone: boolean;
    isPathFound: boolean;
    nodesExplored: number;
    executionTime: number;
}

export interface AlgorithmStats {
    nodesExplored: number;
    pathLength: number;
    executionTime: number; 
    timeComplexity: string; 
    spaceComplexity: string; 
}

export interface AlgorithmInfo {
    name: string;
    type: AlgorithmType;
    description: string;
    timeComplexity: string;
    spaceComplexity: string;
}
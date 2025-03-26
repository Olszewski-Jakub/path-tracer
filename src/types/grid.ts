export type CellType = 'empty' | 'wall' | 'start' | 'end' | 'visited' | 'path' | 'current' | 'frontier';

export interface CellPosition {
    row: number;
    col: number;
}

export interface Cell {
    position: CellPosition;
    type: CellType;
    distance: number; 
    fScore: number; 
    gScore: number; 
    hScore: number; 
    parent: CellPosition | null; 
    isVisited: boolean;
}

export type GridMatrix = Cell[][];
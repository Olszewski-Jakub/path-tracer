import { AlgorithmInfo, AlgorithmType } from '@/types';

export const algorithmInfoMap: Record<AlgorithmType, AlgorithmInfo> = {
    astar: {
        name: 'A* Search',
        type: 'astar',
        description: 'A* is an informed search algorithm that uses a heuristic to estimate the cost to reach the goal. It prioritizes paths that appear to be leading closer to the goal.',
        timeComplexity: 'O(E log V)',
        spaceComplexity: 'O(V)',
    },
    dijkstra: {
        name: 'Dijkstra\'s Algorithm',
        type: 'dijkstra',
        description: 'Dijkstra\'s algorithm is a shortest path algorithm that guarantees the optimal solution by exploring nodes in order of their distance from the start.',
        timeComplexity: 'O(E log V)',
        spaceComplexity: 'O(V)',
    },
    bfs: {
        name: 'Breadth-First Search',
        type: 'bfs',
        description: 'BFS explores all neighbor nodes at the present depth before moving on to nodes at the next depth level. It guarantees the shortest path in unweighted graphs.',
        timeComplexity: 'O(V + E)',
        spaceComplexity: 'O(V)',
    },
    dfs: {
        name: 'Depth-First Search',
        type: 'dfs',
        description: 'DFS explores as far as possible along each branch before backtracking. It does not guarantee the shortest path but can be useful for maze exploration.',
        timeComplexity: 'O(V + E)',
        spaceComplexity: 'O(V)',
    },
};

export class PriorityQueue<T> {
    private items: { element: T; priority: number }[];

    constructor() {
        this.items = [];
    }

    
    enqueue(element: T, priority: number): void {
        const queueElement = { element, priority };

        
        let added = false;
        for (let i = 0; i < this.items.length; i++) {
            if (queueElement.priority < this.items[i].priority) {
                this.items.splice(i, 0, queueElement);
                added = true;
                break;
            }
        }

        
        if (!added) {
            this.items.push(queueElement);
        }

        
        console.log(`PQ: Enqueued element with priority ${priority}, queue size: ${this.items.length}`);
    }

    
    dequeue(): T | null {
        if (this.isEmpty()) {
            return null;
        }
        const item = this.items.shift()!;
        console.log(`PQ: Dequeued element with priority ${item.priority}, remaining: ${this.items.length}`);
        return item.element;
    }

    
    isEmpty(): boolean {
        return this.items.length === 0;
    }

    
    size(): number {
        return this.items.length;
    }

    
    contains(element: T, compareFn: (a: T, b: T) => boolean): boolean {
        return this.items.some(item => compareFn(item.element, element));
    }

    
    getElementIndex(element: T, compareFn: (a: T, b: T) => boolean): number {
        return this.items.findIndex(item => compareFn(item.element, element));
    }

    
    updatePriority(element: T, newPriority: number, compareFn: (a: T, b: T) => boolean): void {
        
        const index = this.getElementIndex(element, compareFn);

        if (index !== -1) {
            
            this.items.splice(index, 1);
            
            this.enqueue(element, newPriority);
            console.log(`PQ: Updated element priority to ${newPriority}`);
        }
    }

    
    getAll(): { element: T; priority: number }[] {
        return [...this.items];
    }

    
    peek(): T | null {
        if (this.isEmpty()) {
            return null;
        }
        return this.items[0].element;
    }
}

export const areCellPositionsEqual = (a: { row: number; col: number }, b: { row: number; col: number }): boolean => {
    return a.row === b.row && a.col === b.col;
};
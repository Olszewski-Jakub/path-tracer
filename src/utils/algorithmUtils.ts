import { AlgorithmInfo, AlgorithmType } from '@/types';

export const ALGO_COLORS: Record<string, string> = {
    astar:         '#6366f1',
    dijkstra:      '#06b6d4',
    bfs:           '#10b981',
    dfs:           '#f59e0b',
    greedy:        '#f97316',
    bidirectional: '#ec4899',
};

export const algorithmInfoMap: Record<AlgorithmType, AlgorithmInfo> = {
    astar: {
        name: 'A* Search',
        type: 'astar',
        description: 'Informed search using g(n)+h(n). Balances explored distance with estimated remaining cost to guarantee shortest path faster than Dijkstra.',
        timeComplexity: 'O(E log V)',
        spaceComplexity: 'O(V)',
    },
    dijkstra: {
        name: "Dijkstra's",
        type: 'dijkstra',
        description: 'Explores nodes in order of cumulative distance from start. Guarantees the shortest path; slower than A* because it ignores goal direction.',
        timeComplexity: 'O(E log V)',
        spaceComplexity: 'O(V)',
    },
    bfs: {
        name: 'BFS',
        type: 'bfs',
        description: 'Explores all cells at depth d before depth d+1. Guarantees shortest path in unweighted grids. Simple and predictable.',
        timeComplexity: 'O(V + E)',
        spaceComplexity: 'O(V)',
    },
    dfs: {
        name: 'DFS',
        type: 'dfs',
        description: 'Dives deep along one branch before backtracking. Does not guarantee shortest path but uses minimal memory. Great for maze exploration.',
        timeComplexity: 'O(V + E)',
        spaceComplexity: 'O(V)',
    },
    greedy: {
        name: 'Greedy BFS',
        type: 'greedy',
        description: 'Prioritises cells purely by heuristic h(n) — ignoring distance travelled. Very fast but not optimal; can be misled by local structure.',
        timeComplexity: 'O(E log V)',
        spaceComplexity: 'O(V)',
    },
    bidirectional: {
        name: 'Bi-BFS',
        type: 'bidirectional',
        description: 'BFS from both start and end simultaneously. The two frontiers meet in the middle, roughly halving the search space compared to one-directional BFS.',
        timeComplexity: 'O(b^(d/2))',
        spaceComplexity: 'O(b^(d/2))',
    },
};

export class PriorityQueue<T> {
    private items: { element: T; priority: number }[] = [];

    enqueue(element: T, priority: number): void {
        const qe = { element, priority };
        let added = false;
        for (let i = 0; i < this.items.length; i++) {
            if (qe.priority < this.items[i].priority) {
                this.items.splice(i, 0, qe);
                added = true;
                break;
            }
        }
        if (!added) this.items.push(qe);
    }

    dequeue(): T | null {
        return this.isEmpty() ? null : this.items.shift()!.element;
    }

    isEmpty(): boolean { return this.items.length === 0; }
    size(): number { return this.items.length; }

    contains(element: T, compareFn: (a: T, b: T) => boolean): boolean {
        return this.items.some(i => compareFn(i.element, element));
    }

    getElementIndex(element: T, compareFn: (a: T, b: T) => boolean): number {
        return this.items.findIndex(i => compareFn(i.element, element));
    }

    updatePriority(element: T, newPriority: number, compareFn: (a: T, b: T) => boolean): void {
        const index = this.getElementIndex(element, compareFn);
        if (index !== -1) {
            this.items.splice(index, 1);
            this.enqueue(element, newPriority);
        }
    }

    peek(): T | null { return this.isEmpty() ? null : this.items[0].element; }
    getAll(): { element: T; priority: number }[] { return [...this.items]; }
}

export const areCellPositionsEqual = (
    a: { row: number; col: number },
    b: { row: number; col: number }
): boolean => a.row === b.row && a.col === b.col;

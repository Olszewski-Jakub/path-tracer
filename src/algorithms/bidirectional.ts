import { CellPosition, GridMatrix, AlgorithmStep, AlgorithmConfig, CellType } from '@/types';
import { findCellByType, getNeighbors, visualizePath } from '@/utils/gridUtils';

type ParentMap = Map<string, CellPosition | null>;

const key = (p: CellPosition) => `${p.row},${p.col}`;

function buildPath(
    meeting: CellPosition,
    pStart: ParentMap,
    pEnd: ParentMap
): CellPosition[] {
    // start → meeting (reverse walk through pStart)
    const half1: CellPosition[] = [];
    let c: CellPosition | null = meeting;
    while (c !== null) {
        half1.unshift({ ...c });
        const parent = pStart.get(key(c));
        if (parent === undefined) break;
        c = parent;
    }

    // meeting → end (walk forward through pEnd)
    const half2: CellPosition[] = [];
    let c2 = pEnd.get(key(meeting)) ?? null;
    while (c2 !== null) {
        half2.push({ ...c2 });
        const parent = pEnd.get(key(c2));
        if (parent === undefined) break;
        c2 = parent ?? null;
    }

    return [...half1, ...half2];
}

export function* bidirectional(
    grid: GridMatrix,
    config: AlgorithmConfig = {}
): Generator<AlgorithmStep, AlgorithmStep, unknown> {
    const { allowDiagonals = false } = config;
    const currentGrid = grid;

    const startPos = findCellByType(currentGrid, 'start');
    const endPos   = findCellByType(currentGrid, 'end');

    if (!startPos || !endPos) {
        return { grid: currentGrid, current: null, frontier: [], visited: [], path: [], isDone: true, isPathFound: false, nodesExplored: 0, executionTime: 0 };
    }

    const qStart: CellPosition[] = [{ ...startPos }];
    const qEnd:   CellPosition[] = [{ ...endPos }];

    // parentStart[k] = how we reached k from start (null = root/start)
    // parentEnd[k]   = how we reached k from end   (null = root/end)
    const pStart: ParentMap = new Map([[key(startPos), null]]);
    const pEnd:   ParentMap = new Map([[key(endPos),   null]]);

    let meetingPoint: CellPosition | null = null;
    let isPathFound = false;
    let current: CellPosition | null = null;
    let nodesExplored = 0;
    const startTime = performance.now();
    const visitedNodes: CellPosition[] = [];

    const mark = (pos: CellPosition, type: CellType) => {
        const { row, col } = pos;
        if (
            (row === startPos.row && col === startPos.col) ||
            (row === endPos.row   && col === endPos.col)
        ) return;
        currentGrid[row][col] = { ...currentGrid[row][col], type };
    };

    while (qStart.length > 0 || qEnd.length > 0) {
        // ── Expand one cell from start side ──
        if (qStart.length > 0) {
            current = qStart.shift()!;
            const ck = key(current);

            if (pEnd.has(ck)) {
                meetingPoint = current;
                isPathFound = true;
                break;
            }

            nodesExplored++;
            visitedNodes.push({ ...current });
            mark(current, 'visited');

            for (const nb of getNeighbors(currentGrid, current, allowDiagonals)) {
                const nk = key(nb);
                if (!pStart.has(nk)) {
                    pStart.set(nk, current);
                    mark(nb, 'frontier');
                    qStart.push({ ...nb });
                }
            }
        }

        // ── Expand one cell from end side ──
        if (qEnd.length > 0 && !isPathFound) {
            const cur2 = qEnd.shift()!;
            const c2k = key(cur2);

            if (pStart.has(c2k)) {
                meetingPoint = cur2;
                isPathFound = true;
                break;
            }

            nodesExplored++;
            mark(cur2, 'visited');

            for (const nb of getNeighbors(currentGrid, cur2, allowDiagonals)) {
                const nk = key(nb);
                if (!pEnd.has(nk)) {
                    pEnd.set(nk, cur2);
                    // Use 'current' (purple) to visually distinguish end-side frontier
                    if (!pStart.has(nk)) mark(nb, 'current');
                    qEnd.push({ ...nb });
                }
            }
        }

        if (isPathFound) break;

        yield {
            grid: currentGrid,
            current,
            frontier: [],
            visited: visitedNodes.map(p => ({ ...p })),
            path: [],
            isDone: false,
            isPathFound: false,
            nodesExplored,
            executionTime: performance.now() - startTime,
        };
    }

    const path: CellPosition[] = [];
    if (isPathFound && meetingPoint) {
        const fullPath = buildPath(meetingPoint, pStart, pEnd);
        path.push(...fullPath);
        // Mark path cells (skip start and end)
        for (let i = 1; i < fullPath.length - 1; i++) {
            const { row, col } = fullPath[i];
            currentGrid[row][col] = { ...currentGrid[row][col], type: 'path' };
        }
        // Also set parent pointers on path cells so useAlgorithm path-reveal works
        for (let i = 1; i < fullPath.length; i++) {
            const { row, col } = fullPath[i];
            const prev = fullPath[i - 1];
            currentGrid[row][col] = {
                ...currentGrid[row][col],
                parent: { row: prev.row, col: prev.col },
            };
        }
    }

    return {
        grid: currentGrid,
        current,
        frontier: [],
        visited: visitedNodes,
        path,
        isDone: true,
        isPathFound,
        nodesExplored,
        executionTime: performance.now() - startTime,
    };
}

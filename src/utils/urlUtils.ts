import { GridMatrix, CellType } from '@/types';

const TYPE_TO_CHAR: Record<string, string> = {
    empty: 'e', wall: 'w', start: 's', end: 'n',
    visited: 'e', path: 'e', current: 'e', frontier: 'e',
};
const CHAR_TO_TYPE: Record<string, CellType> = {
    e: 'empty', w: 'wall', s: 'start', n: 'end',
};

export function encodeGrid(grid: GridMatrix): string {
    const rows = grid.length;
    const cols = grid[0].length;
    const chars = grid.flat().map(c => TYPE_TO_CHAR[c.type] ?? 'e').join('');
    const encoded = btoa(chars);
    return `?grid=${encoded}&r=${rows}&c=${cols}`;
}

export function copyGridUrlToClipboard(grid: GridMatrix): void {
    const suffix = encodeGrid(grid);
    const url = `${window.location.origin}${window.location.pathname}${suffix}`;
    navigator.clipboard.writeText(url).catch(() => {
        prompt('Copy this URL:', url);
    });
}

export function decodeGridFromUrl(): { encoded: string; rows: number; cols: number } | null {
    if (typeof window === 'undefined') return null;
    const p = new URLSearchParams(window.location.search);
    const encoded = p.get('grid');
    const rows = parseInt(p.get('r') ?? '0', 10);
    const cols = parseInt(p.get('c') ?? '0', 10);
    if (!encoded || !rows || !cols) return null;
    return { encoded, rows, cols };
}

export function applyEncodedGrid(encoded: string, rows: number, cols: number, base: GridMatrix): GridMatrix {
    try {
        const chars = atob(encoded);
        if (chars.length !== rows * cols) return base;
        const next = base.map(row => row.map(cell => ({ ...cell })));
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const t = CHAR_TO_TYPE[chars[r * cols + c]];
                if (t) {
                    next[r][c] = {
                        ...next[r][c],
                        type: t,
                        distance: t === 'start' ? 0 : Infinity,
                        fScore: t === 'start' ? 0 : Infinity,
                        gScore: t === 'start' ? 0 : Infinity,
                    };
                }
            }
        }
        return next;
    } catch {
        return base;
    }
}

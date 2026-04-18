import { useState, useCallback } from 'react';
import { AlgorithmType } from '@/types';

export interface RunRecord {
    id: number;
    algorithm: AlgorithmType;
    nodesExplored: number;
    pathLength: number;
    executionTime: number;
    isPathFound: boolean;
}

export const useRunHistory = () => {
    const [history, setHistory] = useState<RunRecord[]>([]);

    const addRun = useCallback((record: Omit<RunRecord, 'id'>) => {
        setHistory(prev => [{ ...record, id: Date.now() }, ...prev].slice(0, 6));
    }, []);

    const clearHistory = useCallback(() => setHistory([]), []);

    return { history, addRun, clearHistory };
};

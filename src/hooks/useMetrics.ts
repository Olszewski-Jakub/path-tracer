import { useMemo } from 'react';
import { AlgorithmStep } from '@/types';

interface UseMetricsProps {
    currentStep: AlgorithmStep | null;
    isDone: boolean;
}

interface UseMetricsReturn {
    nodesExplored: number;
    pathLength: number;
    executionTime: number;
    isPathFound: boolean;
    efficiencyScore: string;
}

export const useMetrics = ({
                               currentStep,
                               isDone
                           }: UseMetricsProps): UseMetricsReturn => {
    const nodesExplored = useMemo(() => currentStep?.nodesExplored || 0, [currentStep]);
    const pathLength = useMemo(() => currentStep?.path?.length || 0, [currentStep]);
    const executionTime = useMemo(() => currentStep?.executionTime || 0, [currentStep]);
    const isPathFound = useMemo(() => currentStep?.isPathFound || false, [currentStep]);

    const efficiencyScore = useMemo((): string => {
        if (!isDone || !isPathFound || pathLength === 0) return 'N/A';
        const ratio = nodesExplored / pathLength;
        return ratio.toFixed(2);
    }, [isDone, isPathFound, pathLength, nodesExplored]);

    return {
        nodesExplored,
        pathLength,
        executionTime,
        isPathFound,
        efficiencyScore
    };
};
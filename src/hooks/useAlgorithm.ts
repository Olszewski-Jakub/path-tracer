import { AlgorithmType, AlgorithmStep, GridMatrix, CellPosition, CellType } from '@/types';
import { getAlgorithmGenerator } from '@/algorithms';
import { debugAlgorithm, debugGrid, validatePath } from '@/utils/debugUtils';
import { useCallback, useEffect, useRef, useState } from 'react';

interface UseAlgorithmProps {
    initialAlgorithm: AlgorithmType;
    grid: GridMatrix;
    setGrid: (grid: GridMatrix | ((prev: GridMatrix) => GridMatrix)) => void;
}

interface UseAlgorithmReturn {
    algorithm: AlgorithmType;
    isRunning: boolean;
    isPaused: boolean;
    isDone: boolean;
    isRevealingPath: boolean;
    speed: number;
    currentStep: AlgorithmStep | null;
    steps: AlgorithmStep[];
    stepIndex: number;
    showConfetti: boolean;
    nodesExplored: number;
    pathLength: number;
    executionTime: number;
    isPathFound: boolean;
    changeAlgorithm: (newAlgorithm: AlgorithmType) => void;
    changeSpeed: (newSpeed: number) => void;
    start: () => void;
    pause: () => void;
    resume: () => void;
    stop: () => void;
    step: () => void;
    reset: () => void;
}

// Revert path cells back to visited so we can re-animate them one by one
function stripPathFromGrid(g: GridMatrix): GridMatrix {
    return g.map(row =>
        row.map(cell =>
            cell.type === 'path'
                ? { ...cell, type: 'visited' as CellType }
                : cell
        )
    );
}

export const useAlgorithm = ({
    initialAlgorithm,
    grid,
    setGrid,
}: UseAlgorithmProps): UseAlgorithmReturn => {
    const [algorithm, setAlgorithm] = useState<AlgorithmType>(initialAlgorithm);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [isDone, setIsDone] = useState<boolean>(false);
    const [isRevealingPath, setIsRevealingPath] = useState<boolean>(false);
    const [speed, setSpeed] = useState<number>(5);
    const [currentStep, setCurrentStep] = useState<AlgorithmStep | null>(null);
    const [steps, setSteps] = useState<AlgorithmStep[]>([]);
    const [stepIndex, setStepIndex] = useState<number>(0);
    const [showConfetti, setShowConfetti] = useState<boolean>(false);

    // Refs for algorithm animation loop
    const algorithmGeneratorRef = useRef<Generator<AlgorithmStep, AlgorithmStep, unknown> | null>(null);
    const animationFrameIdRef = useRef<number | null>(null);
    const lastUpdateTimeRef = useRef<number>(0);

    // Refs for path reveal animation loop
    const pathQueueRef = useRef<CellPosition[]>([]);
    const pathFrameRef = useRef<number | null>(null);
    const pathLastRef = useRef<number>(0);

    // Delay in ms for one algorithm step
    const getDelay = useCallback((): number => {
        return 500 - ((speed - 1) * (490 / 9));
    }, [speed]);

    const initializeAlgorithm = useCallback((): void => {
        const cleanGrid = JSON.parse(JSON.stringify(grid)) as GridMatrix;
        algorithmGeneratorRef.current = getAlgorithmGenerator(algorithm, cleanGrid);
        setSteps([]);
        setStepIndex(0);
        setCurrentStep(null);
        setIsDone(false);
        setIsRevealingPath(false);
        setShowConfetti(false);
        pathQueueRef.current = [];
    }, [algorithm, grid]);

    // Run a single step; returns true when the algorithm phase is finished
    const runStep = useCallback((): boolean => {
        if (!algorithmGeneratorRef.current) {
            initializeAlgorithm();
        }

        if (algorithmGeneratorRef.current) {
            try {
                const result = algorithmGeneratorRef.current.next();

                if (!result.done) {
                    const step = result.value;
                    if (step.current) {
                        debugAlgorithm(algorithm, stepIndex + 1, step.current, step.frontier, step.visited);
                    }
                    if (Array.isArray(step.grid)) {
                        setGrid(step.grid);
                    }
                    setCurrentStep(step);
                    setSteps(prev => [...prev, step]);
                    setStepIndex(prev => prev + 1);
                    return false;
                } else {
                    // Algorithm is done
                    const finalStep = result.value;
                    setCurrentStep(finalStep);
                    setSteps(prev => [...prev, finalStep]);
                    setStepIndex(prev => prev + 1);
                    setIsDone(true);

                    if (finalStep.isPathFound && Array.isArray(finalStep.path) && finalStep.path.length > 2) {
                        // Strip path cells — we'll reveal them one by one
                        if (Array.isArray(finalStep.grid)) {
                            setGrid(stripPathFromGrid(finalStep.grid));
                        }
                        // Queue inner path cells (skip start at 0 and end at length-1)
                        pathQueueRef.current = finalStep.path.slice(1, finalStep.path.length - 1);
                        setIsRevealingPath(true);
                        // Confetti fires after reveal (see path reveal loop)
                    } else {
                        // No path found — just set the final grid, no confetti
                        if (Array.isArray(finalStep.grid)) {
                            setGrid(finalStep.grid);
                        }
                    }

                    return true;
                }
            } catch (error) {
                console.error('Error running algorithm step:', error);
                setIsDone(true);
                return true;
            }
        }

        return false;
    }, [initializeAlgorithm, algorithm, stepIndex, setGrid]);

    // ── Algorithm animation loop ──────────────────────────────────────────────
    const animationLoop = useCallback((timestamp: number): void => {
        if (!isRunning || isPaused) {
            animationFrameIdRef.current = null;
            return;
        }

        const delay = getDelay();
        if (timestamp - lastUpdateTimeRef.current > delay) {
            lastUpdateTimeRef.current = timestamp;
            const done = runStep();
            if (done) {
                setIsRunning(false);
                animationFrameIdRef.current = null;
                return;
            }
        }

        animationFrameIdRef.current = requestAnimationFrame(animationLoop);
    }, [isRunning, isPaused, runStep, getDelay]);

    useEffect(() => {
        if (isRunning && !isPaused && !animationFrameIdRef.current) {
            lastUpdateTimeRef.current = performance.now();
            animationFrameIdRef.current = requestAnimationFrame(animationLoop);
        }
        return () => {
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
                animationFrameIdRef.current = null;
            }
        };
    }, [isRunning, isPaused, animationLoop]);

    // ── Path reveal loop ─────────────────────────────────────────────────────
    const pathRevealLoop = useCallback((timestamp: number): void => {
        // Path reveal runs at 60% of algorithm speed, minimum 25ms
        const pathDelay = Math.max(25, getDelay() * 0.6);

        if (timestamp - pathLastRef.current >= pathDelay) {
            pathLastRef.current = timestamp;

            const pos = pathQueueRef.current.shift();
            if (!pos) {
                // All path cells revealed
                setIsRevealingPath(false);
                setShowConfetti(true);
                pathFrameRef.current = null;
                return;
            }

            setGrid((prev: GridMatrix) => {
                const next = prev.map(r => [...r]);
                if (next[pos.row] && next[pos.row][pos.col]) {
                    next[pos.row][pos.col] = { ...next[pos.row][pos.col], type: 'path' as CellType };
                }
                return next;
            });
        }

        pathFrameRef.current = requestAnimationFrame(pathRevealLoop);
    }, [getDelay, setGrid]);

    useEffect(() => {
        if (isRevealingPath && !pathFrameRef.current) {
            pathLastRef.current = performance.now();
            pathFrameRef.current = requestAnimationFrame(pathRevealLoop);
        }
        return () => {
            if (pathFrameRef.current && !isRevealingPath) {
                cancelAnimationFrame(pathFrameRef.current);
                pathFrameRef.current = null;
            }
        };
    }, [isRevealingPath, pathRevealLoop]);

    // ── Controls ─────────────────────────────────────────────────────────────
    const start = useCallback((): void => {
        debugGrid(grid);
        validatePath(grid);
        initializeAlgorithm();
        setIsRunning(true);
        setIsPaused(false);
        setIsDone(false);
    }, [initializeAlgorithm, grid]);

    const pause = useCallback((): void => {
        setIsPaused(true);
    }, []);

    const resume = useCallback((): void => {
        setIsPaused(false);
    }, []);

    const stop = useCallback((): void => {
        setIsRunning(false);
        setIsPaused(false);
        if (animationFrameIdRef.current) {
            cancelAnimationFrame(animationFrameIdRef.current);
            animationFrameIdRef.current = null;
        }
        // Cancel path reveal if in progress
        setIsRevealingPath(false);
        pathQueueRef.current = [];
        if (pathFrameRef.current) {
            cancelAnimationFrame(pathFrameRef.current);
            pathFrameRef.current = null;
        }
    }, []);

    const step = useCallback((): void => {
        if (!isRunning && !isDone && !isRevealingPath) {
            runStep();
        }
    }, [isRunning, isDone, isRevealingPath, runStep]);

    const reset = useCallback((): void => {
        setIsRunning(false);
        setIsPaused(false);
        setIsDone(false);
        setIsRevealingPath(false);
        setCurrentStep(null);
        setSteps([]);
        setStepIndex(0);
        setShowConfetti(false);
        algorithmGeneratorRef.current = null;
        pathQueueRef.current = [];

        if (animationFrameIdRef.current) {
            cancelAnimationFrame(animationFrameIdRef.current);
            animationFrameIdRef.current = null;
        }
        if (pathFrameRef.current) {
            cancelAnimationFrame(pathFrameRef.current);
            pathFrameRef.current = null;
        }
    }, []);

    const changeAlgorithm = useCallback((newAlgorithm: string): void => {
        setAlgorithm(newAlgorithm as AlgorithmType);
        if (!isRunning && currentStep) {
            reset();
        }
    }, [isRunning, currentStep, reset]);

    const changeSpeed = useCallback((newSpeed: number): void => {
        setSpeed(newSpeed);
    }, []);

    // Derived metrics
    const nodesExplored = currentStep?.nodesExplored || 0;
    const pathLength = currentStep?.path?.length || 0;
    const executionTime = currentStep?.executionTime || 0;
    const isPathFound = currentStep?.isPathFound || false;

    return {
        algorithm,
        isRunning,
        isPaused,
        isDone,
        isRevealingPath,
        speed,
        currentStep,
        steps,
        stepIndex,
        showConfetti,
        nodesExplored,
        pathLength,
        executionTime,
        isPathFound,
        changeAlgorithm,
        changeSpeed,
        start,
        pause,
        resume,
        stop,
        step,
        reset,
    };
};

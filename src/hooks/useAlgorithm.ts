import { AlgorithmType, AlgorithmStep, GridMatrix } from '@/types';
import { getAlgorithmGenerator } from '@/algorithms';
import { debugAlgorithm, debugGrid, validatePath } from '@/utils/debugUtils';
import {useCallback, useEffect, useRef, useState} from "react";

interface UseAlgorithmProps {
  initialAlgorithm: AlgorithmType;
  grid: GridMatrix;
  setGrid: (grid: GridMatrix) => void;
}

interface UseAlgorithmReturn {
  algorithm: AlgorithmType;
  isRunning: boolean;
  isPaused: boolean;
  isDone: boolean;
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

export const useAlgorithm = ({
                               initialAlgorithm,
                               grid,
                               setGrid
                             }: UseAlgorithmProps): UseAlgorithmReturn => {
  const [algorithm, setAlgorithm] = useState<AlgorithmType>(initialAlgorithm);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(5);
  const [currentStep, setCurrentStep] = useState<AlgorithmStep | null>(null);
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  // Refs for animation and timing
  const algorithmGeneratorRef = useRef<Generator<AlgorithmStep, AlgorithmStep, unknown> | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);

  // Calculate delay based on speed
  const getDelay = useCallback((): number => {
    return 500 - ((speed - 1) * (490 / 9));
  }, [speed]);

  // Initialize algorithm
  const initializeAlgorithm = useCallback((): void => {
    // Create a deep copy of the grid for the algorithm
    const cleanGrid = JSON.parse(JSON.stringify(grid)) as GridMatrix;
    algorithmGeneratorRef.current = getAlgorithmGenerator(algorithm, cleanGrid);
    setSteps([]);
    setStepIndex(0);
    setCurrentStep(null);
    setIsDone(false);
    setShowConfetti(false);
  }, [algorithm, grid]);

  // Run a single step of the algorithm
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
            debugAlgorithm(
                algorithm,
                stepIndex + 1,
                step.current,
                step.frontier,
                step.visited
            );
          }

          if (Array.isArray(step.grid)) {
            setGrid(step.grid);
          }

          setCurrentStep(step);
          setSteps((prevSteps) => [...prevSteps, step]);
          setStepIndex((prevIndex) => prevIndex + 1);
          return false; // Not done yet
        } else {
          // Algorithm has completed
          const finalStep = result.value;

          if (Array.isArray(finalStep.grid)) {
            setGrid(finalStep.grid);
          }

          setCurrentStep(finalStep);
          setSteps((prevSteps) => [...prevSteps, finalStep]);
          setStepIndex((prevIndex) => prevIndex + 1);
          setIsDone(true);

          // Show confetti if a path was found
          if (finalStep.isPathFound) {
            setShowConfetti(true);
          }

          return true; // Done
        }
      } catch (error) {
        console.error("Error running algorithm step:", error);
        setIsDone(true);
        return true; // Done with error
      }
    }

    return false;
  }, [initializeAlgorithm, algorithm, stepIndex, setGrid]);

  // Animation loop
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

  // Start and stop animation loop based on isRunning and isPaused
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

  // Control functions
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
  }, []);

  const step = useCallback((): void => {
    if (!isRunning && !isDone) {
      runStep();
    }
  }, [isRunning, isDone, runStep]);

  const reset = useCallback((): void => {
    setIsRunning(false);
    setIsPaused(false);
    setIsDone(false);
    setCurrentStep(null);
    setSteps([]);
    setStepIndex(0);
    algorithmGeneratorRef.current = null;
    setShowConfetti(false);

    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
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

  // Metrics calculations
  const nodesExplored = currentStep?.nodesExplored || 0;
  const pathLength = currentStep?.path?.length || 0;
  const executionTime = currentStep?.executionTime || 0;
  const isPathFound = currentStep?.isPathFound || false;

  return {
    algorithm,
    isRunning,
    isPaused,
    isDone,
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
    reset
  };
};
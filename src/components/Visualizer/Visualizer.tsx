"use client";

import React from 'react';
import { Grid } from '@/components/Grid';
import {
    AlgorithmControls,
    AlgorithmProgress,
    ControlPanel,
    Sidebar,
    StatusBar,
    ConfettiEffect
} from "@/components/Visualizer/index";
import { algorithmInfoMap } from '@/utils/algorithmUtils';
import { useGrid } from '@/hooks/useGrid';
import { useAlgorithm } from '@/hooks/useAlgorithm';
import { useMetrics } from '@/hooks/useMetrics';
import { useSidebar } from '@/hooks/useSidebar';
import { useThemeMode } from '@/hooks/useTheme';
import { AlgorithmType } from '@/types';

interface LegendItem {
    label: string;
    color: string;
}

const Visualizer: React.FC = () => {
    // Theme detection
    const { isDark } = useThemeMode();

    // Sidebar state management
    const { isOpen: sidebarOpen, toggle: toggleSidebar } = useSidebar({ initialOpen: true });

    // Grid state and operations
    const {
        grid,
        setGrid,
        rows,
        cols,
        toggleCell,
        updateSize,
        resetGrid,
        clearGrid,
        generateMaze
    } = useGrid();

    // Algorithm state and operations
    const {
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
        step: runSingleStep,
        reset: resetAlgorithm
    } = useAlgorithm({
        initialAlgorithm: 'astar' as AlgorithmType,
        grid,
        setGrid
    });

    // Additional metrics
    const { efficiencyScore } = useMetrics({
        currentStep,
        isDone
    });

    // Legend items definition
    const legendItems: LegendItem[] = [
        {label: 'Start', color: 'bg-green-500'},
        {label: 'End', color: 'bg-red-500'},
        {label: 'Wall', color: isDark ? 'bg-gray-200' : 'bg-gray-800'},
        {label: 'Visited', color: 'bg-blue-400'},
        {label: 'Path', color: 'bg-yellow-400'},
        {label: 'Current', color: 'bg-purple-500'},
        {label: 'Frontier', color: 'bg-cyan-400'},
    ];

    // Handler functions combining hook operations
    const handleAlgorithmChange = (newAlgorithm: AlgorithmType) => {
        if (isRunning) return;
        changeAlgorithm(newAlgorithm);
    };

    const handleSizeChange = (newRows: number, newCols: number) => {
        if (isRunning) return;
        updateSize(newRows, newCols);
    };

    const handleCellChange = (position: { row: number, col: number }) => {
        if (isRunning && !isPaused) return;
        toggleCell(position);
    };

    const handleClear = () => {
        if (isRunning) return;
        resetAlgorithm();
        clearGrid();
    };

    const handleReset = () => {
        if (isRunning) return;
        resetAlgorithm();
        resetGrid();
    };

    const handleGenerateMaze = () => {
        if (isRunning) return;
        resetAlgorithm();
        generateMaze();
    };

    // Status message component
    const getStatusMessage = (): React.ReactNode => {
        if (!currentStep) return null;

        if (isDone) {
            return isPathFound
                ? <span className="text-green-500 font-medium">
                    Path found! Explored {nodesExplored} nodes in {executionTime.toFixed(2)} ms.
                  </span>
                : <span className="text-red-500 font-medium">
                    No path possible! All reachable nodes have been explored.
                  </span>;
        }

        return <span>
          Exploring node at ({currentStep.current?.row || 0}, {currentStep.current?.col || 0}).
          Visited {nodesExplored} nodes so far.
        </span>;
    };

    // Metrics object for components
    const metrics = {
        nodesExplored,
        pathLength,
        executionTime,
        isPathFound
    };

    return (
        <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'} `}>
            {/* Algorithm Controls */}
            <AlgorithmControls
                algorithm={algorithm}
                algorithmInfoMap={algorithmInfoMap}
                handleAlgorithmChange={handleAlgorithmChange}
                isRunning={isRunning}
                legendItems={legendItems}
                isDark={isDark}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={toggleSidebar}
            />

            {/* Control Panel */}
            <ControlPanel
                isRunning={isRunning}
                isPaused={isPaused}
                isDone={isDone}
                speed={speed}
                handleStart={start}
                handlePause={pause}
                handleResume={resume}
                handleStop={stop}
                handleStep={runSingleStep}
                handleClear={handleClear}
                handleReset={handleReset}
                handleGenerateMaze={handleGenerateMaze}
                setSpeed={changeSpeed}
                isDark={isDark}
                sidebarOpen={sidebarOpen}
                legendItems={legendItems}
            />

            <div className="flex">
                {sidebarOpen && (
                    <Sidebar
                        algorithm={algorithm}
                        algorithmInfoMap={algorithmInfoMap}
                        rows={rows}
                        cols={cols}
                        handleSizeChange={handleSizeChange}
                        isRunning={isRunning}
                        metrics={metrics}
                        isDone={isDone}
                        getEfficiencyScore={() => efficiencyScore}
                        isDark={isDark}
                    />
                )}

                {/* Main content area */}
                <main className={`flex-1 p-4 transition-all duration-300 ${sidebarOpen ? 'md:ml-0' : 'ml-0'}`}>
                    {/* Visualization container */}
                    <div className={`rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md overflow-hidden`}>
                        <StatusBar
                            isDark={isDark}
                            currentStep={currentStep}
                            getStatusMessage={getStatusMessage}
                            legendItems={legendItems}
                        />

                        {/* Grid visualization */}
                        <div className={`p-4 overflow-auto ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                            <Grid
                                grid={grid}
                                onCellChange={handleCellChange}
                                isDisabled={isRunning && !isPaused}
                                isDark={isDark}
                            />
                        </div>
                    </div>

                    {/* Algorithm progress information */}
                    {currentStep && (
                        <AlgorithmProgress
                            isDark={isDark}
                            metrics={metrics}
                            isDone={isDone}
                            currentStep={currentStep}
                        />
                    )}
                </main>
            </div>

            {/* Confetti effect could be implemented here if needed */}
            {showConfetti && (
                <div className="fixed inset-0 pointer-events-none">
                    <ConfettiEffect/>
                </div>
            )}
        </div>
    );
};

export default Visualizer;
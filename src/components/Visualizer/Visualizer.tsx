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
    const { isDark } = useThemeMode();
    const { isOpen: sidebarOpen, toggle: toggleSidebar } = useSidebar({ initialOpen: true });

    const {
        grid, setGrid, rows, cols,
        toggleCell, updateSize, resetGrid, clearGrid, generateMaze,
        isMazeGenerating,
    } = useGrid();

    const {
        algorithm, isRunning, isPaused, isDone, isRevealingPath, speed, currentStep,
        showConfetti, nodesExplored, pathLength, executionTime, isPathFound,
        changeAlgorithm, changeSpeed, start, pause, resume, stop,
        step: runSingleStep, reset: resetAlgorithm
    } = useAlgorithm({ initialAlgorithm: 'astar' as AlgorithmType, grid, setGrid });

    const { efficiencyScore } = useMetrics({ currentStep, isDone });

    const legendItems: LegendItem[] = [
        { label: 'Start', color: 'bg-green-500' },
        { label: 'End', color: 'bg-red-500' },
        { label: 'Wall', color: isDark ? 'bg-gray-200' : 'bg-gray-800' },
        { label: 'Visited', color: 'bg-blue-400' },
        { label: 'Path', color: 'bg-yellow-400' },
        { label: 'Current', color: 'bg-purple-500' },
        { label: 'Frontier', color: 'bg-cyan-400' },
    ];

    const busy = isRunning || isRevealingPath || isMazeGenerating;

    const handleAlgorithmChange = (a: AlgorithmType) => { if (!busy) changeAlgorithm(a); };
    const handleSizeChange = (r: number, c: number) => { if (!busy) updateSize(r, c); };
    const handleCellChange = (pos: { row: number; col: number }) => {
        if (busy && !isPaused) return;
        toggleCell(pos);
    };
    const handleClear = () => { if (busy) return; resetAlgorithm(); clearGrid(); };
    const handleReset = () => { if (busy) return; resetAlgorithm(); resetGrid(); };
    const handleGenerateMaze = () => { if (busy) return; resetAlgorithm(); generateMaze(); };

    const getStatusMessage = (): React.ReactNode => {
        if (isMazeGenerating) return <span style={{ color: '#10b981', fontWeight: 600 }}>Generating maze…</span>;
        if (!currentStep) return null;
        if (isRevealingPath) return <span style={{ color: '#f59e0b', fontWeight: 600 }}>Tracing path…</span>;
        if (isDone) {
            return isPathFound
                ? <span style={{ color: '#10b981', fontWeight: 600 }}>Path found! {nodesExplored} nodes explored in {executionTime.toFixed(2)} ms.</span>
                : <span style={{ color: '#ef4444', fontWeight: 600 }}>No path possible. All reachable nodes explored.</span>;
        }
        return <span>Exploring ({currentStep.current?.row ?? 0}, {currentStep.current?.col ?? 0}) &middot; {nodesExplored} nodes visited</span>;
    };

    const metrics = { nodesExplored, pathLength, executionTime, isPathFound };

    return (
        <div
            style={{
                minHeight: 'calc(100vh - 60px)',
                background: isDark
                    ? 'radial-gradient(ellipse at top, #0f172a 0%, #080c14 60%)'
                    : 'radial-gradient(ellipse at top, #e0e7ff 0%, #f8fafc 60%)',
            }}
        >
            {/* Algorithm Controls bar */}
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
                isRevealingPath={isRevealingPath}
                isMazeGenerating={isMazeGenerating}
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

                <main
                    className="flex-1 p-4 transition-all duration-300"
                    style={{ minWidth: 0 }}
                >
                    {/* Grid container */}
                    <div
                        className="rounded-2xl overflow-hidden"
                        style={{
                            background: isDark ? 'rgba(13,20,34,0.7)' : 'rgba(255,255,255,0.7)',
                            border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(15,23,42,0.08)',
                            backdropFilter: 'blur(12px)',
                            boxShadow: isDark
                                ? '0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)'
                                : '0 8px 40px rgba(15,23,42,0.1)',
                        }}
                    >
                        <StatusBar
                            isDark={isDark}
                            currentStep={currentStep}
                            getStatusMessage={getStatusMessage}
                            legendItems={legendItems}
                        />

                        <div
                            className="p-4 overflow-auto"
                            style={{
                                background: isDark ? '#080c14' : '#f1f5f9',
                            }}
                        >
                            <Grid
                                grid={grid}
                                onCellChange={handleCellChange}
                                isDisabled={busy && !isPaused}
                                isDark={isDark}
                            />
                        </div>
                    </div>

                    {currentStep && (
                        <AlgorithmProgress
                            isDark={isDark}
                            algorithm={algorithm}
                            metrics={metrics}
                            isDone={isDone}
                            isRevealingPath={isRevealingPath}
                            currentStep={currentStep}
                        />
                    )}
                </main>
            </div>

            {showConfetti && (
                <div className="fixed inset-0 pointer-events-none z-50">
                    <ConfettiEffect />
                </div>
            )}
        </div>
    );
};

export default Visualizer;

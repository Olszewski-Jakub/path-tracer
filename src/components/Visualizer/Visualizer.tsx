"use client";

import React, { useState, useEffect, useRef } from 'react';
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
import { copyGridUrlToClipboard } from '@/utils/urlUtils';
import { useGrid } from '@/hooks/useGrid';
import { useAlgorithm } from '@/hooks/useAlgorithm';
import { useMetrics } from '@/hooks/useMetrics';
import { useSidebar } from '@/hooks/useSidebar';
import { useThemeMode } from '@/hooks/useTheme';
import { useRunHistory } from '@/hooks/useRunHistory';
import { AlgorithmType, CellPosition } from '@/types';

interface LegendItem {
    label: string;
    color: string;
}

const Visualizer: React.FC = () => {
    const { isDark } = useThemeMode();
    const { isOpen: sidebarOpen, toggle: toggleSidebar } = useSidebar({ initialOpen: true });

    const [allowDiagonals, setAllowDiagonals] = useState(false);
    const [drawMode, setDrawMode] = useState<'wall' | 'erase'>('wall');

    const {
        grid, setGrid, rows, cols,
        toggleCell, eraseCell, moveNode,
        updateSize, resetGrid, clearGrid, generateMaze, loadPreset,
        isMazeGenerating,
    } = useGrid();

    const {
        algorithm, isRunning, isPaused, isDone, isRevealingPath, speed, currentStep,
        showConfetti, nodesExplored, pathLength, executionTime, isPathFound,
        changeAlgorithm, changeSpeed, start, pause, resume, stop,
        step: runSingleStep, reset: resetAlgorithm,
    } = useAlgorithm({
        initialAlgorithm: 'astar' as AlgorithmType,
        grid,
        setGrid,
        config: { allowDiagonals },
    });

    const { efficiencyScore } = useMetrics({ currentStep, isDone });
    const { history: runHistory, addRun, clearHistory } = useRunHistory();

    // Record completed runs
    const prevIsDone = useRef(false);
    useEffect(() => {
        if (isDone && !prevIsDone.current && currentStep) {
            addRun({
                algorithm,
                nodesExplored: currentStep.nodesExplored ?? 0,
                pathLength: currentStep.path?.length ?? 0,
                executionTime: currentStep.executionTime ?? 0,
                isPathFound: currentStep.isPathFound ?? false,
            });
        }
        prevIsDone.current = isDone;
    }, [isDone, currentStep, algorithm, addRun]);

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

    const handleCellChange = (pos: CellPosition) => {
        if (busy && !isPaused) return;
        if (drawMode === 'erase') {
            eraseCell(pos);
        } else {
            toggleCell(pos);
        }
    };

    const handleEraseCell = (pos: CellPosition) => {
        if (busy && !isPaused) return;
        eraseCell(pos);
    };

    const handleNodeMove = (type: 'start' | 'end', from: CellPosition, to: CellPosition) => {
        if (busy) return;
        moveNode(type, from, to);
        resetAlgorithm();
    };

    const handleClear = () => { if (busy) return; resetAlgorithm(); clearGrid(); };
    const handleReset = () => { if (busy) return; resetAlgorithm(); resetGrid(); };
    const handleGenerateMaze = () => { if (busy) return; resetAlgorithm(); generateMaze(); };
    const handleShareGrid = () => copyGridUrlToClipboard(grid);

    // Keyboard shortcuts
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;
            switch (e.key) {
                case ' ':
                    e.preventDefault();
                    if (!busy && !isDone) start();
                    else if (isRunning && !isPaused) pause();
                    else if (isPaused) resume();
                    break;
                case 'r': case 'R':
                    if (!busy) { resetAlgorithm(); resetGrid(); }
                    break;
                case 'c': case 'C':
                    if (!busy) { resetAlgorithm(); clearGrid(); }
                    break;
                case 'm': case 'M':
                    if (!busy) { resetAlgorithm(); generateMaze(); }
                    break;
                case 's': case 'S':
                    if (!busy && !isDone) runSingleStep();
                    break;
                case 'w': case 'W':
                    setDrawMode('wall');
                    break;
                case 'e': case 'E':
                    setDrawMode('erase');
                    break;
                case 'ArrowRight':
                    changeSpeed(Math.min(10, speed + 1));
                    break;
                case 'ArrowLeft':
                    changeSpeed(Math.max(1, speed - 1));
                    break;
                case '1': changeAlgorithm('astar'); break;
                case '2': changeAlgorithm('dijkstra'); break;
                case '3': changeAlgorithm('bfs'); break;
                case '4': changeAlgorithm('dfs'); break;
                case '5': changeAlgorithm('greedy'); break;
                case '6': changeAlgorithm('bidirectional'); break;
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [busy, isDone, isRunning, isPaused, speed, start, pause, resume, stop, resetAlgorithm, resetGrid, clearGrid, generateMaze, runSingleStep, changeSpeed, changeAlgorithm]);

    const getStatusMessage = (): React.ReactNode => {
        if (isMazeGenerating) return <span style={{ color: '#10b981', fontWeight: 600 }}>Generating maze…</span>;
        if (!currentStep) return <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Space to start · W/E draw/erase · 1-6 switch algorithm</span>;
        if (isRevealingPath) return <span style={{ color: '#f59e0b', fontWeight: 600 }}>Tracing path…</span>;
        if (isDone) {
            return isPathFound
                ? <span style={{ color: '#10b981', fontWeight: 600 }}>Path found! {nodesExplored} nodes in {executionTime.toFixed(2)} ms.</span>
                : <span style={{ color: '#ef4444', fontWeight: 600 }}>No path possible. All reachable nodes explored.</span>;
        }
        return <span>Exploring ({currentStep.current?.row ?? 0}, {currentStep.current?.col ?? 0}) · {nodesExplored} nodes visited</span>;
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
                drawMode={drawMode}
                setDrawMode={setDrawMode}
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
                        isBusy={busy}
                        metrics={metrics}
                        isDone={isDone}
                        getEfficiencyScore={() => efficiencyScore}
                        isDark={isDark}
                        allowDiagonals={allowDiagonals}
                        setAllowDiagonals={setAllowDiagonals}
                        loadPreset={(preset) => { if (!busy) { resetAlgorithm(); loadPreset(preset); } }}
                        onShareGrid={handleShareGrid}
                        runHistory={runHistory}
                        clearHistory={clearHistory}
                    />
                )}

                <main
                    className="flex-1 p-4 transition-all duration-300"
                    style={{ minWidth: 0 }}
                >
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
                            style={{ background: isDark ? '#080c14' : '#f1f5f9' }}
                        >
                            <Grid
                                grid={grid}
                                onCellChange={handleCellChange}
                                onEraseCell={handleEraseCell}
                                onNodeMove={handleNodeMove}
                                isDisabled={busy && !isPaused}
                                drawMode={drawMode}
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

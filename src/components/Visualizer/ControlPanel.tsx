import React from 'react';
import { CellPosition, GridMatrix } from "@/types";

interface LegendItem {
    label: string;
    color: string;
}

interface ControlPanelProps {
    isRunning: boolean;
    isPaused: boolean;
    isDone: boolean;
    speed: number;
    handleStart: () => void;
    handlePause: () => void;
    handleResume: () => void;
    handleStop: () => void;
    handleStep: () => void;
    handleClear: () => void;
    handleReset: () => void;
    handleGenerateMaze: () => void;
    setSpeed: (speed: number) => void;
    isDark: boolean;
    sidebarOpen: boolean;
    legendItems?: LegendItem[]; // Add legend items prop
}

const ControlPanel: React.FC<ControlPanelProps> = ({
                                                       isRunning,
                                                       isPaused,
                                                       isDone,
                                                       speed,
                                                       handleStart,
                                                       handlePause,
                                                       handleResume,
                                                       handleStop,
                                                       handleStep,
                                                       handleClear,
                                                       handleReset,
                                                       handleGenerateMaze,
                                                       setSpeed,
                                                       isDark,
                                                       sidebarOpen,
                                                       legendItems = []
                                                   }) => {
    // Default legend items if not provided
    const defaultLegendItems: LegendItem[] = [
        { label: 'Start', color: 'bg-green-500' },
        { label: 'End', color: 'bg-red-500' },
        { label: 'Wall', color: isDark ? 'bg-gray-300' : 'bg-gray-800' },
        { label: 'Visited', color: isDark ? 'bg-blue-500 bg-opacity-70' : 'bg-blue-400' },
        { label: 'Path', color: 'bg-yellow-400' },
        { label: 'Current', color: 'bg-purple-500' },
        { label: 'Frontier', color: isDark ? 'bg-cyan-500 bg-opacity-70' : 'bg-cyan-400' },
    ];

    // Use provided legend items or defaults
    const displayLegendItems = legendItems.length > 0 ? legendItems : defaultLegendItems;

    return (
        <div className="mx-auto px-4 sm:px-6 lg:px-8 mt-4">
            <div className="flex flex-wrap justify-between items-center mb-3">
                {/* Playback Controls Bar */}
                <div className={`flex items-center space-x-2 overflow-x-auto flex-grow ${!sidebarOpen ? 'justify-center' : ''}`}>
                    <button
                        onClick={!isRunning && !isDone ? handleStart : isPaused ? handleResume : handlePause}
                        disabled={isDone}
                        className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
                            isDone
                                ? `${isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'} cursor-not-allowed`
                                : isRunning && !isPaused
                                    ? `${isDark ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-yellow-500 hover:bg-yellow-600'} text-white`
                                    : `${isDark ? 'bg-green-500 hover:bg-green-600' : 'bg-green-600 hover:bg-green-700'} text-white`
                        }`}
                    >
                        {!isRunning && !isDone ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     stroke="currentColor" className="w-4 h-4 mr-1">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                Start
                            </>
                        ) : isPaused ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     stroke="currentColor" className="w-4 h-4 mr-1">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                Resume
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     stroke="currentColor" className="w-4 h-4 mr-1">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                Pause
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleStop}
                        disabled={!isRunning && !isPaused}
                        className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
                            !isRunning && !isPaused
                                ? `${isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'} cursor-not-allowed`
                                : `${isDark ? 'bg-red-500 hover:bg-red-600' : 'bg-red-600 hover:bg-red-700'} text-white`
                        }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor" className="w-4 h-4 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"/>
                        </svg>
                        Stop
                    </button>

                    <button
                        onClick={handleStep}
                        disabled={isRunning || isDone}
                        className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
                            isRunning || isDone
                                ? `${isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'} cursor-not-allowed`
                                : `${isDark ? 'bg-purple-500 hover:bg-purple-600' : 'bg-purple-600 hover:bg-purple-700'} text-white`
                        }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor" className="w-4 h-4 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M13 5l7 7-7 7M5 5l7 7-7 7"/>
                        </svg>
                        Step
                    </button>

                    <button
                        onClick={handleClear}
                        disabled={isRunning}
                        className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
                            isRunning
                                ? `${isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'} cursor-not-allowed`
                                : `${isDark ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-600 hover:bg-gray-700'} text-white`
                        }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor" className="w-4 h-4 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                        Clear
                    </button>

                    <button
                        onClick={handleReset}
                        disabled={isRunning}
                        className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
                            isRunning
                                ? `${isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'} cursor-not-allowed`
                                : `${isDark ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white`
                        }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor" className="w-4 h-4 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                        </svg>
                        Reset
                    </button>

                    <button
                        onClick={handleGenerateMaze}
                        disabled={isRunning}
                        className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
                            isRunning
                                ? `${isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'} cursor-not-allowed`
                                : `${isDark ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-emerald-600 hover:bg-emerald-700'} text-white`
                        }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor" className="w-4 h-4 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/>
                        </svg>
                        Generate Maze
                    </button>

                    {/* Speed control slider */}
                    <div className="flex items-center space-x-2 pl-2 min-w-[180px]">
                        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Speed:</span>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={speed}
                            onChange={(e) => setSpeed(parseInt(e.target.value))}
                            disabled={isRunning && !isPaused}
                            className={`flex-grow h-1.5 rounded-lg appearance-none cursor-pointer ${
                                isDark ? 'bg-gray-700' : 'bg-gray-300'
                            }`}
                        />
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className={`flex flex-wrap items-center gap-2 pb-3 ${!sidebarOpen ? 'justify-center' : 'justify-start'}`}>
                <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Legend:</span>
                {displayLegendItems.map((item) => (
                    <div
                        key={item.label}
                        className={`flex items-center px-2 py-0.5 rounded-full text-xs ${
                            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                        } border transition-colors duration-200`}
                    >
                        <div className={`w-3 h-3 ${item.color} rounded-full mr-1.5`}></div>
                        <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ControlPanel;
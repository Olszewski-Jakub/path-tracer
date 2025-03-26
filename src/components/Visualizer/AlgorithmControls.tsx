import React from 'react';
import { AlgorithmInfo, AlgorithmType } from '@/types';

interface LegendItem {
    label: string;
    color: string;
}

interface AlgorithmControlsProps {
    algorithm: AlgorithmType;
    algorithmInfoMap: Record<AlgorithmType, AlgorithmInfo>;
    handleAlgorithmChange: (algorithm: AlgorithmType) => void;
    isRunning: boolean;
    legendItems: Array<LegendItem>;
    isDark: boolean;
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

const AlgorithmControls: React.FC<AlgorithmControlsProps> = ({
                                                                 algorithm,
                                                                 algorithmInfoMap,
                                                                 handleAlgorithmChange,
                                                                 isRunning,
                                                                 legendItems,
                                                                 isDark,
                                                                 sidebarOpen,
                                                                 setSidebarOpen
                                                             }) => {
    const getLegendColorClass = (colorClass: string): string => {
        const baseColorClass = colorClass.split(' ')[0];
        return baseColorClass || 'bg-gray-400'; // Fallback color if none is found
    };

    return (
        <div className={`py-2 px-4 ${isDark ? 'bg-gray-800' : 'bg-gray-50'} border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Left side - Algorithm selector and toggle sidebar */}
                <div className="flex items-center gap-3">
                    {/* Algorithm selector */}
                    <div className="flex items-center">
                        <label htmlFor="algorithm-select" className={`mr-2 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            Algorithm:
                        </label>
                        <select
                            id="algorithm-select"
                            value={algorithm}
                            onChange={(e) => handleAlgorithmChange(e.target.value as AlgorithmType)}
                            disabled={isRunning}
                            className={`rounded-md border-0 py-1.5 pl-3 pr-8 text-sm ring-1 ring-inset ${
                                isDark
                                    ? 'bg-gray-700 text-white ring-gray-600 focus:ring-indigo-500'
                                    : 'bg-white text-gray-900 ring-gray-300 focus:ring-indigo-600'
                            } focus:ring-2 focus:ring-inset ${isRunning ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {Object.entries(algorithmInfoMap).map(([type, info]) => (
                                <option key={type} value={type}>
                                    {info.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Toggle sidebar button */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className={`p-2 rounded ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-white hover:bg-gray-100 text-gray-700'} flex items-center text-sm`}
                        aria-label={`${sidebarOpen ? 'Hide' : 'Show'} sidebar`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-4 h-4 mr-1"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d={sidebarOpen
                                      ? "M11 19l-7-7 7-7m8 14l-7-7 7-7"
                                      : "M13 5l7 7-7 7M5 5l7 7-7 7"}
                            />
                        </svg>
                        <span className="hidden sm:inline">{sidebarOpen ? 'Hide' : 'Show'} Sidebar</span>
                    </button>
                </div>

                {/* Right side - Legend */}
                <div className="flex flex-wrap items-center gap-1.5">
                    <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Legend:</span>
                    {legendItems.map((item) => (
                        <div
                            key={item.label}
                            className={`flex items-center px-2 py-0.5 rounded-full text-xs ${
                                isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                            } border`}
                        >
                            <div className={`w-2.5 h-2.5 ${getLegendColorClass(item.color)} rounded-full mr-1`}></div>
                            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AlgorithmControls;
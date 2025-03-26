import React from 'react';
import {AlgorithmInfo, AlgorithmType} from "@/types";

interface SidebarProps {
    algorithm: AlgorithmType;
    algorithmInfoMap: Record<AlgorithmType, AlgorithmInfo>;
    rows: number;
    cols: number;
    handleSizeChange: (rows: number, cols: number) => void;
    isRunning: boolean;
    metrics: {
        nodesExplored: number;
        pathLength: number;
        executionTime: number;
        isPathFound: boolean;
    };
    isDone: boolean;
    getEfficiencyScore: () => string;
    isDark: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
                                             algorithm,
                                             algorithmInfoMap,
                                             rows,
                                             cols,
                                             handleSizeChange,
                                             isRunning,
                                             metrics,
                                             isDone,
                                             getEfficiencyScore,
                                             isDark
                                         }) => {
    return (
        <aside
            className={`w-72 overflow-y-auto border-r ${
                isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
            } p-4 transition-all duration-300 ease-in-out fixed md:static top-16 bottom-0 left-0 z-[5] h-[calc(100vh-4rem)]`}
        >
            {}
            <div className={`rounded-lg p-4 mb-4 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                    {algorithmInfoMap[algorithm].name}
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                    {algorithmInfoMap[algorithm].description}
                </p>
                <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                        <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Time Complexity:</span>
                        <span className="font-medium">{algorithmInfoMap[algorithm].timeComplexity}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Space Complexity:</span>
                        <span className="font-medium">{algorithmInfoMap[algorithm].spaceComplexity}</span>
                    </div>
                </div>
            </div>

            {}
            <div className={`rounded-lg p-4 mb-4 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <h3 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Grid Size</h3>
                <select
                    value={`${rows},${cols}`}
                    onChange={(e) => {
                        const [selectedRows, selectedCols] = e.target.value.split(',').map(Number);
                        handleSizeChange(selectedRows, selectedCols);
                    }}
                    disabled={isRunning}
                    className={`block w-full rounded-md border-0 py-1.5 text-sm shadow-sm ring-1 ring-inset ${
                        isDark
                            ? 'bg-gray-700 text-white ring-gray-600 focus:ring-indigo-500'
                            : 'bg-white text-gray-900 ring-gray-300 focus:ring-indigo-600'
                    } focus:ring-2 focus:ring-inset ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <option value="10,10">10 x 10</option>
                    <option value="15,15">15 x 15</option>
                    <option value="20,20">20 x 20</option>
                    <option value="25,25">25 x 25</option>
                    <option value="30,30">30 x 30</option>
                    <option value="50,50">50 x 50</option>
                </select>
                <p className="text-xs mt-1 text-gray-500">Changing the grid size will reset the grid.</p>
            </div>

            {}
            <div className={`rounded-lg p-4 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <h3 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>Performance Metrics</h3>

                <div className="space-y-4">
                    {}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Nodes Explored</span>
                            <span className={`text-sm font-medium ${isDone && metrics.isPathFound ? 'text-blue-500' : ''}`}>
                                {metrics.nodesExplored}
                            </span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500 transition-all duration-300"
                                style={{width: `${Math.min(100, (metrics.nodesExplored / 400) * 100)}%`}}
                            ></div>
                        </div>
                    </div>

                    {}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Path Length</span>
                            <span className={`text-sm font-medium ${isDone && metrics.isPathFound ? 'text-green-500' : ''}`}>
                                {isDone
                                    ? metrics.isPathFound
                                        ? metrics.pathLength
                                        : <span className="text-red-400">No path</span>
                                    : 'N/A'}
                            </span>
                        </div>
                    </div>

                    {}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Execution Time</span>
                            <span className={`text-sm font-medium ${isDone ? 'text-indigo-500' : ''}`}>
                                {isDone
                                    ? `${metrics.executionTime.toFixed(2)} ms`
                                    : 'N/A'}
                            </span>
                        </div>
                    </div>

                    {}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Efficiency Score</span>
                            <span className="text-sm font-medium">{getEfficiencyScore()}</span>
                        </div>
                        {getEfficiencyScore() !== 'N/A' && (
                            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${
                                        parseFloat(getEfficiencyScore()) < 1.5 ? 'bg-green-500' :
                                            parseFloat(getEfficiencyScore()) < 3 ? 'bg-green-400' :
                                                parseFloat(getEfficiencyScore()) < 5 ? 'bg-yellow-400' :
                                                    parseFloat(getEfficiencyScore()) < 8 ? 'bg-yellow-500' :
                                                        'bg-red-400'
                                    } transition-all duration-500`}
                                    style={{width: `${Math.min(100, 100 - Math.min(parseFloat(getEfficiencyScore()) * 10, 90))}%`}}
                                ></div>
                            </div>
                        )}
                    </div>

                    {}
                    <div>
                        <div className="flex justify-between items-center">
                            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Status</span>
                            <span className={`text-sm font-medium ${
                                !isDone ? 'text-blue-500' :
                                    metrics.isPathFound ? 'text-green-500' :
                                        'text-red-500'
                            }`}>
                                {!isDone
                                    ? isRunning ? 'Running...' : 'Ready'
                                    : metrics.isPathFound
                                        ? 'Path found!'
                                        : 'No path possible'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
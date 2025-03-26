import React from 'react';
import {AlgorithmStep, CellPosition, GridMatrix} from "@/types";

interface AlgorithmProgressProps {
    isDark: boolean;
    metrics: {
        nodesExplored: number;
        pathLength: number;
        executionTime: number;
        isPathFound: boolean;
    };
    isDone: boolean;
    currentStep: AlgorithmStep
}

const AlgorithmProgress: React.FC<AlgorithmProgressProps> = ({ isDark, metrics, isDone, currentStep }) => {
    return (
        <div
            className={`mt-4 p-4 rounded-lg shadow-md ${isDark ? 'bg-gray-800' : 'bg-white'} transition-colors duration-300`}>
            <h3 className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2`}>Algorithm Progress</h3>
            <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {isDone ? (
                    metrics.isPathFound ? (
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20"
                                 fill="currentColor">
                                <path fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                      clipRule="evenodd"/>
                            </svg>
                            <span>
                                Optimal path found with {metrics.pathLength} steps,
                                exploring {metrics.nodesExplored} nodes in {metrics.executionTime.toFixed(2)} ms.
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 className="h-5 w-5 text-red-500 mr-2" viewBox="0 0 20 20"
                                 fill="currentColor">
                                <path fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                      clipRule="evenodd"/>
                            </svg>
                            <span>
                                No possible path exists between start and end points.
                                Explored {metrics.nodesExplored} nodes.
                            </span>
                        </div>
                    )
                ) : (
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg"
                             className="h-5 w-5 text-blue-500 mr-2 animate-spin" viewBox="0 0 24 24"
                             fill="none" stroke="currentColor">
                            <circle cx="12" cy="12" r="10" strokeWidth="4" stroke="currentColor"
                                    strokeDasharray="32" strokeDashoffset="12"/>
                        </svg>
                        <span>
                            Algorithm is exploring the grid...
                            Current position: ({currentStep.current?.row || 0}, {currentStep.current?.col || 0})
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AlgorithmProgress;
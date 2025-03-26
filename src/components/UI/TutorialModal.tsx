"use client";

import React, { useState, useEffect } from 'react';

interface TutorialModalProps {
    initialIsOpen?: boolean;
    onClose?: () => void;
}

const TutorialModal: React.FC<TutorialModalProps> = ({ initialIsOpen, onClose }) => {
    const [isOpen, setIsOpen] = useState(initialIsOpen || false);
    const [currentStep, setCurrentStep] = useState(0);
    const [showAgain, setShowAgain] = useState(true);

    useEffect(() => {
        // Check if this is the first visit (only if initialIsOpen is not provided)
        if (initialIsOpen === undefined) {
            const hasSeenTutorial = localStorage.getItem('hasSeenPathTracerTutorial');
            if (!hasSeenTutorial) {
                setIsOpen(true);
            }
        }
    }, [initialIsOpen]);

    // Update isOpen if prop changes
    useEffect(() => {
        if (initialIsOpen !== undefined) {
            setIsOpen(initialIsOpen);
        }
    }, [initialIsOpen]);

    const closeTutorial = () => {
        setIsOpen(false);

        if (!showAgain) {
            localStorage.setItem('hasSeenPathTracerTutorial', 'true');
        }

        // Call onClose prop if provided
        if (onClose) {
            onClose();
        }
    };

    const nextStep = () => {
        if (currentStep < tutorialSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            closeTutorial();
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const tutorialSteps = [
        {
            title: "Welcome to Path Tracer!",
            content: (
                <div>
                    <p className="mb-2">This app visualizes different pathfinding algorithms to help you understand how they work.</p>
                    <p>Follow this quick tutorial to learn how to use the tool.</p>
                </div>
            )
        },
        {
            title: "Creating Walls",
            content: (
                <div>
                    <p className="mb-2">Click or drag on the grid to create walls.</p>
                    <p className="mb-2">Walls are obstacles that the algorithm cannot pass through.</p>
                    <p>Click on a wall again to remove it.</p>
                </div>
            )
        },
        {
            title: "Start and End Points",
            content: (
                <div>
                    <p className="mb-2">The green cell (S) is the starting point.</p>
                    <p className="mb-2">The red cell (E) is the destination.</p>
                    <p>The algorithm will find a path from start to end.</p>
                </div>
            )
        },
        {
            title: "Choose an Algorithm",
            content: (
                <div>
                    <p className="mb-2">Select from 4 different algorithms:</p>
                    <ul className="list-disc pl-5 mb-2">
                        <li><span className="font-semibold">A* Search</span>: Uses a heuristic to prioritize paths closer to the goal</li>
                        <li><span className="font-semibold">Dijkstra</span>: Guarantees the shortest path by exploring nodes based on distance</li>
                        <li><span className="font-semibold">BFS</span>: Explores all neighbors at the current depth before moving deeper</li>
                        <li><span className="font-semibold">DFS</span>: Goes as far as possible along each branch before backtracking</li>
                    </ul>
                </div>
            )
        },
        {
            title: "Controls",
            content: (
                <div>
                    <p className="mb-2">Use the control bar to interact with the visualization:</p>
                    <ul className="list-disc pl-5">
                        <li><span className="font-semibold">Start</span>: Begin the visualization</li>
                        <li><span className="font-semibold">Pause/Resume</span>: Control the animation</li>
                        <li><span className="font-semibold">Step</span>: Advance algorithm one step at a time</li>
                        <li><span className="font-semibold">Speed</span>: Adjust the animation speed with the slider</li>
                        <li><span className="font-semibold">Clear</span>: Remove visited paths while keeping walls</li>
                        <li><span className="font-semibold">Reset</span>: Clear the entire grid</li>
                        <li><span className="font-semibold">Generate Maze</span>: Create a random maze pattern</li>
                    </ul>
                </div>
            )
        },
        {
            title: "Understanding the Grid",
            content: (
                <div>
                    <p className="mb-2">As the algorithm runs, you'll see different cell colors:</p>
                    <ul className="list-disc pl-5">
                        <li><span className="font-semibold text-green-500">Green (S)</span>: Start point</li>
                        <li><span className="font-semibold text-red-500">Red (E)</span>: End point</li>
                        <li><span className="font-semibold text-gray-700">Gray</span>: Wall (obstacle)</li>
                        <li><span className="font-semibold text-blue-500">Blue</span>: Visited cells</li>
                        <li><span className="font-semibold text-cyan-500">Cyan</span>: Frontier (cells to be explored next)</li>
                        <li><span className="font-semibold text-purple-500">Purple</span>: Current cell being examined</li>
                        <li><span className="font-semibold text-yellow-400">Yellow</span>: The final path from start to end</li>
                    </ul>
                </div>
            )
        },
        {
            title: "Performance Metrics",
            content: (
                <div>
                    <p className="mb-2">The sidebar shows algorithm performance:</p>
                    <ul className="list-disc pl-5">
                        <li><span className="font-semibold">Nodes Explored</span>: How many cells the algorithm checked</li>
                        <li><span className="font-semibold">Path Length</span>: Number of steps in the final path</li>
                        <li><span className="font-semibold">Execution Time</span>: How long it took to find the path</li>
                        <li><span className="font-semibold">Efficiency Score</span>: Lower is better (explored nodes ÷ path length)</li>
                    </ul>
                    <p className="mt-2">Compare different algorithms to see which works best for each maze type!</p>
                </div>
            )
        },
        {
            title: "You're Ready to Start!",
            content: (
                <div>
                    <p className="mb-2">Now you know how to use Path Tracer!</p>
                    <p className="mb-2">Try creating your own maze or generating a random one.</p>
                    <p>Experiment with different algorithms to see which performs best.</p>
                </div>
            )
        },
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl overflow-hidden">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        {tutorialSteps[currentStep].title}
                    </h2>

                    <div className="mb-6">
                        {tutorialSteps[currentStep].content}
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="showAgain"
                                checked={showAgain}
                                onChange={(e) => setShowAgain(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor="showAgain" className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                                Show this tutorial again
                            </label>
                        </div>

                        <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Step {currentStep + 1} of {tutorialSteps.length}
              </span>
                            <div className="flex space-x-2">
                                <button
                                    onClick={prevStep}
                                    disabled={currentStep === 0}
                                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                                        currentStep === 0
                                            ? 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={nextStep}
                                    className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                                >
                                    {currentStep < tutorialSteps.length - 1 ? 'Next' : 'Finish'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorialModal;
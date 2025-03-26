// src/components/UI/Header.tsx
"use client";

import React, { useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import Link from 'next/link';
import TutorialModal from './TutorialModal';

const Header: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';
    const [showTutorial, setShowTutorial] = useState(false);

    const handleShowTutorial = () => {
        setShowTutorial(true);
    };

    return (
        <>
            {showTutorial && (
                <TutorialModalWithProps
                    isOpen={showTutorial}
                    onClose={() => setShowTutorial(false)}
                />
            )}

            <header
                className={`backdrop-blur-sm border-b ${isDark ? 'border-gray-700 bg-gray-900/80' : 'border-gray-200 bg-white/80'} sticky top-0 z-10`}>
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <h1 className="text-xl font-bold flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                         className={`h-6 w-6 mr-2 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}
                                         fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                                    </svg>
                                    Path Tracer
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 sm:space-x-4">
                            {/* Help Button */}
                            <button
                                onClick={handleShowTutorial}
                                className={`inline-flex items-center justify-center px-2 sm:px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                    isDark
                                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                        : 'bg-indigo-500 text-white hover:bg-indigo-600'
                                }`}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="flex-shrink-0"
                                >
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                </svg>
                                <span className="hidden sm:block ml-1.5">Help</span>
                            </button>

                            {/* GitHub Repository Button */}
                            <Link
                                href="https://github.com/yourusername/path-tracer"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center justify-center px-2 sm:px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                    isDark
                                        ? 'bg-gray-800 text-white hover:bg-gray-700'
                                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                                style={{minWidth: '2.5rem'}}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="flex-shrink-0"
                                >
                                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                                </svg>
                                <span className="hidden sm:block ml-1.5">GitHub</span>
                            </Link>

                            {/* Portfolio Button */}
                            <Link
                                href="https://yourportfolio.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center justify-center px-2 sm:px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                    isDark
                                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                        : 'bg-indigo-500 text-white hover:bg-indigo-600'
                                }`}
                                style={{minWidth: '2.5rem'}}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="flex-shrink-0"
                                >
                                    <path d="M21 16V8.00002C21 6.34317 19.6569 5.00002 18 5.00002H6C4.34315 5.00002 3 6.34317 3 8.00002V16C3 17.6569 4.34315 19 6 19H18C19.6569 19 21 17.6569 21 16Z"></path>
                                    <path d="M3 8L12 13L21 8"></path>
                                </svg>
                                <span className="hidden sm:block ml-1.5">Portfolio</span>
                            </Link>

                            {/* Theme toggle button */}
                            <button
                                onClick={toggleTheme}
                                className={`p-2 rounded-full ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-yellow-300' : 'bg-gray-100 hover:bg-gray-200 text-indigo-600'}`}
                                aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                            >
                                {isDark ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                         strokeLinejoin="round" className="w-5 h-5">
                                        <circle cx="12" cy="12" r="5"></circle>
                                        <line x1="12" y1="1" x2="12" y2="3"></line>
                                        <line x1="12" y1="21" x2="12" y2="23"></line>
                                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                        <line x1="1" y1="12" x2="3" y2="12"></line>
                                        <line x1="21" y1="12" x2="23" y2="12"></line>
                                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                         strokeLinejoin="round" className="w-5 h-5">
                                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

// Modified version of TutorialModal that accepts props
interface TutorialModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const TutorialModalWithProps: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [showAgain, setShowAgain] = useState(true);

    const closeTutorial = () => {
        onClose();
        if (!showAgain) {
            localStorage.setItem('hasSeenPathTracerTutorial', 'true');
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

export default Header;
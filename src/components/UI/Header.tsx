"use client";

import React from 'react';
import { useTheme } from '@/components/ThemeProvider';
import Link from 'next/link';

const Header: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
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
    );
};

export default Header;
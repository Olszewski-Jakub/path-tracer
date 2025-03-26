"use client";
import React from 'react';
import Link from 'next/link';
import {useTheme} from '@/components/ThemeProvider';

const Footer: React.FC = () => {
    // Get the current theme from your ThemeProvider
    const {theme} = useTheme();
    const isDark = theme === 'dark';
    const currentYear = new Date().getFullYear();
    return (
        <footer
            className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} py-4 transition-colors duration-300 border-t`}>
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    {/* Left section - Copyright */}
                    <div className="text-center md:text-left">
                        <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} font-medium`}>
                            © {currentYear} Jakub Olszewski
                        </p>
                        <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm mt-1`}>
                            All rights reserved
                        </p>
                    </div>
                    <div className="mb-4 md:mb-0">
                        <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-center md:text-left`}>
                            Pathfinding Algorithm Visualizer | Built with React, TypeScript, and TailwindCSS
                        </p>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* GitHub Repository Button */}
                        <Link
                            href="https://github.com/Olszewski-Jakub/path-tracer"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                                isDark
                                    ? 'bg-gray-800 text-white hover:bg-gray-700'
                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-2"
                            >
                                <path
                                    d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                            </svg>
                            GitHub Repo
                        </Link>

                        {/* Portfolio Button */}
                        <Link
                            href="https://jakubolszewski.dev"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                                isDark
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                    : 'bg-indigo-500 text-white hover:bg-indigo-600'
                            }`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-2"
                            >
                                <path
                                    d="M6 2h12a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4z"></path>
                                <circle cx="12" cy="12" r="2"></circle>
                                <path d="M16 8v.88a4 4 0 0 1 0 6.24V16a2 2 0 0 1-2 2h-3"></path>
                                <path d="M8 16v-.88a4 4 0 0 1 0-6.24V8a2 2 0 0 1 2-2h3"></path>
                            </svg>
                            My Portfolio
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
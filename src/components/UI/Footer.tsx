"use client";
import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';

const Footer: React.FC = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const currentYear = new Date().getFullYear();

    return (
        <footer
            style={{
                background: isDark ? 'rgba(8,12,20,0.9)' : 'rgba(248,250,252,0.9)',
                borderTop: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(15,23,42,0.08)',
                backdropFilter: 'blur(12px)',
            }}
        >
            <div className="mx-auto px-6 py-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    {/* Left */}
                    <div className="flex items-center gap-2">
                        <div
                            style={{
                                width: '22px',
                                height: '22px',
                                background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                                borderRadius: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 0 10px rgba(99,102,241,0.4)',
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <span className="text-sm font-medium gradient-text">Path Tracer</span>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>&copy; {currentYear} Jakub Olszewski</span>
                    </div>

                    {/* Center */}
                    <p className="text-xs hidden md:block" style={{ color: 'var(--text-muted)' }}>
                        Built with React, TypeScript & Tailwind CSS
                    </p>

                    {/* Right */}
                    <div className="flex items-center gap-2">
                        <Link
                            href="https://github.com/Olszewski-Jakub/path-tracer"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.06)',
                                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(15,23,42,0.1)',
                                color: isDark ? '#94a3b8' : '#64748b',
                                borderRadius: '8px',
                                padding: '6px 12px',
                                fontSize: '12px',
                                fontWeight: 500,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                            }}
                            className="transition-opacity hover:opacity-80"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                            </svg>
                            GitHub
                        </Link>
                        <Link
                            href="https://jakubolszewski.dev"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                color: 'white',
                                borderRadius: '8px',
                                padding: '6px 12px',
                                fontSize: '12px',
                                fontWeight: 500,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                boxShadow: '0 0 12px rgba(99,102,241,0.3)',
                            }}
                            className="transition-opacity hover:opacity-90"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                            </svg>
                            Portfolio
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

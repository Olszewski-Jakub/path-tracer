
module.exports = {
    content: [
        "./src*.{js,jsx,ts,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {

                'astar': {
                    light: '#4f46e5',
                    dark: '#6366f1',
                },
                'dijkstra': {
                    light: '#0891b2',
                    dark: '#0e7490',
                },
                'bfs': {
                    light: '#16a34a',
                    dark: '#15803d',
                },
                'dfs': {
                    light: '#ea580c',
                    dark: '#c2410c',
                },
            },
            animation: {
                'pulse-slow': 'pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'appear': 'appear 0.4s ease-out forwards',
                'bounce-subtle': 'bounce-subtle 0.8s ease-in-out infinite',
                'fade-slide-in': 'fade-slide-in 0.4s ease-out forwards',
                'glow': 'glow 2s ease-in-out infinite',
            },
            transitionProperty: {
                'height': 'height',
                'spacing': 'margin, padding',
            },
            boxShadow: {
                'inner-light': 'inset 2px 2px 5px rgba(255, 255, 255, 0.3), inset -2px -2px 5px rgba(0, 0, 0, 0.1)',
            },
        },
    },
    plugins: [],
}
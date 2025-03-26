# Path Tracer - Pathfinding Algorithm Visualizer

## Overview

Path Tracer is an interactive web application that visualizes popular pathfinding algorithms. It provides an intuitive interface to help users understand how different algorithms navigate through a grid from start to end points while avoiding obstacles.

[View Live Demo](https://path-tracer.jakubolszewski.dev)

## Features

- **Interactive Grid**: Create walls and obstacles by clicking/dragging on the grid
- **Multiple Algorithms**: Visualize and compare different pathfinding approaches:
    - A* Search
    - Dijkstra's Algorithm
    - Breadth-First Search (BFS)
    - Depth-First Search (DFS)
- **Real-time Visualization**: Watch the algorithm exploration step by step
- **Performance Metrics**: Compare efficiency with metrics like nodes explored, path length, and execution time
- **Control Panel**: Start, pause, step through, or reset the visualization
- **Maze Generation**: Automatically generate random mazes to test algorithms
- **Dark/Light Mode**: Toggle between themes for comfortable viewing
- **Responsive Design**: Works on desktop and mobile devices

## Technologies Used

- **React**: Frontend library for building the user interface
- **TypeScript**: Type-safe JavaScript for better code quality
- **Next.js**: React framework for server-side rendering and improved performance
- **Tailwind CSS**: Utility-first CSS framework for styling

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/path-tracer.git
   cd path-tracer
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage Guide

1. **Grid Interaction**:
    - Click on empty cells to create walls
    - Drag to create multiple walls quickly
    - The green cell represents the start position
    - The red cell represents the end position

2. **Algorithm Selection**:
    - Choose an algorithm from the dropdown menu
    - Each algorithm has different characteristics and performance profiles

3. **Controls**:
    - **Start**: Begin the visualization
    - **Pause/Resume**: Pause or continue the algorithm execution
    - **Step**: Advance one step at a time
    - **Stop**: Halt the current execution
    - **Clear**: Remove the visualization but keep walls
    - **Reset**: Clear everything and return to initial state
    - **Generate Maze**: Create a random maze pattern

4. **Speed Control**:
    - Adjust the slider to change the visualization speed

5. **Performance Metrics**:
    - View real-time statistics in the sidebar
    - Compare algorithm efficiency with the Efficiency Score

## How It Works

### Algorithm Implementations

#### A* Search
A* is an informed search algorithm that uses a heuristic to estimate the cost to reach the goal. It prioritizes paths that appear to be leading closer to the goal.

#### Dijkstra's Algorithm
Dijkstra's algorithm is a shortest path algorithm that guarantees the optimal solution by exploring nodes in order of their distance from the start.

#### Breadth-First Search (BFS)
BFS explores all neighbor nodes at the present depth before moving on to nodes at the next depth level. It guarantees the shortest path in unweighted graphs.

#### Depth-First Search (DFS)
DFS explores as far as possible along each branch before backtracking. It does not guarantee the shortest path but can be useful for maze exploration.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
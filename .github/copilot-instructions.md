# Copilot Instructions for Convex Hull Generation Project

## Project Overview

This is a React + Vite project for visualizing the Convex Hull using the Jarvis March (Gift Wrapping) algorithm, with an additional Onion Decomposition feature for maze generation.

## Project Structure

- React + Vite framework
- Tailwind CSS for styling
- Frontend-only implementation (no backend)
- Modular component structure
- Canvas-based visualization

## Progress

- [x] Create project structure and copilot-instructions.md
- [x] Scaffold React + Vite project
- [x] Install dependencies
- [x] Create geometry utility functions
- [x] Create Canvas component
- [x] Create Controls component
- [x] Create main App component
- [x] Configure Tailwind CSS
- [x] Test and run the application
- [x] Implement Onion Decomposition algorithm
- [x] Create MazeCanvas component with emoji decorations
- [x] Add image download functionality
- [x] Integrate maze mode toggle in App.jsx
- [x] Update Controls for maze features
- [x] Update README documentation

## Features Implemented

### Basic Features

1. ✅ Convex Hull visualization with Jarvis March algorithm
2. ✅ Step-by-step animation
3. ✅ Interactive controls (play, pause, next, previous, reset)
4. ✅ Random point generation (3-100 points)
5. ✅ Real-time statistics

### Advanced Features (Onion Decomposition)

1. ✅ Recursive convex hull layers extraction
2. ✅ Maze generation with strategic edge removal
3. ✅ Emoji decorations (path markers, obstacles, start/end)
4. ✅ Dual view mode (hull/maze toggle)
5. ✅ Image download (PNG export)
6. ✅ Kid-friendly maze visualization

## Components

- `App.jsx` - Main application with mode switching
- `Canvas.jsx` - Convex hull visualization
- `MazeCanvas.jsx` - Maze visualization with emojis
- `Controls.jsx` - UI controls with maze options
- `geometry.js` - Algorithms (Jarvis March, Onion Decomposition)
- `imageUtils.js` - Image download utilities

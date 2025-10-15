# Convex Hull Visualization - Jarvis March Algorithm

**GroupID-3:**

- Raman Sharma (22114076)
- Ayush Ranjan (22114018)
- Sarvasva Gupta (22114086)

**Date:** October 15, 2025

## 🎯 Project Overview

This is a fully interactive React-based web application that demonstrates the **Convex Hull** construction using the **Jarvis March (Gift Wrapping) Algorithm**. The application runs entirely on the frontend with no backend requirements.

## ✨ Features

- 🎲 **Random Point Generation**: Generate 3-100 random points in 2D space
- 📊 **Step-by-Step Visualization**: Use a slider to see each step of the hull construction
- ▶️ **Animation Mode**: Automatic playback of the algorithm steps
- 🎨 **Beautiful UI**: Clean, modern interface built with Tailwind CSS
- 📈 **Real-time Statistics**: View total points, hull vertices, and algorithm steps
- 🎯 **Interactive Controls**: Play, pause, next, previous, and reset functionality

## 🛠️ Technology Stack

- **Framework**: React 18.3.1
- **Build Tool**: Vite 5.4.1
- **Styling**: Tailwind CSS 3.4.13
- **Language**: JavaScript (ES6+)
- **Canvas**: HTML5 Canvas API for rendering

## 📁 Project Structure

```
Convex Hull Generation/
├── src/
│   ├── components/
│   │   ├── Canvas.jsx          # Visualization canvas component
│   │   └── Controls.jsx        # UI controls component
│   ├── utils/
│   │   └── geometry.js         # Jarvis March algorithm implementation
│   ├── App.jsx                 # Main application component
│   ├── main.jsx                # Application entry point
│   └── index.css               # Global styles with Tailwind
├── index.html                  # HTML template
├── package.json                # Project dependencies
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── postcss.config.js           # PostCSS configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone or navigate to the project directory:**

   ```bash
   cd "Convex Hull Generation"
   ```

2. **Install dependencies:**

   If you encounter PowerShell execution policy issues, open PowerShell as Administrator and run:

   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

   Then install dependencies:

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - Navigate to `http://localhost:5173` (or the port shown in terminal)

### Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🎮 How to Use

1. **Generate Points:**

   - Enter the number of points (3-100) in the input field
   - Click "Generate Points" button

2. **Visualize the Algorithm:**

   - Use the slider to move through each step of the algorithm
   - Click "Play" to automatically animate the hull construction
   - Use "Previous" and "Next" buttons for manual step control
   - Click "Reset" to return to the first step

3. **Understand the Visualization:**
   - **Blue circles**: Input points
   - **Green circles with yellow border**: Convex hull vertices
   - **Green lines**: Completed hull edges
   - **Red dashed line**: Current edge being added
   - **Step description**: Shows current operation below the canvas

## 🧮 Algorithm Details

### Jarvis March (Gift Wrapping) Algorithm

The Jarvis March algorithm constructs the convex hull by:

1. Finding the leftmost point as the starting point
2. From the current point, finding the most counterclockwise point
3. Adding this point to the hull
4. Repeating until returning to the starting point

**Time Complexity:** O(nh), where:

- n = number of input points
- h = number of hull vertices

**Space Complexity:** O(h) for storing hull points

## 🎨 UI Components

### Canvas Component (`Canvas.jsx`)

- Renders points and convex hull on HTML5 canvas
- Handles visual styling and animations
- Displays current algorithm step with highlighting

### Controls Component (`Controls.jsx`)

- Point generation input and button
- Step-by-step slider control
- Animation play/pause functionality
- Algorithm information display

### Geometry Utilities (`geometry.js`)

- `generateRandomPoints()`: Creates random distinct 2D points
- `jarvisMarchAlgorithm()`: Implements the convex hull algorithm
- Helper functions for geometric calculations

## 📊 Features in Detail

### Point Generation

- Ensures all points are distinct
- Maintains padding from canvas edges
- Validates input range (3-100 points)

### Step-by-Step Visualization

- Each step shows the current edge being considered
- Hull points are highlighted differently from input points
- Progress bar shows completion percentage

### Animation

- Configurable animation speed (800ms per step)
- Automatic pause at completion
- Can be paused and resumed at any step

## 🔧 Configuration

You can customize various aspects by modifying:

- **Canvas size**: Edit `CANVAS_WIDTH` and `CANVAS_HEIGHT` in `Canvas.jsx` and `App.jsx`
- **Animation speed**: Modify the interval time in `Controls.jsx` (currently 800ms)
- **Point styling**: Adjust colors and sizes in `Canvas.jsx`
- **UI theme**: Modify Tailwind classes in component files

## 🐛 Troubleshooting

### npm command not working in PowerShell

- Run PowerShell as Administrator
- Execute: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- Restart your terminal

### Port already in use

- Vite will automatically try the next available port
- Or specify a different port in `vite.config.js`:
  ```js
  export default defineConfig({
    plugins: [react()],
    server: { port: 3000 },
  });
  ```

### Build errors

- Delete `node_modules` folder and `package-lock.json`
- Run `npm install` again

## 📝 License

This project is created for educational purposes as part of a Computational Geometry course assignment.

## 👥 Contributors

- **Raman Sharma** (22114076)
- **Ayush Ranjan** (22114018)
- **Sarvasva Gupta** (22114086)

## 📅 Project Timeline

- **Created:** October 15, 2025
- **Last Updated:** October 15, 2025

---

**Built with ❤️ using React, Vite, and Tailwind CSS**

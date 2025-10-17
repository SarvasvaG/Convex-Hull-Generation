# 🔷 Convex Hull Visualization & Maze Generation

An interactive web application that visualizes the **Jarvis March (Gift Wrapping)** algorithm for computing convex hulls and generates beautiful solvable mazes using **Onion Decomposition**.

Built with **React**, **Vite**, and **Tailwind CSS** by **Group-3** for Computational Geometry coursework.

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation & Running

```bash
# Clone the repository
git clone https://github.com/SarvasvaG/Convex-Hull-Generation.git

# Navigate to project directory
cd "Convex Hull Generation"

# Install dependencies
npm install

# Start development server
npm run dev
```

Open your browser and navigate to **http://localhost:5173**

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build
npm run preview
```

---

## ✨ Features

### 🔷 Convex Hull Visualization

- **Interactive Point Generation**: Generate 3-200 random points using 2D Gaussian distribution
- **Step-by-Step Animation**: Watch Jarvis March algorithm execute with detailed steps
- **Algorithm Statistics**: View real-time stats (total points, hull vertices, steps)
- **Play/Pause Controls**: Navigate through each step of the algorithm

### 🎁 Maze Generation

- **Onion Decomposition**: Automatically generates concentric hull layers
- **Smart Point Filtering**: Removes points too close to edges for clear layer separation
- **Dual Visualization Modes**:
  - **Smooth Curves**: Beautiful Bézier curves for artistic maze walls
  - **Hull Edges**: Geometric straight-edge view
- **Small Gap Openings**: Precisely placed 20px gaps or full edge removal for short edges
- **Emoji Decorations**: Apples (🍎) and ghosts (👻) equal to number of layers
- **Start & End Markers**: Green flag at center, golden trophy at bottom-left

### 📊 Statistics & Analytics

- Total points, hull vertices, algorithm steps
- Number of layers in maze
- Removed points count (for spacing optimization)

### 💾 Export & Download

- Download maze or hull visualization as PNG image
- High-quality canvas export

---

## 🎮 How to Use

1. **Generate Points**: Enter number (3-200) and click "Generate Points"
2. **View Hull**: Use step controls to animate Jarvis March algorithm
3. **Create Maze**: Click "Generate Maze" to compute onion decomposition
4. **Toggle Views**:
   - Switch between "Hull" and "Maze" views
   - Toggle between "Smooth Curves" and "Hull Edges" in maze
5. **Download**: Save your visualization as an image

---

## 🛠️ Technology Stack

- **Frontend**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Algorithms**: Custom implementations in vanilla JavaScript
- **Canvas Rendering**: HTML5 Canvas API

---

## 📁 Project Structure

```
src/
├── App.jsx                 # Main application component
├── main.jsx               # Entry point
├── components/
│   ├── Canvas.jsx         # Convex hull visualization
│   ├── MazeCanvas.jsx     # Maze rendering with Bézier curves
│   └── Controls.jsx       # UI controls and buttons
├── utils/
│   ├── geometry.js        # Jarvis March, Onion Decomposition
│   └── imageUtils.js      # Canvas export utilities
└── assets/                # Images and static resources
```

---

## 👥 Contributors

**Group-3 Members:**

| Name               | Roll Number |
| ------------------ | ----------- |
| **Raman Sharma**   | 22114076    |
| **Ayush Ranjan**   | 22114018    |
| **Sarvasva Gupta** | 22114086    |

**Course**: Computational Geometry  
**Institution**: Indian Institute of Technology Roorkee  
**Date**: October 2025

---

## 📝 License

This project is created for educational purposes as part of coursework at IIT Roorkee.

---

## 🙏 Acknowledgments

- Course instructors and TAs for guidance
- React and Vite communities for excellent documentation
- Computational Geometry textbooks for algorithm references

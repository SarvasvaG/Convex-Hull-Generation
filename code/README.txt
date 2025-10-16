Convex Hull Generation - Code Folder README

Location: This README sits in the `code/` folder inside the project.

Purpose: Quick instructions for running the application and interpreting outputs.

Run (Windows, cmd.exe):
1. Open Command Prompt and navigate to project root:
   cd "C:\Users\sarva\OneDrive - iitr.ac.in\Desktop\Convex Hull Generation"

2. Install dependencies (only once):
   npm install

3. Start development server:
   npm run dev

4. Open the app in your browser at http://localhost:5173

What to do in the app:
- Use the "Points" input to choose 3-100 points and click "Generate Points".
- Use Play/Pause or the slider to run the Jarvis March visualization step-by-step.
- Click "Generate Maze" to build an Onion Decomposition-based maze (one passage per layer).
- Toggle "Show Hulls" to see hull outlines while viewing the maze.
- Click "Download Image" to export the current canvas as a PNG.

Interpreting outputs:
- Blue dots: Input points
- Green dots (with yellow border): Convex hull vertices
- Solid green lines: Confirmed hull edges
- Red dashed line: Current candidate edge being tested
- In Maze mode: Smooth colored Bézier curves represent walls; gaps indicate passages.
- Start marker (🏁) is at the innermost centroid; End marker (🏆) at removed edge on outer layer.

Important files:
- src/utils/geometry.js - core algorithms and maze generator
- src/components/Canvas.jsx - hull drawing and animation
- src/components/MazeCanvas.jsx - maze rendering and decorations
- src/components/Controls.jsx - UI and controls logic

Notes:
- Requires Node.js (v16+). Tested with npm.
- For production build: npm run build (output in `dist/`).

Contact:
- For questions, contact the project authors listed in the top-level README.md

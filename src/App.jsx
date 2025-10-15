// GroupID-3 (22114076_22114018_22114086) - Raman Sharma, Ayush Ranjan, and Sarvasva Gupta
// Date: October 15, 2025
// App.jsx - Main application component integrating all functionality

import React, { useState } from "react";
import Canvas from "./components/Canvas";
import MazeCanvas from "./components/MazeCanvas";
import Controls from "./components/Controls";
import {
  generateRandomPoints,
  jarvisMarchAlgorithm,
  onionDecomposition,
} from "./utils/geometry";

function App() {
  const [points, setPoints] = useState([]);
  const [hullData, setHullData] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [viewMode, setViewMode] = useState("hull"); // "hull" or "maze"
  const [onionData, setOnionData] = useState(null);

  const CANVAS_WIDTH = 900;
  const CANVAS_HEIGHT = 600;

  const handleGeneratePoints = (numPoints) => {
    // Generate random points
    const newPoints = generateRandomPoints(
      numPoints,
      CANVAS_WIDTH,
      CANVAS_HEIGHT,
      50
    );
    setPoints(newPoints);

    // Calculate convex hull
    const result = jarvisMarchAlgorithm(newPoints);
    setHullData(result);

    // Reset to first step
    setCurrentStep(0);
    setIsAnimating(false);

    // Reset maze data
    setOnionData(null);
    setViewMode("hull");
  };

  const handleGenerateMaze = () => {
    if (!points || points.length < 3) {
      alert("Please generate points first!");
      return;
    }

    // Compute onion decomposition
    const onionResult = onionDecomposition(points);
    setOnionData(onionResult);
    setViewMode("maze");
  };

  const handleToggleView = () => {
    if (viewMode === "hull") {
      if (onionData) {
        setViewMode("maze");
      } else {
        handleGenerateMaze();
      }
    } else {
      setViewMode("hull");
    }
  };

  const handleStepChange = (step) => {
    setCurrentStep(step);
  };

  const handleToggleAnimation = () => {
    setIsAnimating((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              {viewMode === "hull"
                ? "🔷 Convex Hull Visualization"
                : "🎁 Maze Generation"}
            </h1>
            <p className="text-md text-gray-600">
              {viewMode === "hull"
                ? "Jarvis March (Gift Wrapping) Algorithm"
                : "Onion Decomposition Maze"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              GroupID-3: Raman Sharma (22114076), Ayush Ranjan (22114018),
              Sarvasva Gupta (22114086)
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Two Column Layout - 1:3 ratio */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 auto-rows-fr">
          {/* Left Column - 1/4 width */}
          <div className="space-y-4 flex flex-col h-full lg:col-span-1">
            {/* Generate Points Section */}
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 mb-3">
                Generate Random Points
              </h2>
              <Controls
                onGeneratePoints={handleGeneratePoints}
                onStepChange={handleStepChange}
                currentStep={currentStep}
                totalSteps={hullData?.steps?.length || 0}
                isAnimating={isAnimating}
                onToggleAnimation={handleToggleAnimation}
                onGenerateMaze={handleGenerateMaze}
                onToggleView={handleToggleView}
                viewMode={viewMode}
                hasPoints={points.length > 0}
                hasMazeData={onionData !== null}
                mode="generate"
              />
            </div>

            {/* Step-by-Step Visualization Controls */}
            {hullData?.steps?.length > 0 && viewMode === "hull" && (
              <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-lg font-bold text-gray-800 mb-3">
                  Step-by-Step Visualization
                </h2>
                <Controls
                  onGeneratePoints={handleGeneratePoints}
                  onStepChange={handleStepChange}
                  currentStep={currentStep}
                  totalSteps={hullData?.steps?.length || 0}
                  isAnimating={isAnimating}
                  onToggleAnimation={handleToggleAnimation}
                  onGenerateMaze={handleGenerateMaze}
                  onToggleView={handleToggleView}
                  viewMode={viewMode}
                  hasPoints={points.length > 0}
                  hasMazeData={onionData !== null}
                  mode="visualize"
                />
              </div>
            )}

            {/* Statistics Section */}
            {hullData &&
              hullData.hullPoints.length > 0 &&
              viewMode === "hull" && (
                <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">
                    📊 Statistics
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <p className="text-xs text-blue-600 font-medium">
                        Total Points
                      </p>
                      <p className="text-2xl font-bold text-blue-900">
                        {points.length}
                      </p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <p className="text-xs text-green-600 font-medium">
                        Hull Vertices
                      </p>
                      <p className="text-2xl font-bold text-green-900">
                        {hullData.hullPoints.length}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                      <p className="text-xs text-purple-600 font-medium">
                        Total Steps
                      </p>
                      <p className="text-2xl font-bold text-purple-900">
                        {hullData.steps.length}
                      </p>
                    </div>
                  </div>

                  {/* Hull Points List */}
                  <div className="mt-3">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Convex Hull Points:
                    </h4>
                    <div className="bg-gray-50 p-2 rounded-lg border border-gray-200 max-h-24 overflow-y-auto">
                      <p className="text-xs text-gray-700 font-mono">
                        {hullData.hullPoints
                          .map(
                            (p, i) => `(${Math.round(p.x)}, ${Math.round(p.y)})`
                          )
                          .join(" → ")}
                      </p>
                    </div>
                  </div>
                </div>
              )}

            {/* Maze Statistics Section */}
            {onionData && viewMode === "maze" && (
              <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  🎁 Maze Statistics
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                    <p className="text-xs text-amber-600 font-medium">Layers</p>
                    <p className="text-2xl font-bold text-amber-900">
                      {onionData.layers.length}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-600 font-medium">
                      Total Points
                    </p>
                    <p className="text-2xl font-bold text-blue-900">
                      {points.length}
                    </p>
                  </div>
                </div>

                {/* Maze Info */}
                <div className="mt-3">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    How to Play:
                  </h4>
                  <div className="bg-gray-50 p-2 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-700">
                      🏁 Start at the green flag in the center
                      <br />
                      🏆 Reach the golden trophy at the edge
                      <br />
                      🧩 Navigate through the passages between layers
                      <br />
                      🎯 Find the path from center to the exit!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - 3/4 width */}
          <div className="flex flex-col h-full lg:col-span-3 space-y-4">
            {/* Algorithm Info Block */}
            <div
              className={`p-4 rounded-lg border ${
                viewMode === "hull"
                  ? "bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200"
                  : "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200"
              }`}
            >
              <h3
                className={`text-md font-bold mb-2 ${
                  viewMode === "hull" ? "text-purple-900" : "text-amber-900"
                }`}
              >
                {viewMode === "hull"
                  ? "🎁 Jarvis March (Gift Wrapping) Algorithm"
                  : "🎁 Onion Decomposition Maze"}
              </h3>
              <p
                className={`text-xs ${
                  viewMode === "hull" ? "text-purple-800" : "text-amber-800"
                }`}
              >
                {viewMode === "hull" ? (
                  <>
                    This algorithm constructs the convex hull by starting from
                    the leftmost point and "wrapping" around the points in a
                    counterclockwise direction, selecting the most
                    counterclockwise point at each step until returning to the
                    start.
                  </>
                ) : (
                  <>
                    Onion Decomposition recursively computes convex hull layers.
                    Each layer forms a "wall" of the maze. Strategic edges are
                    removed to create passages, generating a beautiful solvable
                    maze for kids!
                  </>
                )}
              </p>
              <p
                className={`text-xs mt-2 ${
                  viewMode === "hull" ? "text-purple-800" : "text-amber-800"
                }`}
              >
                <strong>
                  {viewMode === "hull"
                    ? "Time Complexity: O(nh), where n is the number of points and h is the number of hull vertices."
                    : "Perfect for creating fun, educational mazes with multiple difficulty layers!"}
                </strong>
              </p>
            </div>

            {/* Canvas Section - Full Height */}
            <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 flex-1 flex items-center justify-center">
              {viewMode === "hull" ? (
                <Canvas
                  points={points}
                  currentStep={currentStep}
                  steps={hullData?.steps}
                  isAnimating={isAnimating}
                />
              ) : (
                <MazeCanvas points={points} onionData={onionData} />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-6">
        <div className="max-w-7xl mx-auto px-4 py-3 text-center">
          <p className="text-xs text-gray-600">
            Computational Geometry Project - October 15, 2025 | Built with React
            + Vite + Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

// GroupID-3 (22114076_22114018_22114086) - Raman Sharma, Ayush Ranjan, and Sarvasva Gupta
// Date: October 15, 2025
// App.jsx - Main application component integrating all functionality

import React, { useState } from "react";
import Canvas from "./components/Canvas";
import Controls from "./components/Controls";
import { generateRandomPoints, jarvisMarchAlgorithm } from "./utils/geometry";

function App() {
  const [points, setPoints] = useState([]);
  const [hullData, setHullData] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const CANVAS_WIDTH = 800;
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
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              🔷 Convex Hull Visualization
            </h1>
            <p className="text-lg text-gray-600">
              Jarvis March (Gift Wrapping) Algorithm
            </p>
            <p className="text-sm text-gray-500 mt-2">
              GroupID-3: Raman Sharma (22114076), Ayush Ranjan (22114018),
              Sarvasva Gupta (22114086)
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Controls Section */}
          <Controls
            onGeneratePoints={handleGeneratePoints}
            onStepChange={handleStepChange}
            currentStep={currentStep}
            totalSteps={hullData?.steps?.length || 0}
            isAnimating={isAnimating}
            onToggleAnimation={handleToggleAnimation}
          />

          {/* Canvas Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <Canvas
              points={points}
              currentStep={currentStep}
              steps={hullData?.steps}
              isAnimating={isAnimating}
            />
          </div>

          {/* Statistics Section */}
          {hullData && hullData.hullPoints.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                📊 Statistics
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-600 font-medium">
                    Total Points
                  </p>
                  <p className="text-3xl font-bold text-blue-900">
                    {points.length}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-sm text-green-600 font-medium">
                    Hull Vertices
                  </p>
                  <p className="text-3xl font-bold text-green-900">
                    {hullData.hullPoints.length}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-600 font-medium">
                    Total Steps
                  </p>
                  <p className="text-3xl font-bold text-purple-900">
                    {hullData.steps.length}
                  </p>
                </div>
              </div>

              {/* Hull Points List */}
              <div className="mt-4">
                <h4 className="text-md font-semibold text-gray-700 mb-2">
                  Convex Hull Points:
                </h4>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 max-h-32 overflow-y-auto">
                  <p className="text-sm text-gray-700 font-mono">
                    {hullData.hullPoints
                      .map((p, i) => `(${Math.round(p.x)}, ${Math.round(p.y)})`)
                      .join(" → ")}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <p className="text-sm text-gray-600">
            Computational Geometry Project - October 15, 2025
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Built with React + Vite + Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

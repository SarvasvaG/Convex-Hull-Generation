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
              🔷 Convex Hull Visualization
            </h1>
            <p className="text-md text-gray-600">
              Jarvis March (Gift Wrapping) Algorithm
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
                mode="generate"
              />
            </div>

            {/* Step-by-Step Visualization Controls */}
            {hullData?.steps?.length > 0 && (
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
                  mode="visualize"
                />
              </div>
            )}

            {/* Statistics Section */}
            {hullData && hullData.hullPoints.length > 0 && (
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
          </div>

          {/* Right Column - 3/4 width */}
          <div className="flex flex-col h-full lg:col-span-3 space-y-4">
            {/* Algorithm Info Block */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
              <h3 className="text-md font-bold text-purple-900 mb-2">
                🎁 Jarvis March (Gift Wrapping) Algorithm
              </h3>
              <p className="text-xs text-purple-800">
                This algorithm constructs the convex hull by starting from the
                leftmost point and "wrapping" around the points in a
                counterclockwise direction, selecting the most counterclockwise
                point at each step until returning to the start.
              </p>
              <p className="text-xs text-purple-800 mt-2">
                <strong>Time Complexity:</strong> O(nh), where n is the number
                of points and h is the number of hull vertices.
              </p>
            </div>

            {/* Canvas Section - Full Height */}
            <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 flex-1 flex items-center justify-center">
              <Canvas
                points={points}
                currentStep={currentStep}
                steps={hullData?.steps}
                isAnimating={isAnimating}
              />
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

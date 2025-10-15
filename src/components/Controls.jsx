// GroupID-3 (22114076_22114018_22114086) - Raman Sharma, Ayush Ranjan, and Sarvasva Gupta
// Date: October 15, 2025
// Controls.jsx - UI controls for point generation and step visualization

import React, { useState, useEffect } from "react";

const Controls = ({
  onGeneratePoints,
  onStepChange,
  currentStep,
  totalSteps,
  isAnimating,
  onToggleAnimation,
  mode = "both", // 'generate', 'visualize', or 'both'
}) => {
  const [numPoints, setNumPoints] = useState(10);
  const [error, setError] = useState("");

  useEffect(() => {
    let animationInterval;

    if (isAnimating && currentStep < totalSteps - 1) {
      animationInterval = setInterval(() => {
        onStepChange(currentStep + 1);
      }, 800);
    } else if (isAnimating && currentStep >= totalSteps - 1) {
      onToggleAnimation();
    }

    return () => {
      if (animationInterval) {
        clearInterval(animationInterval);
      }
    };
  }, [isAnimating, currentStep, totalSteps, onStepChange, onToggleAnimation]);

  const handleGeneratePoints = () => {
    const num = parseInt(numPoints);

    if (isNaN(num) || num < 3) {
      setError("Please enter a number greater than or equal to 3");
      return;
    }

    if (num > 100) {
      setError("Please enter a number less than or equal to 100");
      return;
    }

    setError("");
    onGeneratePoints(num);
  };

  const handleNumPointsChange = (e) => {
    setNumPoints(e.target.value);
    setError("");
  };

  const handleSliderChange = (e) => {
    const value = parseInt(e.target.value);
    onStepChange(value);
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      onStepChange(currentStep + 1);
    }
  };

  const handleReset = () => {
    onStepChange(0);
  };

  const handlePlayPause = () => {
    if (currentStep >= totalSteps - 1) {
      onStepChange(0);
    }
    onToggleAnimation();
  };

  return (
    <div className="w-full">
      {/* Point Generation Controls */}
      {(mode === "both" || mode === "generate") && (
        <div>
          <div className="flex flex-col gap-4">
            <div className="flex-1">
              <label
                htmlFor="numPoints"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Number of Points (3-100)
              </label>
              <input
                id="numPoints"
                type="number"
                min="3"
                max="100"
                value={numPoints}
                onChange={handleNumPointsChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter number of points"
              />
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>

            <button
              onClick={handleGeneratePoints}
              className="w-full px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
            >
              Generate Points
            </button>
          </div>
        </div>
      )}

      {/* Visualization Controls */}
      {(mode === "both" || mode === "visualize") && totalSteps > 0 && (
        <div>
          <div className="space-y-4">
            {/* Step Counter */}
            <div className="text-center">
              <span className="text-lg font-semibold text-gray-700">
                Step {currentStep + 1} / {totalSteps}
              </span>
            </div>

            {/* Slider */}
            <div className="px-2">
              <input
                type="range"
                min="0"
                max={totalSteps - 1}
                value={currentStep}
                onChange={handleSliderChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                disabled={isAnimating}
              />
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-500">Start</span>
                <span className="text-xs text-gray-500">End</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={handleReset}
                disabled={currentStep === 0 || isAnimating}
                className="px-3 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                ⏮ Reset
              </button>

              <button
                onClick={handlePrevious}
                disabled={currentStep === 0 || isAnimating}
                className="px-3 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                ⏪ Previous
              </button>

              <button
                onClick={handlePlayPause}
                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
              >
                {isAnimating ? "⏸ Pause" : "▶ Play"}
              </button>

              <button
                onClick={handleNext}
                disabled={currentStep >= totalSteps - 1 || isAnimating}
                className="px-3 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Next ⏩
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Controls;

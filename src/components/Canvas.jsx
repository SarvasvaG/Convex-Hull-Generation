// GroupID-3 (22114076_22114018_22114086) - Raman Sharma, Ayush Ranjan, and Sarvasva Gupta
// Date: October 15, 2025
// Canvas.jsx - Visualization component for rendering points and convex hull

import React, { useEffect, useRef } from "react";

const Canvas = ({ points, currentStep, steps, isAnimating }) => {
  const canvasRef = useRef(null);
  const POINT_RADIUS = 6;
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw background
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw grid
    drawGrid(ctx);

    if (!points || points.length === 0) {
      drawWelcomeMessage(ctx);
      return;
    }

    // Draw all points
    points.forEach((point, index) => {
      drawPoint(ctx, point, "#3b82f6", index);
    });

    // Draw convex hull edges up to current step
    if (steps && steps.length > 0 && currentStep >= 0) {
      const relevantSteps = steps.slice(0, currentStep + 1);

      // Draw all completed edges
      relevantSteps.forEach((step, idx) => {
        const isCurrentEdge = idx === currentStep;
        drawEdge(ctx, step.edge[0], step.edge[1], isCurrentEdge);
      });

      // Highlight hull points
      if (relevantSteps.length > 0) {
        const currentHull = relevantSteps[currentStep].hullSoFar || [];
        currentHull.forEach((point) => {
          drawPoint(ctx, point, "#10b981", null, true);
        });
      }

      // Draw current edge being formed with animation
      if (isAnimating && currentStep < steps.length) {
        const step = steps[currentStep];
        drawAnimatedEdge(ctx, step.edge[0], step.edge[1]);
      }
    }

    // Draw legend
    drawLegend(ctx);
  }, [points, currentStep, steps, isAnimating]);

  const drawGrid = (ctx) => {
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 0.5;

    // Vertical lines
    for (let x = 0; x <= CANVAS_WIDTH; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= CANVAS_HEIGHT; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }

    // Border
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  };

  const drawPoint = (ctx, point, color, index, isHullPoint = false) => {
    ctx.beginPath();
    ctx.arc(
      point.x,
      point.y,
      isHullPoint ? POINT_RADIUS + 2 : POINT_RADIUS,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = color;
    ctx.fill();

    if (isHullPoint) {
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 2;
      ctx.stroke();
    } else {
      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw point label
    if (index !== null && index !== undefined) {
      ctx.fillStyle = "#1e293b";
      ctx.font = "10px Arial";
      ctx.textAlign = "center";
      ctx.fillText(`${index}`, point.x, point.y - 12);
    }
  };

  const drawEdge = (ctx, p1, p2, isCurrent = false) => {
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);

    if (isCurrent) {
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
    } else {
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2.5;
      ctx.setLineDash([]);
    }

    ctx.stroke();
    ctx.setLineDash([]);

    // Draw arrow at the end
    if (isCurrent) {
      drawArrow(ctx, p1, p2, "#ef4444");
    }
  };

  const drawAnimatedEdge = (ctx, p1, p2) => {
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  const drawArrow = (ctx, from, to, color) => {
    const headlen = 15;
    const angle = Math.atan2(to.y - from.y, to.x - from.x);

    ctx.beginPath();
    ctx.moveTo(to.x, to.y);
    ctx.lineTo(
      to.x - headlen * Math.cos(angle - Math.PI / 6),
      to.y - headlen * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(to.x, to.y);
    ctx.lineTo(
      to.x - headlen * Math.cos(angle + Math.PI / 6),
      to.y - headlen * Math.sin(angle + Math.PI / 6)
    );
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const drawWelcomeMessage = (ctx) => {
    ctx.fillStyle = "#64748b";
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      "Convex Hull Visualization",
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT / 2 - 30
    );

    ctx.font = "16px Arial";
    ctx.fillText(
      'Enter number of points and click "Generate Points"',
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT / 2 + 10
    );
  };

  const drawLegend = (ctx) => {
    const legendX = 10;
    const legendY = 10;
    const lineHeight = 25;

    ctx.font = "12px Arial";
    ctx.textAlign = "left";

    // Input points
    ctx.beginPath();
    ctx.arc(legendX + 8, legendY + 8, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "#3b82f6";
    ctx.fill();
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = "#1e293b";
    ctx.fillText("Input Points", legendX + 20, legendY + 12);

    // Hull points
    ctx.beginPath();
    ctx.arc(legendX + 8, legendY + lineHeight + 8, 7, 0, 2 * Math.PI);
    ctx.fillStyle = "#10b981";
    ctx.fill();
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#1e293b";
    ctx.fillText("Hull Points", legendX + 20, legendY + lineHeight + 12);

    // Current edge
    ctx.beginPath();
    ctx.moveTo(legendX, legendY + 2 * lineHeight + 5);
    ctx.lineTo(legendX + 15, legendY + 2 * lineHeight + 5);
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#1e293b";
    ctx.fillText("Current Edge", legendX + 20, legendY + 2 * lineHeight + 10);
  };

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border-2 border-gray-300 rounded-lg shadow-lg bg-white"
      />
      {steps &&
        steps.length > 0 &&
        currentStep >= 0 &&
        currentStep < steps.length && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg max-w-2xl">
            <p className="text-sm text-blue-900 font-medium">
              Step {currentStep + 1} of {steps.length}:{" "}
              {steps[currentStep].message}
            </p>
          </div>
        )}
    </div>
  );
};

export default Canvas;

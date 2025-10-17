// GroupID-3 (22114076_22114018_22114086) - Raman Sharma, Ayush Ranjan, and Sarvasva Gupta
// Date: October 15, 2025
// MazeCanvas.jsx - Component for rendering the maze with Onion Decomposition and emojis

import React, { useEffect, useRef, forwardRef, useState } from "react";
import mazeBackground from "../assets/maze-background.jpg";

const MazeCanvas = forwardRef(
  ({ points, onionData, showHulls = false, emojiPositions = [] }, ref) => {
    const canvasRef = useRef(null);
    const [backgroundImage, setBackgroundImage] = useState(null);
    const CANVAS_WIDTH = 900;
    const CANVAS_HEIGHT = 600;

    // Emoji collections for decoration
    const APPLE_EMOJI = "\uD83C\uDF4E"; // 🍎 Apple emoji
    const MONSTER_EMOJI = "\uD83D\uDC7B"; // 👻 Ghost emoji
    const START_EMOJI = "🏁"; // Start flag
    const END_EMOJI = "🏆"; // Trophy for end

    // Load background image
    useEffect(() => {
      const img = new Image();
      img.src = mazeBackground;
      img.onload = () => {
        setBackgroundImage(img);
      };
    }, []);

    // Emoji positions are provided by parent via prop (emojiPositions)

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw background image or gradient
      if (backgroundImage) {
        // Draw the background image to cover the entire canvas
        ctx.drawImage(backgroundImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Add a semi-transparent overlay for better contrast
        ctx.fillStyle = "rgba(254, 243, 199, 0.4)";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      } else {
        // Fallback to gradient if image not loaded
        const gradient = ctx.createLinearGradient(
          0,
          0,
          CANVAS_WIDTH,
          CANVAS_HEIGHT
        );
        gradient.addColorStop(0, "#fef3c7");
        gradient.addColorStop(0.5, "#fde68a");
        gradient.addColorStop(1, "#fbbf24");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      }

      if (!onionData || !onionData.layers || onionData.layers.length === 0) {
        drawWelcomeMessage(ctx);
        return;
      }

      const { layers, mazeData, centroid } = onionData;

      // Toggle between smooth curves and hulls based on showHulls prop
      if (showHulls) {
        // Show ONLY hulls (straight edges) when showHulls is true
        drawMazeWalls(ctx, mazeData.edgesToKeep);
      } else {
        // Show smoothed Bézier curves when showHulls is false (default)
        if (mazeData.smoothCurves && mazeData.smoothCurves.length > 0) {
          drawSmoothMazeWalls(
            ctx,
            mazeData.smoothCurves,
            mazeData.edgesToRemove
          );
        } else {
          // Fallback to straight edges if smooth curves not available
          drawMazeWalls(ctx, mazeData.edgesToKeep);
        }
      }

      // Passages are no longer drawn - they are just gaps in the walls

      // Draw start position
      if (mazeData.startPosition) {
        drawStartPosition(ctx, mazeData.startPosition);
      }

      // Draw end position
      if (mazeData.endPosition) {
        drawEndPosition(ctx, mazeData.endPosition);
      }

      // Draw emojis LAST to ensure they're on top (highest z-index)
      decorateMazeWithEmojis(
        ctx,
        mazeData,
        layers,
        mazeData.startPosition,
        mazeData.endPosition
      );

      // Draw color-coded points when showHulls is enabled
      if (showHulls && points && points.length > 0 && onionData) {
        drawColorCodedPoints(ctx, points, onionData);
      }
    }, [points, onionData, showHulls, backgroundImage]);

    /**
     * Draw points with different colors based on their role:
     * - Hull points (on convex hulls): Green
     * - Removed points (filtered for spacing): Red
     * - Inner points (remaining): Blue
     */
    const drawColorCodedPoints = (ctx, allPoints, onionData) => {
      const {
        allHullPoints = [],
        removedPoints = [],
        innerPoints = [],
      } = onionData;

      // Create sets for fast lookup
      const hullPointsSet = new Set(allHullPoints.map((p) => `${p.x},${p.y}`));
      const removedPointsSet = new Set(
        removedPoints.map((p) => `${p.x},${p.y}`)
      );
      const innerPointsSet = new Set(innerPoints.map((p) => `${p.x},${p.y}`));

      allPoints.forEach((point) => {
        const key = `${point.x},${point.y}`;
        let fillColor, strokeColor, radius;

        if (hullPointsSet.has(key)) {
          // Hull points: Green
          fillColor = "rgba(34, 197, 94, 0.7)"; // green-500 with transparency
          strokeColor = "#16a34a"; // green-600
          radius = 4;
        } else if (removedPointsSet.has(key)) {
          // Removed points: Red
          fillColor = "rgba(239, 68, 68, 0.6)"; // red-500 with transparency
          strokeColor = "#dc2626"; // red-600
          radius = 3;
        } else if (innerPointsSet.has(key)) {
          // Inner points: Blue
          fillColor = "rgba(59, 130, 246, 0.6)"; // blue-500 with transparency
          strokeColor = "#2563eb"; // blue-600
          radius = 3;
        } else {
          // Fallback for any other points: Light gray
          fillColor = "rgba(148, 163, 184, 0.4)"; // slate-400 with transparency
          strokeColor = "#94a3b8"; // slate-400
          radius = 2;
        }

        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = fillColor;
        ctx.fill();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    };

    const drawDottedHulls = (ctx, layers) => {
      // Layer colors with low opacity
      const layerColors = [
        "rgba(220, 38, 38, 0.3)", // Red
        "rgba(234, 88, 12, 0.3)", // Orange
        "rgba(217, 119, 6, 0.3)", // Amber
        "rgba(101, 163, 13, 0.3)", // Lime
        "rgba(5, 150, 105, 0.3)", // Emerald
        "rgba(8, 145, 178, 0.3)", // Cyan
        "rgba(37, 99, 235, 0.3)", // Blue
        "rgba(124, 58, 237, 0.3)", // Violet
        "rgba(192, 38, 211, 0.3)", // Fuchsia
      ];

      layers.forEach((layer, layerIndex) => {
        const hull = layer.hull;
        const color = layerColors[layerIndex % layerColors.length];

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]); // Dotted line pattern

        // Draw the convex hull as a closed polygon
        ctx.beginPath();
        ctx.moveTo(hull[0].x, hull[0].y);

        for (let i = 1; i < hull.length; i++) {
          ctx.lineTo(hull[i].x, hull[i].y);
        }

        ctx.closePath();
        ctx.stroke();

        // Reset line dash
        ctx.setLineDash([]);
      });
    };

    const drawSmoothMazeWalls = (ctx, smoothCurves, edgesToRemove) => {
      // Layer colors
      const layerColors = [
        "#dc2626", // Red - outermost
        "#ea580c", // Orange
        "#d97706", // Amber
        "#65a30d", // Lime
        "#059669", // Emerald
        "#0891b2", // Cyan
        "#2563eb", // Blue
        "#7c3aed", // Violet
        "#c026d3", // Fuchsia
      ];

      // Create a set of removed edge indices for quick lookup
      const removedEdgeSet = new Set();
      edgesToRemove.forEach((edge) => {
        removedEdgeSet.add(`${edge.layerIndex}-${edge.edgeIndex}`);
      });

      // Draw each layer's smooth curves
      smoothCurves.forEach((layerCurve) => {
        const { layerIndex, curves } = layerCurve;
        const color = layerColors[layerIndex % layerColors.length];

        ctx.strokeStyle = color;
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // Draw the smooth curve as a closed path
        ctx.beginPath();

        curves.forEach((curve, segmentIndex) => {
          // Check if this segment should be skipped (it's a removed edge/passage)
          const isRemoved = removedEdgeSet.has(`${layerIndex}-${segmentIndex}`);

          if (!isRemoved) {
            if (segmentIndex === 0) {
              ctx.moveTo(curve.start.x, curve.start.y);
            }

            // Draw quadratic Bézier curve
            ctx.quadraticCurveTo(
              curve.control.x,
              curve.control.y,
              curve.end.x,
              curve.end.y
            );
          } else {
            // For removed edges, just move to the end without drawing
            if (segmentIndex === 0) {
              ctx.moveTo(curve.start.x, curve.start.y);
            }
            ctx.moveTo(curve.end.x, curve.end.y);
          }
        });

        // Add shadow for depth
        ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
        ctx.shadowBlur = 3;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.stroke();
        ctx.shadowColor = "transparent";
      });
    };

    const drawMazeWalls = (ctx, edgesToKeep) => {
      // Group edges by layer for color coding
      const layerColors = [
        "#dc2626", // Red - outermost
        "#ea580c", // Orange
        "#d97706", // Amber
        "#65a30d", // Lime
        "#059669", // Emerald
        "#0891b2", // Cyan
        "#2563eb", // Blue
        "#7c3aed", // Violet
        "#c026d3", // Fuchsia
      ];

      edgesToKeep.forEach((edge) => {
        const color = layerColors[edge.layerIndex % layerColors.length];

        ctx.beginPath();
        ctx.moveTo(edge.from.x, edge.from.y);
        ctx.lineTo(edge.to.x, edge.to.y);
        ctx.strokeStyle = color;
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        ctx.stroke();

        // Add shadow for depth
        ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
        ctx.shadowBlur = 3;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.stroke();
        ctx.shadowColor = "transparent";
      });
    };

    const drawPassages = (ctx, passages) => {
      passages.forEach((passage) => {
        // Draw dashed line to indicate passage
        ctx.beginPath();
        ctx.moveTo(passage.from.x, passage.from.y);
        ctx.lineTo(passage.to.x, passage.to.y);
        ctx.strokeStyle = "#a3e635";
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw arrow indicating passage
        drawPassageArrow(ctx, passage.from, passage.to);
      });
    };

    const drawPassageArrow = (ctx, from, to) => {
      const midX = (from.x + to.x) / 2;
      const midY = (from.y + to.y) / 2;
      const angle = Math.atan2(to.y - from.y, to.x - from.x);

      ctx.save();
      ctx.translate(midX, midY);
      ctx.rotate(angle);

      // Draw arrow
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-10, -5);
      ctx.lineTo(-10, 5);
      ctx.closePath();
      ctx.fillStyle = "#22c55e";
      ctx.fill();

      ctx.restore();
    };

    const decorateMazeWithEmojis = (
      ctx,
      mazeData,
      layers,
      startPosition,
      endPosition
    ) => {
      // Prefer emoji positions attached to mazeData, otherwise use parent prop
      const positions =
        (mazeData && mazeData.emojiPositions) || emojiPositions || [];
      if (positions && positions.length > 0) {
        positions.forEach((pos, index) => {
          const emoji = index % 2 === 0 ? APPLE_EMOJI : MONSTER_EMOJI;
          drawEmoji(ctx, emoji, pos.x, pos.y, 24);
        });
      }
    };

    /**
     * Generates safe positions for emojis that don't overlap with Bézier curves
     * Uses a grid-based sampling approach with collision detection
     */
    const generateSafePositions = (
      smoothCurves,
      count,
      minDistance,
      startPosition,
      endPosition,
      outermostHull
    ) => {
      const safePositions = [];
      const maxAttempts = 500;
      const margin = 50; // Keep away from canvas edges

      for (let i = 0; i < count && safePositions.length < count; i++) {
        let attempts = 0;
        let foundSafe = false;

        while (attempts < maxAttempts && !foundSafe) {
          // Generate random position within canvas bounds
          const candidatePos = {
            x: Math.random() * (CANVAS_WIDTH - 2 * margin) + margin,
            y: Math.random() * (CANVAS_HEIGHT - 2 * margin) + margin,
          };

          // Check if position is inside the outermost hull
          if (
            outermostHull &&
            !isPointInsidePolygon(candidatePos, outermostHull)
          ) {
            attempts++;
            continue;
          }

          // Check if position is safe (not too close to walls, other emojis, or start/end)
          if (
            isPositionSafe(
              candidatePos,
              smoothCurves,
              minDistance,
              safePositions,
              startPosition,
              endPosition
            )
          ) {
            safePositions.push(candidatePos);
            foundSafe = true;
          }

          attempts++;
        }
      }

      return safePositions;
    };

    /**
     * Checks if a position is safe (not too close to walls or other items)
     */
    const isPositionSafe = (
      pos,
      smoothCurves,
      minDistance,
      existingPositions,
      startPosition,
      endPosition
    ) => {
      // Check distance from start position (avoid overlapping)
      if (startPosition) {
        const distToStart = Math.sqrt(
          Math.pow(pos.x - startPosition.x, 2) +
            Math.pow(pos.y - startPosition.y, 2)
        );
        if (distToStart < minDistance + 20) {
          // Extra buffer for start
          return false;
        }
      }

      // Check distance from end position (avoid overlapping)
      if (endPosition) {
        const distToEnd = Math.sqrt(
          Math.pow(pos.x - endPosition.x, 2) +
            Math.pow(pos.y - endPosition.y, 2)
        );
        if (distToEnd < minDistance + 20) {
          // Extra buffer for end
          return false;
        }
      }

      // Check distance from existing positions
      for (const existingPos of existingPositions) {
        const dist = Math.sqrt(
          Math.pow(pos.x - existingPos.x, 2) +
            Math.pow(pos.y - existingPos.y, 2)
        );
        if (dist < minDistance) {
          return false;
        }
      }

      // Check distance from all Bézier curves
      if (smoothCurves && smoothCurves.length > 0) {
        for (const layerCurve of smoothCurves) {
          for (const curve of layerCurve.curves) {
            const distToCurve = distanceToQuadraticBezier(
              pos,
              curve.start,
              curve.control,
              curve.end
            );

            if (distToCurve < minDistance) {
              return false;
            }
          }
        }
      }

      return true;
    };

    /**
     * Calculates the minimum distance from a point to a quadratic Bézier curve
     * Uses parametric sampling for approximation
     */
    const distanceToQuadraticBezier = (point, start, control, end) => {
      let minDist = Infinity;
      const samples = 20; // Number of samples along the curve

      // Sample points along the Bézier curve
      for (let i = 0; i <= samples; i++) {
        const t = i / samples;
        const curvePoint = getQuadraticBezierPoint(t, start, control, end);

        const dist = Math.sqrt(
          Math.pow(point.x - curvePoint.x, 2) +
            Math.pow(point.y - curvePoint.y, 2)
        );

        minDist = Math.min(minDist, dist);
      }

      return minDist;
    };

    /**
     * Gets a point on a quadratic Bézier curve at parameter t (0 to 1)
     */
    const getQuadraticBezierPoint = (t, start, control, end) => {
      const oneMinusT = 1 - t;
      return {
        x:
          oneMinusT * oneMinusT * start.x +
          2 * oneMinusT * t * control.x +
          t * t * end.x,
        y:
          oneMinusT * oneMinusT * start.y +
          2 * oneMinusT * t * control.y +
          t * t * end.y,
      };
    };

    /**
     * Checks if a point is inside a polygon using ray casting algorithm
     * @param {object} point - Point with x and y coordinates
     * @param {Array} polygon - Array of points forming the polygon
     * @returns {boolean} True if point is inside polygon
     */
    const isPointInsidePolygon = (point, polygon) => {
      let inside = false;
      const n = polygon.length;

      for (let i = 0, j = n - 1; i < n; j = i++) {
        const xi = polygon[i].x;
        const yi = polygon[i].y;
        const xj = polygon[j].x;
        const yj = polygon[j].y;

        const intersect =
          yi > point.y !== yj > point.y &&
          point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;

        if (intersect) inside = !inside;
      }

      return inside;
    };

    const drawEmoji = (ctx, emoji, x, y, size = 24) => {
      ctx.font = `${size}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(emoji, x, y);
    };

    const drawStartPosition = (ctx, startPosition) => {
      // Draw a circle background
      ctx.beginPath();
      ctx.arc(startPosition.x, startPosition.y, 25, 0, 2 * Math.PI);
      ctx.fillStyle = "#22c55e";
      ctx.fill();
      ctx.strokeStyle = "#16a34a";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw start emoji
      drawEmoji(ctx, START_EMOJI, startPosition.x, startPosition.y, 30);

      // Draw label
      ctx.font = "bold 12px Arial";
      ctx.fillStyle = "#16a34a";
      ctx.fillText("START", startPosition.x, startPosition.y + 40);
    };

    const drawEndPosition = (ctx, endPosition) => {
      // Draw a circle background
      ctx.beginPath();
      ctx.arc(endPosition.x, endPosition.y, 25, 0, 2 * Math.PI);
      ctx.fillStyle = "#fbbf24";
      ctx.fill();
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw end emoji
      drawEmoji(ctx, END_EMOJI, endPosition.x, endPosition.y, 30);

      // Draw label
      ctx.font = "bold 12px Arial";
      ctx.fillStyle = "#f59e0b";
      ctx.fillText("END", endPosition.x, endPosition.y + 40);
    };

    const drawWelcomeMessage = (ctx) => {
      ctx.fillStyle = "#64748b";
      ctx.font = "bold 24px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        "🎁 Maze Generation with Onion Decomposition",
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT / 2 - 30
      );

      ctx.font = "16px Arial";
      ctx.fillText(
        'Generate points and click "Generate Maze" to create a solvable maze!',
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT / 2 + 10
      );
    };

    return (
      <div className="flex flex-col items-center w-full">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="border border-gray-300 rounded-lg shadow-lg bg-white max-w-full"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </div>
    );
  }
);

MazeCanvas.displayName = "MazeCanvas";

export default MazeCanvas;

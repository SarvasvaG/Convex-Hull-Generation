// GroupID-3 (22114076_22114018_22114086) - Raman Sharma, Ayush Ranjan, and Sarvasva Gupta
// Date: October 15, 2025
// MazeCanvas.jsx - Component for rendering the maze with Onion Decomposition and emojis

import React, { useEffect, useRef, forwardRef, useState } from "react";
import mazeBackground from "../assets/maze-background.jpg";

const MazeCanvas = forwardRef(
  ({ points, onionData, showHulls = false }, ref) => {
    const canvasRef = useRef(null);
    const [backgroundImage, setBackgroundImage] = useState(null);
    const CANVAS_WIDTH = 900;
    const CANVAS_HEIGHT = 600;

    // Emoji collections for decoration
    const PATH_EMOJIS = [
      "⭐",
      "🌟",
      "✨",
      "🦄",
      "🍎",
      "🍇",
      "🍓",
      "🍊",
      "🎈",
      "🎁",
      "💎",
      "🌸",
    ];
    const MONSTER_EMOJIS = ["👹", "👺", "👻", "👾", "🤖", "💀"];
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

      // Draw all layers with smooth curves
      if (mazeData.smoothCurves && mazeData.smoothCurves.length > 0) {
        drawSmoothMazeWalls(ctx, mazeData.smoothCurves, mazeData.edgesToRemove);
      } else {
        // Fallback to straight edges if smooth curves not available
        drawMazeWalls(ctx, mazeData.edgesToKeep);
      }

      // Passages are no longer drawn - they are just gaps in the walls

      // Draw emojis along the paths
      decorateMazeWithEmojis(ctx, mazeData, layers);

      // Draw dotted convex hulls if enabled
      if (showHulls && layers && layers.length > 0) {
        drawDottedHulls(ctx, layers);
      }

      // Draw start position
      if (mazeData.startPosition) {
        drawStartPosition(ctx, mazeData.startPosition);
      }

      // Draw end position
      if (mazeData.endPosition) {
        drawEndPosition(ctx, mazeData.endPosition);
      }

      // Draw all original points (optional - controlled by showHulls prop)
      if (showHulls && points && points.length > 0) {
        points.forEach((point) => {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
          ctx.fillStyle = "#1e293b";
          ctx.fill();
          ctx.strokeStyle = "#64748b";
          ctx.lineWidth = 1;
          ctx.stroke();
        });
      }
    }, [points, onionData, showHulls, backgroundImage]);

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

    const decorateMazeWithEmojis = (ctx, mazeData, layers) => {
      // Only start and end emojis will be drawn
      // All decorative emojis (path markers and monsters) have been removed
      // The start and end positions are drawn separately in their respective functions
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
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border border-gray-300 rounded-lg shadow-lg"
      />
    );
  }
);

MazeCanvas.displayName = "MazeCanvas";

export default MazeCanvas;

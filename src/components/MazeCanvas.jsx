// GroupID-3 (22114076_22114018_22114086) - Raman Sharma, Ayush Ranjan, and Sarvasva Gupta
// Date: October 15, 2025
// MazeCanvas.jsx - Component for rendering the maze with Onion Decomposition and emojis

import React, { useEffect, useRef, forwardRef } from "react";

const MazeCanvas = forwardRef(({ points, onionData }, ref) => {
  const canvasRef = useRef(null);
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw background with gradient
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

    if (!onionData || !onionData.layers || onionData.layers.length === 0) {
      drawWelcomeMessage(ctx);
      return;
    }

    const { layers, mazeData, centroid } = onionData;

    // Draw all layers first (edges to keep - walls)
    drawMazeWalls(ctx, mazeData.edgesToKeep);

    // Draw passages (removed edges) with path markers
    drawPassages(ctx, mazeData.passages);

    // Draw emojis along the paths
    decorateMazeWithEmojis(ctx, mazeData, layers);

    // Draw start position
    if (mazeData.startPosition) {
      drawStartPosition(ctx, mazeData.startPosition);
    }

    // Draw end position
    if (mazeData.endPosition) {
      drawEndPosition(ctx, mazeData.endPosition);
    }

    // Draw all original points (optional - small dots)
    if (points && points.length > 0) {
      points.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
        ctx.fillStyle = "#64748b";
        ctx.fill();
      });
    }

    // Draw legend
    drawMazeLegend(ctx);
  }, [points, onionData]);

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

  const drawMazeLegend = (ctx) => {
    const legendX = 10;
    const legendY = CANVAS_HEIGHT - 60;

    // Background
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fillRect(legendX, legendY, 200, 50);
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1;
    ctx.strokeRect(legendX, legendY, 200, 50);

    ctx.font = "12px Arial";
    ctx.textAlign = "left";

    // Start
    drawEmoji(ctx, START_EMOJI, legendX + 15, legendY + 15, 16);
    ctx.fillStyle = "#1e293b";
    ctx.fillText("Start Position", legendX + 35, legendY + 18);

    // End
    drawEmoji(ctx, END_EMOJI, legendX + 15, legendY + 35, 16);
    ctx.fillText("End Position", legendX + 35, legendY + 38);
  };

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="border border-gray-300 rounded-lg shadow-lg"
    />
  );
});

MazeCanvas.displayName = "MazeCanvas";

export default MazeCanvas;

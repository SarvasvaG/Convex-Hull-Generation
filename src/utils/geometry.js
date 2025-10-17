// GroupID-3 (22114076_22114018_22114086) - Raman Sharma, Ayush Ranjan, and Sarvasva Gupta
// Date: October 15, 2025
// geometry.js - Jarvis March (Gift Wrapping) Algorithm for Convex Hull

/**
 * Generates n random distinct 2D points within the specified bounds
 * @param {number} n - Number of points to generate
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} padding - Padding from edges
 * @returns {Array<{x: number, y: number, id: number}>} Array of points
 */
export function generateRandomPoints(n, width, height, padding = 50) {
  const points = [];
  const pointsSet = new Set();

  while (points.length < n) {
    const x = Math.floor(Math.random() * (width - 2 * padding) + padding);
    const y = Math.floor(Math.random() * (height - 2 * padding) + padding);
    const key = `${x},${y}`;

    // Ensure points are distinct
    if (!pointsSet.has(key)) {
      pointsSet.add(key);
      points.push({ x, y, id: points.length });
    }
  }

  return points;
}

/**
 * Calculate the cross product of vectors OA and OB where O, A, B are points
 * Returns positive value if OAB makes a counter-clockwise turn
 * Returns negative value if OAB makes a clockwise turn
 * Returns 0 if O, A, and B are collinear
 * @param {object} O - Origin point
 * @param {object} A - Point A
 * @param {object} B - Point B
 * @returns {number} Cross product value
 */
function crossProduct(O, A, B) {
  return (A.x - O.x) * (B.y - O.y) - (A.y - O.y) * (B.x - O.x);
}

/**
 * Calculate the squared distance between two points
 * @param {object} p1 - First point
 * @param {object} p2 - Second point
 * @returns {number} Squared distance
 */
function distanceSquared(p1, p2) {
  return (p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2;
}

/**
 * Calculate the minimum distance from a point to a line segment
 * @param {object} point - The point
 * @param {object} lineStart - Start of line segment
 * @param {object} lineEnd - End of line segment
 * @returns {number} Minimum distance from point to line segment
 */
function distanceToLineSegment(point, lineStart, lineEnd) {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;

  // If the line segment is just a point
  if (dx === 0 && dy === 0) {
    return Math.sqrt(distanceSquared(point, lineStart));
  }

  // Calculate the parameter t for the projection of point onto the line
  // t represents the position along the line segment (0 = start, 1 = end)
  const t = Math.max(
    0,
    Math.min(
      1,
      ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) /
        (dx * dx + dy * dy)
    )
  );

  // Calculate the closest point on the line segment
  const closestPoint = {
    x: lineStart.x + t * dx,
    y: lineStart.y + t * dy,
  };

  // Return the distance from the point to the closest point on the segment
  return Math.sqrt(distanceSquared(point, closestPoint));
}

/**
 * Finds the orientation of ordered triplet (p, q, r)
 * @param {object} p - Point p
 * @param {object} q - Point q
 * @param {object} r - Point r
 * @returns {number} 0 if collinear, 1 if clockwise, 2 if counterclockwise
 */
function orientation(p, q, r) {
  const val = crossProduct(p, q, r);
  if (Math.abs(val) < 1e-9) return 0; // Collinear
  return val > 0 ? 2 : 1; // 2: Counterclockwise, 1: Clockwise
}

/**
 * Jarvis March (Gift Wrapping) Algorithm
 * Computes the convex hull of a set of 2D points
 * @param {Array<object>} points - Array of points with x and y coordinates
 * @returns {object} Object containing hull points and step-by-step visualization data
 */
export function jarvisMarchAlgorithm(points) {
  if (!points || points.length < 3) {
    return {
      hullPoints: points || [],
      steps: [],
      allSteps: [],
    };
  }

  const n = points.length;
  const hull = [];
  const steps = [];
  const allSteps = []; // All checking steps for visualization

  // Find the leftmost point (starting point)
  let leftmost = 0;
  for (let i = 1; i < n; i++) {
    if (
      points[i].x < points[leftmost].x ||
      (points[i].x === points[leftmost].x && points[i].y < points[leftmost].y)
    ) {
      leftmost = i;
    }
  }

  let currentPoint = leftmost;
  let stepCount = 0;

  do {
    // Add current point to hull
    hull.push(points[currentPoint]);

    // Find the most counterclockwise point from current point
    let nextPoint = (currentPoint + 1) % n;

    for (let i = 0; i < n; i++) {
      if (i === currentPoint) continue;

      // Record this checking step for visualization
      allSteps.push({
        type: "checking",
        from: points[currentPoint],
        to: points[i],
        candidate: points[nextPoint],
        currentHull: [...hull],
        stepNumber: allSteps.length,
      });

      const orient = orientation(
        points[currentPoint],
        points[nextPoint],
        points[i]
      );

      // If i is more counterclockwise than current nextPoint, update nextPoint
      if (orient === 2) {
        nextPoint = i;
      } else if (orient === 0) {
        // If collinear, choose the farthest point
        if (
          distanceSquared(points[currentPoint], points[i]) >
          distanceSquared(points[currentPoint], points[nextPoint])
        ) {
          nextPoint = i;
        }
      }
    }

    // Add the edge from current to next point
    steps.push({
      edge: [points[currentPoint], points[nextPoint]],
      hullSoFar: [...hull, points[nextPoint]],
      stepNumber: stepCount++,
      message: `Added edge from (${points[currentPoint].x}, ${points[currentPoint].y}) to (${points[nextPoint].x}, ${points[nextPoint].y})`,
    });

    currentPoint = nextPoint;
  } while (currentPoint !== leftmost); // Loop until we come back to the first point

  return {
    hullPoints: hull,
    steps: steps,
    allSteps: allSteps,
  };
}

/**
 * Calculate the polar angle of point p with respect to origin o
 * @param {object} o - Origin point
 * @param {object} p - Point to calculate angle for
 * @returns {number} Angle in radians
 */
export function polarAngle(o, p) {
  return Math.atan2(p.y - o.y, p.x - o.x);
}

/**
 * Check if a point is inside the convex hull
 * @param {object} point - Point to check
 * @param {Array<object>} hull - Convex hull points
 * @returns {boolean} True if point is inside hull
 */
export function isPointInsideHull(point, hull) {
  if (hull.length < 3) return false;

  let sign = null;
  for (let i = 0; i < hull.length; i++) {
    const j = (i + 1) % hull.length;
    const cross = crossProduct(hull[i], hull[j], point);

    if (Math.abs(cross) < 1e-9) continue; // On the edge

    if (sign === null) {
      sign = cross > 0;
    } else if (cross > 0 !== sign) {
      return false;
    }
  }

  return true;
}

/**
 * Check if a point is on the convex hull boundary
 * @param {object} point - Point to check
 * @param {Array<object>} hull - Convex hull points
 * @returns {boolean} True if point is on hull boundary
 */
export function isPointOnHullBoundary(point, hull) {
  if (hull.length < 2) return false;

  for (let i = 0; i < hull.length; i++) {
    const j = (i + 1) % hull.length;

    // Check if point is the same as a hull vertex
    if (
      Math.abs(point.x - hull[i].x) < 1e-9 &&
      Math.abs(point.y - hull[i].y) < 1e-9
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Calculate centroid of a polygon
 * @param {Array<object>} points - Array of points forming a polygon
 * @returns {object} Centroid point with x and y coordinates
 */
export function calculateCentroid(points) {
  if (!points || points.length === 0) return { x: 0, y: 0 };

  let sumX = 0;
  let sumY = 0;

  points.forEach((point) => {
    sumX += point.x;
    sumY += point.y;
  });

  return {
    x: sumX / points.length,
    y: sumY / points.length,
  };
}

/**
 * Onion Decomposition - Recursively find convex hulls until less than 3 points remain
 * Filters out points too close to hull edges to ensure clear spacing between layers
 * @param {Array<object>} points - Array of all points
 * @param {number} edgeProximityThreshold - Minimum distance from hull edges (default: 15 pixels)
 * @returns {object} Object containing layers, innermost centroid, maze data, and removed points count
 */
export function onionDecomposition(points, edgeProximityThreshold = 15) {
  if (!points || points.length < 3) {
    return {
      layers: [],
      innerPoints: points || [],
      centroid: null,
      mazeData: null,
      removedPointsCount: 0,
      removedPoints: [],
      allHullPoints: [],
    };
  }

  const layers = [];
  let remainingPoints = [...points];
  let totalRemovedPoints = 0;
  const removedPoints = []; // Track actual removed points
  const allHullPoints = []; // Track all points that are on any hull

  // Keep finding convex hulls until we have less than 3 points
  while (remainingPoints.length >= 3) {
    const hullResult = jarvisMarchAlgorithm(remainingPoints);
    const hullPoints = hullResult.hullPoints;

    if (hullPoints.length < 3) break;

    // Collect all hull points
    allHullPoints.push(...hullPoints);

    layers.push({
      hull: hullPoints,
      layerIndex: layers.length,
    });

    // Filter out points that are on the hull boundary
    const pointsNotOnBoundary = remainingPoints.filter(
      (point) => !isPointOnHullBoundary(point, hullPoints)
    );

    // Additionally filter out points that are too close to any hull edge
    const filteredPoints = [];
    pointsNotOnBoundary.forEach((point) => {
      let tooClose = false;

      // Check distance from point to all edges of the current hull
      for (let i = 0; i < hullPoints.length; i++) {
        const edgeStart = hullPoints[i];
        const edgeEnd = hullPoints[(i + 1) % hullPoints.length];

        const distanceToEdge = distanceToLineSegment(point, edgeStart, edgeEnd);

        // If point is too close to any edge, mark it for removal
        if (distanceToEdge < edgeProximityThreshold) {
          tooClose = true;
          break;
        }
      }

      if (tooClose) {
        removedPoints.push(point); // Track removed point
      } else {
        filteredPoints.push(point); // Keep point
      }
    });

    // Count removed points in this iteration
    const removedInThisLayer =
      pointsNotOnBoundary.length - filteredPoints.length;
    totalRemovedPoints += removedInThisLayer;

    remainingPoints = filteredPoints;
  }

  // Calculate centroid of innermost layer or remaining points
  let centroid;
  if (layers.length > 0) {
    const innermostLayer = layers[layers.length - 1];
    centroid = calculateCentroid(innermostLayer.hull);
  } else if (remainingPoints.length > 0) {
    centroid = calculateCentroid(remainingPoints);
  } else {
    centroid = { x: 0, y: 0 };
  }

  // Generate maze structure by removing edges
  const mazeData = generateMazeStructure(layers, centroid);

  return {
    layers: layers,
    innerPoints: remainingPoints,
    centroid: centroid,
    mazeData: mazeData,
    removedPointsCount: totalRemovedPoints,
    removedPoints: removedPoints,
    allHullPoints: allHullPoints,
  };
}

/**
 * Generate smooth Bézier curve path for a convex hull using quadratic curves
 * @param {Array<object>} hull - Array of hull points in order
 * @returns {Array<object>} Array of curve segments with control points
 */
export function generateSmoothCurve(hull) {
  if (!hull || hull.length < 3) {
    return [];
  }

  const curveSegments = [];
  const n = hull.length;

  // For each point, create a quadratic Bézier curve using it as control point
  for (let i = 0; i < n; i++) {
    const p0 = hull[i];
    const p1 = hull[(i + 1) % n];
    const p2 = hull[(i + 2) % n];

    // Calculate midpoints
    const mid1 = {
      x: (p0.x + p1.x) / 2,
      y: (p0.y + p1.y) / 2,
    };
    const mid2 = {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2,
    };

    // Create quadratic Bézier curve: from mid1 to mid2, with p1 as control point
    curveSegments.push({
      start: mid1,
      control: p1,
      end: mid2,
      segmentIndex: i,
    });
  }

  return curveSegments;
}

/**
 * Generate maze structure by creating small gaps in edges of each layer
 * Instead of removing entire edges, creates small openings with intermediate points
 * @param {Array<object>} layers - Convex hull layers
 * @param {object} centroid - Centroid of innermost layer (start position)
 * @param {number} gapSize - Size of the gap opening (default: 20 pixels)
 * @param {number} edgeMargin - Minimum distance from edge endpoints (default: 30 pixels)
 * @returns {object} Maze data with edges to keep, gaps, start and end positions
 */
export function generateMazeStructure(
  layers,
  centroid,
  gapSize = 20,
  edgeMargin = 30
) {
  if (!layers || layers.length === 0) {
    return {
      edgesToKeep: [],
      edgesToRemove: [],
      passages: [],
      smoothCurves: [],
      startPosition: centroid,
      endPosition: null,
      gaps: [],
    };
  }

  const edgesToKeep = [];
  const edgesToRemove = [];
  const passages = [];
  const smoothCurves = [];
  const gaps = []; // Track gap positions

  // For each layer, create a small gap in one edge
  layers.forEach((layer, layerIndex) => {
    const hull = layer.hull;
    const numEdges = hull.length;

    // Create modified hull with intermediate points for gap creation
    const modifiedHull = [];
    let completeEdgeRemoved = false;

    // Randomly select one edge to create a gap
    const gapEdgeIndex = Math.floor(Math.random() * numEdges);

    for (let i = 0; i < hull.length; i++) {
      const currentPoint = hull[i];
      const nextPoint = hull[(i + 1) % hull.length];

      if (i === gapEdgeIndex) {
        // This is the edge where we'll create a gap
        const edgeLength = Math.sqrt(
          Math.pow(nextPoint.x - currentPoint.x, 2) +
            Math.pow(nextPoint.y - currentPoint.y, 2)
        );

        // Check if edge is long enough for a small gap
        if (edgeLength > 2 * edgeMargin + gapSize) {
          // Edge is long enough - create small gap with intermediate points
          modifiedHull.push(currentPoint);

          // Choose random position along the edge (with margin from endpoints)
          const minT = edgeMargin / edgeLength;
          const maxT = (edgeLength - edgeMargin - gapSize) / edgeLength;
          const gapStartT = minT + Math.random() * (maxT - minT);
          const gapEndT = gapStartT + gapSize / edgeLength;

          // Calculate gap start and end points
          const gapStart = {
            x: currentPoint.x + gapStartT * (nextPoint.x - currentPoint.x),
            y: currentPoint.y + gapStartT * (nextPoint.y - currentPoint.y),
          };
          const gapEnd = {
            x: currentPoint.x + gapEndT * (nextPoint.x - currentPoint.x),
            y: currentPoint.y + gapEndT * (nextPoint.y - currentPoint.y),
          };

          // Add intermediate points to the modified hull
          modifiedHull.push(gapStart);
          modifiedHull.push(gapEnd);

          // Track the gap for rendering
          gaps.push({
            layerIndex: layerIndex,
            edgeIndex: i,
            gapStart: gapStart,
            gapEnd: gapEnd,
            gapType: "small",
            midpoint: {
              x: (gapStart.x + gapEnd.x) / 2,
              y: (gapStart.y + gapEnd.y) / 2,
            },
          });

          // Add passage marker
          passages.push({
            from: gapStart,
            to: gapEnd,
            layerIndex: layerIndex,
            edgeIndex: i,
            midpoint: {
              x: (gapStart.x + gapEnd.x) / 2,
              y: (gapStart.y + gapEnd.y) / 2,
            },
          });
        } else {
          // Edge is too short - remove the entire edge
          modifiedHull.push(currentPoint);
          // Don't add nextPoint - this creates a gap from currentPoint directly to the point after nextPoint
          completeEdgeRemoved = true;

          // Track the complete edge removal
          gaps.push({
            layerIndex: layerIndex,
            edgeIndex: i,
            gapStart: currentPoint,
            gapEnd: nextPoint,
            gapType: "complete",
            midpoint: {
              x: (currentPoint.x + nextPoint.x) / 2,
              y: (currentPoint.y + nextPoint.y) / 2,
            },
          });

          // Add passage marker for complete edge
          passages.push({
            from: currentPoint,
            to: nextPoint,
            layerIndex: layerIndex,
            edgeIndex: i,
            midpoint: {
              x: (currentPoint.x + nextPoint.x) / 2,
              y: (currentPoint.y + nextPoint.y) / 2,
            },
          });
        }
      } else {
        // Normal edge - keep it
        modifiedHull.push(currentPoint);
      }
    }

    // Generate smooth curve segments for this layer using the modified hull
    const layerCurves = generateSmoothCurve(modifiedHull);
    smoothCurves.push({
      layerIndex: layerIndex,
      curves: layerCurves,
      modifiedHull: modifiedHull,
      gapEdgeIndex: gapEdgeIndex,
    });

    // Create edges from the modified hull
    for (let i = 0; i < modifiedHull.length; i++) {
      const j = (i + 1) % modifiedHull.length;
      const from = modifiedHull[i];
      const to = modifiedHull[j];

      // Check if this edge is part of a gap
      const isGap = gaps.some(
        (gap) =>
          gap.layerIndex === layerIndex &&
          Math.abs(from.x - gap.gapStart.x) < 0.1 &&
          Math.abs(from.y - gap.gapStart.y) < 0.1 &&
          Math.abs(to.x - gap.gapEnd.x) < 0.1 &&
          Math.abs(to.y - gap.gapEnd.y) < 0.1
      );

      const edge = {
        from: from,
        to: to,
        layerIndex: layerIndex,
        edgeIndex: i,
        isGap: isGap,
      };

      if (isGap) {
        edgesToRemove.push(edge);
      } else {
        edgesToKeep.push(edge);
      }
    }
  });

  // Start position is near the centroid
  const startPosition = centroid;

  // End position is at the bottom left corner of the canvas
  // Assuming standard canvas dimensions of 900x600 with 50px padding
  const endPosition = {
    x: 70, // Bottom left with some padding
    y: 550, // Bottom with some padding
  };

  return {
    edgesToKeep: edgesToKeep,
    edgesToRemove: edgesToRemove,
    passages: passages,
    smoothCurves: smoothCurves,
    startPosition: startPosition,
    endPosition: endPosition,
    gaps: gaps,
  };
}

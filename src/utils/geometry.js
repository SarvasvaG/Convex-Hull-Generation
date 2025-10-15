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

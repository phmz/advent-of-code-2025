const parseRedTiles = (input) =>
  input.split("\n").map((line) => line.split(",").map(Number));

const rectangleArea = ([x1, y1], [x2, y2]) =>
  (Math.abs(x2 - x1) + 1) * (Math.abs(y2 - y1) + 1);

const findLargestRectangle = (points) => {
  let maxArea = 0;
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const area = rectangleArea(points[i], points[j]);
      if (area > maxArea) maxArea = area;
    }
  }
  return maxArea;
};

const buildPolygonEdges = (points) => {
  const edges = [];
  for (let i = 0; i < points.length; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[(i + 1) % points.length];
    edges.push({ x1, y1, x2, y2 });
  }
  return edges;
};

const mergeIntervals = (intervals) => {
  if (intervals.length === 0) return [];
  const sorted = intervals.slice().sort((a, b) => a[0] - b[0]);
  const merged = [[sorted[0][0], sorted[0][1]]];

  for (let i = 1; i < sorted.length; i++) {
    const last = merged[merged.length - 1];
    if (sorted[i][0] <= last[1] + 1) {
      last[1] = Math.max(last[1], sorted[i][1]);
    } else {
      merged.push([sorted[i][0], sorted[i][1]]);
    }
  }
  return merged;
};

const getValidXIntervalsAtY = (y, edges) => {
  const intervals = [];

  for (const { x1, y1, x2, y2 } of edges) {
    if (y1 === y2 && y1 === y) {
      intervals.push([Math.min(x1, x2), Math.max(x1, x2)]);
    }
  }

  const crossings = [];
  for (const { x1, y1, x2, y2 } of edges) {
    if (x1 === x2) {
      const yMin = Math.min(y1, y2);
      const yMax = Math.max(y1, y2);
      if (yMin <= y && y < yMax) {
        crossings.push(x1);
      }
    }
  }
  crossings.sort((a, b) => a - b);

  for (let i = 0; i < crossings.length; i += 2) {
    if (i + 1 < crossings.length) {
      intervals.push([crossings[i], crossings[i + 1]]);
    }
  }

  return mergeIntervals(intervals);
};

const buildScanlineMap = (points, edges) => {
  const uniqueYs = [...new Set(points.map(([, y]) => y))].sort((a, b) => a - b);
  const scanlineMap = new Map();

  for (let i = 0; i < uniqueYs.length; i++) {
    scanlineMap.set(uniqueYs[i], getValidXIntervalsAtY(uniqueYs[i], edges));
    if (i < uniqueYs.length - 1) {
      const midY = (uniqueYs[i] + uniqueYs[i + 1]) / 2;
      scanlineMap.set(midY, getValidXIntervalsAtY(midY, edges));
    }
  }

  return scanlineMap;
};

const isRangeContained = (intervals, minX, maxX) => {
  for (const [a, b] of intervals) {
    if (a <= minX && maxX <= b) return true;
  }
  return false;
};

const isRectangleInsidePolygon = ([x1, y1], [x2, y2], scanlineMap) => {
  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);

  for (const [y, intervals] of scanlineMap) {
    if (y < minY || y > maxY) continue;
    if (!isRangeContained(intervals, minX, maxX)) return false;
  }
  return true;
};

const findLargestRectangleInsidePolygon = (points) => {
  const edges = buildPolygonEdges(points);
  const scanlineMap = buildScanlineMap(points, edges);

  let maxArea = 0;
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      if (isRectangleInsidePolygon(points[i], points[j], scanlineMap)) {
        const area = rectangleArea(points[i], points[j]);
        if (area > maxArea) maxArea = area;
      }
    }
  }
  return maxArea;
};

const solve1 = (input) => findLargestRectangle(parseRedTiles(input));
const solve2 = (input) => findLargestRectangleInsidePolygon(parseRedTiles(input));

module.exports = { solve1, solve2 };

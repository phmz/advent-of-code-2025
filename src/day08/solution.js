const parsePoints = (input) =>
  input.split("\n").map((line) => line.split(",").map(Number));

const distanceSquared = (pointA, pointB) => {
  const dx = pointA[0] - pointB[0];
  const dy = pointA[1] - pointB[1];
  const dz = pointA[2] - pointB[2];
  return dx * dx + dy * dy + dz * dz;
};

class MinHeap {
  constructor() {
    this.heap = [];
  }

  push(item) {
    this.heap.push(item);
    this.bubbleUp(this.heap.length - 1);
  }

  pop() {
    const top = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.bubbleDown(0);
    }
    return top;
  }

  bubbleUp(idx) {
    while (idx > 0) {
      const parent = (idx - 1) >> 1;
      if (this.heap[parent].dist <= this.heap[idx].dist) break;
      [this.heap[parent], this.heap[idx]] = [this.heap[idx], this.heap[parent]];
      idx = parent;
    }
  }

  bubbleDown(idx) {
    while (true) {
      const left = 2 * idx + 1;
      const right = 2 * idx + 2;
      let smallest = idx;
      if (left < this.heap.length && this.heap[left].dist < this.heap[smallest].dist) smallest = left;
      if (right < this.heap.length && this.heap[right].dist < this.heap[smallest].dist) smallest = right;
      if (smallest === idx) break;
      [this.heap[idx], this.heap[smallest]] = [this.heap[smallest], this.heap[idx]];
      idx = smallest;
    }
  }

  get size() {
    return this.heap.length;
  }
}

const buildPairsHeap = (points) => {
  const heap = new MinHeap();
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      heap.push({ i, j, dist: distanceSquared(points[i], points[j]) });
    }
  }
  return heap;
};

class UnionFind {
  constructor(size) {
    this.parent = Array.from({ length: size }, (_, i) => i);
    this.rank = new Array(size).fill(0);
    this.componentCount = size;
  }

  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);
    if (rootX === rootY) return false;

    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }
    this.componentCount--;
    return true;
  }

  getTopComponentSizes(count) {
    const sizes = new Map();
    for (let i = 0; i < this.parent.length; i++) {
      const root = this.find(i);
      sizes.set(root, (sizes.get(root) || 0) + 1);
    }
    return [...sizes.values()].sort((a, b) => b - a).slice(0, count);
  }
}

const connectKPairs = (points, pairCount) => {
  const heap = buildPairsHeap(points);
  const uf = new UnionFind(points.length);

  for (let i = 0; i < pairCount && heap.size > 0; i++) {
    const { i: a, j: b } = heap.pop();
    uf.union(a, b);
  }

  return uf.getTopComponentSizes(3).reduce((a, b) => a * b, 1);
};

const findLastConnection = (points) => {
  const heap = buildPairsHeap(points);
  const uf = new UnionFind(points.length);
  let lastPair = null;

  while (uf.componentCount > 1 && heap.size > 0) {
    const pair = heap.pop();
    if (uf.union(pair.i, pair.j)) {
      lastPair = pair;
    }
  }

  return points[lastPair.i][0] * points[lastPair.j][0];
};

const solve1 = (input) => connectKPairs(parsePoints(input), 1000);
const solve2 = (input) => findLastConnection(parsePoints(input));

module.exports = { solve1, solve2, connectKPairs, parsePoints };

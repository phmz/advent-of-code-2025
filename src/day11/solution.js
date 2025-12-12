const parseGraph = (input) => {
  const graph = new Map();
  for (const line of input.split("\n")) {
    const [device, outputs] = line.split(": ");
    graph.set(device, outputs.split(" "));
  }
  return graph;
};

const countPathsToOut = (graph, startNode) => {
  const cache = new Map();

  const countPathsFrom = (currentNode) => {
    if (currentNode === "out") return 1;
    if (cache.has(currentNode)) return cache.get(currentNode);

    const outputNodes = graph.get(currentNode);
    if (!outputNodes) return 0;

    const pathCount = outputNodes.reduce(
      (totalPaths, nextNode) => totalPaths + countPathsFrom(nextNode),
      0
    );
    cache.set(currentNode, pathCount);
    return pathCount;
  };

  return countPathsFrom(startNode);
};

const countPathsWithRequiredNodes = (graph, startNode, requiredNodes) => {
  const cache = new Map();
  const allRequiredVisitedMask = (1 << requiredNodes.length) - 1;

  const computeVisitedMask = (node, currentMask) => {
    const requiredNodeIndex = requiredNodes.indexOf(node);
    return requiredNodeIndex >= 0 ? currentMask | (1 << requiredNodeIndex) : currentMask;
  };

  const countPathsFrom = (currentNode, visitedMask) => {
    const updatedMask = computeVisitedMask(currentNode, visitedMask);

    if (currentNode === "out") {
      return updatedMask === allRequiredVisitedMask ? 1 : 0;
    }

    const cacheKey = `${currentNode}:${updatedMask}`;
    if (cache.has(cacheKey)) return cache.get(cacheKey);

    const outputNodes = graph.get(currentNode);
    if (!outputNodes) return 0;

    const pathCount = outputNodes.reduce(
      (totalPaths, nextNode) => totalPaths + countPathsFrom(nextNode, updatedMask),
      0
    );
    cache.set(cacheKey, pathCount);
    return pathCount;
  };

  return countPathsFrom(startNode, 0);
};

const solve1 = (input) => {
  const graph = parseGraph(input);
  return countPathsToOut(graph, "you");
};

const solve2 = (input) => {
  const graph = parseGraph(input);
  return countPathsWithRequiredNodes(graph, "svr", ["dac", "fft"]);
};

module.exports = { solve1, solve2 };

const parseInput = (input) => {
  const sections = input.split("\n\n");
  const shapeSection = sections.slice(0, -1).join("\n\n");
  const regionSection = sections[sections.length - 1];

  const shapes = parseShapes(shapeSection);
  const regions = parseRegions(regionSection);

  return { shapes, regions };
};

const parseShapes = (section) => {
  const shapeBlocks = section.split("\n\n");
  return shapeBlocks.map((block) => {
    const lines = block.split("\n");
    const cells = [];
    for (let row = 1; row < lines.length; row++) {
      for (let col = 0; col < lines[row].length; col++) {
        if (lines[row][col] === "#") {
          cells.push([row - 1, col]);
        }
      }
    }
    return cells;
  });
};

const parseRegions = (section) => {
  return section.split("\n").map((line) => {
    const [actualWidth, actualHeight] = line.match(/(\d+)x(\d+)/).slice(1).map(Number);
    const counts = line.split(": ")[1].split(" ").map(Number);
    return { width: actualWidth, height: actualHeight, counts };
  });
};

const normalizeShape = (cells) => {
  const minRow = Math.min(...cells.map(([row]) => row));
  const minCol = Math.min(...cells.map(([, col]) => col));
  const normalized = cells.map(([row, col]) => [row - minRow, col - minCol]);
  normalized.sort((cellA, cellB) => cellA[0] - cellB[0] || cellA[1] - cellB[1]);
  return normalized;
};

const rotateShape90 = (cells) => {
  return cells.map(([row, col]) => [col, -row]);
};

const flipShapeHorizontal = (cells) => {
  return cells.map(([row, col]) => [row, -col]);
};

const shapeToKey = (cells) => {
  return cells.map(([row, col]) => `${row},${col}`).join("|");
};

const generateAllOrientations = (cells) => {
  const uniqueOrientations = new Set();
  let currentShape = cells;

  for (let flipIndex = 0; flipIndex < 2; flipIndex++) {
    for (let rotationIndex = 0; rotationIndex < 4; rotationIndex++) {
      const normalized = normalizeShape(currentShape);
      uniqueOrientations.add(shapeToKey(normalized));
      currentShape = rotateShape90(currentShape);
    }
    currentShape = flipShapeHorizontal(cells);
  }

  return [...uniqueOrientations].map((key) =>
    key.split("|").map((coord) => coord.split(",").map(Number))
  );
};

const generatePlacementsCoveringCell = (width, height, orientations, targetRow, targetCol) => {
  const placements = [];

  for (const orientation of orientations) {
    for (const [anchorRow, anchorCol] of orientation) {
      const startRow = targetRow - anchorRow;
      const startCol = targetCol - anchorCol;

      if (startRow < 0 || startCol < 0) continue;

      let valid = true;
      const cells = [];

      for (const [cellRow, cellCol] of orientation) {
        const gridRow = startRow + cellRow;
        const gridCol = startCol + cellCol;

        if (gridRow >= height || gridCol >= width) {
          valid = false;
          break;
        }
        cells.push(gridRow * width + gridCol);
      }

      if (valid) {
        placements.push(cells);
      }
    }
  }

  return placements;
};

const canFitAllShapes = (width, height, shapeOrientations, shapeCounts) => {
  const totalPieces = shapeCounts.reduce((sum, count) => sum + count, 0);
  if (totalPieces === 0) {
    return true;
  }

  const totalCells = width * height;
  const shapeSizes = shapeOrientations.map((orientations) => orientations[0].length);
  const totalShapeCells = shapeCounts.reduce((sum, count, index) => {
    return sum + count * shapeSizes[index];
  }, 0);

  if (totalShapeCells > totalCells) {
    return false;
  }

  const grid = new Uint8Array(totalCells);
  const remainingCounts = [...shapeCounts];
  let remainingPieces = totalPieces;
  let emptyCells = totalCells;

  const placementsPerCell = [];
  for (let cellIndex = 0; cellIndex < totalCells; cellIndex++) {
    const row = Math.floor(cellIndex / width);
    const col = cellIndex % width;
    const perShape = [];
    for (let shapeIndex = 0; shapeIndex < shapeOrientations.length; shapeIndex++) {
      const placements = generatePlacementsCoveringCell(
        width, height, shapeOrientations[shapeIndex], row, col
      );
      perShape.push(placements);
    }
    placementsPerCell.push(perShape);
  }

  const minShapeSize = Math.min(...shapeSizes);

  const findFirstEmptyCell = () => {
    for (let cellIndex = 0; cellIndex < totalCells; cellIndex++) {
      if (grid[cellIndex] === 0) {
        return cellIndex;
      }
    }
    return -1;
  };

  const canPlace = (cells) => {
    for (const cellIndex of cells) {
      if (grid[cellIndex] !== 0) {
        return false;
      }
    }
    return true;
  };

  const place = (cells) => {
    for (const cellIndex of cells) {
      grid[cellIndex] = 1;
      emptyCells--;
    }
  };

  const unplace = (cells) => {
    for (const cellIndex of cells) {
      grid[cellIndex] = 0;
      emptyCells++;
    }
  };

  const solve = () => {
    if (remainingPieces === 0) {
      return true;
    }

    if (emptyCells < remainingPieces * minShapeSize) {
      return false;
    }

    const targetCell = findFirstEmptyCell();
    if (targetCell === -1) {
      return false;
    }

    const placementsForCell = placementsPerCell[targetCell];
    let foundValidPlacement = false;

    for (let shapeIndex = 0; shapeIndex < shapeOrientations.length; shapeIndex++) {
      if (remainingCounts[shapeIndex] === 0) continue;

      for (const placement of placementsForCell[shapeIndex]) {
        if (canPlace(placement)) {
          foundValidPlacement = true;
          place(placement);
          remainingCounts[shapeIndex]--;
          remainingPieces--;

          if (solve()) {
            return true;
          }

          unplace(placement);
          remainingCounts[shapeIndex]++;
          remainingPieces++;
        }
      }
    }

    if (!foundValidPlacement) {
      grid[targetCell] = 2;
      emptyCells--;
      const result = solve();
      grid[targetCell] = 0;
      emptyCells++;
      return result;
    }

    return false;
  };

  return solve();
};

const solve1 = (input) => {
  const { shapes, regions } = parseInput(input);
  const shapeOrientations = shapes.map(generateAllOrientations);

  let validRegionCount = 0;
  for (const region of regions) {
    if (canFitAllShapes(region.width, region.height, shapeOrientations, region.counts)) {
      validRegionCount++;
    }
  }

  return validRegionCount;
};

const solve2 = (input) => {
  return null;
};

module.exports = { solve1, solve2 };

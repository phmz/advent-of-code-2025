const MAX_ADJACENT_FOR_ACCESS = 4;

const parseGrid = (input) => input.split("\n").map((line) => line.split(""));

const countAdjacentRolls = (grid, row, col) => {
  let count = 0;
  for (let deltaRow = -1; deltaRow <= 1; deltaRow++) {
    for (let deltaCol = -1; deltaCol <= 1; deltaCol++) {
      if (deltaRow === 0 && deltaCol === 0) continue;
      const neighborRow = row + deltaRow;
      const neighborCol = col + deltaCol;
      if (grid[neighborRow]?.[neighborCol] === "@") count++;
    }
  }
  return count;
};

const findAccessible = (grid) => {
  const accessible = [];
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col] === "@" && countAdjacentRolls(grid, row, col) < MAX_ADJACENT_FOR_ACCESS) {
        accessible.push([row, col]);
      }
    }
  }
  return accessible;
};

const solve1 = (input) => findAccessible(parseGrid(input)).length;

const solve2 = (input) => {
  const grid = parseGrid(input);
  let total = 0;

  let toRemove;
  while ((toRemove = findAccessible(grid)).length > 0) {
    for (const [row, col] of toRemove) grid[row][col] = ".";
    total += toRemove.length;
  }

  return total;
};

module.exports = { solve1, solve2 };

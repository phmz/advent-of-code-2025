const parseGrid = (input) => {
  const rows = input.split("\n");
  let startCol = -1;
  const splitters = new Set();

  for (let row = 0; row < rows.length; row++) {
    for (let col = 0; col < rows[row].length; col++) {
      const char = rows[row][col];
      if (char === "S") startCol = col;
      else if (char === "^") splitters.add(`${row},${col}`);
    }
  }

  return { startCol, splitters, rowCount: rows.length };
};

const countSplits = (startCol, splitters, rowCount) => {
  let activeColumns = new Set([startCol]);
  let splitCount = 0;

  for (let row = 1; row < rowCount; row++) {
    const nextColumns = new Set();

    for (const col of activeColumns) {
      if (splitters.has(`${row},${col}`)) {
        splitCount++;
        nextColumns.add(col - 1);
        nextColumns.add(col + 1);
      } else {
        nextColumns.add(col);
      }
    }

    activeColumns = nextColumns;
  }

  return splitCount;
};

const countTimelines = (startCol, splitters, rowCount) => {
  let timelines = new Map([[startCol, 1]]);

  for (let row = 1; row < rowCount; row++) {
    const nextTimelines = new Map();

    const addTimelines = (col, count) => {
      nextTimelines.set(col, (nextTimelines.get(col) || 0) + count);
    };

    for (const [col, count] of timelines) {
      if (splitters.has(`${row},${col}`)) {
        addTimelines(col - 1, count);
        addTimelines(col + 1, count);
      } else {
        addTimelines(col, count);
      }
    }

    timelines = nextTimelines;
  }

  let total = 0;
  for (const count of timelines.values()) total += count;
  return total;
};

const solve1 = (input) => {
  const { startCol, splitters, rowCount } = parseGrid(input);
  return countSplits(startCol, splitters, rowCount);
};

const solve2 = (input) => {
  const { startCol, splitters, rowCount } = parseGrid(input);
  return countTimelines(startCol, splitters, rowCount);
};

module.exports = { solve1, solve2 };

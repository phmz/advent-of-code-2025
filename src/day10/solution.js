const parseMachine = (line) => {
  const target = line.match(/\[([.#]+)\]/)[1].split("").map((c) => (c === "#" ? 1 : 0));
  const buttons = [...line.matchAll(/\(([0-9,]+)\)/g)].map((m) => m[1].split(",").map(Number));
  const joltage = line.match(/\{([0-9,]+)\}/)[1].split(",").map(Number);
  return { target, buttons, joltage };
};

const parseMachines = (input) => input.split("\n").map(parseMachine);

const buildToggleMatrix = ({ target, buttons }) => {
  return target.map((targetVal, light) => {
    const row = buttons.map((btn) => (btn.includes(light) ? 1 : 0));
    row.push(targetVal);
    return row;
  });
};

const gaussianEliminationGF2 = (matrix) => {
  const numRows = matrix.length;
  const numCols = matrix[0].length;
  const pivotCols = [];
  let pivotRow = 0;

  for (let col = 0; col < numCols - 1 && pivotRow < numRows; col++) {
    const foundRow = matrix.slice(pivotRow).findIndex((row) => row[col] === 1);
    if (foundRow === -1) continue;

    [matrix[pivotRow], matrix[pivotRow + foundRow]] = [matrix[pivotRow + foundRow], matrix[pivotRow]];
    pivotCols.push(col);

    for (let row = 0; row < numRows; row++) {
      if (row !== pivotRow && matrix[row][col] === 1) {
        for (let c = 0; c < numCols; c++) {
          matrix[row][c] ^= matrix[pivotRow][c];
        }
      }
    }
    pivotRow++;
  }

  return { matrix, pivotCols, rank: pivotRow };
};

const findMinTogglePresses = (machine) => {
  const matrix = buildToggleMatrix(machine);
  const numButtons = machine.buttons.length;
  const { matrix: reduced, pivotCols, rank } = gaussianEliminationGF2(matrix);

  const freeVars = [];
  for (let col = 0; col < numButtons; col++) {
    if (!pivotCols.includes(col)) freeVars.push(col);
  }

  let minPresses = Infinity;
  for (let mask = 0; mask < 1 << freeVars.length; mask++) {
    const solution = new Array(numButtons).fill(0);
    freeVars.forEach((col, i) => (solution[col] = (mask >> i) & 1));

    for (let i = rank - 1; i >= 0; i--) {
      let value = reduced[i][numButtons];
      for (let col = pivotCols[i] + 1; col < numButtons; col++) {
        value ^= reduced[i][col] * solution[col];
      }
      solution[pivotCols[i]] = value;
    }

    minPresses = Math.min(minPresses, solution.reduce((a, b) => a + b, 0));
  }

  return minPresses;
};

const buildJoltageMatrix = ({ joltage, buttons }) => {
  return joltage.map((targetVal, counter) => {
    const row = buttons.map((btn) => (btn.includes(counter) ? 1 : 0));
    row.push(targetVal);
    return row;
  });
};

const gaussianEliminationRational = (matrix) => {
  const numRows = matrix.length;
  const numCols = matrix[0].length;
  const pivotCols = [];
  let pivotRow = 0;

  for (let col = 0; col < numCols - 1 && pivotRow < numRows; col++) {
    let maxRow = pivotRow;
    for (let row = pivotRow + 1; row < numRows; row++) {
      if (Math.abs(matrix[row][col]) > Math.abs(matrix[maxRow][col])) maxRow = row;
    }

    if (matrix[maxRow][col] === 0) continue;

    [matrix[pivotRow], matrix[maxRow]] = [matrix[maxRow], matrix[pivotRow]];
    pivotCols.push(col);

    const pivot = matrix[pivotRow][col];
    for (let row = 0; row < numRows; row++) {
      if (row !== pivotRow && matrix[row][col] !== 0) {
        const factor = matrix[row][col] / pivot;
        for (let c = 0; c < numCols; c++) {
          matrix[row][c] -= factor * matrix[pivotRow][c];
        }
      }
    }
    pivotRow++;
  }

  for (let i = 0; i < pivotCols.length; i++) {
    const pivot = matrix[i][pivotCols[i]];
    if (pivot !== 0) {
      for (let c = 0; c < matrix[i].length; c++) {
        matrix[i][c] /= pivot;
      }
    }
  }

  return { matrix, pivotCols, rank: pivotRow };
};

const verifySolution = (machine, presses) => {
  const result = new Array(machine.joltage.length).fill(0);
  presses.forEach((count, btn) => {
    machine.buttons[btn].forEach((counter) => (result[counter] += count));
  });
  return result.every((val, i) => val === machine.joltage[i]);
};

const findMinJoltagePresses = (machine) => {
  const matrix = buildJoltageMatrix(machine);
  const numButtons = machine.buttons.length;
  const { matrix: reduced, pivotCols, rank } = gaussianEliminationRational(matrix);

  const freeVars = [];
  for (let col = 0; col < numButtons; col++) {
    if (!pivotCols.includes(col)) freeVars.push(col);
  }

  const maxTarget = Math.max(...machine.joltage);
  let globalMin = Infinity;

  const computeSolution = (freeValues) => {
    const solution = new Array(numButtons).fill(0);
    freeVars.forEach((col, i) => (solution[col] = freeValues[i]));

    for (let i = rank - 1; i >= 0; i--) {
      let value = reduced[i][numButtons];
      for (let col = pivotCols[i] + 1; col < numButtons; col++) {
        value -= reduced[i][col] * solution[col];
      }
      const rounded = Math.round(value);
      if (Math.abs(value - rounded) > 1e-6 || rounded < 0) return null;
      solution[pivotCols[i]] = rounded;
    }

    return verifySolution(machine, solution) ? solution : null;
  };

  const search = (idx, freeValues, currentSum) => {
    if (currentSum >= globalMin) return;

    if (idx === freeVars.length) {
      const solution = computeSolution(freeValues);
      if (solution) {
        globalMin = Math.min(globalMin, solution.reduce((a, b) => a + b, 0));
      }
      return;
    }

    for (let val = 0; val <= maxTarget; val++) {
      freeValues[idx] = val;
      search(idx + 1, freeValues, currentSum + val);
    }
  };

  search(0, new Array(freeVars.length).fill(0), 0);
  return globalMin;
};

const sumMinPresses = (machines, findMin) =>
  machines.reduce((sum, machine) => sum + findMin(machine), 0);

const solve1 = (input) => sumMinPresses(parseMachines(input), findMinTogglePresses);
const solve2 = (input) => sumMinPresses(parseMachines(input), findMinJoltagePresses);

module.exports = { solve1, solve2 };

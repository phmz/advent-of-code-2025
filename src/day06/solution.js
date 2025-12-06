const parseProblems = function* (rows) {
  const maxLength = Math.max(...rows.map((row) => row.length));
  let start = -1;

  for (let col = 0; col <= maxLength; col++) {
    const isSpace = col === maxLength || rows.every((row) => !row[col] || row[col] === " ");

    if (isSpace && start >= 0) {
      yield { start, end: col, operation: rows.at(-1).slice(start, col).trim() };
      start = -1;
    } else if (!isSpace && start < 0) {
      start = col;
    }
  }
};

const getHorizontalNumbers = (dataRows, start, end) =>
  dataRows.map((row) => row.slice(start, end).trim()).filter(Boolean).map(Number);

const getVerticalNumbers = (dataRows, start, end) => {
  const numbers = [];
  for (let col = end - 1; col >= start; col--) {
    const digits = dataRows.map((row) => row[col]).filter((c) => c && c !== " ");
    if (digits.length) numbers.push(Number(digits.join("")));
  }
  return numbers;
};

const applyOperation = (numbers, operation) =>
  numbers.reduce((acc, num) => (operation === "+" ? acc + num : acc * num), operation === "+" ? 0 : 1);

const solve = (input, getNumbers) => {
  const rows = input.split("\n");
  const dataRows = rows.slice(0, -1);
  let total = 0;
  for (const { start, end, operation } of parseProblems(rows)) {
    total += applyOperation(getNumbers(dataRows, start, end), operation);
  }
  return total;
};

const solve1 = (input) => solve(input, getHorizontalNumbers);
const solve2 = (input) => solve(input, getVerticalNumbers);

module.exports = { solve1, solve2 };

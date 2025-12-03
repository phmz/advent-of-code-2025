const fs = require("fs");
const path = require("path");

const readInput = (filePath) => {
  return fs.readFileSync(filePath, "utf-8").trimEnd();
};

const lines = (input) => input.split("\n");

const numbers = (input) => lines(input).map(Number);

const grid = (input) => lines(input).map((line) => line.split(""));

const sum = (arr) => arr.reduce((a, b) => a + b, 0);

const product = (arr) => arr.reduce((a, b) => a * b, 1);

const min = (arr) => Math.min(...arr);

const max = (arr) => Math.max(...arr);

const range = (start, end) => {
  const arr = [];
  for (let i = start; i < end; i++) arr.push(i);
  return arr;
};

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

const lcm = (a, b) => (a * b) / gcd(a, b);

module.exports = {
  readInput,
  lines,
  numbers,
  grid,
  sum,
  product,
  min,
  max,
  range,
  gcd,
  lcm,
};

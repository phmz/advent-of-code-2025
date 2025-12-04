# Advent of Code

JavaScript solutions for Advent of Code puzzles.

## Project Structure

```
src/day{XX}/
├── solution.js       # solve1(input) and solve2(input) functions
├── solution.test.js  # Tests with example and real input
├── example.txt       # Example input from puzzle description
└── input.txt         # Personal puzzle input
```

## Commands

```bash
npm test              # Run tests in watch mode
npm run test:run      # Run tests once
npm run solve 1       # Run day 1 solution
npm run solve 1 1 --example  # Run part 1 with example input
```

## Workflow (TDD)

1. Paste example input into `example.txt`
2. Update test with expected answer from puzzle
3. Run `npm test` (watch mode)
4. Implement solution until tests pass
5. Paste real input into `input.txt`
6. Run solution to get answer

## Utils

Common helpers available in `utils/index.js`:

- `lines(input)` - Split input into array of lines
- `numbers(input)` - Parse input as array of numbers
- `grid(input)` - Parse input as 2D character array
- `sum(arr)`, `product(arr)` - Array reduction
- `min(arr)`, `max(arr)` - Array min/max
- `range(start, end)` - Generate number range
- `gcd(a, b)`, `lcm(a, b)` - Math utilities

## Code Style

- Use descriptive variable names (no single-letter or two-letter variables)
- Extract magic numbers into named constants
- Keep solutions clean and readable

## Solution Template

```javascript
const solve1 = (input) => {
  return null;
};

const solve2 = (input) => {
  return null;
};

module.exports = { solve1, solve2 };
```

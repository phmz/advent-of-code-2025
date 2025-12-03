const path = require("path");
const { readInput } = require("./utils");

const [day, part] = process.argv.slice(2);

if (!day) {
  console.log("Usage: node run.js <day> [part] [--example]");
  console.log("Example: node run.js 1");
  console.log("         node run.js 1 1 --example");
  process.exit(1);
}

const useExample = process.argv.includes("--example");
const dayPadded = day.padStart(2, "0");
const dayPath = path.join(__dirname, "src", `day${dayPadded}`);
const inputFile = useExample ? "example.txt" : "input.txt";

try {
  const { solve1, solve2 } = require(path.join(dayPath, "solution.js"));
  const input = readInput(path.join(dayPath, inputFile));

  console.log(`\n🎄 Advent of Code 2025 - Day ${day}\n`);

  if (!part || part === "1") {
    console.time("Part 1");
    console.log("Part 1:", solve1(input));
    console.timeEnd("Part 1");
  }

  if (!part || part === "2") {
    console.time("Part 2");
    console.log("Part 2:", solve2(input));
    console.timeEnd("Part 2");
  }
} catch (err) {
  console.error("Error:", err.message);
  process.exit(1);
}

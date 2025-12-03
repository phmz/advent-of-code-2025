import { describe, it, expect } from "vitest";
import { readInput } from "../../utils/index.js";
import path from "path";
import { fileURLToPath } from "url";
import { solve1, solve2 } from "./solution.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const example = readInput(path.join(__dirname, "example.txt"));
const input = readInput(path.join(__dirname, "input.txt"));

describe("Day 02", () => {
  describe("Part 1", () => {
    it("solves example", () => {
      expect(solve1(example)).toBe(1227775554);
    });
  });

  describe("Part 2", () => {
    it("solves example", () => {
      expect(solve2(example)).toBe(4174379265);
    });
  });
});

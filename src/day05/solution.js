const parseInput = (input) => {
  const [rangesSection, ingredientsSection] = input.split("\n\n");

  const ranges = rangesSection.split("\n").map((line) => {
    const [start, end] = line.split("-").map(Number);
    return { start, end };
  });

  const ingredients = ingredientsSection.split("\n").map(Number);

  return { ranges, ingredients };
};

const isFresh = (ingredientId, ranges) => {
  return ranges.some(
    ({ start, end }) => ingredientId >= start && ingredientId <= end
  );
};

const solve1 = (input) => {
  const { ranges, ingredients } = parseInput(input);
  return ingredients.filter((id) => isFresh(id, ranges)).length;
};

const countFreshIds = (ranges) => {
  ranges.sort((a, b) => a.start - b.start);

  let total = 0;
  let currentEnd = -1;

  for (const { start, end } of ranges) {
    if (start > currentEnd) {
      total += end - start + 1;
      currentEnd = end;
    } else if (end > currentEnd) {
      total += end - currentEnd;
      currentEnd = end;
    }
  }

  return total;
};

const solve2 = (input) => {
  const { ranges } = parseInput(input);
  return countFreshIds(ranges);
};

module.exports = { solve1, solve2 };

const isRepeated = (n) => {
  const s = String(n);
  if (s.length % 2 !== 0) return false;
  const half = s.length / 2;
  return s.slice(0, half) === s.slice(half);
};

const solve1 = (input) => {
  const ranges = input.split(",");
  let sum = 0;

  for (const range of ranges) {
    const [start, end] = range.split("-").map(Number);
    for (let id = start; id <= end; id++) {
      if (isRepeated(id)) sum += id;
    }
  }

  return sum;
};

const isRepeatedAtLeastTwice = (n) => {
  const s = String(n);
  for (let len = 1; len <= s.length / 2; len++) {
    if (s.length % len !== 0) continue;
    const pattern = s.slice(0, len);
    if (pattern.repeat(s.length / len) === s) return true;
  }
  return false;
};

const solve2 = (input) => {
  const ranges = input.split(",");
  let sum = 0;

  for (const range of ranges) {
    const [start, end] = range.split("-").map(Number);
    for (let id = start; id <= end; id++) {
      if (isRepeatedAtLeastTwice(id)) sum += id;
    }
  }

  return sum;
};

module.exports = { solve1, solve2 };

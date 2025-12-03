const maxJoltage = (bank) => {
  let max = 0;
  for (let i = 0; i < bank.length - 1; i++) {
    for (let j = i + 1; j < bank.length; j++) {
      const joltage = parseInt(bank[i] + bank[j], 10);
      if (joltage > max) max = joltage;
    }
  }
  return max;
};

const solve1 = (input) => {
  const banks = input.split("\n");
  return banks.reduce((sum, bank) => sum + maxJoltage(bank), 0);
};

const maxJoltageN = (bank, n) => {
  let result = "";
  let start = 0;

  for (let i = 0; i < n; i++) {
    const remaining = n - i;
    const end = bank.length - remaining + 1;
    let maxDigit = "0";
    let maxIdx = start;

    for (let j = start; j < end; j++) {
      if (bank[j] > maxDigit) {
        maxDigit = bank[j];
        maxIdx = j;
      }
    }

    result += maxDigit;
    start = maxIdx + 1;
  }

  return BigInt(result);
};

const solve2 = (input) => {
  const banks = input.split("\n");
  return banks.reduce((sum, bank) => sum + maxJoltageN(bank, 12), 0n);
};

module.exports = { solve1, solve2 };

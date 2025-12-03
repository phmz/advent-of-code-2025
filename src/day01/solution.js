const solve1 = (input) => {
  const rotations = input.split("\n");
  let position = 50;
  let count = 0;

  for (const rotation of rotations) {
    const direction = rotation[0];
    const distance = parseInt(rotation.slice(1), 10);

    if (direction === "L") {
      position = ((position - distance) % 100 + 100) % 100;
    } else {
      position = (position + distance) % 100;
    }

    if (position === 0) count++;
  }

  return count;
};

const solve2 = (input) => {
  const rotations = input.split("\n");
  let position = 50;
  let count = 0;

  for (const rotation of rotations) {
    const direction = rotation[0];
    const distance = parseInt(rotation.slice(1), 10);

    for (let i = 0; i < distance; i++) {
      if (direction === "L") {
        position = position === 0 ? 99 : position - 1;
      } else {
        position = position === 99 ? 0 : position + 1;
      }
      if (position === 0) count++;
    }
  }

  return count;
};

module.exports = { solve1, solve2 };

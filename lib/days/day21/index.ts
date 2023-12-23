import { eg1, input } from './input';
import { ArrayKeyedSet, Coordinate, cleanAndParse, generateArray, orthogonalNeighbours, simpleRange } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {
  manualStart: true
};

function parse(input: string) {
  let start: Coordinate = [];
  const cells = cleanAndParse(input, (s, row) => Array.from(s).map((c, col) => {
    if (c === 'S') {
      start = [row, col];
      return true;
    }
    return c === '.';
  }));

  const size = cells.length;

  function grid(row: number, col: number) {
    return cells.at(row % size)?.at(col % size)!;
  }

  return { grid, start, size };
}


function lagrangeQuadraticInterpolation(x: number, coords: [number, number][]) {
  const [[x0, y0], [x1, y1], [x2, y2]] = coords;

  // co-pilot gave me this formula, just from the function name

  return (
    ((x - x1) * (x - x2) * y0) / ((x0 - x1) * (x0 - x2)) +
    ((x - x0) * (x - x2) * y1) / ((x1 - x0) * (x1 - x2)) +
    ((x - x0) * (x - x1) * y2) / ((x2 - x0) * (x2 - x1))
  );
}

export function part1() {
  const { grid, start } = parse(input);

  let steps = 64;
  let gardens = ArrayKeyedSet([start]);

  while (steps--) {
    const newGardens = ArrayKeyedSet();
    for (const coord of gardens) {
      for (const [r, c] of orthogonalNeighbours(coord)) {
        if (grid(r, c)) {
          newGardens.add([r, c]);
        }
      }
    }

    gardens = newGardens;
  }

  return gardens.size;
}

export function part2() {
  const { grid, start, size } = parse(input);

  let gardens = ArrayKeyedSet([start]);
  const coordsForLagrange: [number, number][] = [];
  const stepsForLagrange = generateArray(3, i => start[0] + size * i);

  const steps = stepsForLagrange.at(-1)!;

  let step = 0

  while (step++ < steps) {
    const newGardens = ArrayKeyedSet();
    for (const coord of gardens) {
      for (const [r, c] of orthogonalNeighbours(coord)) {
        if (grid(r, c)) {
          newGardens.add([r, c]);
        }
      }
    }

    gardens = newGardens;

    if (stepsForLagrange.includes(step)) {
      coordsForLagrange.push([step, gardens.size]);
    }
  }

  return lagrangeQuadraticInterpolation(26501365, coordsForLagrange);
}

export const answers = [
  3682,
  609012263058042
];

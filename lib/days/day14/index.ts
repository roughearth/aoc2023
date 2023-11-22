import { eg1, input } from './input';
import { cleanAndParse, CoordinateRange, coordinates, getIntKey, growRange, SafetyNet } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {
  maxLoops: 1e7
};

function Path(src: string) {
  return src.split(" -> ").map(pr => pr.split(',').map(Number));
}

function getGridKey(c: number[]) {
  return getIntKey(c, 1000);
}

type Paths = ReturnType<typeof Path>[];

function buildGrid(paths: Paths) {
  const grid = new Map<number, string>();
  const range: CoordinateRange = [
    [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER],
    [0, Number.MIN_SAFE_INTEGER]
  ]

  for (const path of paths) {
    const { length } = path;

    for (let i = 0; i < length - 1; i++) {
      const from = path[i];
      const to = path[i + 1];
      const segmentRange: CoordinateRange = [
        [Math.min(from[0], to[0]), Math.max(from[0], to[0])],
        [Math.min(from[1], to[1]), Math.max(from[1], to[1])]
      ];

      range[0][0] = Math.min(range[0][0], from[0], to[0]);
      range[0][1] = Math.max(range[0][1], from[0], to[0]);
      range[1][1] = Math.max(range[1][1], from[1], to[1]);

      for (const coord of coordinates(segmentRange)) {
        grid.set(getGridKey(coord), '#');
      }
    }
  }

  return { grid, range };
}

function visualiseGrid({ grid, range }: ReturnType<typeof buildGrid>): string {
  const viz: string[][] = [];

  range[0][0] -= 150;
  range[0][1] += 150;
  range[1][1] += 2;

  const minX = range[1][0];

  for (const [x, y] of coordinates(range)) {
    viz[y] ??= [];
    viz[y][x - minX] = grid.get(getGridKey([x, y])) ?? '.';
  }

  return viz.map(r => r.join('')).join('\n');
}

export function part1(safetyNet: SafetyNet) {
  const data = cleanAndParse(input, Path);

  const { grid, range } = buildGrid(data);
  const [, [, maxY]] = range;

  outer:
  while (safetyNet.isSafe()) {
    let sand = [500, 0];

    inner:
    while (safetyNet.isSafe()) {
      let [x, y] = sand;
      y += 1;

      if (y > maxY) {
        break outer;
      }

      if (!grid.has(getGridKey([x, y]))) {
        sand = [x, y];
      }
      else if (!grid.has(getGridKey([x - 1, y]))) {
        sand = [x - 1, y];
      }
      else if (!grid.has(getGridKey([x + 1, y]))) {
        sand = [x + 1, y];
      }
      else {
        grid.set(getGridKey(sand), 'o');
        break inner;
      }
    }
  }

  // console.log(visualiseGrid({ grid, range }));

  return Array.from(grid.values()).filter(s => s === 'o').length;
}

export function part2(safetyNet: SafetyNet) {
  const data = cleanAndParse(input, Path);

  const { grid, range } = buildGrid(data);

  const maxY = range[1][1] + 2;
  const startKey = getGridKey([500, 0]);

  outer:
  while (safetyNet.isSafe()) {
    let sand = [500, 0];

    inner:
    while (safetyNet.isSafe()) {
      let [x, y] = sand;
      y += 1;

      const notBottom = y < maxY;

      if (notBottom && !grid.has(getGridKey([x, y]))) {
        sand = [x, y];
      }
      else if (notBottom && !grid.has(getGridKey([x - 1, y]))) {
        sand = [x - 1, y];
      }
      else if (notBottom && !grid.has(getGridKey([x + 1, y]))) {
        sand = [x + 1, y];
      }
      else {
        const key = getGridKey(sand);
        grid.set(key, 'o');

        if (key === startKey) {
          break outer;
        }

        break inner;
      }
    }
  }

  // console.log(visualiseGrid({ grid, range }));

  return Array.from(grid.values()).filter(s => s === 'o').length;
}

export const answers = [
  618,
  26358
];

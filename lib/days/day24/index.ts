import { eg1, input } from './input';
import { cleanAndParse, Coordinate, gcd, getIntKey, modLpr, neighbours, orthogonalNeighbours, SafetyNet, safetyNet, simpleRange } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {};

function CoordinateSet() {
  const set = new Set<number>();

  function has(x: number, y: number): boolean {
    return set.has((x * 1000) + y);
  }

  function add(x: number, y: number) {
    set.add((x * 1000) + y);
  }

  return {
    has,
    add
  }
}

type CoordinateSet = ReturnType<typeof CoordinateSet>;

type BlizzardFn = (min: number) => [number, number];

const blizzards = (w: number, h: number): Record<
  string,
  (r: number, c: number) => BlizzardFn
> => ({
  "^": (r, c) => min => [modLpr(r - min, h), c],
  ">": (r, c) => min => [r, modLpr(c + min, w)],
  "v": (r, c) => min => [modLpr(r + min, h), c],
  "<": (r, c) => min => [r, modLpr(c - min, w)]
});

function blizzardSetAt(srcBlizzards: BlizzardFn[], min: number): CoordinateSet {
  const set = CoordinateSet();

  for (const bf of srcBlizzards) {
    set.add(...bf(min));
  }

  return set;
}

function parseData(src: string) {
  const lines = src.split("\n").slice(1, -1);
  const height = lines.length;
  const width = lines[0].length - 2;

  const blizzardSpec = blizzards(width, height);

  const srcBlizzards: BlizzardFn[] = [];

  for (let row = 0; row < height; row++) {
    const cells = Array.from(lines[row]).slice(1, -1);

    for (let col = 0; col < width; col++) {
      const cell = cells[col];

      if (cell !== ".") {
        srcBlizzards.push(blizzardSpec[cell](row, col));
      }
    }
  }

  return {
    width,
    height,
    srcBlizzards
  }
}

export function run(src: string, part: number) {
  const { srcBlizzards, width, height } = parseData(src);

  const blizzardsByMinute: CoordinateSet[] = [];

  const lastRow = height - 1;
  const lastCol = width - 1;

  const valley = simpleRange([height, width]);
  const blizzardCycleLength = width * height / gcd(width, height);

  const start = "[-1,0]";
  const first = "[0,0]"
  const last = JSON.stringify([lastRow, lastCol]);
  const exit = JSON.stringify([lastRow + 1, lastCol]);

  let minsPassed = 0;
  let currentGeneration = new Set<string>([start]);

  let phase: "there" | "back" | "complete" = part === 1 ? "complete" : "there";

  while (true) {
    let nextGeneration = new Set<string>();
    const nextBlizzards = blizzardSetAt(srcBlizzards, minsPassed + 1);

    generations:
    for (const cell of currentGeneration) {
      if (cell === last) {
        if (phase === "complete") {
          return minsPassed + 1;
        }
        else if (phase === "there") {
          nextGeneration = new Set([exit]);
          phase = "back";
          break generations;
        }
      }

      if (cell === first && phase === "back") {
        nextGeneration = new Set([start]);
        phase = "complete";
        break generations;
      }

      const [thisRow, thisCol]: [number, number] = JSON.parse(cell);

      for (const [r, c] of orthogonalNeighbours([thisRow, thisCol], valley)) {
        if (!nextBlizzards.has(r, c)) {
          nextGeneration.add(JSON.stringify([r, c]));
        }
      }

      if (!nextBlizzards.has(thisRow, thisCol)) {
        nextGeneration.add(JSON.stringify([thisRow, thisCol]));
      }
    }

    currentGeneration = nextGeneration;
    minsPassed++;
  }
}

export function part1(safetyNet: SafetyNet) {
  return run(input, 1);
}

export function part2(safetyNet: SafetyNet) {
  return run(input, 2);
}

export const answers = [
  251,
  758
];

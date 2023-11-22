import { eg1, input } from './input';
import { cleanAndParse, SafetyNet } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {
  maxLoops: 1e7
};

type Edge = number[];
type Cells = number[][];
type Rock = {
  cells: (x: number, y: number) => Cells
}
type Stack = Map<number, Set<number>>;

// x -> y is left -> up
const ROCKS: Rock[] = [
  // ####
  {
    cells: (x: number, y: number) => [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0]
    ].map(([X, Y]) => [X + x, Y + y])
  },

  // .#.
  // ###
  // .#.
  {
    cells: (x: number, y: number) => [
      [1, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [1, 2]
    ].map(([X, Y]) => [X + x, Y + y])
  },

  // ..#
  // ..#
  // ###
  {
    cells: (x: number, y: number) => [
      [0, 0],
      [1, 0],
      [2, 0],
      [2, 1],
      [2, 2]
    ].map(([X, Y]) => [X + x, Y + y])
  },

  // #
  // #
  // #
  // #
  {
    cells: (x: number, y: number) => [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3]
    ].map(([X, Y]) => [X + x, Y + y])
  },

  // ##
  // ##
  {
    cells: (x: number, y: number) => [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1]
    ].map(([X, Y]) => [X + x, Y + y])
  }
];

const LEFT_WALL = 0;
const RIGHT_WALL = 6;
const FLOOR = 0;

type Wind = 1 | -1;

function parseWind(src: string): Wind[] {
  return Array.from(src).map(
    i => <Wind>({
      '<': -1,
      '>': 1,
    }[i])
  );
}

function canMove(rock: Cells, stack: Stack) {
  for (const [x, y] of rock) {
    if (x < LEFT_WALL || x > RIGHT_WALL || y < FLOOR) {
      return false;
    }
    if (stack.get(y)?.has(x)) {
      return false;
    }
  }
  return true;
}

function visualise(stack: Stack, cells?: Cells) {
  const rows = [Array.from("+-------+")];
  let height = Math.max(0, ...Array.from(stack.keys()));

  if (cells) {
    const ys = cells.map(([, y]) => y);
    height = Math.max(height, ...ys);
  }

  for (let y = 0; y <= height; y++) {
    const row = ['|'];
    for (let x = 0; x < 7; x++) {
      if (stack.get(y)?.has(x)) {
        row.push("#");
      }
      else {
        row.push(".");
      }
    }
    row.push("|");
    rows.push(row);
  }

  if (cells) {
    for (const [x, y] of cells) {
      rows[y + 1][x + 1] = "@";
    }
  }

  return rows.reverse().map(r => r.join("")).join("\n");
}

function* run(src: string, safetyNet: SafetyNet): Generator<RunYeild, void, unknown> {
  const wind = parseWind(src);
  const windSize = wind.length;

  let nextWind = 0;
  let nextRock = 0;
  let height = 0;

  // Use this as Y, X to make tracking height easier
  const stack: Stack = new Map();

  while (safetyNet.isSafe()) {
    const thisRock = ROCKS[nextRock];

    let nextX = 2;
    let nextY = height + 3;

    move:
    while (safetyNet.isSafe()) {
      // move (and increment) wind if poss
      const wInc = wind[nextWind];
      nextWind = (nextWind + 1) % windSize;
      const wRock = thisRock.cells(nextX + wInc, nextY);

      if (canMove(wRock, stack)) {
        nextX += wInc;
      }

      const dRock = thisRock.cells(nextX, nextY - 1);

      if (canMove(dRock, stack)) {
        nextY--;
      }
      else {
        // add to stack...
        const sRock = thisRock.cells(nextX, nextY);
        for (const [x, y] of sRock) {
          if (!stack.has(y)) {
            stack.set(y, new Set<number>());
          }
          stack.get(y)!.add(x);
        }

        height = Math.max(-1, ...Array.from(stack.keys())) + 1;

        yield [height, stack, nextWind, nextRock];

        // ..and break inner loop
        break move;
      }
    }

    nextRock = (nextRock + 1) % 5;
  }
}

type RunYeild = [number, Stack, number, number];

export function part1(safetyNet: SafetyNet) {
  const runner = run(input, safetyNet);

  let rocks = 0;
  let data: RunYeild;

  while ((++rocks) <= 2022) {
    data = runner.next().value!;
  }

  return data![0];
}

function fringe([, stack, windId, rockId]: RunYeild, rocks: number): [string, number] {
  const colHeight = Array(7).fill(0);
  for (const [row, values] of stack.entries()) {
    for (const value of values) {
      colHeight[value] = Math.max(colHeight[value], row + 1);
    }
  }

  const min = Math.min(...colHeight);

  // the key is the rock and wind ids, with a normalised shape of the top of the stack
  // if this repeats, the stack goes in to a loop
  return [
    [windId, rockId, colHeight.map(v => v - min)].join(","),
    rocks
  ];
}

export function part2(safetyNet: SafetyNet) {
  const runner = run(input, safetyNet);

  let rocks = 0;
  let data: RunYeild;
  const loopMap = new Map<string, number>();
  let loopFound: number[] = [];
  let rockHeight = new Map<number, number>();

  while (true) { // runner uses safety net
    data = runner.next().value!;
    rocks++;
    const [key, value] = fringe(data, rocks);
    rockHeight.set(rocks, data[0]);
    if (loopMap.has(key)) {
      loopFound = [value, loopMap.get(key)!];
      break;
    }
    loopMap.set(key, value);
  }

  const targetRocks = 1000000000000;
  const [rockTo, rockFrom] = loopFound;
  const loopLength = rockTo - rockFrom;
  const rocksInLoop = targetRocks - rockFrom;
  const remainder = rocksInLoop % loopLength;
  const quotient = (rocksInLoop - remainder) / loopLength;

  const heightAtLoopStart = rockHeight.get(rockFrom)!;
  const heightAtLoopEnd = rockHeight.get(rockTo)!;
  const loopHeight = heightAtLoopEnd - heightAtLoopStart;
  const heightAtLoopRemainder = rockHeight.get(rockFrom + remainder)!;

  return heightAtLoopRemainder + (quotient * loopHeight);
}

export const answers = [
  3227,
  1597714285698
]

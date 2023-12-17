import { eg1, eg2, input } from './input';
import { cleanAndParse, getIntKey, inRange, simpleRange } from '../../utils';
import { Day } from '..';
import { dijkstraFrom } from '../../utils/dijkstra';


export const meta: Day['meta'] = {
  manualStart: true
};

const X = -1;
const U = 0;
const D = 1;
const L = 2;
const R = 3;

const Moves = [
  { dir: U, opp: D, dRow: -1, dCol: 0 },
  { dir: D, opp: U, dRow: 1, dCol: 0 },
  { dir: L, opp: R, dRow: 0, dCol: -1 },
  { dir: R, opp: L, dRow: 0, dCol: 1 }
];

type Crucible = {
  row: number,
  col: number,
  direction: number,
  straightCount: number
};

function crucibleKey(
  row: number,
  col: number,
  direction: number,
  straightCount: number
) {
  return getIntKey([row, col, direction, straightCount], 1e3);
}

type CrucibleCache = Map<number, Crucible>;

function Crucible(
  row: number,
  col: number,
  direction: number,
  straightCount: number,
  cache: CrucibleCache
) {
  const key = crucibleKey(row, col, direction, straightCount);
  const cached = cache.get(key);
  if (cached) {
    return cached;
  }

  const newCrucible = { row, col, direction, straightCount };
  cache.set(key, newCrucible);
  return newCrucible;
}

function Grid(input: string) {
  const blocks = cleanAndParse(input, s => Array.from(s).map(Number));
  const width = blocks[0].length;
  const height = blocks.length;
  const range = simpleRange([height, width]);
  const end = { row: height - 1, col: width - 1 };

  return { blocks, range, end };
}
type Grid = ReturnType<typeof Grid>;

function findNext(
  { row, col, direction, straightCount }: Crucible,
  { blocks, range, end }: Grid,
  cache: CrucibleCache,
  minLine: number,
  maxLine: number
): [Crucible, number][] {
  const moves = Moves.flatMap(({ dir, opp, dRow, dCol }) => {
    const nextRow = row + dRow;
    const nextCol = col + dCol;

    if (opp === direction) {
      return [];
    }

    if (!inRange([nextRow, nextCol], range)) {
      return [];
    }

    if (dir !== direction && direction !== X && straightCount < minLine) {
      return [];
    }

    if (dir === direction && straightCount >= maxLine) {
      return [];
    }

    return [{ row: nextRow, col: nextCol, direction: dir, straight: dir === direction }];
  });

  return moves.map(({ row, col, direction, straight }) => [
    Crucible(row, col, direction, straight ? straightCount + 1 : 1, cache),
    blocks[row][col]
  ]);
}

export function part(input: string, min: number, max: number) {
  const grid = Grid(input);
  const cache = new Map<number, Crucible>();

  const dj = dijkstraFrom<Crucible>(
    Crucible(0, 0, X, 1, cache),
    crucible => findNext(crucible, grid, cache, min, max),
    { maxMs: 300_000 }
  );

  const target = dj.find(node => (
    (node.row === grid.end.row) &&
    (node.col === grid.end.col) &&
    (node.straightCount > min)
  ));

  return target[1];
}
export function part1() {
  return part(input, 0, 3);
}

export function part2() {
  return part(input, 4, 10);
}

function vizPath(blocks: number[][], path: Crucible[]) {
  const viz = blocks.map(row => row.map(v => `${v}`));

  const d: Record<string, string> = {
    U: '^',
    D: 'v',
    L: '<',
    R: '>'
  };

  path.forEach(
    ({ row, col, direction }) => {
      if (direction !== X) {
        viz[row][col] = d[direction];
      }
    }
  );
  return viz.map(row => row.join('')).join('\n');
}

export const answers = [
  843,
  1017
];

import { eg1, input } from './input';
import { cleanAndParse, orthogonalNeighbours, CoordinateRange, coordinates } from '../../utils';
import { dijkstraFrom } from '../../utils/dijkstra';
import { Day } from '..';

export const meta: Day['meta'] = {};

const useThisInput = input;

function gridRow(src: string, row: number) {
  return Array.from(src).map((l, col) => {
    const height = { S: 0, E: 25 }[l] ?? (l.charCodeAt(0) - 97);
    const start = l === 'S';
    const end = l === 'E';
    return { height, start, end, coords: [row, col] };
  });
}

type Square = ReturnType<typeof gridRow>[number];

export function part1() {
  const grid = cleanAndParse(useThisInput, gridRow);
  const gridRange: CoordinateRange = [[0, grid.length - 1], [0, grid[0].length - 1]];

  let start = grid[0][0]; // arbitrary initialiser to keep TS happy...

  for (const [row, col] of coordinates(gridRange)) {
    if (grid[row][col].start) {
      start = grid[row][col];
    }
  }

  const graph = dijkstraFrom(
    start,
    (n: Square) => {
      const mapped: [Square, number][] = [];

      for (const [row, col] of orthogonalNeighbours(n.coords, gridRange)) {
        const s = grid[row][col];
        const diff = s.height - n.height;
        if (diff <= 1) {
          mapped.push([s, 1]);
        }
      }

      return mapped;
    }
  );

  const [, steps] = graph.find(
    (n: Square) => n.end
  );

  return steps;
}

export function part2() {
  const grid = cleanAndParse(useThisInput, gridRow);
  const gridRange: CoordinateRange = [[0, grid.length - 1], [0, grid[0].length - 1]];

  let start = grid[0][0]; // arbitrary initialiser to keep TS happy...
  let end = new Set<Square>();

  for (const [row, col] of coordinates(gridRange)) {
    if (grid[row][col].end) { // going "backwards"
      start = grid[row][col];
    }

    if (grid[row][col].height === 0) {
      end.add(grid[row][col]); // all the `a`s
    }
  }

  const graph = dijkstraFrom(
    start,
    (n: Square) => {
      const mapped: [Square, number][] = [];

      for (const [row, col] of orthogonalNeighbours(n.coords, gridRange)) {
        const s = grid[row][col];
        const diff = n.height - s.height; // going "backwards"
        if (diff <= 1) {
          mapped.push([s, 1]);
        }
      }

      return mapped;
    }
  );

  const covered = graph.cover();

  const list = <number[]>Array.from(end).map(
    s => covered.get(s)?.[0]
  ).filter(Boolean);

  return Math.min(...list);
}

export const answers = [
  504,
  500
];

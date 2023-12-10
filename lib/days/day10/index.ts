import { eg1, eg2, eg3, eg4, eg5, eg6, input } from './input';
import { CoordinateRange, cleanAndParse, coordinates, inRange, simpleRange } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {};

const Direction = ['Up', 'Dn', 'Lt', 'Rt'] as const;
type Direction = typeof Direction[number];

const Moves: Record<Direction, number[]> = {
  Up: [-1, 0],
  Dn: [1, 0],
  Lt: [0, -1],
  Rt: [0, 1]
};

function move(from: number[], direction: Direction) {
  const [row, col] = from;
  const [dRow, dCol] = Moves[direction];
  return [row + dRow, col + dCol];
}

const VBoundary = ['|', 'F', '7', 'J', 'L'] as const;
const Pipe = ['-', ...VBoundary] as const;
type Pipe = typeof Pipe[number];
type Cell = Pipe | 'S' | '.';


const pipeToDirection: Record<Pipe, Direction[]> = {
  '-': ['Lt', 'Rt'],
  '|': ['Up', 'Dn'],
  'F': ['Rt', 'Dn'],
  '7': ['Lt', 'Dn'],
  'J': ['Lt', 'Up'],
  'L': ['Rt', 'Up']
};

const OppositeDirection: Record<Direction, Direction> = {
  'Up': 'Dn',
  'Dn': 'Up',
  'Lt': 'Rt',
  'Rt': 'Lt'
};

function getValidPipeForDirection(direction: Direction): Pipe[] {
  const allEntries = Object.entries(pipeToDirection) as [Pipe, Direction[]][];
  const withDirection = allEntries.filter(
    ([_, directions]) => directions.includes(OppositeDirection[direction])
  );
  const pipes = withDirection.map(([pipe]) => pipe);

  return pipes;
}

type DirectionMap = Map<Direction, Cell[]>;

const ValidNeighbors = new Map<Cell, DirectionMap>([
  ['.', new Map()],
]);

ValidNeighbors.set('S', new Map(
  Direction.map(direction => [direction, getValidPipeForDirection(direction)] as [Direction, Pipe[]])
));

Pipe.forEach(pipe => {
  ValidNeighbors.set(pipe, new Map(
    pipeToDirection[pipe].map(direction => [direction, getValidPipeForDirection(direction)] as [Direction, Pipe[]])
  ));
});

function getSShape(grid: Cell[][], gridRange: CoordinateRange, start: number[]) {
  const shape: Direction[] = [];

  Object.keys(Moves).forEach((dn) => {
    const dir = dn as Direction;
    const [r, c] = move(start, dir);
    if (inRange([r, c], gridRange) && ValidNeighbors.get('S')!.get(dir)!.includes(grid[r][c])) {
      shape.push(dir);
    }
  });

  const directionToPipe = Object.fromEntries(Object.entries(pipeToDirection).map(
    ([pipe, directions]) => [directions.sort().join(","), pipe]
  ));

  return directionToPipe[shape.sort().join(",")];
}

function findLoop(input: string) {
  let start: number[] = [];
  const grid = cleanAndParse(input, (s, r) => {
    const c = s.indexOf('S');
    if (c !== -1) {
      start = [r, c];
    }
    return Array.from(s) as (Cell)[];
  });

  const width = grid[0].length;
  const height = grid.length;
  const gridRange = simpleRange([height, width]);

  const loop = new Set<string>();

  let currentList = [start];

  let N = 1e7;

  while (currentList.some(coord => !loop.has(coord.join(',')))) {
    if (N-- < 0) {
      throw new Error("Too many iterations");
    }

    const nextList: number[][] = [];

    for (const currentCoord of currentList) {
      const [row, col] = currentCoord;

      const links = Array.from(ValidNeighbors.get(grid[row][col])!.entries()).map(
        ([dir, nextPipes]) => [move([row, col], dir), nextPipes] as const
      ).filter(
        ([coord]) => inRange(coord, gridRange) && !loop.has(coord.join(','))
      ).filter(
        ([[r, c], pipes]) => pipes.includes(grid[r][c])
      ).map(
        ([[r, c]]) => {
          nextList.push([r, c]);
          return [r, c].join(',');
        }
      );

      const id = currentCoord.join(',');
      loop.add(id);
    }

    currentList = nextList;
  }

  return { grid, gridRange, loop, start };
}

export function part1() {
  const { loop } = findLoop(input);

  return loop.size / 2;
}

export function part2() {
  const use = input;
  const { grid, gridRange, loop, start } = findLoop(use);

  const inside = new Set<string>();

  const sShape = getSShape(grid, gridRange, start);

  grid[start[0]][start[1]] = sShape as Cell;

  for (const [row, col] of coordinates(gridRange)) {
    if (!loop.has([row, col].join(','))) {
      const left = Array.from(grid[row].slice(0, col)).filter(
        (c, i) => {
          const onLoop = loop.has([row, i].join(','));
          const isBoundary = VBoundary.includes(c as any);

          return onLoop && isBoundary;
        }
      ).join("");

      // |, FJ, or L7 each count as a crossing
      // F7 and LJ don't count as crossings
      const x = left.match(/\||FJ|L7/g) ?? [];

      if (x.length % 2 === 1) {
        inside.add([row, col].join(','));
      }
    }
  }

  return inside.size;
}

export const answers = [
  6842,
  393
];

import { eg1, eg2, input } from './input';
import { cleanAndParse, inRange, orthogonalNeighbours, simpleRange } from '../../utils';
import { Day } from '..';
import { dir } from 'console';

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

const Pipe = ['-', '|', 'F', '7', 'J', 'L'] as const;
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

      Array.from(ValidNeighbors.get(grid[row][col])!.entries()).map(
        ([dir, nextPipes]) => [move([row, col], dir), nextPipes] as const
      ).filter(
        ([coord]) => inRange(coord, gridRange) && !loop.has(coord.join(','))
      ).filter(
        ([[r, c], pipes]) => pipes.includes(grid[r][c])
      ).forEach(
        ([[r, c]]) => nextList.push([r, c])
      );

      loop.add(currentCoord.join(','));
    }

    currentList = nextList;
  }

  console.log({ N, loop, ValidNeighbors, start, width, height });

  return { loop, start };
}

export function part1() {
  const { loop } = findLoop(input);

  return Math.ceil(loop.size / 2);
}

export function part2() {
  return "todo";
}

export const answers = [
  6842,
  // 222
];

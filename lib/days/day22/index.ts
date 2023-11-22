import { eg1, input } from './input';
import { chunk, CoordinateLimits, generateArray } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {};

const turns = <const>['L', 'R'];
type Turn = typeof turns[number];
type Instruction = number | Turn;

function isTurn(i: Instruction): i is Turn {
  return turns.includes(<Turn>i);
}

function parseInput(src: string) {
  const lines = src.split("\n");

  let pathSrc = lines.pop()!;
  const path: Instruction[] = [];

  while (pathSrc) {
    if (isTurn(<Turn>pathSrc[0])) {
      path.push(<Turn>pathSrc[0]);
      pathSrc = pathSrc.slice(1);
    }
    else {
      const n = parseInt(pathSrc, 10);
      path.push(n);
      pathSrc = pathSrc.slice(n.toString().length);
    }
  }

  lines.pop();
  const width = Math.max(...lines.map(r => r.length));

  const grid = lines.map(l => Array.from(l.padEnd(width, ' ')));
  const height = grid.length;

  const findLimits = (l: string): CoordinateLimits => {
    const start = l.length - l.trimStart().length;
    const end = l.trimEnd().length - 1;
    return [start, end];
  };

  // column limits by row
  const colLimits: CoordinateLimits[] = lines.map(findLimits);

  // row limits by column
  const rowLimits: CoordinateLimits[] = generateArray(width, i => i).map(
    col => grid.map(row => row[col] ?? ' ').join('')
  ).map(findLimits);

  const facing = 0;
  const row = 0;
  const col = colLimits[0][0];

  return {
    path,
    grid,
    width,
    height,
    rowLimits,
    colLimits,
    state: {
      facing,
      row,
      col
    }
  }
}

type Input = ReturnType<typeof parseInput>;
type State = Input['state'];
type Grid = Input['grid'];

const facings = ['>', 'v', '<', '^'];
const turnDirections: Record<Turn, number> = {
  R: 1,
  L: -1
};
const moveDirections = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0]
];

function doTurn(turn: Turn, state: State) {
  state.facing = (state.facing + 4 + turnDirections[turn]) % 4;
}

function wrapPart1(n: number, d: number, [min, max]: CoordinateLimits) {
  if (d === 0) {
    return n;
  }

  const dn = n + d;

  if (dn > max) {
    return min;
  }
  if (dn < min) {
    return max;
  }

  return dn;
}

function doMovePart1(moves: number, state: State, grid: Grid, rowLimits: CoordinateLimits[], colLimits: CoordinateLimits[]) {
  const [dRow, dCol] = moveDirections[state.facing];
  let { row, col } = state;

  loop:
  while (moves--) {
    const [nextRow, nextCol] = [wrapPart1(row, dRow, rowLimits[col]), wrapPart1(col, dCol, colLimits[row])];

    if (grid[nextRow][nextCol] === '#') {
      break loop;
    }

    [row, col] = [nextRow, nextCol];
    grid[row][col] = facings[state.facing];
  }

  state.row = row;
  state.col = col;
}

function offGrid(n: number, [min, max]: CoordinateLimits) {
  return (n < min) || (n > max);
}

function doMovePart2(moves: number, state: State, grid: Grid, rowLimits: CoordinateLimits[], colLimits: CoordinateLimits[]) {
  let { row, col } = state;

  loop:
  while (moves--) {
    const [dRow, dCol] = moveDirections[state.facing];
    const [candidateRow, candidateCol] = [row + dRow, col + dCol];

    let [nextRow, nextCol] = [candidateRow, candidateCol];
    let nextFacing = state.facing;
    const bigRow = Math.floor(row / spec.faceSize);
    const bigCol = Math.floor(col / spec.faceSize);

    if (offGrid(candidateRow, rowLimits[col])) {
      let actions = spec.edges.down[bigCol];
      if (state.facing === 3) {
        actions = spec.edges.up[bigCol];

      }
      [nextRow, nextCol] = actions.coord(row, col);
      nextFacing = (state.facing + actions.reorient) % 4;
    }

    if (offGrid(candidateCol, colLimits[row])) {
      let actions = spec.edges.right[bigRow];
      if (state.facing === 2) {
        actions = spec.edges.left[bigRow];
      }
      [nextRow, nextCol] = actions.coord(row, col);
      nextFacing = (state.facing + actions.reorient) % 4;
    }

    if (grid[nextRow][nextCol] === '#') {
      break loop;
    }

    state.facing = nextFacing;
    [row, col] = [nextRow, nextCol];
    grid[row][col] = facings[state.facing];
  }

  state.row = row;
  state.col = col;
}

function doInstruction(part: number, i: Instruction, state: State, grid: Grid, rowLimits: CoordinateLimits[], colLimits: CoordinateLimits[]) {
  if (isTurn(i)) {
    doTurn(i, state);
    grid[state.row][state.col] = facings[state.facing];
  }
  else {
    if (part === 1) {
      doMovePart1(i, state, grid, rowLimits, colLimits);
    }
    else {
      doMovePart2(i, state, grid, rowLimits, colLimits);
    }
  }
}

function visualize(grid: Grid) {
  return grid.map(row => row.join("")).join("\n");
}

function runPart(part: number, src: string) {
  const { path, state, grid, rowLimits, colLimits, width, height } = parseInput(src);

  grid[state.row][state.col] = facings[state.facing];
  for (const instruction of path) {
    doInstruction(part, instruction, state, grid, rowLimits, colLimits);
  }

  const { row, col, facing } = state;

  return facing + 4 * (col + 1) + 1000 * (row + 1);
}

function mapFace(coord: number, from: number, to: number, dir: string): number {
  const { faceSize } = spec;

  if (dir === "fwd") {
    return coord + (to - from) * faceSize;
  }

  return ((to + from + 1) * faceSize) - coord - 1;
}

function faceEdge(n: number, edge: string): number {
  const { faceSize } = spec;
  let coord = n * faceSize;

  if (['B', 'R'].includes(edge)) {
    coord += (faceSize - 1);
  }

  return coord;
}

const specs: Record<string, Spec> = {
  eg1: {
    src: eg1,
    faceSize: 4,
    edges: {
      up: [
        {
          coord: (r, c) => [faceEdge(0, 'T'), mapFace(c, 0, 2, "rev")],
          reorient: 2
        },
        {
          coord: (r, c) => [mapFace(c, 1, 0, "fwd"), faceEdge(2, 'L')],
          reorient: 1
        },
        {
          coord: (r, c) => [faceEdge(1, 'T'), mapFace(c, 2, 0, "rev")],
          reorient: 2
        },
        {
          coord: (r, c) => [mapFace(c, 3, 1, "rev"), faceEdge(2, "R")],
          reorient: 3
        }
      ],
      down: [
        {
          coord: (r, c) => [faceEdge(2, 'B'), mapFace(c, 0, 2, 'rev')],
          reorient: 2
        },
        {
          coord: (r, c) => [mapFace(c, 1, 2, 'rev'), faceEdge(2, 'L')],
          reorient: 3
        },
        {
          coord: (r, c) => [faceEdge(1, 'B'), mapFace(c, 2, 0, 'rev')],
          reorient: 2
        },
        {
          coord: (r, c) => [mapFace(c, 3, 1, 'rev'), faceEdge(0, 'L')],
          reorient: 3
        }
      ],
      left: [
        {
          coord: (r, c) => [faceEdge(1, 'T'), mapFace(r, 0, 1, 'fwd')],
          reorient: 3
        },
        {
          coord: (r, c) => [faceEdge(2, 'B'), mapFace(r, 1, 3, 'rev')],
          reorient: 1
        },
        {
          coord: (r, c) => [faceEdge(1, 'B'), mapFace(r, 2, 1, 'rev')],
          reorient: 1
        }
      ],
      right: [
        {
          coord: (r, c) => [mapFace(r, 0, 2, 'rev'), faceEdge(3, 'R')],
          reorient: 2
        },
        {
          coord: (r, c) => [faceEdge(2, 'T'), mapFace(r, 1, 3, 'rev')],
          reorient: 1
        },
        {
          coord: (r, c) => [mapFace(r, 2, 0, 'rev'), faceEdge(2, 'R')],
          reorient: 2
        }
      ]
    }
  },
  input: {
    src: input,
    faceSize: 50,
    edges: {
      up: [
        {
          coord: (r, c) => [mapFace(c, 0, 1, 'fwd'), faceEdge(1, 'L')],
          reorient: 1
        },
        {
          coord: (r, c) => [mapFace(c, 1, 3, 'fwd'), faceEdge(0, 'L')],
          reorient: 1
        },
        {
          coord: (r, c) => [faceEdge(3, 'B'), mapFace(c, 2, 0, 'fwd')],
          reorient: 0
        }
      ],
      down: [
        {
          coord: (r, c) => [faceEdge(0, 'T'), mapFace(c, 0, 2, 'fwd')],
          reorient: 0
        },
        {
          coord: (r, c) => [mapFace(c, 1, 3, 'fwd'), faceEdge(0, 'R')],
          reorient: 1
        },
        {
          coord: (r, c) => [mapFace(c, 2, 1, 'fwd'), faceEdge(1, 'R')],
          reorient: 1
        }
      ],
      left: [
        {
          coord: (r, c) => [mapFace(r, 0, 2, 'rev'), faceEdge(0, 'L')],
          reorient: 2
        },
        {
          coord: (r, c) => [faceEdge(2, 'T'), mapFace(r, 1, 0, 'fwd')],
          reorient: 3
        },
        {
          coord: (r, c) => [mapFace(r, 2, 0, 'rev'), faceEdge(1, 'L')],
          reorient: 2
        },
        {
          coord: (r, c) => [faceEdge(0, 'T'), mapFace(r, 3, 1, 'fwd')],
          reorient: 3
        }
      ],
      right: [
        {
          coord: (r, c) => [mapFace(r, 0, 2, 'rev'), faceEdge(1, 'R')],
          reorient: 2
        },
        {
          coord: (r, c) => [faceEdge(0, 'B'), mapFace(r, 1, 2, 'fwd')],
          reorient: 3
        },
        {
          coord: (r, c) => [mapFace(r, 2, 0, 'rev'), faceEdge(2, 'R')],
          reorient: 2
        },
        {
          coord: (r, c) => [faceEdge(2, 'B'), mapFace(r, 3, 1, 'fwd')],
          reorient: 3
        }
      ]
    }
  }
};

type EdgeMap = {
  coord: (row: number, col: number) => [number, number];
  reorient: 0 | 1 | 2 | 3
};

type Spec = {
  src: string,
  faceSize: number,
  edges: {
    up: EdgeMap[],
    down: EdgeMap[],
    left: EdgeMap[],
    right: EdgeMap[]
  }
}
let spec: Spec = specs.eg1;

export function part1() {
  return runPart(1, input);
}

export function part2() {
  spec = specs.input;

  return runPart(2, spec.src);
}

export const answers = [
  26558,
  110400
];

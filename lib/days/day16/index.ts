import { eg1, input } from './input';
import { cleanAndParse, generateArray, inRange, simpleRange } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {};

function Beam(row: number, col: number, direction: string) {
  return { row, col, direction };
}
type Beam = ReturnType<typeof Beam>;
type Energized = Record<string, boolean>;

function parse(input: string) {
  const grid = cleanAndParse(input, s => Array.from(s));
  const width = grid[0].length;
  const height = grid.length;
  const gridRange = simpleRange([height, width]);

  return { grid, width, height, gridRange };
}
type Parsed = ReturnType<typeof parse>;

function countEnergized(startBeam: Beam, { grid, width, height, gridRange }: Parsed) {
  const start = performance.now();
  let beams = [startBeam];
  const energized: Energized[][] = generateArray(height, () => generateArray(width, () => ({ L: false, R: false, U: false, D: false })));

  let N = 0;

  while (beams.length) {
    if (N++ > 1e4) {
      throw new Error(`${N} is too many iterations. Started at ${vizBeams([startBeam], grid)}`);
    }
    if (beams.length > (width * height * 4)) {
      throw new Error(`${beams.length} is too many beams. Started at ${vizBeams([startBeam], grid)}`);
    }

    const nextBeams: Beam[] = [];

    checkBeams:
    for (const { row, col, direction } of beams) {
      const cell = grid[row][col];
      const action = `${cell}${direction}`;

      if (energized[row][col][direction]) {
        continue checkBeams;
      }

      energized[row][col][direction] = true;

      let hasNext = 0;

      switch (action) {
        case '.R': case '-R': {
          hasNext++;
          nextBeams.push(Beam(row, col + 1, 'R'));
          break;
        }
        case '.L': case '-L': {
          hasNext++;
          nextBeams.push(Beam(row, col - 1, 'L'));
          break;
        }
        case '.D': case '|D': {
          hasNext++;
          nextBeams.push(Beam(row + 1, col, 'D'));
          break;
        }
        case '.U': case '|U': {
          hasNext++;
          nextBeams.push(Beam(row - 1, col, 'U'));
          break;
        }
        case '\\R': {
          hasNext++;
          nextBeams.push(Beam(row + 1, col, 'D'));
          break;
        }
        case '\\L': {
          hasNext++;
          nextBeams.push(Beam(row - 1, col, 'U'));
          break;
        }
        case '\\D': {
          hasNext++;
          nextBeams.push(Beam(row, col + 1, 'R'));
          break;
        }
        case '\\U': {
          hasNext++;
          nextBeams.push(Beam(row, col - 1, 'L'));
          break;
        }
        case '/R': {
          hasNext++;
          nextBeams.push(Beam(row - 1, col, 'U'));
          break;
        }
        case '/L': {
          hasNext++;
          nextBeams.push(Beam(row + 1, col, 'D'));
          break;
        }
        case '/D': {
          hasNext++;
          nextBeams.push(Beam(row, col - 1, 'L'));
          break;
        }
        case '/U': {
          hasNext++;
          nextBeams.push(Beam(row, col + 1, 'R'));
          break;
        }
        case '-D': case '-U': {
          hasNext++;
          nextBeams.push(Beam(row, col - 1, 'L'));
          nextBeams.push(Beam(row, col + 1, 'R'));
          break;
        }
        case '|R': case '|L': {
          hasNext++;
          nextBeams.push(Beam(row - 1, col, 'U'));
          nextBeams.push(Beam(row + 1, col, 'D'));
          break;
        }
      }
    }

    beams = nextBeams.filter(
      ({ row, col }) => (
        inRange([row, col], gridRange)

      )
    );
  }

  const end = performance.now();

  return energized.flat().filter(e => Object.values(e).some(Boolean)).length;
}

export function part1() {
  const parsed = parse(input);
  return countEnergized(Beam(0, 0, 'R'), parsed);
}

export function part2() {
  const parsed = parse(input);
  const { width, height } = parsed;
  const startPos = [
    ...generateArray(width, col => Beam(0, col, 'D')),
    ...generateArray(width, col => Beam(height - 1, col, 'U')),
    ...generateArray(height, row => Beam(row, 0, 'R')),
    ...generateArray(height, row => Beam(row, width - 1, 'L'))
  ];

  const allResults = startPos.map(startBeam => countEnergized(startBeam, parsed));

  return Math.max(...allResults);
}

function vizEnergized(energized: Energized[][]) {
  return energized.map(row => row.map(c => {
    const dirs = Object.entries(c).filter(([d, e]) => e);

    if (dirs.length === 0) {
      return ' ';
    }
    if (dirs.length === 1) {
      return dirs[0][0];
    }
    return dirs.length.toString();
  }).join('')).join('\n');
}

function vizBeams(beams: Beam[], grid: string[][]) {
  return `{ ${beams.map(({ row, col, direction }) => `[${row},${col} ${direction} ${grid[row]?.[col] ?? 'x'} ]`).join(', ')} }`;
}


export const answers = [
  6361,
  6701
];

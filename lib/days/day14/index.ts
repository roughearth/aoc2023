import { eg1, input } from './input';
import { cleanAndParse, generateArray } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {};

type Grid = string[][];

function parse(input: string) {
  const grid = cleanAndParse(input, l => Array.from(l));

  return { grid };
}

function rotate(grid: Grid, dir: string) {
  const size = grid.length;

  const newGrid: Grid = generateArray(size, () => Array(size));

  for (let col = 0; col < size; col++) {
    for (let row = 0; row < size; row++) {
      let newCol: number;
      let newRow: number;

      switch (dir) {
        case "L": {
          newCol = row;
          newRow = size - col - 1;
          break;
        }
        case "R": default: {
          newCol = size - row - 1;
          newRow = col;
          break;
        }
      }

      newGrid[newRow][newCol] = grid[row][col];
    }
  }

  return newGrid;
}

/*
Tilts to the left to make the analysis easier.
Hence the need to rotate the grid before tilting
*/
function tilt(grid: Grid) {
  type Group = { type: string, cells: string[] };
  const typeMap: Record<string, string> = { '.': 'round', 'O': 'round', '#': 'square' };

  const size = grid.length;

  const newGrid: string[][] = [];

  for (const row of grid) {
    const tiltedRowGroups: Group[] = [];

    let currentGroup: Group = { type: 'unknown', cells: [] };

    for (let col = 0; col < size; col++) {
      const cell = row[col];
      const type = typeMap[cell];

      if (type === currentGroup.type) {
        currentGroup.cells.push(cell);
      }
      else {
        if (currentGroup.type !== 'unknown') {
          tiltedRowGroups.push(currentGroup);
        }
        currentGroup = { type, cells: [cell] };
      }
    }
    tiltedRowGroups.push(currentGroup);

    const tiltedRow: string[] = tiltedRowGroups.flatMap(group => {
      if (group.type === 'round') {
        return group.cells.sort().reverse();
      }
      else {
        return group.cells;
      }
    });

    newGrid.push(tiltedRow);
  }

  return newGrid;
}

/*
Assumes grid is oriented North to the left (ie immediately post tilt)
*/
function calcLoad(grid: Grid) {
  const width = grid[0].length;
  const height = grid.length;

  let load = 0;

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const cell = grid[row][col];

      if (cell === 'O') {
        load += (width - col);
      }
    }
  }

  return load;
}

export function part1() {
  const parsed = parse(input);

  // needs a single rotation to get to the right orientation for a tilt
  const startPos = rotate(parsed.grid, "L");

  return calcLoad(tilt(startPos));
}

export function part2() {
  const parsed = parse(input);

  // needs a single rotation to get to the right orientation for first rotation of the main loop
  let init = rotate(parsed.grid, "L");
  // and another to get to the right orientation for the first tilt
  let current = rotate(init, "L");

  let cycle = 0;
  let repeatStart = -1;
  let repeatEnd = -1;

  const stateHistory = new Map<string, number>();
  const loadHistory = new Map<number, number>();

  mainloop:
  while (++cycle) {
    current = tilt(rotate(current, "R"));
    current = tilt(rotate(current, "R"));
    current = tilt(rotate(current, "R"));
    current = tilt(rotate(current, "R"));

    const key = current.flat().join('');

    if (stateHistory.has(key)) {
      repeatStart = stateHistory.get(key)!;
      repeatEnd = cycle;

      break mainloop;
    }
    else {
      stateHistory.set(key, cycle);
      loadHistory.set(cycle, calcLoad(rotate(current, "R")));
    }
  }

  const targetCycles = 1e9;
  const loadKey = (targetCycles - repeatStart) % (repeatEnd - repeatStart) + repeatStart;
  return loadHistory.get(loadKey);
}

export const answers = [
  108641,
  84328
];

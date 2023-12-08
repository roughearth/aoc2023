import { eg1, input as main } from './input';
import { cleanAndParse, chunk, sumOf, simpleRange, coordinates } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {};

function findPartNumbers(input: string) {
  const grid = cleanAndParse(input);

  const height = grid.length;
  const width = grid[0].length;

  const found = [];
  const gears: Record<string, number[]> = {}

  for (const [r, c] of coordinates(simpleRange([height, width]))) {
    if (grid[r][c] === "*") {
      const key = `${r},${c}`;
      gears[key] = [];
    }
  }

  function logGear(r: number, c: number, v: any) {
    const key = `${r},${c}`;
    gears[key].push(v.number);
  }

  /*
  This is waaay too complicated, but my decision to use `indexOf` caused problems that I overcompensated for.
  eg ...999...999... looking for the second 999
  or ...999...9... looking for the solitary 9
  */
  for (let row = 0; row < height; row++) {
    const candidates = grid[row].match(/\d+/g) ?? [];

    let column = 0;
    let prevLength = 0;

    for (const candidate of candidates) {
      column = grid[row].indexOf(candidate, column + prevLength);
      prevLength = candidate.length;

      const leftColumn = column - 1;
      const rightColumn = column + candidate.length;
      const aboveRow = row - 1;
      const belowRow = row + 1;

      const immediatelyAbove = (row > 0) ? grid[aboveRow].slice(column, rightColumn) : ".".repeat(candidate.length);
      const immediatelyBelow = (row < height - 1) ? grid[belowRow].slice(column, rightColumn) : ".".repeat(candidate.length);

      const aboveLeft = (row > 0 && column > 0) ? grid[aboveRow][leftColumn] : ".";
      const aboveRight = (row > 0 && rightColumn < width) ? grid[aboveRow][rightColumn] : ".";
      const belowLeft = (belowRow < height && column > 0) ? grid[belowRow][leftColumn] : ".";
      const belowRight = (belowRow < height && rightColumn < width) ? grid[belowRow][rightColumn] : ".";

      const above = `${aboveLeft}${immediatelyAbove}${aboveRight}`;
      const below = `${belowLeft}${immediatelyBelow}${belowRight}`;

      const before = (column > 0) ? grid[row][leftColumn] : ".";
      const after = (rightColumn < width) ? grid[row][rightColumn] : ".";

      const border = `${above}${before}${after}${below}`

      if (!/^\.+$/.test(border)) {
        const item = { number: Number(candidate), row, column };

        if (before === "*") {
          logGear(row, leftColumn, item);
        }
        if (after === "*") {
          logGear(row, rightColumn, item);
        }

        for (let c = 0; c < above.length; c++) {
          if (above[c] === "*") {
            logGear(aboveRow, c + leftColumn, item);
          }
        }
        for (let c = 0; c < below.length; c++) {
          if (below[c] === "*") {
            logGear(belowRow, c + leftColumn, item);
          }
        }
        found.push(item);
      }
    }
  }

  return { found, gears };
}

export function part1() {
  const found = findPartNumbers(main).found.map(p => p.number);

  return sumOf(found);
}

export function part2() {
  const { gears } = findPartNumbers(main);

  return sumOf(Object.values(gears).filter(g => g.length === 2).map(g => g[0] * g[1]));
}

export const answers = [
  520135,
  72514855
];
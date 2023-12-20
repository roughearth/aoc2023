import { eg1, input } from './input';
import { CoordinateRange, cleanAndParse } from '../../utils';
import { Day } from '..';
import { parse } from 'path';

export const meta: Day['meta'] = {
  // manualStart: true
};

const Opposite: Record<string, string> = {
  U: 'D',
  D: 'U',
  L: 'R',
  R: 'L'
};

const Orientation: Record<string, string> = {
  U: 'V',
  D: 'V',
  L: 'H',
  R: 'H'
};

type End = { x: number, y: number, join: string };
type Line = {
  start: End,
  end: End,
  min: End,
  max: End,
  ornt: string,
  isVertical: boolean,
  horizontalValue: number,

  isRow: (r: number) => boolean,
};

function parsePt1(input: string) {
  return cleanAndParse(input, l => {
    const [dir, countSrc] = l.split(' ');
    const count = Number(countSrc);

    return { dir, count };
  });
}

function parsePt2(input: string) {
  return cleanAndParse(input, l => {
    const [, , colourSrc] = l.split(' ');

    const countSrc = colourSrc.slice(2, -2);
    const count = parseInt(countSrc, 16);
    const dirSrc = colourSrc.slice(-2, -1);
    const dir = ['R', 'D', 'L', 'U'][Number(dirSrc)];

    return { dir, count };
  });
}

type Parsed = ReturnType<typeof parsePt1>[number];

export function run(list: Parsed[]) {
  let x = 0;
  let y = 0;

  let xMin = x;
  let xMax = x;
  let yMin = y;
  let yMax = y;

  const lines: Line[] = [];
  const rowWithCornersSet = new Set<number>();

  for (let i = 0, l = list.length; i < l; i++) {
    const curr = list.at(i)!;
    const prev = list.at(i - 1)!;
    const next = list.at((i + 1) % l)!;

    const ornt = Orientation[curr.dir];
    const start: End = { x, y, join: Opposite[prev.dir] };


    switch (curr.dir) {
      case "U": y -= curr.count; break;
      case "D": y += curr.count; break;
      case "L": x -= curr.count; break;
      case "R": x += curr.count; break;
    }

    xMin = Math.min(xMin, x);
    xMax = Math.max(xMax, x);
    yMin = Math.min(yMin, y);
    yMax = Math.max(yMax, y);

    const end: End = { x, y, join: next.dir };
    const isVertical = (ornt === 'V') || (start.join !== end.join);
    const horizontalValue = (ornt === 'V') ? 1 : Math.abs(start.x - end.x) + 1;

    const [min, max] = [start, end].sort((a, b) => a.x - b.x);

    const nextLine: Line = {
      start,
      end,
      min,
      max,
      ornt,
      isVertical,
      horizontalValue,
      isRow: r => r === start.y
    };
    lines.push(nextLine);

    rowWithCornersSet.add(start.y);
    rowWithCornersSet.add(end.y);

    // cache nextLine for the rows it counts towards, vertical lines don't count their ends
    if (ornt === "V") {
      const yStart = start.y;
      const yEnd = end.y;

      const yMin = Math.min(yStart, yEnd);
      const yMax = Math.max(yStart, yEnd);

      nextLine.isRow = r => (r > yMin) && (r < yMax);
    }
  }

  /* consider only the rows with corners and 1 example of a row in each gap, multiplied up */
  const rowsToConsider: { row: number, count: number }[] = [];

  const rowWithCorners = Array.from(rowWithCornersSet).sort((a, b) => a - b);
  for (let i = 0, l = rowWithCorners.length - 1; i < l; i++) {
    const row = rowWithCorners[i];
    const next = rowWithCorners[i + 1];

    const diff = next - row - 1;
    rowsToConsider.push({ row, count: 1 });

    if (diff > 0) {
      rowsToConsider.push({ row: row + 1, count: diff });
    }
  }
  rowsToConsider.push({ row: rowWithCorners.at(-1)!, count: 1 });

  let total = 0;
  for (const { row, count } of rowsToConsider) {
    const allLines = lines.filter(l => l.isRow(row)).sort((a, b) => a.min.x - b.min.x);

    let inside = false;
    let rowTotal = 0;
    let xPrev = xMin;
    for (const line of allLines) {
      if (inside) {
        rowTotal += line.min.x - xPrev - 1;
      }
      rowTotal += line.horizontalValue;
      xPrev = line.max.x;
      if (line.isVertical) {
        inside = !inside;
      }
    }
    total += (rowTotal * count);
  }

  return total;
}

export function part1() {
  const list = parsePt1(input);
  return run(list);
}

export function part2() {
  const list = parsePt2(input);

  return run(list);
}

export const answers = [
  46334,
  102000662718092
];

import { eg1, input } from './input';
import { cleanAndParse, generateArray, pairs } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {};

function parse(input: string, age: number) {
  const raw = cleanAndParse(input);

  const width = raw[0].length;
  const height = raw.length;

  const srcList = raw.map((line, row) => {
    return Object.entries(line.split(''))
      .filter(([_, c]) => c === '#')
      .map(([col, _]) => [row, Number(col)]);
  }).flat();

  const emptyRowSet = new Set(generateArray(height, i => i));
  const emptyColSet = new Set(generateArray(width, i => i));

  for (const [row, col] of srcList) {
    emptyRowSet.delete(row);
    emptyColSet.delete(col);
  }

  const emptyRows = Array.from(emptyRowSet).sort((a, b) => (a - b));
  const emptyCols = Array.from(emptyColSet).sort((a, b) => (a - b));

  const colMap = new Map(
    generateArray(width, i => [i, i + (emptyCols.filter(c => c < i).length * (age - 1))])
  );

  const rowMap = new Map(
    generateArray(height, i => [i, i + (emptyRows.filter(r => r < i).length * (age - 1))])
  );

  const list = srcList.map(
    ([row, col]) => [rowMap.get(row), colMap.get(col)]
  );

  const size = srcList.length;

  let total = 0;

  for (const [a, b] of pairs(size)) {
    const [rowA, colA] = list[a];
    const [rowB, colB] = list[b];

    total += Math.abs(rowA! - rowB!) + Math.abs(colA! - colB!);
  }

  return { srcList, list, size, width, height, emptyCols, colMap, emptyRows, rowMap, total };
}


export function part1() {
  const { total } = parse(input, 2);

  return total;
}

export function part2() {
  const { total } = parse(input, 1_000_000);

  return total;
}

export const answers = [
  9403026,
  543018317006
];

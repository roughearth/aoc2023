import { eg1, input } from './input';
import { cleanAndParse } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {};

function Pair(p: string) {
  return cleanAndParse(p, l => {
    return JSON.parse(l);
  });
}

function isNumber(a: any): a is number {
  return !Array.isArray(a);
}

function compare(a: any[], b: any[]): number {
  const l = Math.min(a.length, b.length);

  for (let i = 0; i < l; i++) {
    let A = a[i];
    let B = b[i];

    if (isNumber(A) && isNumber(B)) {
      if (A < B) {
        return -1;
      }
      if (A > B) {
        return 1;
      }
    }
    else {
      if (isNumber(A)) {
        A = [A];
      }
      if (isNumber(B)) {
        B = [B];
      }

      const C = compare(A, B);

      if (C !== 0) {
        return C;
      }
    }
  }

  if (a.length < b.length) {
    return -1;
  }
  if (a.length > b.length) {
    return 1;
  }

  return 0;
}

export function part1() {
  const data = cleanAndParse(input, Pair, { separator: '\n\n' });

  const resultList = data.map(([p, q]) => compare(p, q));

  return resultList.flatMap(
    (b, i) => (b === -1) ? [i + 1] : []
  ).reduce(
    (a, b) => a + b
  );
}

export function part2() {
  const data = [
    [[2]],
    [[6]],
    ...cleanAndParse(input, Pair, { separator: '\n\n' }).flat()
  ];

  data.sort(compare);

  let i2 = 0;
  let i6 = 0;

  data.forEach((a, i) => {
    const s = JSON.stringify(a);
    if (s === "[[2]]") {
      i2 = i + 1;
    }
    if (s === "[[6]]") {
      i6 = i + 1;
    }
  })

  return i2 * i6;
}

export const answers = [
  6086,
  27930
];

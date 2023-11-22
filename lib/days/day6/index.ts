import { input } from './input';
import { cleanAndParse } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {};

function find(n: number) {
  const last = input.length - n;

  for (let i = 0; i < last; i++) {
    const chars = new Set(Array.from(input.slice(i, i + n)));

    if (chars.size === n) {
      return i + n;
    }
  }

  throw new Error("Not found");
}

export function part1() {
  return find(4);
}

export function part2() {
  return find(14);
}

export const answers = [
  1538,
  2315
];

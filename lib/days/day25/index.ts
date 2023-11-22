import { eg1, input } from './input';
import { cleanAndParse, modLpr, sumOf } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {};

const digitSrc: [string, number][] = [
  ["0", 0],
  ["1", 1],
  ["2", 2],
  ["-", -1],
  ["=", -2]
];

const values = new Map(digitSrc);
const digits = new Map(digitSrc.map(
  ([char, val]) => [
    modLpr(val, 5),
    char
  ]
));

function parseSnafu(s: string): number {
  return Array.from(s).reduce(
    (t, n) => (t * 5 + values.get(n)!),
    0
  );
}

function toSnafu(n: number) {
  const chars: string[] = [];

  while (n) {
    const char = digits.get(n % 5)!;
    n -= values.get(char)!;
    n /= 5;
    chars.unshift(char);
  }

  return chars.join("");
}

export function part1() {
  const data = cleanAndParse(input, parseSnafu);

  const total = sumOf(data);

  return toSnafu(total);
}

export function part2() {
  return "Merry Xmas!";
}

export const answers = [
  "2==0=0===02--210---1"
];

import { eg, eg2, eg3, eg4, input } from './input';
import { cleanAndParse } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {};

export function part1() {
  const digits = cleanAndParse(input, (s) => Array.from(s).map(Number).filter(Boolean));

  let total = 0;

  for (const arr of digits) {
    const first = arr.at(0);
    const last = arr.at(-1);

    const num = parseInt(`${first}${last}`, 10);
    total += num;
  }

  return total
}

const wordValues: Record<string, number> = {
  "one": 1,
  "two": 2,
  "three": 3,
  "four": 4,
  "five": 5,
  "six": 6,
  "seven": 7,
  "eight": 8,
  "nine": 9
};

const words = Object.keys(wordValues);
const values = Object.values(wordValues);
const rx = new RegExp(`(${words.join("|")})`, "g");

export function part2() {
  const digits = cleanAndParse(input, (s) => {
    let first = 0;
    let last = 0;

    for (let i = 0; i < s.length; i++) {
      const startTrimmed = s.slice(i);
      const endTrimmed = i ? s.slice(0, -i) : s;

      for (const v of values) {
        if (!first && startTrimmed.startsWith(`${v}`)) {
          first = v;
        }

        if (!last && endTrimmed.endsWith(`${v}`)) {
          last = v;
        }
      }

      for (const w of words) {
        if (!first && startTrimmed.startsWith(w)) {
          first = wordValues[w];
        }

        if (!last && endTrimmed.endsWith(w)) {
          last = wordValues[w];
        }
      }

    }

    return `${first}${last}`;
  });

  let total = 0;

  for (const d of digits) {
    const num = parseInt(d, 10);
    total += num;
  }

  return total
}

export const answers = [
  54601,
  54078
];

import { input } from './input';
import { cleanAndParse } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {};

function parseElves() {
  return input.split("\n\n").map(
    elf => cleanAndParse(elf, Number).reduce((a, b) => a + b)
  );
}

export function part1() {
  return Math.max(...parseElves());
}

export function part2() {
  const topThree = parseElves().sort((a, b) => a - b).slice(-3);

  return topThree.reduce((a, b) => a + b);
}

export const answers = [
  67027,
  197291
];

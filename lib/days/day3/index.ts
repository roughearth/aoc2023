import { eg1, input } from './input';
import { cleanAndParse, chunk } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {};

const PriorityList = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
function priority(l: string) {
  return PriorityList.indexOf(l) + 1;
}

function parsePart1(list: string) {
  const size = list.length / 2;
  const compartment1 = Array.from(list.slice(0, size));
  const compartment2 = list.slice(size);
  const both = compartment1.filter(
    item => compartment2.includes(item)
  )

  return priority(both[0]);
}

export function part1() {
  const data = cleanAndParse(input, parsePart1);

  return data.reduce((a, b) => a + b);
}

function parseGroupPart2(elfs: string[]) {
  const all = Array.from(elfs[0]).filter(
    item => (elfs[1].includes(item) && elfs[2].includes(item))
  );

  return priority(all[0]);
}

export function part2() {
  const groups = chunk(cleanAndParse(input), 3);

  const priorities = groups.map(parseGroupPart2);

  return priorities.reduce((a, b) => a + b);
}

export const answers = [
  7967,
  2716
];

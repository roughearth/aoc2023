import { eg1, input } from './input';
import { cleanAndParse, modLpr, sumOf } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {};

function run(src: string, rounds: number, key: number) {
  const numbers: [number][] = cleanAndParse(src, n => [Number(n) * key]); // 1-ple to account for duplicates
  let data = Array.from(numbers); // clone to mutate
  const size = data.length;

  for (let round = 0; round < rounds; round++) {
    for (const next of numbers) {
      const currentIndex = data.indexOf(next);
      const removed = data.splice(0, currentIndex + 1);
      data = data.concat(removed);
      const target = modLpr(next[0], size - 1); // there are only `size - 1` gaps to slot in to
      const e = data.pop()!;
      data.splice(target, 0, e);
    }
  }

  const currentIndex = data.findIndex(([n]) => n === 0);
  const removed = data.splice(0, currentIndex);
  data = data.concat(removed);

  const answers = [1000, 2000, 3000].map(n => data[n % size][0]);

  return sumOf(answers);

}


export function part1() {
  return run(input, 1, 1);
}

export function part2() {
  return run(input, 10, 811589153);
}

export const answers = [
  3466,
  9995532008348
];

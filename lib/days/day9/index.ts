import { eg1, input } from './input';
import { cleanAndParse, generateArray } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {};

function Move(src: string) {
  const [direction, sCount] = src.split(' ');

  return {
    direction,
    count: Number(sCount)
  };
}

export function runRope(src: string, length: number) {
  const data = cleanAndParse(src, Move);
  const visited = new Set<string>(['[0,0]']);
  const rope = generateArray(length, () => [0, 0]);

  const head = rope[0];
  const tail = rope[length - 1];

  let move;

  while (move = data.shift()) {
    for (let i = 0; i < move.count; i++) {
      // move head
      switch (move.direction) {
        case 'R':
          head[0]++;
          break;
        case 'L':
          head[0]--;
          break;
        case 'D':
          head[1]++;
          break;
        case 'U':
          head[1]--;
          break;
      }

      // chase head
      for (let segment = 1; segment < length; segment++) {
        const current = rope[segment];
        const previous = rope[segment - 1];

        if (Math.max(
          Math.abs(previous[0] - current[0]),
          Math.abs(previous[1] - current[1])
        ) > 1) {
          current[0] += Math.sign(previous[0] - current[0]);
          current[1] += Math.sign(previous[1] - current[1]);
        }
      }

      visited.add(JSON.stringify(tail));
    }
  }

  return visited.size;
}

export function part1() {
  return runRope(input, 2);
}

export function part2() {
  return runRope(input, 10);
}

export const answers = [
  6181,
  2386
];

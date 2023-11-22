import { eg1, input } from './input';
import { cleanAndParse } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {};

function parseLine(d: string) {
  return d.split(",").map(e => {
    const [from, to] = e.split("-").map(n => Number(n));
    return { from, to };
  });
}

export function part1() {
  const data = cleanAndParse(input, parseLine).filter(
    pair => {
      const [a, b] = pair;

      return (
        (a.from <= b.from) && (a.to >= b.to) ||
        (a.from >= b.from) && (a.to <= b.to)
      );
    }
  );

  return data.length;
}

export function part2() {
  const data = cleanAndParse(input, parseLine).filter(
    pair => {
      const [a, b] = pair;

      return (Math.max(a.from, b.from) <= Math.min(a.to, b.to));
    }
  );

  return data.length;
}

export const answers = [
  433,
  852
];

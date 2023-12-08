import { eg1, input } from './input';
import { cleanAndParse, productOf } from '../../utils';
import { Day } from '..';
import { time } from 'console';

export const meta: Day['meta'] = {};

function parseInput(input: string[]) {
  const [timeSrc, distanceSrc] = input;
  const times = timeSrc.slice(5).split(/\s+/).map(Number).filter(Boolean);
  const distances = distanceSrc.slice(9).split(/\s+/).map(Number).filter(Boolean);

  return times.map((time, i) => ({ time, distance: distances[i] }));
}
type Race = ReturnType<typeof parseInput>[number];

function analyse({ time, distance }: Race) {
  const sqrt = Math.sqrt(time ** 2 - 4 * distance)
  const minRaw = (time - sqrt) / 2;
  let min = Math.ceil(minRaw);

  if (minRaw === min) {
    min += 1;
  }

  const maxRaw = (time + sqrt) / 2;
  let max = Math.floor(maxRaw);

  if (maxRaw === max) {
    max -= 1;
  }


  const range = max - min + 1;

  return range;
}

export function part1() {
  const races = parseInput(cleanAndParse(input));

  const ranges = races.map(analyse);

  return productOf(ranges);
}

export function part2() {
  const [race] = parseInput(cleanAndParse(
    input,
    s => Array.from(s).filter(l => Boolean(l.trim())).join('')
  ));

  return analyse(race);
}

export const answers = [
  114400,
  21039729
];

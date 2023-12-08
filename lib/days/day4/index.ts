import { eg1, input } from './input';
import { cleanAndParse, sumOf } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {};

function parse(input: string) {
  const data = cleanAndParse(input, line => {
    const [idSrc, numberSrc] = line.split(':');
    const [winningSrc, elfSrc] = numberSrc.split('|');

    const winningNumbers = winningSrc.split(' ').map(s => s.trim()).filter(Boolean).map(Number);
    const elfNumbers = elfSrc.split(' ').map(s => s.trim()).filter(Boolean).map(Number);

    const matches = elfNumbers.filter(n => winningNumbers.includes(n));
    const score = matches.length && 2 ** (matches.length - 1);
    const id = Number(idSrc.split(" ").at(-1));

    return {
      id,
      score,
      matches: matches.length,
      count: 1
    };
  });

  return data;
}

export function part1() {
  const data = parse(input);
  return sumOf(data.map(c => c.score));
}

export function part2() {
  const data = parse(input);

  for (let i = 0, l = data.length; i < l; i++) {
    const { matches, count } = data[i];

    for (let j = 0; j < matches; j++) {
      data[i + 1 + j].count += count;
    }
  }

  return sumOf(data.map(c => c.count));
}

export const answers = [
  27059,
  5744979
];

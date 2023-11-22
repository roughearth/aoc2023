import { input, eg1 } from './input';
import { cleanAndParse } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {};

/*

Rock: A, X
Paper: B, Y
Scissors: C, Z

*/

const ScoresPart1: Record<string, Record<string, number>> = {
  X: { C: 6, A: 3, B: 0, self: 1 },
  Y: { A: 6, B: 3, C: 0, self: 2 },
  Z: { B: 6, C: 3, A: 0, self: 3 },
}


function roundPart1(l: string) {
  const [elf, me] = l.split(' ');
  const result = ScoresPart1[me][elf];
  const choice = ScoresPart1[me].self;

  return result + choice;
}

export function part1() {
  const data = cleanAndParse(input, roundPart1);

  return data.reduce((a, b) => a + b);
}

// Rock beats Scissors beats Paper beats Rock
// A > C > B > A

const ChoicePart2: Record<string, Record<string, string>> = {
  X: { A: 'C', B: 'A', C: 'B' },
  Y: { A: 'A', B: 'B', C: 'C' },
  Z: { A: 'B', B: 'C', C: 'A' },
}

const ScoresPart2: Record<string, Record<string, number>> = {
  A: ScoresPart1.X,
  B: ScoresPart1.Y,
  C: ScoresPart1.Z
}

function roundPart2(l: string) {
  const [elf, strat] = l.split(' ');
  const me = ChoicePart2[strat][elf];

  const result = ScoresPart2[me][elf];
  const choice = ScoresPart2[me].self;

  return result + choice;
}

export function part2() {
  const data = cleanAndParse(input, roundPart2);

  return data.reduce((a, b) => a + b);
}

export const answers = [
  13809,
  12316
];

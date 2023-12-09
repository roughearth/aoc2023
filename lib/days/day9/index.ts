import { eg1, input } from './input';
import { cleanAndParse, sumOf } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {};

function getStack(sequence: number[]) {
  const stack: number[][] = [sequence];
  let current = sequence;

  while (!current.every(n => n === 0)) {
    const next: number[] = [];

    for (let i = 0, l = current.length - 1; i < l; i++) {
      next.push(current[i + 1] - current[i]);
    }

    stack.push(next);
    current = next;
  }

  return stack;
}

function findNext(sequence: number[]) {
  const stack = getStack(sequence);
  // sum of the last element
  return sumOf(stack.map(s => s.at(-1)!));
}

function findPrevious(sequence: number[]) {
  const stack = getStack(sequence);
  // sum of the first element with alternating signs
  return sumOf(stack.map((s, i) => (s[0] * (-1) ** i)));
}


export function part1() {
  const sequences = cleanAndParse(input, l => l.split(" ").map(Number));

  return sumOf(sequences.map(findNext));
}

export function part2() {
  const sequences = cleanAndParse(input, l => l.split(" ").map(Number));

  return sumOf(sequences.map(findPrevious));
}

export const answers = [
  1904165718,
  964
];

import { eg0, eg1, input } from './input';
import { cleanAndParse } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {};

function parseCommand(s: string) {
  return {
    command: s.slice(0, 4),
    value: Number(s.slice(5))
  };
}

export function part1() {
  const lines = cleanAndParse(input, parseCommand);

  let x = 1;
  let cycle = 1;
  const targetCycles = new Set([20, 60, 100, 140, 180, 220]);

  const trace = lines.flatMap(({ command, value }) => {
    const strengths = [cycle * x];
    cycle += 1;

    if (command === 'addx') {
      strengths[1] = cycle * x;
      cycle += 1;
      x += value;
    }

    return strengths;
  }).filter(
    (_, i) => targetCycles.has(i + 1)
  );

  return trace.reduce((a, b) => a + b);

}

export function part2() {
  const lines = cleanAndParse(input, parseCommand);

  let x = 1;
  let cycle = 1;

  const trace = lines.flatMap(({ command, value }) => {
    const spritePos = [[x - 1, x, x + 1]];
    cycle += 1;

    if (command === 'addx') {
      spritePos[1] = [x - 1, x, x + 1];
      cycle += 1;
      x += value;
    }

    return spritePos;
  });

  const screen: string[][] = [];

  for (let cycle = 0; cycle < 240; cycle++) { // zero indexing cycle
    const row = Math.floor(cycle / 40);
    const col = cycle % 40;
    screen[row] ??= [];
    screen[row][col] = (trace[cycle].includes(col)) ? '#' : '.';
  }

  const visual = screen.map(l => l.join('')).join('\n');

  return visual;
}

export const answers = [
  14240,
  `
###..#....#..#.#....#..#.###..####.#..#.
#..#.#....#..#.#....#.#..#..#....#.#..#.
#..#.#....#..#.#....##...###....#..####.
###..#....#..#.#....#.#..#..#..#...#..#.
#....#....#..#.#....#.#..#..#.#....#..#.
#....####..##..####.#..#.###..####.#..#.
  `.trim()
]

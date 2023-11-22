import { eg1, input } from './input';
import { cleanAndParse, generateArray } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {};

function parseInput(src: string, count: number) {
  const [startStacks, instructionSrc] = src.split("\n\n");
  const stacks = initialiseStacks(startStacks, count);

  const instructions = cleanAndParse(instructionSrc, parseInstruction);

  return { stacks, instructions };
}

function initialiseStacks(startStacks: string, count: number) {
  const lines = startStacks.split("\n");
  const stacks: string[][] = generateArray(count, () => []);
  lines.pop(); // remove the index row

  for (const line of lines) {
    for (let i = 0; i < count; i++) {
      const crate = line[4 * i + 1]?.trim();

      if (crate) {
        stacks[i].unshift(crate);
      }
    }
  }

  return stacks;
}

type Stacks = ReturnType<typeof initialiseStacks>;

function parseInstruction(instruction: string) {
  const [, move, from, to] = instruction.split(/[ a-z]+/).map(Number);

  return { move, from, to };
}

type Instruction = ReturnType<typeof parseInstruction>;


function runInstructionPart1(stacks: Stacks, instruction: Instruction): void {
  const { move, from, to } = instruction;

  const fromIndex = from - 1;
  const toIndex = to - 1;

  for (let i = 0; i < move; i++) {
    stacks[toIndex].push(<string>stacks[fromIndex].pop());
  }
}

function runInstructionPart2(stacks: Stacks, instruction: Instruction): void {
  const { move, from, to } = instruction;

  const fromIndex = from - 1;
  const toIndex = to - 1;

  const subStack = stacks[fromIndex].splice(-move, move);

  stacks[toIndex] = [...stacks[toIndex], ...subStack];
}

function getStackTops(stacks: Stacks): string {
  return stacks.map(
    s => s[s.length - 1]
  ).join('');
}

export function part1() {
  const { stacks, instructions } = parseInput(input, 9);

  for (const instruction of instructions) {
    runInstructionPart1(stacks, instruction);
  }

  return getStackTops(stacks);
}

export function part2() {
  const { stacks, instructions } = parseInput(input, 9);

  for (const instruction of instructions) {
    runInstructionPart2(stacks, instruction);
  }

  return getStackTops(stacks);
}

export const answers = [
  'SHMSDGZVC',
  'VRZGHDFBQ'
];

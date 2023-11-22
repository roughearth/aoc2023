import { eg1, input } from './input';
import { cleanAndParse, SafetyNet } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {};

// values are 1-ples to keep TS happy for part 2
const ops: Record<string, (a: number[], b: number[]) => number[]> = {
  "+": ([a], [b]) => [a + b],
  "-": ([a], [b]) => [a - b],
  "*": ([a], [b]) => [a * b],
  "/": ([a], [b]) => [a / b]
}

function parseMonkey(src: string, monkeys: Monkeys, part: number) {
  const [name, action] = src.split(": ");
  let fn: Monkey;

  if (/[0-9]/.test(action)) {
    fn = () => [Number(action)];
  }
  else {
    const [a, op, b] = action.split(" ");

    if (part === 2 && name === "root") {
      fn = () => {
        const [monkeyA] = monkeys[a]();
        const [monkeyB] = monkeys[b]();

        return [Number(monkeyA === monkeyB), monkeyA, monkeyB];
      };
    }
    else {
      fn = () => ops[op](monkeys[a](), monkeys[b]());
    }
  }

  monkeys[name] = fn;
  return fn;
}
type Monkey = () => number[];
type Monkeys = Record<string, Monkey>;

export function part1() {
  const monkeys: Monkeys = {};
  cleanAndParse(input, src => parseMonkey(src, monkeys, 1));

  return monkeys.root()[0];
}

export function part2() {
  const monkeys: Monkeys = {};
  cleanAndParse(input, src => parseMonkey(src, monkeys, 2));

  let ans = -999;

  let low = Number.MIN_SAFE_INTEGER;
  let high = Number.MAX_SAFE_INTEGER;

  // for my input, A decreases as `humn` increases
  // B is constant
  // even with the above initial range, there are at most 54 bisections

  loop:
  do {
    let mid = Math.floor((low + high) / 2);
    monkeys.humn = () => [mid];
    const [result, A, B] = monkeys.root();

    if (A === B) {
      ans = mid;
      break loop;
    }
    if (A > B) {
      low = mid;
    }
    else {
      high = mid;
    }
  }
  while (high > low);

  return ans;
}

export const answers = [
  49288254556480,
  3558714869436
];

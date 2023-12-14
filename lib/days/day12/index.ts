import { eg1, input } from './input';
import { cleanAndParse, generateArray, sumOf, sumPartitions } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {
  manualStart: true
};

type Result = number[];
type Memo = Map<string, Result>;

/*

  _______ _     _       _                                      _
 |__   __| |   (_)     (_)                                    | |
    | |  | |__  _ ___   _ ___  __      ___ __ ___  _ __   __ _| |
    | |  | '_ \| / __| | / __| \ \ /\ / / '__/ _ \| '_ \ / _` | |
    | |  | | | | \__ \ | \__ \  \ V  V /| | | (_) | | | | (_| |_|
    |_|  |_| |_|_|___/ |_|___/   \_/\_/ |_|  \___/|_| |_|\__, (_)
     /\   | \ | |  __ \                                   __/ |
    /  \  |  \| | |  | |                                 |___/
   / /\ \ | . ` | |  | |
  / ____ \| |\  | |__| |
 /_/    \_\_| \_|_____/_
 | |                  | |
 | |_ ___   ___    ___| | _____      __
 | __/ _ \ / _ \  / __| |/ _ \ \ /\ / /
 | || (_) | (_) | \__ \ | (_) \ V  V /
  \__\___/ \___/  |___/_|\___/ \_/\_/


*/

function listNext(springs: string, numbers: number[], memo: Memo) {
  const firstNumber = numbers[0];
  const key = `${springs}|${firstNumber}`;
  if (memo.has(key)) {
    return memo.get(key)!;
  }

  const rx = new RegExp(`^[?.][?#]{${firstNumber}}[?.]`);
  const augSprings = "." + springs + ".";

  const list = generateArray(
    springs.length - firstNumber + 1,
    i => [
      i,
      rx.test(augSprings.slice(i))
    ] as [number, boolean]
  ).filter(([, b]) => b).map(([i]) => i)

  memo.set(key, list);

  return list;
}

function countValid(springs: string, numbers: number[], memo: Memo, logStack: unknown[] = []) {
  const log: unknown[] = [springs, numbers.join(",")];
  logStack.push(log);

  if (numbers.length === 0) {
    log.push(`no more numbers, ${springs.includes("#") ? 0 : 1}`);
    return springs.includes("#") ? 0 : 1;
  };

  if (springs.length === 0) {
    log.push(`no more springs, ${Boolean(numbers.length) ? 0 : 1}`);
    return Boolean(numbers.length) ? 0 : 1;
  }

  const nextNumbers = numbers.slice(1);

  const list: number[] = listNext(springs, numbers, memo)

  log.push(list.join(","));

  const vals: number[] = list.map(i => {
    return countValid(springs.slice(i + numbers[0]), nextNumbers, memo, logStack);
  });

  const sum = sumOf(vals);

  log.push(vals.join(","));
  log.push(sum);

  return sum;
}



function parse(input: string, copies: number) {
  const memo: Memo = new Map();

  return cleanAndParse(input, (l, i) => {
    // if (i !== 0) return 0;

    const logStack: unknown[] = [];

    const [rawSprings, rawNumbers] = l.split(" ");
    const springs = rawSprings.repeat(copies);
    const numbers = generateArray(copies, () => rawNumbers.split(",")).flat().map(Number);

    const returnValue = countValid(springs, numbers, memo, logStack);

    // console.log("logStack", returnValue, logStack);
    return returnValue;
  });
}

function calcTotal(parsed: ReturnType<typeof parse>) {
  console.log("calcTotal", parsed);
  return sumOf(parsed);
}

export function part1() {
  const parsed = parse(eg1, 1);

  return calcTotal(parsed);
}

export function part2() {
  return "todo"
}

export const answers = [
  21, // <- eg | real -> 7670,
  // 222
];

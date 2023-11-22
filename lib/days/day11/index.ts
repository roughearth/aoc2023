import { eg1Parsed, inputParsed } from './input';
import { Day } from '..';

export const meta: Day['meta'] = {};

export function part1() {
  const monkeys = inputParsed();

  const countMap = new Map(monkeys.map(m => [m, 0]));

  let RoundCount = 20;

  while (RoundCount--) {
    for (const monkey of monkeys) {
      let item: number;
      countMap.set(monkey, <number>countMap.get(monkey) + monkey.items.length);
      while (item = <number>monkey.items.shift()) {
        const newLevel = Math.floor(monkey.operation(item) / 3);
        const nextMonkey = (newLevel % monkey.divisibleby) ? monkey.Iffalse : monkey.Iftrue;
        monkeys[nextMonkey].items.push(newLevel);
      }
    }
  }

  const countList = Array.from(countMap.values()).sort((a, b) => b - a);

  return countList[0] * countList[1];
}

export function part2() {
  const monkeys = inputParsed();

  const countMap = new Map(monkeys.map(m => [m, 0]));

  let RoundCount = 10_000;

  const modulo = monkeys.map(m => m.divisibleby).reduce((a, b) => a * b);

  while (RoundCount--) {
    for (const monkey of monkeys) {
      let item: number;
      countMap.set(monkey, <number>countMap.get(monkey) + monkey.items.length);
      while (item = <number>monkey.items.shift()) {
        const newLevel = monkey.operation(item) % modulo;
        const nextMonkey = (newLevel % monkey.divisibleby) ? monkey.Iffalse : monkey.Iftrue;
        monkeys[nextMonkey].items.push(newLevel);
      }
    }
  }

  const countList = Array.from(countMap.values()).sort((a, b) => b - a);

  return countList[0] * countList[1];
}

export const answers = [
  102399,
  23641658401
];

import { eg1, input } from './input';
import { cleanAndParse, sumOf, sumPartitions } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {
  manualStart: true
};

function parse(input: string) {
  return cleanAndParse(input, (l, i) => {
    const [rawSprings, rawNumbers] = l.split(" ");
    const springs = Array.from(rawSprings);
    const numbers = rawNumbers.split(",").map(Number);

    const totalSprings = springs.length;
    const totalFaults = sumOf(numbers);
    const totalGood = totalSprings - totalFaults;

    const minGaps = numbers.length - 1;

    const validOptions: string[] = [];

    function checkOption(partition: number[]) {
      const option = makeOption(partition, numbers);

      const isValid = Array.from(option).reduce(
        (acc, c, i) => {
          const src = springs[i];
          if (src !== '?') {
            return acc && src === c;
          }

          return acc;
        },
        true
      );

      if (isValid) {
        validOptions.push(option);
      }
    }

    for (const partition of sumPartitions(totalGood, minGaps)) {
      checkOption([0, ...partition, 0]);
    }

    for (const partition of sumPartitions(totalGood, minGaps + 1)) {
      checkOption([0, ...partition]);
      checkOption([...partition, 0]);
    }

    for (const partition of sumPartitions(totalGood, minGaps + 2)) {
      checkOption(partition);
    }

    return {
      validOptions,
      springs,
      numbers
    };
  }).filter(Boolean);
}

function makeOption(partition: number[], springs: number[]) {
  if (partition.length !== springs.length + 1) {
    throw new Error("Invalid partition");
  }

  const option: string[] = [];

  for (let i = 0; i < springs.length; i++) {
    option.push('.'.repeat(partition[i]));
    option.push('#'.repeat(springs[i]));
  }
  option.push('.'.repeat(partition.at(-1)!));

  return option.join('');
}

export function part1() {
  const parsed = parse(input);

  return sumOf(parsed.map(p => p!.validOptions.length));
}

export function part2() {
  return "todo"
}

export const answers = [
  7670,
  // 222
];

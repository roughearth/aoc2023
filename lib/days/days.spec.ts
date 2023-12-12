import { Days } from '.';
import { generateArray, safetyNet } from '../utils';
import { determineDay } from '../utils/dates';

function dayFilter(d: number) {
  const day = determineDay();

  if (process.env.DAY === "today") {
    return d === day;
  }

  const envDay = Number(process.env.DAY);

  if (envDay >= 1 && envDay <= 25) {
    return d === envDay;
  }

  return true;
}

const dayResults = generateArray(25, i => [i + 1]).filter(([d]) => dayFilter(d));

describe.each(dayResults)("Day %i", (d: number) => {
  const day = Days[`day${d}`];

  const [ans1, ans2] = day.answers ?? [];

  if (ans1) {
    if (ans1 === Symbol.for('skip')) {
      test.skip("Part 1", () => { });
    }
    else {
      test("Part 1", () => {
        expect(day.part1(safetyNet(day.meta))).toEqual(ans1);
      });
    }
  }

  if (ans2) {
    if (ans2 === Symbol.for('skip')) {
      test.skip("Part 2", () => { });
    }
    else {
      test("Part 2", () => {
        expect(day.part2(safetyNet(day.meta))).toEqual(ans2);
      });
    }
  }
});

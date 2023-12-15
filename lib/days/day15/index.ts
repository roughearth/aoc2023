import { eg1, input } from './input';
import { cleanAndParse, generateArray, sumOf } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {};

function hash(s: string) {
  return Array.from(s).reduce(
    (h, c) => ((h + c.charCodeAt(0)) * 17) % 256,
    0
  );
}

type Lens = {
  label: string;
  focalLength: number;
}

function Box(boxNumber: number) {
  const lenses: Lens[] = [];

  return {
    get power() {
      return lenses.reduce(
        (total, { focalLength }, lensNumber) => {
          const lensPower = (boxNumber + 1) * (lensNumber + 1) * (focalLength);

          return total + lensPower;
        },
        0
      );
    },
    set(label: string, focalLength: number) {
      const found = lenses.find(l => l.label === label);
      if (found) {
        found.focalLength = focalLength;
      }
      else {
        lenses.push({ label, focalLength });
      }
    },
    remove(label: string) {
      const foundIndex = lenses.findIndex(l => l.label === label);

      if (foundIndex >= 0) {
        lenses.splice(foundIndex, 1);
      }
    }
  }
}

export function part1() {
  return sumOf(input.split(",").map(hash));
}

export function part2() {
  // set up all the boxes, initially empty
  const boxes = generateArray(256, Box);

  // parse the input to steps
  const stepRegex = /^([^=-]+)([=-])([0-9]*)$/;

  const steps = input.split(",").map((step => {
    const [, label, op, flStr] = step.match(stepRegex) ?? [];

    const focalLength = Number(flStr);
    const box = hash(label);

    return { label, op, box, focalLength };
  }));

  // run the steps
  for (const { label, op, box, focalLength } of steps) {
    if (op === "=") {
      boxes[box].set(label, focalLength);
    }
    else {
      boxes[box].remove(label);
    }
  }

  // find the total power
  return sumOf(boxes.map(box => box.power));
}

export const answers = [
  497373,
  259356
];

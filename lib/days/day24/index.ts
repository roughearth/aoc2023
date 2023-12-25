import { eg1, input } from './input';
import { cleanAndParse, pairs } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {};

function parse(input: string) {
  return cleanAndParse(input, l => {
    const [ptSrc, gradSrc] = l.split(" @ ");
    const pt = ptSrc.split(", ").map(Number);
    const grad = gradSrc.split(", ").map(Number);

    const d2 = {
      a: grad[1] / grad[0],
      b: pt[1] - (grad[1] / grad[0]) * pt[0]
    }

    return {
      src: l,
      pt,
      grad,
      d2
    };
  });
}

type Line = ReturnType<typeof parse>[number];

function intersect(l1: Line, l2: Line, [min, max]: [number, number]) {
  // console.log("Testing", l1.src, l2.src);
  if (l1.d2.a === l2.d2.a) {
    // console.log("Parallel");
    return false;
  }

  const x = (l2.d2.b - l1.d2.b) / (l1.d2.a - l2.d2.a);
  const y = l1.d2.a * x + l1.d2.b;

  // console.log("Cross at", x.toFixed(2), y.toFixed(2));

  if (x < min || x > max) {
    // console.log("Out of bounds (x)");
    return false;
  };

  if (y < min || y > max) {
    // console.log("Out of bounds (y)");
    return false;
  }

  if (Math.sign(x - l1.pt[0]) !== Math.sign(l1.grad[0])) {
    // console.log("Wrong direction (l1)");
    return false;
  }

  if (Math.sign(x - l2.pt[0]) !== Math.sign(l2.grad[0])) {
    // console.log("Wrong direction (l2)");
    return false;
  }

  // console.log("Intersect");
  return true;
}

export function part1() {
  const eg1Data: [string, [number, number]] = [eg1, [7, 27]];
  const inputData: [string, [number, number]] = [input, [200000000000000, 400000000000000]];
  const useData = inputData;

  const lines = parse(useData[0]);

  const unfiltered = [...pairs(lines.length)].map(([i, j]) => intersect(lines[i], lines[j], useData[1]));

  return unfiltered.filter(Boolean).length;
}

export function part2() {
  return "todo";
}

export const answers = [
  // 111,
  // 222
];

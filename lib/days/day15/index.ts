import { eg1, input } from './input';
import { cleanAndParse } from '../../utils';
import { Day } from '..';

const test = { src: eg1, target: 10, limit: 20 };
const actual = { src: input, target: 2000000, limit: 4000000 };

const X = 0;
const Y = 1;

export const meta: Day['meta'] = {
  manualStart: false
};

function distance(a: number[], b: number[]) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

function analyse(input: string) {
  const beacons = new Map<number, Set<number>>();

  const sensors = cleanAndParse(input, s => {
    const [sensor, beacon] = s.slice(10)
      .split(': closest beacon is at ')
      .map(c => c.slice(2).split(', y=').map(Number));

    const [bx, by] = beacon;
    const [sx, sy] = sensor;

    const radius = Math.abs(beacon[X] - sensor[X]) + Math.abs(beacon[Y] - sensor[Y]);
    const beaconRow = beacons.get(beacon[Y]) ?? new Set<number>();
    beaconRow.add(beacon[X]);
    beacons.set(beacon[Y], beaconRow);

    return { sensor, beacon, radius };
  });

  return { sensors, beacons };
}

type Sensor = ReturnType<typeof analyse>['sensors'][number];

// because we know the centre and the radius of the circle,
// we can derive a range for the intersection
function intersect({ sensor, radius }: Sensor, row: number, part2Limit?: number) {
  const center = sensor[X];
  const diff = radius - Math.abs(row - sensor[Y]);

  if (diff < 0) {
    return [];
  }

  if (part2Limit) {
    return [
      Math.max(0, center - diff),
      Math.min(part2Limit, center + diff)
    ];
  }

  return [center - diff, center + diff];
}

function coalesceRanges(current: number[][], add: number[]): number[][] {
  if (!add.length) {
    // nothing to add
    return current;
  }

  if (!current.length) {
    // nothing to add to
    return [add];
  }

  let r: number[];
  const coalesced: number[][] = [];
  let i = 0;

  while (r = <number[]>current[i]) {
    const [aMin, aMax] = add;
    const [rMin, rMax] = r;
    if (Math.max(aMin, rMin) <= Math.min(aMax, rMax)) {
      // overlaps, so merge and make this the test for the rest
      add = [Math.min(aMin, rMin), Math.max(aMax, rMax)];
    }
    else {
      // no overlap
      coalesced.push(current[i]);
    }
    i++;
  }

  // the test range always needs adding
  coalesced.push(add);

  return coalesced;
}

export function part1() {
  const { src, target } = actual;

  const { sensors, beacons } = analyse(src);
  const beaconRow = beacons.get(target) ?? new Set();

  let ranges: number[][] = [];

  for (const sensor of sensors) {
    ranges = coalesceRanges(ranges, intersect(sensor, target));
  }

  // turns out there's only one range
  const [[xMin, xMax]] = ranges;
  let found = xMax - xMin + 1;

  // need to adjust for any locations that *are* actually beacons
  for (const beaconY of beaconRow) {
    if ((beaconY >= xMin) && (beaconY <= xMax)) {
      found--;
    }
  }

  return found;
}

export function part2() {
  const { src, limit } = actual;

  const { sensors } = analyse(src);

  // look for the only row with a bifurcated range
  // y is that row, x is 1 above the top of the first range
  for (let y = 0; y <= limit; y++) {
    let ranges: number[][] = [];

    for (const sensor of sensors) {
      ranges = coalesceRanges(ranges, intersect(sensor, y, limit));
    }

    if (ranges.length !== 1) {
      const [[, x]] = ranges;
      return ((x + 1) * 4000000) + y;
    }
  }

  return -1;
}

export const answers = [
  5112034,
  13172087230812
];

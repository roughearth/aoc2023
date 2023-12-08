import { eg1, input } from './input';
import { chunk, cleanAndParse, generateArray } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {
  manualStart: false
};

type Transform = {
  destinationStart: number,
  sourceStart: number,
  sourceEnd: number,
  offset: number,
  range: [number, number],
  size: number
};

type TransformMap = {
  to: string,
  lines: string[],
  transforms: Transform[]
}


function parseInput(input: string) {
  const rawLines = cleanAndParse(input);

  const seedList = rawLines[0].slice(7).split(' ').map(Number);
  const maps: Record<string, TransformMap> = {};
  let currentMap = 'unused';

  for (let i = 1, l = rawLines.length; i < l; i++) {
    const line = rawLines[i];

    if (line.endsWith(' map:')) {
      const [from, to] = line.slice(0, -5).split('-to-');
      currentMap = from;
      maps[currentMap] = {
        to,
        lines: [],
        transforms: []
      };
    }
    else if (line) {
      maps[currentMap].lines.push(line);
      const [destinationStart, sourceStart, size] = line.split(' ').map(Number);

      const sourceEnd = sourceStart + size;
      const offset = destinationStart - sourceStart;

      maps[currentMap].transforms.push({
        destinationStart,
        sourceStart,
        sourceEnd,
        range: [sourceStart, sourceEnd],
        size,
        offset
      });
    }
  }

  const seedRanges = chunk(seedList, 2).map(([s, l]) => [s, s + l]);

  return { maps, seedList, seedRanges }
}

function mapFrom(input: number, type: string, maps: Record<string, TransformMap>) {
  const { to, transforms } = maps[type];

  for (const transform of transforms) {
    if (input >= transform.sourceStart && input < transform.sourceEnd) {
      return {
        output: input + transform.offset,
        to
      }
    }
  }

  return { output: input, to };
}

function findLocation(seed: number, maps: Record<string, TransformMap>) {
  let input = seed;
  let type = 'seed';

  do {
    const { output, to } = mapFrom(input, type, maps);

    input = output;
    type = to;
  }
  while (type !== 'location');

  return input;
}

function amalgamateRanges(ranges: number[][]) {
  const sorted = ranges.sort((a, b) => a[0] - b[0]);

  const result: number[][] = [];

  let currentRange = sorted[0];

  for (let i = 1, l = sorted.length; i < l; i++) {
    const range = sorted[i];

    if (range[0] <= currentRange[1]) {
      currentRange[1] = range[1];
    }
    else {
      result.push(currentRange);
      currentRange = range;
    }
  }

  result.push(currentRange);

  return result;
}

export function part1() {
  const { maps, seedList } = parseInput(input);

  const locations = seedList.map(seed => findLocation(seed, maps));

  return Math.min(...locations);
}

export function part2() {
  const { maps, seedRanges } = parseInput(input);

  let currentRanges = amalgamateRanges(seedRanges);
  let type = 'seed';

  do {
    const nextRanges: [number, number][] = [];

    for (const [start, end] of currentRanges) {
      const overlaps: [number, number, number][] = [];

      // the overlaps bewteen the current range and the transforms for this map
      // are those segments of the range that need to be transformed
      for (const { range: [mapStart, mapEnd], offset } of maps[type].transforms) {
        const maxStart = Math.max(start, mapStart);
        const minEnd = Math.min(end, mapEnd);

        if (minEnd > maxStart) {
          overlaps.push([maxStart, minEnd, offset]);
        }
      }

      // this then needs filling in with the bits of the range that don't
      // need transforming (ie and offset of 0)
      const sorted = overlaps.sort((a, b) => a[0] - b[0]);
      // bear in mind that `sorted` may be empty
      const allSegments = [
        [start, (sorted[0] ?? [end])[0], 0],
        ...sorted.flatMap(([s, e, o], i, all) => {
          const next = all[i + 1] ?? [end];
          return [[s, e, o], [e, next[0], 0]]
        })
      ].filter(([s, e]) => s < e);

      // and then the transformations need applying
      nextRanges.push(...allSegments.map(([s, e, o]): [number, number] => [s + o, e + o]));
    }

    currentRanges = amalgamateRanges(nextRanges);
    type = maps[type].to;

  }
  while (type !== 'location');

  return Math.min(...currentRanges.map(([s]) => s));
}

export const answers = [
  199602917,
  2254686
];

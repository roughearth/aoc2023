import { eg1, eg2, input } from './input';
import { findRange, getIntKey, neighbours, SafetyNet } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {
  // manualStart: true,
  maxMs: 60_000,
  maxLoops: 1e7
};

function getKey(coord: number[]) {
  return getIntKey(coord, 1e4);
}

function ElfSet() {
  const map = new Map<number, Set<number>>();

  function has(x: number, y: number) {
    return !!map.get(x)?.has(y);
  }

  function add(x: number, y: number) {
    let set = map.get(x);

    if (!set) {
      set = new Set<number>();
      map.set(x, set);
    }

    set.add(y);
  }

  function* all() {
    for (const [x, set] of map) {
      for (const y of set) {
        yield [x, y];
      }
    }
  }

  const filter = ([x, y]: number[]) => has(x, y)

  return {
    [Symbol.iterator]: all,
    has,
    add,
    proposedMove(x: number, y: number, moveList: string[]): number[] | undefined {
      const allNeighbours = Array.from(neighbours([x, y]));

      if (!allNeighbours.some(filter)) {
        return;
      }

      const [nw, w, sw, n, s, ne, e, se] = allNeighbours;
      const edges: Record<string, number[][]> = {
        N: [nw, n, ne],
        S: [sw, s, se],
        W: [nw, w, sw],
        E: [ne, e, se]
      }

      for (const direction of moveList) {
        if (!edges[direction].some(filter)) {
          return edges[direction][1];
        }
      }
    }
  }
}
type ElfSet = ReturnType<typeof ElfSet>;

function toElfSet(src: string): ElfSet {
  const elves = ElfSet();
  const grid = src.split("\n").map(r => Array.from(r));

  for (let y = 0, ht = grid.length; y < ht; y++) {
    const row = grid[y];
    for (let x = 0, wd = row.length; x < wd; x++) {
      if (row[x] === '#') {
        elves.add(x, y);
      }
    }
  }

  return elves;
}

const testDiffs = {
  N: [[0, 0], [0, 0], [0, 0]],
  S: [[0, 0], [0, 0], [0, 0]],
  W: [[0, 0], [0, 0], [0, 0]],
  E: [[0, 0], [0, 0], [0, 0]]
};

function toNextElfSet(elves: ElfSet, moveList: string[]): [ElfSet, number] {
  const nextElves = ElfSet();
  const proposedPosCount: Record<string, number> = {};
  const proposedPosMap = new Map<number, [number, number[]]>();
  let proposedCount = 0;

  for (const [x, y] of elves) {
    const proposed = elves.proposedMove(x, y, moveList);

    if (proposed) {
      const elfKey = getKey([x, y]);
      const propKey = getKey(proposed);
      proposedPosMap.set(elfKey, [propKey, proposed]);

      proposedPosCount[propKey] = (proposedPosCount[propKey] ?? 0) + 1;

      proposedCount++;
    }
  }

  if (proposedCount === 0) {
    moveList.push(moveList.shift()!);

    return [elves, 0];
  }

  for (const [x, y] of elves) {
    const elfKey = getKey([x, y]);

    const proposal = proposedPosMap.get(elfKey);

    if (proposal) {
      const [propKey, [px, py]] = proposal

      if (proposedPosCount[propKey] === 1) {
        nextElves.add(px, py);
      }
      else {
        nextElves.add(x, y);
      }
    }
    else {
      nextElves.add(x, y);
    }
  }

  moveList.push(moveList.shift()!);

  return [nextElves, proposedCount];
}

export function part1() {
  let elves = toElfSet(input);
  const moveList = Array.from('NSWE');

  let moves = 10;

  while (moves--) {
    [elves] = toNextElfSet(elves, moveList);
  }

  const elfList = Array.from(elves);
  const elfRange = findRange(elfList);

  const [[x1, x2], [y1, y2]] = elfRange;

  return (x2 - x1 + 1) * (y2 - y1 + 1) - elfList.length;
}

export function part2(safetyNet: SafetyNet) {
  const srcElves = toElfSet(input);
  const moveList = Array.from('NSWE');

  let moved = -1;

  let high = 968;

  while (high-- > 950) {
    console.log("try", high);
    let elves = srcElves;
    let moves = high;
    while (moves--) {
      safetyNet.isSafe();
      [elves, moved] = toNextElfSet(elves, moveList);
    }

    if (moved !== 0) {
      return high + 1;
    }
  }

  return -999;
}

export const answers = [
  4068,
  968
];

import { eg1, input } from './input';
import { ArrayKeyedMap, CoordinateRange, cleanAndParse, coordinates, sumOf } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {
  // manualStart: true,
};

function parse(input: string) {
  const xs = new Set<number>();
  const ys = new Set<number>();

  const src = cleanAndParse(input, l => {
    const [start, end] = l.split('~').map(c => c.split(',').map(Number));

    [start, end].forEach(([x, y]) => {
      xs.add(x);
      ys.add(y);
    });

    const floorCoords = Array.from(coordinates([
      [start[0], end[0]],
      [start[1], end[1]]
    ]));

    return { start, end, length, floorCoords, src: l };
  });

  const xMin = Math.min(...[...xs]);
  const xMax = Math.max(...[...xs]);
  const yMin = Math.min(...[...ys]);
  const yMax = Math.max(...[...ys]);

  const floorRange: CoordinateRange = [
    [xMin, xMax],
    [yMin, yMax]
  ];

  /*

  We know (from some analysis) that the lowest (smallest z) of the brick is the z of the start coordinate.
  because all the bricks coordinates are properly ordered.

  */

  const bricks = src.sort((a, b) => a.start[2] - b.start[2]);

  return { bricks, floorRange };
}
type Brick = ReturnType<typeof parse>['bricks'][0];


export function drop(input: string) {
  const { bricks, floorRange } = parse(input);

  const minZs = ArrayKeyedMap();
  for (const fl of coordinates(floorRange)) {
    minZs.set(fl, { z: 0 });
  }

  for (const brick of bricks) {
    const highestBlock = Math.max(...brick.floorCoords.map(fl => minZs.get(fl).z)) + 1;
    const move = brick.start[2] - highestBlock;
    brick.start[2] -= move;
    brick.end[2] -= move;

    brick.floorCoords.forEach(fl => {
      minZs.get(fl).z = brick.end[2];
    });
  }

  return { bricks };
}

function findSupports(bricks: Brick[]) {
  const supportedByMap = new Map(bricks.map(b => [b, new Set<Brick>()]));
  const supportsMap = new Map(bricks.map(b => [b, new Set<Brick>()]));

  for (const brick of bricks) {
    const levelUp = bricks.filter(b => b.start[2] === brick.end[2] + 1);

    for (const upBrick of levelUp) {
      if (brick.floorCoords.some(
        ([x1, y1]) => upBrick.floorCoords.some(
          ([x2, y2]) => x1 === x2 && y1 === y2
        )
      )) {
        supportedByMap.get(upBrick)!.add(brick);
        supportsMap.get(brick)!.add(upBrick);
      }
    }
  }

  return { supportedByMap, supportsMap };
}

export function part1() {
  const { bricks } = drop(input);
  const { supportedByMap, supportsMap } = findSupports(bricks);

  const freeBricks = bricks.filter(b => [...supportsMap.get(b)!].every(u => supportedByMap.get(u)!.size > 1));

  return freeBricks.length;
}

function cloneMap(map: Map<Brick, Set<Brick>>) {
  const newMap = new Map<Brick, Set<Brick>>();

  for (const [k, v] of map) {
    newMap.set(k, new Set(v));
  }

  return newMap;
}


export function part2() {
  const { bricks } = drop(input);
  const { supportedByMap: supportedByMapSrc, supportsMap: supportsMapSrc } = findSupports(bricks);

  const fallList = bricks.map(b => {
    const theseFall = new Set<Brick>();
    const supportedByMap = cloneMap(supportedByMapSrc);
    const supportsMap = cloneMap(supportsMapSrc);

    const toFall = [b];

    let sf = 0;

    while (toFall.length) {
      if (sf++ > 1e4) throw new Error('too many iterations');

      const brick = toFall.shift()!;

      supportsMap.get(brick)!.forEach(s => {
        supportedByMap.get(s)!.delete(brick);

        if (supportedByMap.get(s)!.size === 0) {
          theseFall.add(s);
          toFall.push(s);
        }
      })
    }

    return theseFall.size;
  });

  return sumOf(fallList);
}

export const answers = [
  461,
  74074
];
